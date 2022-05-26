import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useSelector } from 'dva';
import { Col, message, Row, Select, Form, Space, InputNumber } from 'antd';
import NP from 'number-precision';
import { createCancelRule, getCancelRule, editCancelRule } from '../service';
import { CANCEL_CONFIGURATION } from '@/utils/constant';

const { Item: FormItem } = Form;
const { Option } = Select;

const ModelForm = (props, ref) => {
  const [form] = Form.useForm();
  const { userId, type } = props;
  const [detail, setDetail] = useState({});

  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  // 获取编辑详情
  useEffect(() => {
    if (type === 'edit') {
      getCancelDetail();
    }
    return () => {
      form.resetFields();
    };
  }, [type]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 分转秒
          if (values.arrived_duration) {
            values.arrived_duration = values.arrived_duration * 60;
          }
          if (values.strived_duration) {
            values.strived_duration = values.strived_duration * 60;
          }
          // 元转分
          if (values.arrived_fee) {
            values.arrived_fee = NP.times(values.arrived_fee, 100);
          }
          if (values.strived_fee) {
            values.strived_fee = NP.times(values.strived_fee, 100);
          }
          // 找区号
          if (values.city) {
            values.district = cityCountyList.find((x) => x.city == values.city).district_code;
          }
          if (type == 'edit') {
            values.id = userId;
            postEditCancelRule(values);
          } else {
            postCreateCancelRule(values);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
      setDetail({});
    },
  }));

  // 新增取消费配置
  const postCreateCancelRule = async (values) => {
    const res = await createCancelRule(values);
    if (res) {
      message.success('操作成功');
      props.handleCancel();
      props.getCancelRuleList();
    }
  };

  // 编辑取消费配置
  const postEditCancelRule = async (values) => {
    const res = await editCancelRule(values);
    if (res) {
      message.success('操作成功');
      props.handleCancel();
      props.getCancelRuleList();
    }
  };

  // 获取配置详情
  const getCancelDetail = async () => {
    const params = {
      id: userId,
    };
    const res = await getCancelRule(params);
    if (res) {
      setDetail(res.data);
    }
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  if (JSON.stringify(detail) == '{}' && type === 'edit') return;

  return (
    <Form form={form}>
      <Row>
        <Col span={12}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请选择平台',
              },
            ]}
            name="channel"
            label="平台"
            initialValue={(detail && detail.channel) || null}
          >
            <Select disabled={type == 'edit'} allowClear showSearch placeholder="请选择平台">
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
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请选择城市',
              },
            ]}
            name="city"
            label="城市"
            initialValue={(detail && detail.city * 1) || null}
          >
            <Select
              allowClear
              showSearch
              disabled={type == 'edit'}
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
      </Row>
      <Row>
        <Col span={24}>
          <Space style={{ marginBottom: 16 }} align="center">
            <span>司机接单</span>
            <FormItem
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入时间',
                },
              ]}
              name="strived_duration"
              initialValue={(detail && detail.strived_duration / 60) || null}
            >
              <InputNumber precision={0} min={1} max={60} />
            </FormItem>
            <span>分钟后，</span>
          </Space>
          <Space align="center">
            <span>乘客取消，乘客支付取消费</span>
            <FormItem
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入金额',
                },
              ]}
              name="strived_fee"
              initialValue={(detail && detail.strived_fee / 100) || null}
            >
              <InputNumber precision={2} min={0.1} max={99} />
            </FormItem>
            <span>元</span>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Space align="center">
            <span>司机按时到达上车点，且等待时长超过</span>
            <FormItem
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入时间',
                },
              ]}
              name="arrived_duration"
              initialValue={(detail && detail.arrived_duration / 60) || null}
            >
              <InputNumber precision={0} min={1} max={60} />
            </FormItem>
            <span>分钟后，</span>
          </Space>
          <Space style={{ marginBottom: 16 }}>
            <span>司机可以免责取消,乘客支付取消费</span>
            <FormItem
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入金额',
                },
              ]}
              name="arrived_fee"
              initialValue={(detail && detail.arrived_fee / 100) || null}
            >
              <InputNumber precision={2} min={0.1} max={99} />
            </FormItem>
            <span>元</span>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(ModelForm);
