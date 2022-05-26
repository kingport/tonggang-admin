import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col, Input, DatePicker } from 'antd';
import { useSelector } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { companyList } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { type } = props;
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const [dates, setDates] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      let res = await form.validateFields();
      res = _.pickBy(res, _.identity);
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
    // if (!dates || dates.length === 0) {
    //   return false;
    // }
    // let tooLate;
    // let tooEarly;
    // tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    // tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    // return tooEarly || tooLate;
    return current < moment('2021-04-01') ||  current >= moment().startOf('day')
  };

  /**
   * @description: 选择城市
   * @param {string} e 城市码
   * @return {*}
   */
  const changeCity = (e) => {
    if (e) {
      getCompanyList(e);
    } else {
      setCompanyData([]);
    }
    form.setFieldsValue({ companyList: [] });
  };

  /**
   * @description: 获取租赁公司列表
   * @param {string} area_id 城市码
   * @return {*}
   */
  const getCompanyList = async (area_id) => {
    const params = {
      area_id,
    };
    const res = await companyList(params);
    if (res) {
      setCompanyData(res.data);
    }
  };

  const onFinish = () => {
    // 查询
    props.getDriverBase();
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
          <FormItem name="driver_id" label="司机ID">
            <Input placeholder="请输入司机ID" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="cell" label="司机手机号">
            <Input placeholder="请输入司机手机号" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="area_id" label="所属城市">
            <Select
              allowClear
              showSearch
              onChange={changeCity}
              filterOption={filterOption}
              placeholder="请选择"
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
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="join_company_id" label="租赁公司">
            <Select allowClear placeholder="请选择">
              {companyData &&
                companyData.map((item) => {
                  return (
                    <Option key={item.company_id} value={item.company_id}>
                      {item.company_name}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item
            initialValue={[moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').startOf('day')]}
            rules={[
              {
                required: type === 'ORDER' ? true : false,
              },
            ]}
            name="time"
            label="注册日期"
          >
            <RangePicker
              onCalendarChange={(val) => setDates(val)}
              disabledDate={type === 'ORDER' ? disabledDate : null}
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
