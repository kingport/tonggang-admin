import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Col, Row, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { companyList } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;
const SearchForm = (props, ref) => {
  const { getFullTimeDriverList, type } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const searchIntendedValue = useSelector(({ global }) => global.searchIntendedValue);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    if (searchIntendedValue && type != 'add') {
      Object.keys(searchIntendedValue).map((key) => {
        // 城市码
        if (key == 'area_id') {
          changeCity(searchIntendedValue[key]);
        }
        form.setFieldsValue({
          [key]: searchIntendedValue[key],
        });
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
    setPhone: () => {
      form.setFieldsValue({
        driver_phone: driverPhone,
      });
    },
  }));

  /**
   * @description: 查询表单
   * @param {object} e 表单参数
   * @return {Obje} res
   */
  const onFinish = (e) => {
    // 缓存搜索条件
    dispatch({
      type: 'global/saveIntendedSearchValue',
      payload: {
        searchIntendedValue: e,
      },
    });
    getFullTimeDriverList(e);
  };

  /**
   * @description: 重置表单
   * @return {Obje} res
   */
  const onReset = () => {
    form.resetFields();
  };

  /**
   * @description: 城市搜索过滤
   * @param {string} inputValue 搜索值
   * @param {object} option function
   * @return {Array} res
   */
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  /**
   * @description: 选择城市
   * @param {string} e 城市编码
   * @return {}
   */
  const changeCity = (e) => {
    if (e) {
      getCompanyList(e);
    } else {
      setCompanyData([]);
    }
    form.setFieldsValue({ company_id: null });
  };

  /**
   * @description: 获取租赁公司列表
   * @param {string} area_id 城市码
   * @return {object} res
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
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="cell" label="手机号">
            <Input placeholder="请输入司机手机号" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="area_id" label="选择城市">
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
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <Form.Item name="company_id" label="租赁公司">
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
