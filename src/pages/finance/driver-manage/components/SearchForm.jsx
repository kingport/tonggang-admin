import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { Button, Row, Form, Input, Col, Descriptions, Select, DatePicker } from 'antd';
import {
  ORDER_CENTER_CHANNEL,
  CONFIG_CITY_PRICE_STATUS,
  CONFIG_CITY_PRICE_TYPE,
} from '@/utils/constant';
import moment from 'moment';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { getCityListConfig } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();
  const [countyList, setCountyList] = useState([]);
  const [dates, setDates] = useState([]);

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 2;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 2;
    return tooEarly || tooLate;
  };

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    getCityListConfig(e);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem name="driver_id" label="司机ID">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem name="cell" label="司机手机号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ margin: '0 8px' }} htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
