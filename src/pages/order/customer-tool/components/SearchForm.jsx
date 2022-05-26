import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Col, Button, Row, Form, Input, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';

const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { getOrderList } = props;
  const dispatch = useDispatch();

  const orderSearchValue = useSelector(({ global }) => global.orderSearchValue);
  const userInfo = useSelector(({ global }) => global.userInfo);

  const [expand, setExpand] = useState(false);
  // 乘客or司机
  const [userRole, setUserRole] = useState(null);
  // 乘客
  const [pStatus, setPStatus] = useState(false);
  const [dStatus, setDStatus] = useState(false);
  const [oidStatus, setOidStatus] = useState(false);
  const [pidStatus, setPidStatus] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    // console.log(orderSearchValue, 'orderSearchValue');
    // console.log(_.isEmpty(orderSearchValue), '是否是{}');
    if (!_.isEmpty(orderSearchValue)) {
      Object.keys(orderSearchValue).map((key) => {
        if (key == 'start_time') {
          form.setFieldsValue({
            submit_time: [
              moment(orderSearchValue['start_time']),
              moment(orderSearchValue['end_time']),
            ],
          });
        }
        if (orderSearchValue['passengerPhone']) {
          setUserRole(1);
        }
        if (orderSearchValue['driverPhone']) {
          setUserRole(2);
        }
        form.setFieldsValue({
          [key]: orderSearchValue[key],
        });
      });

      getOrderList(orderSearchValue);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const values = await form.validateFields();
      if (values.submit_time) {
        values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD 00:00:00');
        values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD 23:59:59');
      }
      delete values.submit_time;
      return values;
    },
  }));

  /**
   * @description: 查询表格
   * @param {object} values 获取表格参数
   * @return {*}
   */
  const onFinish = (values) => {
    if (values.submit_time) {
      values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD 00:00:00');
      values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD 23:59:59');
    }
    delete values.submit_time;
    const { open_pid, open_oid } = values;
    const params = {
      user_role: userRole,
      phone: values.passengerPhone || values.driverPhone,
      caller_name: 'sail',
      open_pid,
      open_oid,
      ...values,
    };
    dispatch({
      type: 'global/saveOrderSearchValue',
      payload: {
        orderSearchValue: params,
      },
    });
    getOrderList(params);
  };

  /**
   * @description: 输入乘客手机号
   * @param {*}
   * @return {*}
   */
  const changePassengerPhone = (e) => {
    const value = e.target.value;
    if (value) {
      setUserRole(1);
      setDStatus(true);
      setOidStatus(true);
      setPidStatus(true);
      form.setFieldsValue({
        driverPhone: null,
        open_pid: null,
        open_oid: null,
      });
    } else {
      setUserRole(null);
      setDStatus(false);
      setOidStatus(false);
      setPidStatus(false);
      setPStatus(false);
    }
  };

  /**
   * @description: 输入司机手机号
   * @param {*}
   * @return {*}
   */
  const changeDriverPhone = (e) => {
    const value = e.target.value;
    if (value) {
      setUserRole(2);
      setPStatus(true);
      setOidStatus(true);
      setPidStatus(true);
      form.setFieldsValue({
        passengerPhone: null,
        open_pid: null,
        open_oid: null,
      });
    } else {
      setUserRole(null);
      setDStatus(false);
      setOidStatus(false);
      setPidStatus(false);
      setPStatus(false);
    }
  };

  /**
   * @description: 输入OpenPid
   * @param {*}
   * @return {*}
   */
  const changeOpenPid = (e) => {
    const value = e.target.value;
    if (value) {
      setPStatus(true);
      setOidStatus(true);
      setDStatus(true);
      form.setFieldsValue({
        passengerPhone: null,
        driverPhone: null,
        open_oid: null,
      });
    } else {
      setUserRole(null);
      setDStatus(false);
      setOidStatus(false);
      setPidStatus(false);
      setPStatus(false);
    }
  };

  /**
   * @description: 输入OpenOid
   * @param {*}
   * @return {*}
   */
  const changeOpenOid = (e) => {
    const value = e.target.value;
    if (value) {
      setPStatus(true);
      setPidStatus(true);
      setDStatus(true);
      form.setFieldsValue({
        passengerPhone: null,
        driverPhone: null,
        open_pid: null,
      });
    } else {
      setUserRole(null);
      setDStatus(false);
      setOidStatus(false);
      setPidStatus(false);
      setPStatus(false);
    }
  };
  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        {userInfo && userInfo.agent_type == 0 && (
          <Col span={6}>
            <Form.Item
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const pattern = /^\d{11}$/g;
                    if (pattern.test(value) || !value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请输入正确手机号格式');
                  },
                }),
              ]}
              name="passengerPhone"
              label="乘客手机号"
            >
              <Input
                disabled={pStatus}
                onChange={changePassengerPhone}
                placeholder="请输入手机号"
              />
            </Form.Item>
          </Col>
        )}
        <Col span={6}>
          <Form.Item
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const pattern = /^\d{11}$/g;
                  if (pattern.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请输入正确手机号格式');
                },
              }),
            ]}
            name="driverPhone"
            label="司机手机号"
          >
            <Input onChange={changeDriverPhone} disabled={dStatus} placeholder="请输入手机号" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择时间',
              },
            ]}
            name="submit_time"
            label=""
            initialValue={[moment(new Date()).add(-31, 'days'), moment(new Date()).endOf('day')]}
          >
            <RangePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>
      {expand && (
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="open_pid" label="openPID">
              <Input onChange={changeOpenPid} disabled={pidStatus} placeholder="openPID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="open_oid" label="openOID">
              <Input onChange={changeOpenOid} disabled={oidStatus} placeholder="openOID" />
            </Form.Item>
          </Col>
        </Row>
      )}

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
              setUserRole();
              setDStatus(false);
              setOidStatus(false);
              setPidStatus(false);
              setPStatus(false);
            }}
          >
            重置
          </Button>
          <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />}
            {expand ? '收起' : '展开'}
          </a>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
