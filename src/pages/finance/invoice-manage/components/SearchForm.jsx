import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Col, Button, Row, Form, Input, DatePicker, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { FINANCE_STATUS } from '@/utils/constant';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const { getOrderList } = props;
  const dispatch = useDispatch();

  const userInfo = useSelector(({ global }) => global.userInfo);

  const [form] = Form.useForm();

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const values = await form.validateFields();
      if (values.submit_time) {
        values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD 00:00:00');
        values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD 23:59:59');
      }
      delete values.submit_time;
      return values;
    },
  }));

  /**
   * @description: 查询表格
   * @param {object} values 获取表格参数
   * @return {*}
   */
  const onFinish = (values) => {};

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name="orderId" label="订单ID">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="applyId" label="申请ID">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="receiverTelephone" label="收件人手机">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="receiverEmail" label="收件人邮箱">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="invoiceTitle" label="发票抬头">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="invoiceNumber" label="发票号码">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="申请状态">
            <Select placeholder="请选择">
              {Object.keys(FINANCE_STATUS).map((key) => (
                <Option value={key} key={key}>
                  {FINANCE_STATUS[key]}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择时间',
              },
            ]}
            name="submit_time"
            label=""
            initialValue={[moment(new Date()).add(-31, 'days'), moment(new Date()).endOf('day')]}
          >
            <RangePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
