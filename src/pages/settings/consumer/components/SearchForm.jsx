import React, { useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Input, Col } from 'antd';
import { ACCOUNT_STATUS } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;

const SearchForm = (props, ref) => {
  const { roleData } = props;
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (e) => {
    const { userList } = props;
    userList(e);
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
          <FormItem name="company_name" label="公司名称">
            <Input placeholder="请输入公司名称" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="role_id" label="角色名称">
            <Select
              placeholder="请选择角色名称"
              // onChange={this.getCounty}
              allowClear
              showSearch
              filterOption={filterOption}
            >
              {roleData &&
                roleData.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem initialValue={'0'} name="is_disable" label="状态">
            <Select
              placeholder="请选择"
              // onChange={this.getCounty}
              allowClear
              showSearch
              // filterOption={this.filterOption}
            >
              {Object.keys(ACCOUNT_STATUS).map((item) => {
                return (
                  <Option key={item} value={item}>
                    {ACCOUNT_STATUS[item].label}
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
