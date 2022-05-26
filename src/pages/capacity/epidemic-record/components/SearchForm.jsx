import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { Button, Row, Form, Input, Col, Descriptions, message, Select, DatePicker } from 'antd';

import moment from 'moment';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { getSignList } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();
  const [countyList, setCountyList] = useState([]);
  const [dates, setDates] = useState([]);

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const cell = form.getFieldValue('cell');
    let tooLate;
    let tooEarly;
    // 存在手机号 可选30天范围内 不存在手机号只能选1天
    if (cell) {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    } else {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 1;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 1;
    }
    return tooEarly || tooLate;
  };

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const values = await form.validateFields();
      if (values.time) {
        values.start_time = moment(values.time[0]).format('YYYY-MM-DD');
        values.end_time = moment(values.time[1]).format('YYYY-MM-DD');
      }
      delete values.time;
      return values;
    },
  }));
  const onFinish = (values) => {
    let diff = moment(values.time[1]).diff(moment(values.time[0]), 'days');
    if (values.cell) {
      // 不能超过30天
    } else {
      if (diff > 1) {
        return message.error('选择时间不能大于1天');
      }
    }
    if (values.time) {
      values.start_time = moment(values.time[0]).format('YYYY-MM-DD');
      values.end_time = moment(values.time[1]).format('YYYY-MM-DD');
    }
    delete values.time;

    getSignList(values);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6} >
          <FormItem name="cell" label="司机手机号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="area_id" label="城市">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
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
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="temperature_status" label="体温状态">
            <Select allowClear placeholder="体温状态">
              {[
                { key: '1', value: '正常' },
                { key: '2', value: '异常' },
              ].map((item) => (
                <Option value={item.key} key={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={[moment(), moment()]}
            name="time"
            label="日期"
          >
            <RangePicker
              allowClear
              onCalendarChange={(val) => setDates(val)}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="health_code_status" label="健康码状态">
            <Select allowClear placeholder="健康码状态">
              {[
                { key: '1', value: '未见异常-绿码' },
                { key: '2', value: '居家观察-橙码' },
                { key: '3', value: '集中隔离-红码' },
              ].map((item) => (
                <Option value={item.key} key={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
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
