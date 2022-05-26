import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col, Input, DatePicker } from 'antd';
import { CONFIG_PASSENGER_STATUS, RISK_CONTROL_CANCEL } from '@/utils/constant';
import { useSelector } from 'dva';
import moment from 'moment';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const [dates, setDates] = useState([]);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const res = await form.validateFields();
      if (res.time) {
        res.start_time = moment(res.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        res.end_time = moment(res.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        delete res.time;
      }
      return res;
    },
  }));

  // 最长时间选择31天
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    let tooLate;
    let tooEarly;
    tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const onFinish = (value) => {
    // 查询
    props.getCancelOrderJudgeList();
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
          <FormItem name="area" label="城市">
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
          <FormItem name="area1" label="租赁公司">
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
          <Form.Item
            initialValue={[moment().subtract(0, 'days').startOf('day'), moment()]}
            rules={[
              {
                required: true,
              },
            ]}
            name="time"
            label="日期"
          >
            <RangePicker
              onCalendarChange={(val) => setDates(val)}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          </Form.Item>
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
