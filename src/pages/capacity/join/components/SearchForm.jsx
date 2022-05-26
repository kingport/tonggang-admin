import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import {
  Col,
  DatePicker,
  Button,
  Row,
  Select,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Card,
} from 'antd';
import moment from 'moment';
import { SearchOutlined, ReloadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import {
  DRIVER_AUDIT_STATUS,
  DRIVER_AUTHENTICATION_STATUS,
  DRIVER_ACCOUNT_STATUS,
} from '@/utils/constant';

import { companyList, driverExport, driverExportStatus } from '../service';
import { API_DRIVER_LIST, API_DRIVER_EXPORT } from '../constant';
const { RangePicker } = DatePicker;
const { Option } = Select;
let timer;
const SearchForm = (props, ref) => {
  const dispatch = useDispatch();
  const { channels } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const searchValue = useSelector(({ global }) => global.searchValue);

  const [countyList, setCountyList] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [percent, setPercent] = useState(0);
  const [showPercent, setShowPercent] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (searchValue) {
      Object.keys(searchValue).map((key) => {
        // 城市码
        if (key == 'area_id') {
          changeCity(searchValue[key]);
        }
        if (key == 'start_time') {
          form.setFieldsValue({
            submit_time: [moment(searchValue.start_time), moment(searchValue.end_time)],
          });
        }
        form.setFieldsValue({
          [key]: searchValue[key],
        });
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));

  /**
   * @description: 查询表单
   * @param {object} values 查询参数
   * @return {*}
   */
  const onFinish = (values) => {
    if (values.submit_time) {
      values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD');
      values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD');
    }
    delete values.submit_time;
    // 缓存搜索条件
    dispatch({
      type: 'global/saveJoinSearchValue',
      payload: {
        searchValue: values,
      },
    });
    const { getDriverList } = props;
    getDriverList(values);
  };

  /**
   * @description: 过滤
   * @param {string} inputValue 查询值
   * @param {object} option fun
   * @return {*}
   */
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
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
      getCompanyList(e);
    } else {
      setCountyList([]);
      setCompanyData([]);
    }
    form.setFieldsValue({ district: null });
    form.setFieldsValue({ companyList: [] });
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

  // const convertObj = (data) => {
  //   var _result = [];
  //   for (var key in data) {
  //     var value = data[key];
  //     if (value) {
  //       _result.push(key + '=' + value);
  //     }
  //   }
  //   return _result.join('&');
  // };
  // 导出列表
  const exportExcel = async () => {
    const values = await form.validateFields();
    if (values.area_id && values.submit_time) {
      values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD');
      values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD');
      delete values.submit_time;
      if (moment(values.end_time).diff(moment(values.start_time), 'day') > 30) {
        return message.error('请选择一个月内的时间');
      } else {
        setShowPercent(true);
        const res = await driverExport(values);
        if (res) {
          const { data } = res;
          const params = {
            ...data,
          };
          timer = setInterval(async () => {
            const res1 = await driverExportStatus(params);
            if (res1) {
              setPercent(res1.data.progress * 1);
              if (res1.data.progress * 1 == 100) {
                clearInterval(timer);
                setShowPercent(false);
                setPercent(0);
                window.location.href = `https://saasadmin.tonggangfw.net/saasbench/v1/driver/exportDownload/index?file_id=${data.file_id}`;
              }
            }
          }, 1000);
        }
      }
    } else {
      return message.error('请选择一个月内的时间和城市');
    }
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} hideRequiredMark>
        <Row gutter={24}>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="id_no" label="身份证号">
              <Input placeholder="请输入司机身份证号码" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="cell" label="司机手机">
              <Input placeholder="请输入司机手机号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="driver_id" label="司机ID号">
              <Input placeholder="请输入司机ID" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="plate_no" label="车牌号码">
              <Input placeholder="请输入车牌号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="account_status" label="账户状态">
              <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
                {DRIVER_ACCOUNT_STATUS &&
                  Object.keys(DRIVER_ACCOUNT_STATUS).map((key) => {
                    return (
                      <Option key={key} value={key}>
                        {DRIVER_ACCOUNT_STATUS[key]}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="audit_status" label="审核状态">
              <Select allowClear showSearch placeholder="请选择">
                {Object.keys(DRIVER_AUDIT_STATUS).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {DRIVER_AUDIT_STATUS[key].value}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="license_auth" label="合规认证">
              <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
                {Object.keys(DRIVER_AUTHENTICATION_STATUS).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {DRIVER_AUTHENTICATION_STATUS[key].value}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="channel_source" label="渠道来源">
              <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
                {channels.map((x) => {
                  return (
                    <Option key={x.id} value={x.id}>
                      {x.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="area_id" label="选择城市">
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
            <Form.Item name="county_id" label="选择区县">
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
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="intive_phone" label="邀请手机">
              <Input placeholder="请输入邀请人手机号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6}>
            <Form.Item name="submit_time" label="提交时间">
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {userApiAuth && userApiAuth[API_DRIVER_LIST] && (
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                查询
              </Button>
            )}
            <Button
              icon={<ReloadOutlined />}
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
            {userApiAuth && userApiAuth[API_DRIVER_EXPORT] && (
              <Button
                onClick={exportExcel}
                icon={<VerticalAlignBottomOutlined />}
                type="primary"
                style={{ margin: '0 8px' }}
              >
                导出列表
              </Button>
            )}
          </Col>
        </Row>
      </Form>
      <Modal
        title={percent == 100 ? '下载完成' : '文件下载中...'}
        onCancel={() => {
          setShowPercent(false);
          clearInterval(timer);
        }}
        closable={false}
        maskClosable={false}
        visible={showPercent}
        centered
        footer={
          percent != 100 && [
            <Button
              key="back"
              onClick={() => {
                setShowPercent(false);
                clearInterval(timer);
              }}
            >
              取消下载
            </Button>,
          ]
        }
      >
        <Progress
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          percent={percent}
        />
      </Modal>
    </>
  );
};

export default forwardRef(SearchForm);
