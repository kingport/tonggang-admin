import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Select, Radio, Input, Form, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { COOPERATION_MODE, TRANSPORT_PROPERTIES } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;
const BasicForm = (props, ref) => {
  if (!props) return;
  const [form] = Form.useForm();
  const { basicData, type, editDetail } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const userAgentType = useSelector(({ global }) => global.userAgentType);
  const [multiple, setMultiple] = useState('');
  const dispatch = useDispatch();

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
  };
  // 如果是多选城市的话
  useEffect(() => {
    if (JSON.stringify(basicData) != '{}' && basicData.agent_type == 1) {
      setMultiple('multiple');
      if (basicData.area_id instanceof Array) {
        form.setFieldsValue({ area_id: basicData.area_id });
      } else {
        form.setFieldsValue({
          area_id: basicData.area_id.split(',').map((item) => (item = item * 1)),
        });
      }
    }
  }, [basicData]);

  // 查看 or 编辑 多城市处理
  useEffect(() => {
    if (
      editDetail &&
      editDetail.area_id &&
      editDetail.area_id.indexOf(',') > -1 &&
      userCityCountyList
    ) {
      editDetail.area_id = editDetail.area_id.split(',').map((item) => (item = item * 1));
      setMultiple('multiple');
      form.setFieldsValue({
        area_id: editDetail.area_id,
      });
    } else if (
      editDetail &&
      editDetail.area_id &&
      editDetail.area_id.indexOf(',') == -1 &&
      userCityCountyList
    ) {
      // 只有单个城市
      setMultiple('');
      if (typeof editDetail.area_id == 'string') {
        form.setFieldsValue({
          area_id: editDetail.area_id * 1,
        });
      } else {
        setMultiple('multiple');
        form.setFieldsValue({
          area_id: editDetail.area_id,
        });
      }
    }
  }, [editDetail]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // console.log(values, '基本信息');
          // 缓存基本信息
          dispatch({
            type: 'companyNew/saveBasicData',
            payload: { basicData: values },
          });
          props.nextStepOk();
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 切换代理商类型
  const changeAgentType = (values) => {
    // 只有省代可以多选城市
    if (values && values == 1) {
      setMultiple('multiple');
      form.setFieldsValue({ area_id: [] });
    } else {
      setMultiple('');
      form.setFieldsValue({ area_id: null });
    }
  };

  // 选择城市
  const selectCity = (values) => {
    if (multiple === 'multiple' && values.length != 0) {
      message.info('默认勾选该省下的所有城市,且不能删除,如需切换请清空');
      const cityIdentification = values[0].toString().slice(0, 2);
      // 找出含有标识的城市
      const cityArr = userCityCountyList.filter(
        (x) => x.city.toString().slice(0, 2) == cityIdentification,
      );
      // 默认勾选
      const checkCity = [];
      cityArr.map((item) => checkCity.push(item.city));
      form.setFieldsValue({
        area_id: checkCity,
      });
    }
  };

  // 查看详情 编辑详情
  if (!editDetail && (type === 'check' || type === 'edit')) {
    return;
  }

  return (
    <Form
      labelAlign="left"
      // style={{ width: '50%' }}
      {...formItemLayout}
      layout="horizontal"
      form={form}
    >
      <FormItem
        initialValue={(editDetail && editDetail.company_name) || basicData.company_name || ''}
        rules={[
          {
            required: true,
            message: '请填写公司名称',
          },
        ]}
        name="company_name"
        label="公司名称"
      >
        <Input
          disabled={type === 'check' || type === 'edit'}
          style={{ width: 300 }}
          placeholder="请输入公司名称"
        />
      </FormItem>
      {/* 内部公司不显示 */}
      {
        <FormItem
          initialValue={(editDetail && editDetail.agent_type) || basicData.agent_type || null}
          rules={[
            {
              required: true,
              message: '请选择代理商类型',
            },
          ]}
          name="agent_type"
          label="代理商类型"
        >
          <Select
            onChange={changeAgentType}
            placeholder="请选择代理商类型"
            style={{ width: 200 }}
            allowClear
            showSearch
            disabled={type === 'check' || type === 'edit'}
          >
            {userAgentType &&
              userAgentType.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      }

      <FormItem
        initialValue={(editDetail && editDetail.area_id) || basicData.area_id * 1 || null}
        rules={[
          {
            required: true,
            message: '请选择合作城市',
          },
        ]}
        name="area_id"
        label="合作城市"
      >
        <Select
          filterOption={filterOption}
          onChange={selectCity}
          // onClear={() =>setMultiple('')}
          placeholder="请选择合作城市"
          style={{ width: 300 }}
          allowClear
          showSearch
          mode={multiple}
          disabled={
            type === 'check' || type === 'edit'
            // (userInfo && userInfo.agent_type == 0 && editDetail && editDetail.agent_type != 1)
          }
        >
          {userCityCountyList &&
            userCityCountyList.map((item) => {
              return (
                <Option key={item.city} value={item.city}>
                  {item.city_name}
                </Option>
              );
            })}
        </Select>
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.cooperative_mode) || basicData.cooperative_mode || null
        }
        rules={[
          {
            required: true,
            message: '请选择合作模式',
          },
        ]}
        name="cooperative_mode"
        label="合作模式"
      >
        <Select
          disabled={type === 'check' || type === 'edit'}
          placeholder="请选择合作模式"
          style={{ width: 250 }}
          allowClear
          showSearch
        >
          {COOPERATION_MODE.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.transport_mode) || basicData.transport_mode || null}
        rules={[
          {
            required: true,
            message: '请选择运力属性',
          },
        ]}
        name="transport_mode"
        label="运力属性"
      >
        <Select
          disabled={type === 'check' || type === 'edit'}
          placeholder="请选择运力属性"
          style={{ width: 200 }}
          allowClear
          showSearch
        >
          {TRANSPORT_PROPERTIES.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.company_registered_address) ||
          basicData.company_registered_address ||
          ''
        }
        rules={[
          {
            required: true,
            message: '请输入公司注册地址',
          },
        ]}
        name="company_registered_address"
        label="公司注册地址"
      >
        <Input
          disabled={type === 'check'}
          style={{ width: 400 }}
          placeholder="请输入公司注册地址"
        />
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.company_business_address) ||
          basicData.company_business_address ||
          ''
        }
        rules={[
          {
            required: true,
            message: '请输入公司公办地址',
          },
        ]}
        name="company_business_address"
        label="公司办公地址"
      >
        <Input
          disabled={type === 'check'}
          style={{ width: 400 }}
          placeholder="请输入公司办公地址"
        />
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.registered_capital) || basicData.registered_capital || ''
        }
        rules={[
          {
            required: true,
            message: '请输入注册资金（万元）',
          },
        ]}
        name="registered_capital"
        label="注册资金（万元）"
      >
        <InputNumber
          disabled={type === 'check'}
          style={{ width: 200 }}
          placeholder="请输入注册资金（万元）"
          min={1}
          precision={2}
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.driver_num) || basicData.driver_num || ''}
        rules={[
          {
            required: true,
            message: '请输入司机数量（人）',
          },
        ]}
        name="driver_num"
        label="司机数量（人）"
      >
        <InputNumber
          disabled={type === 'check'}
          style={{ width: 200 }}
          placeholder="请输入司机数量（人）"
          min={1}
          precision={0}
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.car_num) || basicData.car_num || ''}
        rules={[
          {
            required: true,
            message: '请输入车辆数量（辆）',
          },
        ]}
        name="car_num"
        label="车辆数量（辆）"
      >
        <InputNumber
          disabled={type === 'check'}
          style={{ width: 200 }}
          placeholder="请输入车辆数量（辆）"
          min={1}
          precision={0}
        />
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.company_type * 1) || basicData.company_type * 1 || 1
        }
        rules={[
          {
            required: true,
            message: '请选择公司类型',
          },
        ]}
        name="company_type"
        label="公司类型"
      >
        <Radio.Group disabled={type === 'check'}>
          <Radio value={1}>融资性质租赁公司</Radio>
          <Radio value={2}>经营性质租赁公司</Radio>
          <Radio value={3}>其他</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.company_business * 1) || basicData.company_business * 1 || 1
        }
        rules={[
          {
            required: true,
            message: '请选择公司主营业务',
          },
        ]}
        name="company_business"
        label="公司主营业务"
      >
        <Radio.Group disabled={type === 'check'}>
          {/* <Space> */}
          <Radio value={1}>汽车租赁（不带操作人）</Radio>
          <Radio value={2}>汽车租赁（不含运营）</Radio>
          <Radio value={3}>汽车租赁及运营</Radio>
          <Radio value={4}>自有汽车租赁</Radio>
          <Radio value={5}>小型客车租赁经营</Radio>
          <Radio value={6}>小型客车租赁</Radio>
          <Radio value={7}>小型汽车租赁</Radio>
          <Radio value={8}>融资租赁</Radio>
          <Radio value={9}>车辆租赁</Radio>
          <Radio value={10}>网络预约出租汽车经营及咨询服务</Radio>
          <Radio value={11}>暂无以上范围</Radio>
          {/* </Space> */}
        </Radio.Group>
      </FormItem>
    </Form>
  );
};
export default forwardRef(BasicForm);
