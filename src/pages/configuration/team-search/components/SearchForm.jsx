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
import _ from 'lodash';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { getEventList } = props;
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
      let res = await form.validateFields();
      res = _.pickBy(res, _.identity);
      if (res.time) {
        res.start_day = moment(res.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        res.end_day = moment(res.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        delete res.time;
      }
      if (res.id) {
        res.id = parseInt(res.id, 10);
      }
      return res;
    },
  }));
  const onFinish = () => {
    getEventList();
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
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="id" label="活动ID">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="city" label="活动城市">
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
          <FormItem name="status" label="活动状态">
            <Select allowClear placeholder="请选择">
              {[
                {
                  key: 4,
                  name: '待审核',
                },
                {
                  key: 1,
                  name: '审核通过',
                },
                {
                  key: 2,
                  name: '审核未通过',
                },
                {
                  key: 3,
                  name: '已终止',
                },
              ].map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="creator" label="创建人">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="time" label="有效期">
            <RangePicker allowClear format="YYYY-MM-DD" />
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
