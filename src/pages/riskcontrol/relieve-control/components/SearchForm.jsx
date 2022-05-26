import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Input, Col, DatePicker } from 'antd';
import { useSelector } from 'dva';
import { CANCEL_CONFIGURATION } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    const { getCancelRuleList } = props;
    getCancelRuleList(e);
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
          <FormItem name="channel" label="司机手机号">
            <Input placeholder="请输入" />
          </FormItem>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="city" label="城市">
            <Select placeholder="请选择城市" allowClear showSearch filterOption={filterOption}>
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
          <FormItem name="channel" label="状态">
            <Select
              placeholder="请选择平台"
              // onChange={this.getCounty}
              allowClear
              showSearch
              filterOption={filterOption}
            >
              {CANCEL_CONFIGURATION &&
                Object.keys(CANCEL_CONFIGURATION).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {CANCEL_CONFIGURATION[key]}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="channel" label="日期">
            <RangePicker format="YYYY-MM-DD" />
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
