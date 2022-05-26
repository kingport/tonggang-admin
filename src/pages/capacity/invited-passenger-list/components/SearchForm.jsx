import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Col, Row, Form } from 'antd';
const { Item: FormItem } = Form;

const SearchForm = (props, ref) => {
  const { driverPhone } = props;
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
    setPhone: () => {
      form.setFieldsValue({
        driver_phone: driverPhone,
      });
    },
  }));

  /**
   * @description: 查询表格
   * @param {object} e 查询参数
   * @return {*}
   */
  const onFinish = (e) => {
    props.driverBandding(e);
  };

  /**
   * @description: 重置表格
   * @return {*}
   */
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col span={6}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请输入司机手机号',
              },
            ]}
            name="driver_phone"
            label="手机号"
          >
            <Input placeholder="请输入司机手机号" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{ margin: '0 8px' }}
            icon={<ReloadOutlined />}
            htmlType="button"
            onClick={onReset}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
