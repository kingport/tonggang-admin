import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { INVITER_ACTIVE_STATUS } from '@/utils/constant';
import { Col, Button, Row, Select, Form } from 'antd';
import { useSelector } from 'dva';

import { selectCityAllComapny } from '../service';
const { Option } = Select;

const SearchForm = (props, ref) => {
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  const [allCompany, setAllCompany] = useState([]);
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const onFinish = (values) => {
    const { getActiveConfigList } = props;
    getActiveConfigList(values);
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  // 获取所有公司
  const getAllCompany = async (params) => {
    const res = await selectCityAllComapny(params);
    if (res) {
      setAllCompany(res.data.company_list);
    }
  };
  // 选择城市
  const changeCity = (e) => {
    form.setFieldsValue({
      company_id: null,
    });
    if (e) {
      const params = {
        area: e,
      };
      getAllCompany(params);
    } else {
      setAllCompany([]);
    }
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="area" label="城市">
            <Select
              allowClear
              showSearch
              filterOption={filterOption}
              onChange={changeCity}
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
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="company_id" label="租赁公司">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {allCompany &&
                allCompany.map((item) => {
                  return (
                    <Option key={item.company_id} value={item.company_id}>
                      {item.company_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="inviter_active_status" label="状态">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {Object.keys(INVITER_ACTIVE_STATUS).map((key, index) => {
                if (index < 4) {
                  return (
                    <Option key={key} value={key}>
                      {INVITER_ACTIVE_STATUS[key].value}
                    </Option>
                  );
                }
              })}
            </Select>
          </Form.Item>
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
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
