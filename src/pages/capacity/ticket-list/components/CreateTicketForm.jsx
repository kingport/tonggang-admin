import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PlusOutlined, MinusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  message,
  Card,
  Space,
  DatePicker,
  InputNumber,
  Select,
  Form,
  Input,
  Button,
  Tooltip,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import NP from 'number-precision';
import { useSelector } from 'dva';
import { getRandomString } from '@/utils/utils';
import { ticketType, layout, PlatformList } from '@/utils/constant';
import { createActivity, editActivity, updateActivity } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateTicketForm = (props, ref) => {
  // console.log(props, 'props');
  const { id, type } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [form] = Form.useForm();
  // 地区选择 可多选
  const [countyList, setCountyList] = useState([]);
  const [editData, setEditData] = useState({});
  const [addShow, setAddshow] = useState(true);
  // 默认卡片一张
  const [list, setList] = useState({ one: {} });
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }

  useEffect(() => {
    if (type === 'edit') {
      getEditData(id);
    }
  }, [type]);
  // 重置表单
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [type]);
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 日期格式化
          if (values.time) {
            values.begin_time = moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            values.end_time = moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
          }
          delete values.time;
          if (values.city) {
            values.city = values.city;
          }
          if (values.district) {
            values.district = values.district;
          }
          // 使用门槛分 转换
          if (values['one.threshold']) {
            values.threshold = NP.times(values['one.threshold'], 100); // 单位分
          }
          // 面额转为JSON格式 可以有多个面额
          let denominationArr = [];
          let sun = 0;
          if (values['one.denomination']) {
            // 使用for  让return 跳出循环体
            for (let key in values) {
              // console.log(values[key])
              // const item = values[key]
              if (key.indexOf('denomination') > -1) {
                // console.log(item, 'denomination')
                if (values[key] * 100 >= values.threshold) {
                  message.error('门槛必须大于面额');
                  return false;
                }
                sun += values[key] * 1 * values['one.count_card'] * 1;
                if (sun > 50000) {
                  message.error('总面额价值不能超过50000元');
                  return false;
                }
                // 注意浮点数精度问题
                denominationArr.push(NP.times(values[key], 100));
              }
            }
            values.denomination = JSON.stringify(denominationArr);
          }
          // console.log(values, '创建优惠券的表单信息');

          if (type == 'edit') {
            values.activity_id = editData.activity_id;
            // 更新数据
            renewalActivity(values);
          }
          if (type == 'new') {
            // 创建
            addCreateActivity(values);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
      // 清空数据
      setEditData({});
      setList({ one: {} });
    },
  }));

  /**
   * 获取编辑详情
   * @param
   */
  const getEditData = async (activity_id) => {
    const params = {
      activity_id,
    };
    const res = await editActivity(params);
    if (res.data.city) {
      // 找出该城市下的区县
      const arr = cityCountyList.find((x) => x.city === res.data.city).county_infos;
      // console.log(res.data.district, 'district')
      setCountyList(arr);
    }
    setEditData(res.data);
    // 必须重置表单不然 有表单缓存数据 跟antd的form有关
    form.resetFields();
    // 如果存在区县
    if (res.data.district != 0) {
      form.setFieldsValue({ district: res.data.district });
    }

    if (res.data.coupon_type == 1) {
      setAddshow(true);
    } else {
      setAddshow(false);
    }

    // 将面额拆分出来
    if (res.data.denomination) {
      let newList = {};
      // 面额 数组
      const denominationArr = JSON.parse(res.data.denomination);
      // 发行量
      const count_card = res.data.count / denominationArr.length;
      // 门槛
      const threshold = NP.divide(res.data.threshold, 100);
      // 最后一个key
      let lastKey = '';
      newList = _.cloneDeep(list);
      denominationArr.map((item, index) => {
        const key = getRandomString();
        newList[key] = {};
        if (index == denominationArr.length - 1) {
          lastKey = key;
        }

        // 数量 不可修改
        const count_card_key = `${key}.count_card`;
        // 门槛 不可修改
        const threshold_key = `${key}.threshold`;

        form.setFieldsValue({ [count_card_key]: count_card });
        form.setFieldsValue({ [threshold_key]: threshold });
      });

      delete newList[lastKey];
      setList(newList);
      Object.keys(newList).map((key, index) => {
        // 面额
        const denomination_price = `${key}.denomination`;
        form.setFieldsValue({ [denomination_price]: NP.divide(denominationArr[index] * 1, 100) });
      });
      // 发行量
      form.setFieldsValue({ 'one.count_card': count_card });
      // 门槛
      form.setFieldsValue({ 'one.threshold': threshold });
    }
  };

  // 添加优惠券
  const addCreateActivity = async (params) => {
    const res = await createActivity(params);
    if (res) {
      message.success('添加成功');
      props.handleCancel();
      // 刷新列表
      props.getActivity();
    }
  };
  // 编辑跟新优惠券
  const renewalActivity = async (params) => {
    const res = await updateActivity(params);
    if (res) {
      message.success('更新成功');
      props.handleCancel();
      // 刷新列表
      props.getActivity();
    }
  };

  // 选择优惠券类型锁定优惠券名称
  const changeTicket = (key) => {
    const ticketObj = {
      1: '打车券',
      10: '新人券',
    };
    form.setFieldsValue({ coupon_name: ticketObj[key] });
    if (key == 10) {
      setAddshow(false);
      // 清空券信息
      setList({ one: {} });
      form.setFieldsValue({
        count: null,
        'one.denomination': null,
        'one.threshold': null,
        'one.count_card': null,
      });
    } else {
      setAddshow(true);
    }
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 选择城市
  const changeCity = (e) => {
    // console.log(e);
    // 多选暂时不支持 功能已写好
    // const citys = e;
    // const countys = [];
    // citys.map((code) => {
    //   console.log(code);
    //   let county = COUNTY_OPTION.find((x) => x.value === code);
    //   countys.push(county);
    // });
    // let countysAll = countys;
    // countys.map((item) => {
    //   countysAll = countysAll.concat(item.children);
    // });
    // setCountyList(countysAll);
    // 找出所有的区县
    if (e) {
      let county = cityCountyList.find((x) => x.city === e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
    form.setFieldsValue({ district: null });
  };

  // 增加券card
  const addTicket = (item = null) => {
    // const key = list++
    // setList(list.push(list++));
    const newList = _.cloneDeep(list);
    const key = getRandomString();
    newList[key] = {};
    setList(newList);

    // // 获取门槛 和 发行量的参数
    // const denomination = form.getFieldValue('one.denomination');
    const count_card = form.getFieldValue('one.count_card');
    const threshold = form.getFieldValue('one.threshold');
    const count_card_key = `${key}.count_card`;
    const threshold_key = `${key}.threshold`;
    // 发行量
    if (count_card) {
      form.setFieldsValue({ [count_card_key]: count_card });
      form.setFieldsValue({ count: count_card * Object.keys(newList).length });
    }
    // 门槛
    if (threshold) {
      form.setFieldsValue({ [threshold_key]: threshold });
    }
  };

  // 删除券
  const delectCard = (key) => {
    const newList = _.omit(list, [key]);
    setList(newList);
    // 更新总量券
    const count_card = form.getFieldValue('one.count_card');
    // console.log(count_card, 'count_card');
    if (count_card) {
      form.setFieldsValue({ count: count_card * Object.keys(newList).length });
    }
  };

  // 输入发行量
  const onChange = (e) => {
    const values = form.getFieldsValue();
    const key = 'count_card';
    Object.keys(values).map((item) => {
      if (item.indexOf(key) > -1) {
        form.setFieldsValue({ [item]: e });
      }
    });
    form.setFieldsValue({ count: e * Object.keys(list).length });
  };

  // 使用门槛
  const changeThreshold = (e) => {
    const values = form.getFieldsValue();
    const key = 'threshold';
    Object.keys(values).map((item) => {
      if (item.indexOf(key) > -1) {
        form.setFieldsValue({ [item]: e });
      }
    });
  };

  if (JSON.stringify(editData) == '{}' && type === 'edit') return;
  // console.log(list, 'KDLSKLDKSL');
  return (
    <Form {...layout} form={form}>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择优惠券类型',
          },
        ]}
        name="coupon_type"
        label="优惠券类型"
        initialValue={(type === 'edit' && editData.coupon_type) || null}
      >
        <Select
          style={{ width: 200 }}
          placeholder="请选择优惠券类型"
          onChange={changeTicket}
          allowClear
          showSearch
        >
          {ticketType.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择发放平台',
          },
        ]}
        name="channel"
        label="发放平台"
        initialValue={(type === 'edit' && editData.channel) || null}
      >
        <Select style={{ width: 200 }} placeholder="请选择发放平台" allowClear showSearch>
          {PlatformList.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        // initialValue="选择优惠券类型即可自动填充"
        initialValue={(type === 'edit' && editData.coupon_name) || '选择优惠券类型即可自动填充'}
        rules={[
          {
            required: true,
            message: '请填写优惠券名称',
          },
        ]}
        name="coupon_name"
        label="优惠券名称"
      >
        <Input disabled style={{ width: 300 }} placeholder="请填写优惠券名称" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择城市',
          },
        ]}
        name="city"
        label="城市"
        initialValue={(type === 'edit' && editData.city) || null}
      >
        <Select
          style={{ width: 200 }}
          onChange={changeCity}
          allowClear
          showSearch
          placeholder="请选择城市"
          filterOption={filterOption}
          // mode="multiple"
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
      {/* 多选城市 */}
      {/* {countyList.length !== 0 && (
        <FormItem name="district" label="二级区县">
          <Select
            style={{ width: 200 }}
            allowClear
            showSearch
            placeholder="可多选二级区县"
            filterOption={filterOption}
            mode="multiple"
          >
            {countyList.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      )} */}
      {countyList.length > 0 && (
        <FormItem
          initialValue={(type === 'edit' && editData.district) || null}
          name="district"
          label="二级区县"
        >
          <Select
            style={{ width: 200 }}
            allowClear
            showSearch
            placeholder="可选择二级区县"
            filterOption={filterOption}

            // mode="multiple"
          >
            {countyList.length > 0 &&
              countyList.map((item) => {
                return (
                  <Option key={item.county} value={item.county}>
                    {item.county_name}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      )}

      <FormItem
        rules={[
          {
            required: true,
            message: '请选择有效期',
          },
        ]}
        name="time"
        label="优惠券活动有效期"
        initialValue={
          (type === 'edit' && [moment(editData.begin_time), moment(editData.end_time)]) || null
        }
      >
        <RangePicker disabledDate={disabledDate} format="YYYY-MM-DD" />
      </FormItem>
      <FormItem
        style={{ marginTop: 10 }}
        rules={[
          {
            required: true,
            message: '请填写有效期',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || value <= 1000) {
                return Promise.resolve();
              }

              return Promise.reject('有效期不能超过1000天');
            },
          }),
        ]}
        name="effective_days"
        label="优惠券使用有效期"
        initialValue={(type === 'edit' && editData.effective_days) || null}
      >
        <Input style={{ width: 200 }} suffix="天" />
      </FormItem>

      {/* <FormItem
        style={{ marginTop: 10 }}
        rules={[
          {
            required: true,
            message: '请填写使用门槛',
          },
        ]}
        name={`${111}.threshold`}
        label="每人限领"
        initialValue={10}
      >
        <Space>
          <span>1张 使用门槛满</span>
          <InputNumber onChange={changeThreshold} />
          <span>可用</span>
        </Space>
      </FormItem> */}
      <FormItem label="券信息">
        <Space direction="vertical">
          {_.map(list, (item, key) => {
            // console.log(Object.keys(list).length, 'ITEM');
            return (
              <Card key={key} style={{ background: '#f6f6f6' }}>
                <Space>
                  <>
                    <FormItem
                      rules={[
                        {
                          required: true,
                          message: '面值只能是数值，0.01-20，限2位小数',
                        },
                      ]}
                      name={`${key}.denomination`}
                      label="面额(元)"
                    >
                      <InputNumber min={0.01} max={20} precision={2} />
                    </FormItem>
                    <FormItem
                      style={{ marginTop: 10 }}
                      rules={[
                        {
                          required: true,
                          message: '请填写使用门槛',
                        },
                      ]}
                      name={`${key}.threshold`}
                      label="每人限领 1张 使用门槛(元)"
                      // initialValue={form.getFieldValue('denomination.threshold')}
                    >
                      <InputNumber
                        min={0.02}
                        max={1000}
                        precision={2}
                        disabled={key != 'one'}
                        onChange={changeThreshold}
                      />
                    </FormItem>
                    <FormItem
                      style={{ marginTop: 10 }}
                      rules={[
                        {
                          required: true,
                          message: '请填写发行量',
                        },
                      ]}
                      name={`${key}.count_card`}
                      label="发行量(张)"
                      // initialValue={20}
                      // initialValue={(type === 'edit' && editData.count_card) || null}
                    >
                      <InputNumber min={0.02} disabled={key != 'one'} onChange={onChange} />
                    </FormItem>
                  </>
                  {key != 'one' && (
                    <Button
                      onClick={() => delectCard(key)}
                      icon={<MinusOutlined />}
                      shape="circle"
                      size="small"
                    />
                  )}
                </Space>
              </Card>
            );
          })}
          {addShow && (
            <Button onClick={addTicket} icon={<PlusOutlined />}>
              新增
            </Button>
          )}
        </Space>
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '',
          },
        ]}
        name="count"
        label="总发行量"
        initialValue={(type === 'edit' && editData && editData.count) || null}
      >
        <Input
          style={{ width: 200 }}
          disabled
          suffix={
            <Tooltip title="面额总价值不能超过50000元">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
        />
      </FormItem>
    </Form>
  );
};

export default forwardRef(CreateTicketForm);
