import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import { Button, Row, Form, Input, Col, Descriptions, Select } from 'antd';
import {
  ORDER_CENTER_CHANNEL,
  CONFIG_CITY_PRICE_STATUS,
  CONFIG_CITY_PRICE_TYPE,
} from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const { getCityPriceList } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();
  const [countyList, setCountyList] = useState([]);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    getCityPriceList(e);
  };

  /**
   * @description: 选择城市
   * @param {string} e 城市码
   * @return {*}
   */
  const changeCity = (e) => {
    if (e) {
      let county = cityCountyList.find((x) => x.city === e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
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
          <FormItem name="channel" label="选择平台">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {ORDER_CENTER_CHANNEL &&
                Object.keys(ORDER_CENTER_CHANNEL).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {ORDER_CENTER_CHANNEL[key].value}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="product_id" label="产品类型">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {CONFIG_CITY_PRICE_TYPE &&
                Object.keys(CONFIG_CITY_PRICE_TYPE).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {CONFIG_CITY_PRICE_TYPE[key]}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="area" label="选择城市">
            <Select
              onChange={changeCity}
              allowClear
              showSearch
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
          <Form.Item name="abstract_district" label="选择区县">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {countyList &&
                countyList.map((item) => {
                  return (
                    <Option key={item.county} value={item.county}>
                      {item.county_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="status" label="审核状态">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {CONFIG_CITY_PRICE_STATUS &&
                Object.keys(CONFIG_CITY_PRICE_STATUS).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {CONFIG_CITY_PRICE_STATUS[key]}
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
          <Button style={{ margin: '0 8px' }} htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
