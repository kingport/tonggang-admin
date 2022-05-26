import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'dva';
import { Col, Button, Row, Select, Form, Input } from 'antd';
import { SearchOutlined, ReloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

import { companyListAll } from '../service';

const { Option } = Select;

const SearchForm = (props, ref) => {
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  const [companyData, setCompanyData] = useState([]);

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));

  /**
   * @description: 查询表格
   * @param {object} values 获取表格参数
   * @return {*}
   */
  const onFinish = (values) => {
    const { getCompanyList } = props;
    getCompanyList(values);
  };

  /**
   * @description: 过滤
   * @param {string} inputValue 查询关键字
   * @param {object} option fun
   * @return {*}
   */
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  /**
   * @description: 切换城市
   * @param {string} e 城市码
   * @return {*}
   */
  const changeCity = (e) => {
    if (e) {
      getCompanyListAll(e);
    } else {
      setCompanyData([]);
    }
    form.setFieldsValue({
      company_id: null,
    });
  };

  /**
   * @description: 获取租赁公司列表
   * @param {string} area_id 城市码
   * @return {*}
   */
  const getCompanyListAll = async (area_id) => {
    const params = {
      area_id,
    };
    const res = await companyListAll(params);
    if (res) {
      setCompanyData(res.data);
    }
  };

  /**
   * @description: 导出列表
   * @return {*} 跳转下载连接
   */
  const exportExcel = async () => {
    const values = await form.validateFields();
    const params = convertObj(values);
    window.location.href = `http://${window.location.host}/saasbench/v1/inviter/inviterDriverListExport/index?${params}`;
  };

  /**
   * @description: url参数拼接
   * @param {object} data 下载参数
   * @return {string} 拼接后参数
   */
  const convertObj = (data) => {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value) {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  };

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="cell" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="area_id" label="城市">
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
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="company_id" label="公司">
            <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
              {companyData &&
                companyData.map((item) => {
                  return (
                    <Option key={item.company_id} value={item.company_id}>
                      {item.company_name}
                    </Option>
                  );
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
          <Button
            onClick={exportExcel}
            icon={<VerticalAlignBottomOutlined />}
            type="primary"
            style={{ margin: '0 8px' }}
          >
            下载
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
