import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col, Input, DatePicker, Radio } from 'antd';
// import { CONFIG_PASSENGER_STATUS, RISK_CONTROL_CANCEL } from '@/utils/constant';
import { useSelector } from 'dva';
import moment from 'moment';
const { Item: FormItem } = Form;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { totalCount } = props
  const [form] = Form.useForm();
  // const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

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

  const onFinish = () => {
    // 查询
    props.getcancelJudgeTypeDriverList();
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="phone" label="司机手机号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="driver_id" label="司机ID">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="cancel_judge_type" initialValue="1" label="标签">
            <Radio.Button checked>取消管控司机({totalCount})</Radio.Button>
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
