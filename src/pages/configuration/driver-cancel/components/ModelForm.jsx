import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useSelector } from 'dva';
import { Col, message, Row, Select, Form, Tag, InputNumber } from 'antd';
import NP from 'number-precision';
import { setCancelCount } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const ModelForm = (props, ref) => {
  const [form] = Form.useForm();
  const { type, selectRecord } = props;
  // const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  // 获取编辑详情
  useEffect(() => {
    if (type === 'edit') {
      form.setFieldsValue({
        area: selectRecord.area * 1,
        count: selectRecord.count,
      });
    }
    return () => {
      form.resetFields();
    };
  }, [selectRecord]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          if (type == 'edit') {
            values.id = selectRecord.id;
          }
          addEidtCancelCount(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));

  // 新增or修改取消次数配置
  const addEidtCancelCount = async (values) => {
    const res = await setCancelCount(values);
    if (res) {
      message.success('操作成功');
      props.handleCancel();
      props.getCancelCountList();
    }
  };

  // 编辑取消次数配置
  // const postEditCancelRule = async (values) => {
  //   const res = await editCancelRule(values);
  //   if (res) {
  //     message.success('操作成功');
  //     props.handleCancel();
  //     props.getCancelRuleList();
  //   }
  // };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  return (
    <Form form={form}>
      <Row>
        <Col span={12}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请选择城市',
              },
            ]}
            name="area"
            label="城市"
          >
            <Select
              disabled={type == 'edit'}
              allowClear
              showSearch
              placeholder="请选择城市"
              filterOption={filterOption}
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
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: '请输入取消次数',
              },
            ]}
            label="取消次数"
            name="count"
          >
            <InputNumber precision={0} min={0} max={99} />
          </FormItem>
        </Col>
      </Row>
      <Row style={{marginTop: 24}}>
        <Tag color="red">注：默认当前城市的司机取消次数为2次！</Tag>
      </Row>
    </Form>
  );
};

export default forwardRef(ModelForm);
