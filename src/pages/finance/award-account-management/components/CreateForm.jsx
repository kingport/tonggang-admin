import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { Button, Row, Form, Input, Col, InputNumber, Descriptions, Select, DatePicker } from 'antd';

import { accountBalanceIncrease, accountBalanceReduce } from '../service';
const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;

const CreateForm = (props, ref) => {
  const { onCancel, selectRecord, type, getAccountList } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();

  const [btnLoading, setBtnLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = async (values) => {
    setBtnLoading(true);
    console.log(values, '表单参数');
    if (1) {
      message.success('操作成功');
      // getAccountList();
      onCancel();
    }
    setBtnLoading(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="account_name"
        label="账户名称"
      >
        <Input placeholder="请输入" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="product_id"
        label="请选择产品线"
      >
        <Select showSearch allowClear placeholder="请选择产品线">
          {[{ value: 1, name: '快车' }].map((item) => {
            return (
              <Option value={item.value} key={item.value}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('请输入正确邮箱格式');
            },
          }),
        ]}
        name="email"
        label="联系人邮箱"
      >
        <Input placeholder="请输入" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,500})$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('请输入内容为500个字符以内');
            },
          }),
        ]}
        name="desc"
        label="创建原因"
      >
        <TextArea rows={4} placeholder="请输入备注" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ margin: '0 8px' }}>
            取消
          </Button>
          <Button loading={btnLoading} type="primary" htmlType="submit">
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(CreateForm);
