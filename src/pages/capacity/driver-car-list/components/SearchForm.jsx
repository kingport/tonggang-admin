import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col, Input, DatePicker } from 'antd';
import { DRIVER_SOUCER_STATUS, DRIVER_BOUND_STATUS, DRIVER_CHECK_STATUS } from '@/utils/constant';
import { useSelector } from 'dva';
import moment from 'moment';
import { companyList } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const [dates, setDates] = useState([]);
  const [companyData, setCompanyData] = useState([]);

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
    props.getDriverCatList();
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
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

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="city_id" label="城市">
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
          <FormItem name="plate_no" label="车牌号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="bind_status" label="绑定司机状态">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {Object.keys(DRIVER_BOUND_STATUS).map((key) => {
                return (
                  <Option key={key} value={key}>
                    {DRIVER_BOUND_STATUS[key].value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="audit_status" label="车辆审核状态">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {Object.keys(DRIVER_CHECK_STATUS).map((key) => {
                return (
                  <Option key={key} value={key}>
                    {DRIVER_CHECK_STATUS[key].value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="company_id" label="租赁公司">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {companyData.map((item) => {
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
          <FormItem name="source" label="来源">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {Object.keys(DRIVER_SOUCER_STATUS).map((key) => {
                return (
                  <Option key={key} value={key}>
                    {DRIVER_SOUCER_STATUS[key].value}
                  </Option>
                );
              })}
            </Select>
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
