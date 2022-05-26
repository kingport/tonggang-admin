// 申请信息模块
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Select, Card, Input, Form, Space, message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { DRIVER_THE_SOURCE } from '@/utils/constant';

import { selectCityValidComapny } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const DriverApplyForm = (props, ref) => {
  const { detail, type, getDriverConfig, setMustDriverConfig } = props;

  const userInfo = useSelector(({ global }) => global.userInfo);
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [count, setCount] = useState(300);
  const [timing, setTiming] = useState(false);

  const [countyList, setCountyList] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [source, setSource] = useState();

  const [cityCode, setCityCode] = useState();

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (detail && type != 'new') {
      if (detail.area_id) {
        // 请求公司 请求区县 获取双证配置
        getCompanyList(detail.area_id);
        changeCity(detail.area_id);
        // console.log(detail, 'detail');
        getDriverConfig(detail.area_id, detail.county_id);
        // 个人加盟禁止选择推荐公司
        if (detail.biz_source == 1) {
          setSource(detail.biz_source);
          form.setFieldsValue({
            company_id: null,
            county_id: detail.county_id,
          });
        } else {
          form.setFieldsValue({
            company_id: detail.company_id,
            county_id: detail.county_id,
          });
        }
      }
    }
  }, [detail]);

  // 表单信息
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 过滤空项
          Object.keys(values).forEach((key) => {
            if (!values[key]) {
              delete values[key];
            }
          });

          if (values.id_valid_date) {
            values.id_valid_date = moment(values.id_valid_date).format('YYYY-MM-DD');
          }
          dispatch({
            type: 'joinNew/saveDriverApply',
            payload: {
              driverApply: values,
            },
          });
          return values;
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          throw message.error('请填写完整的申请信息');
        });
    },
    getValues: async () => {
      try {
        console.log(await form.validateFields(), 'await form.validateFields();');
        return await form.validateFields();
      } catch (error) {
        return message.error('请填写完整的申请信息');
      }
    },
  }));
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 获取租赁公司列表
  const getCompanyList = async (area_id) => {
    const params = {
      area: area_id,
    };
    const res = await selectCityValidComapny(params);
    if (res) {
      setCompanyData(res.data.valid_company_list);
    }
  };

  // 选择城市
  const changeCity = (e) => {
    if (e) {
      setCityCode(e);
      let county = cityCountyList && cityCountyList.find((x) => x.city === e);
      // console.log(county, 'county')
      if (county) {
        county = county.county_infos;
        setCountyList(county);
      }
      // 获取租赁公司列表
      getCompanyList(e);
    } else {
      setCountyList([]);
      setCompanyData([]);
      setCityCode();
    }
    setMustDriverConfig({});
    form.setFieldsValue({
      county_id: null,
      company_id: null,
    });
  };

  // 选择区县
  const changeCounty = async (countyCode) => {
    if (countyCode) {
      // 获取双证配置
      getDriverConfig(cityCode, countyCode);
    } else {
      setMustDriverConfig({});
    }
  };

  // 选择加入源
  const changeSource = (e) => {
    if (e && e == 1) {
      setSource(e);
      form.setFieldsValue({
        company_id: null,
      });
    } else {
      setSource();
    }
  };

  useEffect(() => {
    let interval = 0;
    const countDown = 300;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数
            return countDown || 300;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);

  return (
    <Card
      title={
        <div>
          <Space>
            <span>申请信息:(注意：加*为必填字段)</span>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const pattern = /^1\d{10}$/;
                    if (pattern.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('您输入的手机号格式不正确');
                  },
                }),
              ]}
              name="cell"
              label="#手机号"
              initialValue={(detail && detail.cell) || ''}
            >
              <Input
                disabled={type === 'check' || type === 'edit' || type === 'audit'}
                placeholder="请输入手机号"
              />
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择加入源',
                },
              ]}
              name="biz_source"
              label="加入源"
              initialValue={(detail && `${detail.biz_source}`) || null}
            >
              <Select
                onChange={changeSource}
                disabled={type === 'check' || type === 'edit' || type === 'audit'}
                placeholder="请选择加入源"
                allowClear
                showSearch
              >
                {DRIVER_THE_SOURCE &&
                  Object.keys(DRIVER_THE_SOURCE).map((key, index) => {
                    if (userInfo && userInfo.agent_type != 0) {
                      if (index > 0) {
                        return (
                          <Option key={key} value={key}>
                            {DRIVER_THE_SOURCE[key].value}
                          </Option>
                        );
                      }
                    } else {
                      return (
                        <Option key={key} value={key}>
                          {DRIVER_THE_SOURCE[key].value}
                        </Option>
                      );
                    }
                  })}
              </Select>
            </FormItem>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择运营城市',
                },
              ]}
              name="area_id"
              label="运营城市"
              initialValue={(detail && `${detail.area_id}` * 1) || null}
            >
              <Select
                filterOption={filterOption}
                onChange={changeCity}
                disabled={type === 'check' || type === 'edit' || type === 'audit'}
                placeholder="请选择运营城市"
                allowClear
                showSearch
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
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请选择运营区县',
                },
              ]}
              name="county_id"
              label="选择区县"
            >
              <Select
                disabled={type === 'check'}
                allowClear
                showSearch
                onChange={changeCounty}
                filterOption={filterOption}
                placeholder="请选择"
              >
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
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              initialValue={(detail && `${detail.company_id}`) || null}
              name="company_id"
              label="推荐公司"
            >
              <Select
                disabled={type === 'check' || type === 'edit' || type === 'audit' || source == 1}
                placeholder="请选择推荐公司"
                allowClear
                showSearch
              >
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
        </Row>
      </Form>
    </Card>
  );
};
export default forwardRef(DriverApplyForm);
