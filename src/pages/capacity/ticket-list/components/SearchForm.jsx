import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col } from 'antd';
import { useSelector } from 'dva';
import { ticketType } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [countyList, setCountyList] = useState([]);
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
      // console.log(a)
    },
  }));
  const onFinish = (e) => {
    // 查询
    props.getActivity(e);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  // 选择城市
  const changeCity = (e) => {
    // console.log(e);
    // 多选暂时不支持 功能已写好
    // const citys = e;
    // const countys = [];
    // citys.map((code) => {
    //   console.log(code);
    //   let county = COUNTY_OPTION.find((x) => x.value === code);
    //   countys.push(county);
    // });
    // let countysAll = countys;
    // countys.map((item) => {
    //   countysAll = countysAll.concat(item.children);
    // });
    // setCountyList(countysAll);
    // 找出所有的区县
    if (e) {
      let county = cityCountyList.find((x) => x.city === e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
    form.setFieldsValue({ district: null });
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="coupon_type" label="优惠券类型">
            <Select allowClear showSearch placeholder="请选择优惠券类型">
              {ticketType.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="city" label="使用城市">
            <Select
              onChange={changeCity}
              allowClear
              showSearch
              placeholder="请选择城市"
              filterOption={filterOption}
              // mode="multiple"
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
          <FormItem name="district" label="二级区县">
            <Select
              allowClear
              showSearch
              placeholder="可选择二级区县"
              filterOption={filterOption}
              // mode="multiple"
            >
              {countyList.length > 0 &&
                countyList.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.label}
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
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
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
