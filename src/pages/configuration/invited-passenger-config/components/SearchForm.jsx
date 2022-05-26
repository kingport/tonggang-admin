import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Col } from 'antd';
import { CONFIG_PASSENGER_STATUS } from '@/utils/constant';
import { useSelector } from 'dva';
const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    // 查询
    props.activityArea(e);
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
          <FormItem name="area_id" label="城市">
            <Select
              // onChange={this.getCounty}
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
          <FormItem name="status" label="状态">
            <Select
              // onChange={this.getCounty}
              allowClear
              showSearch
              placeholder="请选择"

              // filterOption={this.filterOption}
            >
              {Object.keys(CONFIG_PASSENGER_STATUS).map((item, key) => {
                return (
                  <Option key={item} value={item}>
                    {CONFIG_PASSENGER_STATUS[item].label}
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
