import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector } from 'dva';
import _ from 'lodash';
import {
  Form,
  Row,
  InputNumber,
  Col,
  DatePicker,
  Select,
  Button,
  message,
  Table,
  Radio,
  //Checkbox,
  Space,
  Spin,
} from 'antd';
import moment from 'moment';
import Card from '@/components/Card';
import { ORDER_CITYPRICE_CHANNEL, CONFIG_CITY_PRICE_TYPE } from '@/utils/constant';
import { cityPriceAdd, cityPriceEdit, cityPriceDisable } from '../service';
import { transFormPrice } from '../utils/index';
import PeakTime from './PeakTime';
import SubSection from './SubSection';

const { Option } = Select;
const CreateCityPriceModal = props => {
  const { type, data, onCancel, getCityPriceList } = props;

  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [prepay, setPrepay] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [countyList, setCountyList] = useState([]);
  const [fixedPrice, setFixedPrice] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (data && data.area) {
      form.resetFields();
      const county = cityCountyList.find((x) => x.city == data.area).county_infos;
      setCountyList(county);
      form.setFieldsValue({
        abstract_district: _.get(data, 'abstract_district').split(',')[1] * 1 || null,
      });
      form.setFieldsValue({
        area: _.get(data, 'area') * 1,
      });
    }
    // 是否有预付费
    if (data && (data.channel == 1001 || data.channel == 20000)) {
      setPrepay(true);
    } else {
      setPrepay(false);
    }
    // 是否是一口价
    if (data && data.price_mode == 1) {
      setFixedPrice(true);
    }

    // 是否显示一口价选项
    if (data && data.channel == 10000) {
      setFixedPrice(true);
    } else {
      setFixedPrice(false);
    }
  }, [data]);

  useEffect(() => {
    if (type == 'new') {
      form.resetFields();
    }
  }, [type]);

  /**
   * @description: 获取历史操作
   * @param {*}
   * @return {*}
   */
  const getTable = (data) => {
    const dataSource =
      data &&
      data.map((item, index) => {
        item.key = index;
        return item;
      });
    const columns = [
      {
        title: '操作时间',
        dataIndex: 'op_time',
        key: 'op_time',
      },
      {
        title: '操作人',
        dataIndex: 'op_user_name',
        key: 'op_user_name',
      },
      {
        title: '操作详情',
        dataIndex: 'op_type',
        key: 'op_type',
      },
    ];

    return <Table bordered={false} columns={columns} pagination={false} dataSource={dataSource} />;
  };

  /**
   * @description: 选择城市
   * @param {string} e 城市码
   * @return {*}
   */
  const changeCity = (e) => {
    if (e) {
      let county = cityCountyList.find((x) => x.city == e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
    form.setFieldsValue({
      abstract_district: null,
    });
  };

  /**
   * @description: 选择平台
   * @param {*}
   * @return {*}
   */
  const changeChannel = (e) => {
    // 一口价
    if (e == 10000) {
      setFixedPrice(true);
    } else {
      setFixedPrice(false);
      form.setFieldsValue({
        price_mode: 0,
      });
    }
    // 预付
    if (e == 1001 || e == 20000) {
      setPrepay(true);
    } else {
      setPrepay(false);
    }
  };

  /**
   * @description: 提交表单
   * @param {*}
   * @return {*}
   */
  const submitFormData = async (values) => {
    // 起步价
    let start_price_by_time_interval_p_data = [];
    let start_price_by_time_interval_d_data = [];
    // 里程费
    let distance_by_time_interval_p_Data = [];
    let distance_by_time_interval_d_Data = [];
    // 时间费
    let time_by_time_interval_p_Data = [];
    let time_by_time_interval_d_Data = [];
    // 超公里费
    let empty_by_distance_serial_p_Data = [];
    let empty_by_distance_serial_d_Data = [];

    // 起步价乘客
    start_price_by_time_interval_p_data = transFormPrice(values, 'p_start_time_price');
    // console.log(start_price_by_time_interval_p_data, '起步乘客配置');

    // 起步价司机
    start_price_by_time_interval_d_data = transFormPrice(values, 'd_start_time_price');
    // console.log(start_price_by_time_interval_d_data, '起步司机配置');

    // 里程费 乘客
    distance_by_time_interval_p_Data = transFormPrice(values, 'p_distance_price');
    // console.log(distance_by_time_interval_p_Data, '里程乘客');

    // 里程费 司机
    distance_by_time_interval_d_Data = transFormPrice(values, 'd_distance_price');
    // console.log(distance_by_time_interval_d_Data, '里程司机');

    // 时间费乘客
    time_by_time_interval_p_Data = transFormPrice(values, 'p_time_price');
    // console.log(time_by_time_interval_p_Data, '时间费乘客配置');

    // 时间费司机
    time_by_time_interval_d_Data = transFormPrice(values, 'd_time_price');
    // console.log(time_by_time_interval_d_Data, '时间费司机配置');

    // 超公里司机
    let empty_by_distance_serial_d_Data_ = [];
    Object.keys(values).map((key) => {
      if (key.indexOf('d_empty_by_distance') > -1) {
        if (values[key]._isAMomentObject) {
          values[key] = moment(values[key]).format('HH:mm');
        }
        empty_by_distance_serial_d_Data_.push(values[key]);
      }
    });
    empty_by_distance_serial_d_Data_ = _.chunk(empty_by_distance_serial_d_Data_, 2);
    empty_by_distance_serial_d_Data_.map((x) => {
      let obj = {
        begin: x[0],
        price: x[1],
      };
      empty_by_distance_serial_d_Data.push(obj);
    });
    // console.log(empty_by_distance_serial_d_Data, '超公里司机配置');
    // 超公里乘客
    let empty_by_distance_serial_p_Data_ = [];
    Object.keys(values).map((key) => {
      if (key.indexOf('p_empty_by_distance') > -1) {
        if (values[key]._isAMomentObject) {
          values[key] = moment(values[key]).format('HH:mm');
        }
        empty_by_distance_serial_p_Data_.push(values[key]);
      }
    });
    empty_by_distance_serial_p_Data_ = _.chunk(empty_by_distance_serial_p_Data_, 2);
    empty_by_distance_serial_p_Data_.map((x) => {
      let obj = {
        begin: x[0],
        price: x[1],
      };
      empty_by_distance_serial_p_Data.push(obj);
    });
    // console.log(empty_by_distance_serial_p_Data, '超公里乘客配置');

    // 时间
    values.start_time = values.start_time.format('YYYY-MM-DD HH:mm:ss');
    values.end_time = values.end_time.format('YYYY-MM-DD HH:mm:ss');
    // 区号
    values.district =
      cityCountyList &&
      cityCountyList[
        _.findIndex(cityCountyList, (o) => {
          return o.city === values.area * 1;
        })
      ].district_code;
    values.abstract_district = values.abstract_district
      ? `${values.district},${values.abstract_district}`
      : '';

    // 如果有信息服务费
    if (!values.info_fee_status) {
      // delete values.info_fee;
    } else {
      if (values.info_fee * 1 > values['d_rule.start_price'] * 1) {
        return message.error('信息费用不可大于起步价');
      }
    }

    // 如果选择预付费
    if (values.prepay_rule) {
      // 默认支付全部预付费用
      if (values.prepay_rule == 1) {
        values.prepay_rule = {
          prepay_type: 1,
          gt_money: 0,
        };
      }
      // 支付部分费用
      if (values.prepay_rule == 2) {
        values.prepay_rule = {
          prepay_type: 2,
          gt_money: values.gt_money,
        };
      }
      // 免支付
      if (values.prepay_rule == 3) {
        values.prepay_rule = {
          prepay_type: 3,
          gt_money: 0,
        };
      }
    } else {
      values.prepay_rule = {
        prepay_type: 1,
        gt_money: 0,
      };
    }
    // 删除金额
    delete values.gt_money;

    const params = {
      abstract_district: values.abstract_district,
      area: values.area,
      channel: values.channel,
      day_type: values.day_type,
      district: values.district,
      end_time: values.end_time,
      start_time: values.start_time,
      info_fee_status: values.info_fee_status,
      info_fee: values.info_fee,
      // 一直传的false 之前没有一口价
      is_limit_fee: false,
      price_mode: values.price_mode,
      product_id: values.product_id,
      d_rule: {
        distance_by_time_interval: {
          intervals: distance_by_time_interval_d_Data,
        },
        empty_by_distance_serial_interval: {
          intervals: empty_by_distance_serial_d_Data,
        },
        start_price_by_time_interval: {
          intervals: start_price_by_time_interval_d_data,
        },
        time_by_time_interval: {
          intervals: time_by_time_interval_d_Data,
        },
        normal_unit_price: values['d_rule.normal_unit_price'],
        start_distance: values['d_rule.start_distance'],
        start_package_time: values['d_rule.start_package_time'],
        start_price: values['d_rule.start_price'],
        time_unit_price: values['d_rule.time_unit_price'],
      },
      p_rule: {
        distance_by_time_interval: {
          intervals: distance_by_time_interval_p_Data,
        },
        empty_by_distance_serial_interval: {
          intervals: empty_by_distance_serial_p_Data,
        },
        start_price_by_time_interval: {
          intervals: start_price_by_time_interval_p_data,
        },
        time_by_time_interval: {
          intervals: time_by_time_interval_p_Data,
        },
        normal_unit_price: values['p_rule.normal_unit_price'],
        start_distance: values['p_rule.start_distance'],
        start_package_time: values['p_rule.start_package_time'],
        start_price: values['p_rule.start_price'],
        time_unit_price: values['p_rule.time_unit_price'],
      },
      prepay_rule: values.prepay_rule,
    };
    if (type === 'edit') {
      params.id = data.id;
    }
    console.log(params, 'params');
    console.log(values, 'values');
    setBtnLoading(true);
    let res;
    if (type == 'edit') {
      res = await cityPriceEdit(params);
    } else {
      res = await cityPriceAdd(params);
    }
    if (res) {
      message.success('操作成功');
      onCancel();
      getCityPriceList();
    }
    setBtnLoading(false);
  };

  /**
   * @description: 审核通过/拒绝
   * @param {*}
   * @return {*}
   */
  const setAuthDisable = async (params) => {
    const res = await cityPriceDisable(params);
    if (res) {
      message.success('操作成功');
      onCancel();
      getCityPriceList();
    }
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 13 },
  };
  const formItemLayout_d = {
    labelCol: { span: 13 },
    wrapperCol: { span: 8 },
  };
  const formItemLayoutTitle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const formItemLayoutType = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
  };
  const formItemLayoutAgain = {
    labelCol: { span: 10 },
    wrapperCol: { span: 11 },
  };
  if (!data && type != 'new') {
    return <Spin />;
  }

  return (
    <Form form={form} onFinish={submitFormData}>
      <Form.Item style={{ color: '#000' }}>
        <span style={{ fontFamily: 'PingFangSC-Medium', marginRight: 32 }}>类型选择</span>
      </Form.Item>
      <Form.Item
        name="channel"
        label="平台"
        initialValue={_.get(data, 'channel')}
        rules={[
          {
            required: true,
            message: '请选择',
          },
        ]}
        {...formItemLayoutType}
      >
        <Select
          disabled={type === 'show'}
          onChange={changeChannel}
          placeholder="请选择"
          style={{ width: 160 }}
        >
          {ORDER_CITYPRICE_CHANNEL &&
            Object.keys(ORDER_CITYPRICE_CHANNEL).map((key) => {
              return (
                <Option key={key} value={key}>
                  {ORDER_CITYPRICE_CHANNEL[key].value}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择',
          },
        ]}
        name="product_id"
        label="产品类型"
        initialValue={_.get(data, 'product_id')}
        {...formItemLayoutType}
      >
        <Select disabled={type === 'show'} placeholder="请选择" style={{ width: 160 }}>
          {CONFIG_CITY_PRICE_TYPE &&
            Object.keys(CONFIG_CITY_PRICE_TYPE).map((key) => {
              return (
                <Option key={key} value={key}>
                  {CONFIG_CITY_PRICE_TYPE[key]}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Form.Item style={{ color: '#000' }}>
        <span style={{ fontFamily: 'PingFangSC-Medium', marginRight: 32 }}>生效范围</span>
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            name="area"
            label="城市"
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
            initialValue={_.get(data, 'area') * 1 || null}
            {...formItemLayoutTitle}
          >
            <Select
              style={{ width: 190 }}
              className="area"
              showSearch
              allowClear
              onChange={changeCity}
              placeholder="请选择"
              filterOption={filterOption}
              disabled={type === 'show'}
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
        <Col span={12}>
          <Form.Item name="abstract_district" label="二级区县" {...formItemLayoutTitle}>
            <Select
              disabled={type === 'show'}
              placeholder="请选择"
              style={{ width: 190 }}
              showSearch
              allowClear
              filterOption={filterOption}
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
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
            label="日期"
            name="day_type"
            initialValue={_.get(data, 'day_type')}
            {...formItemLayoutTitle}
          >
            <Select
              disabled={type === 'show'}
              placeholder="请选择"
              style={{ width: 190 }}
              showSearch
            >
              {[
                { key: '1', value: '常规' },
                { key: '2', value: '法定节假日&休息日' },
                { key: '3', value: '自定义' },
              ].map((item) => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {prepay && (
        <>
          <Form.Item style={{ color: '#000' }}>
            <span style={{ fontFamily: 'PingFangSC-Medium', marginRight: 32 }}>预付费</span>
          </Form.Item>
          <Space>
            <Form.Item
              name="prepay_rule"
              initialValue={
                data && data.prepay_rule ? JSON.parse(data.prepay_rule).prepay_type * 1 : 1
              }
            >
              <Radio.Group disabled={type === 'show'}>
                <Radio value={1}>按预估金额预付费</Radio>
                <Radio value={2}>
                  <Space>
                    <span>预估超过</span>
                    <Form.Item
                      style={{ margin: 0 }}
                      name="gt_money"
                      initialValue={
                        data && data.prepay_rule ? JSON.parse(data.prepay_rule).gt_money * 1 : 1
                      }
                    >
                      <InputNumber disabled={type === 'show'} precision={2} min={0} max={100} />
                    </Form.Item>
                    <span>元则需要预付</span>
                  </Space>
                </Radio>
                <Radio value={3}>免预付费</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </>
      )}
      <Form.Item style={{ color: '#000' }}>
        <span style={{ fontFamily: 'PingFangSC-Medium', marginRight: 32 }}>信息服务费</span>
      </Form.Item>
      <Space>
        {/*
          <Form.Item
            valuePropName="checked"
            // valuePropName={data && data.info_fee * 1 == 0 ? 'value' : 'checked'}
            // valuePropName={data && data.info_fee * 1 == 0 ? 'value' : 'checked'}
            // initialValue={data && data.info_fee * 1 > 0}
            name="info_fee_status"
          >
            <Checkbox disabled={type === 'show'}></Checkbox>
          </Form.Item>
        */}
        <Form.Item
          name="info_fee"
          rules={[
            {
              required: false,
            },
          ]}
          style={{ display: 'flex' }}
          initialValue={(data && data.info_fee) || 0.0}
          {...formItemLayoutType}
        >
          <InputNumber precision={2} min={0.00} disabled={type === 'show'} />
        </Form.Item>
        <Form.Item>元</Form.Item>
      </Space>
      <Form.Item style={{ color: '#000' }}>
        <span style={{ fontFamily: 'PingFangSC-Medium', marginRight: 32 }}>计费模式</span>
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择',
          },
        ]}
        name="price_mode"
        {...formItemLayoutType}
        label="计费模式"
        initialValue={_.get(data, 'price_mode') * 1 || 0}
      >
        <Radio.Group disabled={type === 'show'}>
          <Radio value={0}>起步价</Radio>
          {fixedPrice && <Radio value={1}>一口价</Radio>}
        </Radio.Group>
      </Form.Item>
      <Row>
        <Col span={12}>
          <h3 style={{ textAlign: 'center' }}>乘客</h3>
        </Col>
        <Col span={12}>
          <h3 style={{ textAlign: 'center' }}>司机</h3>
        </Col>
      </Row>

      {
        <Card title="起步价">
          <Row gutter={16}>
            <Col span={12} className="details">
              <Form.Item
                label="起步价（元）"
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                name="p_rule.start_price"
                initialValue={_.get(data, 'p_rule.start_price')}
                {...formItemLayout}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                label="起步里程（Km）"
                name="p_rule.start_distance"
                initialValue={_.get(data, 'p_rule.start_distance')}
                {...formItemLayout}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                label="起步时长（分钟）"
                name="p_rule.start_package_time"
                initialValue={_.get(data, 'p_rule.start_package_time')}
                {...formItemLayout}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                label="高峰时段"
                name="p_rule.start_price_by_time_interval.intervals"
                {...formItemLayout}
              >
                <PeakTime
                  initialValue={_.get(data, 'p_rule.start_price_by_time_interval.intervals')}
                  type={type}
                  keyTitle="p_start_time_price"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                label="起步价（元）"
                name="d_rule.start_price"
                initialValue={_.get(data, 'd_rule.start_price')}
                {...formItemLayout_d}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                label="起步里程（Km）"
                name="d_rule.start_distance"
                initialValue={_.get(data, 'd_rule.start_distance')}
                {...formItemLayout_d}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
                label="起步时长（分钟）"
                name="d_rule.start_package_time"
                initialValue={_.get(data, 'd_rule.start_package_time')}
                {...formItemLayout_d}
              >
                <InputNumber disabled={type === 'show'} min={0} />
              </Form.Item>
              <Form.Item
                label="高峰时段"
                name="d_rule.start_price_by_time_interval.intervals"
                {...formItemLayout}
              >
                <PeakTime
                  initialValue={_.get(data, 'd_rule.start_price_by_time_interval.intervals')}
                  keyTitle="d_start_time_price"
                  type={type}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      }
      <Card title="里程费">
        <Row gutter={16}>
          <Col span={12} className="details">
            <Form.Item
              label="普通时段单价(元/km)"
              name="p_rule.normal_unit_price"
              initialValue={_.get(data, 'p_rule.normal_unit_price')}
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
              {...formItemLayoutAgain}
            >
              <InputNumber disabled={type === 'show'} min={0} />
            </Form.Item>
            <Form.Item
              label="高峰时段"
              name="p_rule.distance_by_time_interval.intervals"
              rules={[
                {
                  required: false,
                  message: '请输入',
                },
              ]}
              {...formItemLayout}
            >
              <PeakTime
                disabled={type === 'show'}
                initialValue={_.get(data, 'p_rule.distance_by_time_interval.intervals')}
                // wrappedComponentRef={(ref) => {
                //   this.distance_by_time_interval_p_ref = ref;
                // }}
                type={type}
                keyTitle="p_distance_price"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="普通时段单价(元/km)"
              name="d_rule.normal_unit_price"
              initialValue={_.get(data, 'd_rule.normal_unit_price')}
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
              {...formItemLayoutAgain}
            >
              <InputNumber disabled={type === 'show'} min={0} />
            </Form.Item>
            <Form.Item
              label="高峰时段"
              name="d_rule.distance_by_time_interval.intervals"
              rules={[
                {
                  required: false,
                  message: '请输入',
                },
              ]}
              {...formItemLayout}
            >
              <PeakTime
                disabled={type === 'show'}
                initialValue={_.get(data, 'd_rule.distance_by_time_interval.intervals')}
                // wrappedComponentRef={(ref) => {
                //   this.distance_by_time_interval_d_ref = ref;
                // }}
                type={type}
                keyTitle="d_distance_price"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="时间费">
        <Row gutter={16}>
          <Col span={12} className="details">
            <Form.Item
              label="普通时段单价(元/分钟)"
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
              name="p_rule.time_unit_price"
              initialValue={_.get(data, 'p_rule.time_unit_price')}
              {...formItemLayoutAgain}
            >
              <InputNumber disabled={type === 'show'} min={0} />
            </Form.Item>
            <Form.Item
              label="高峰时段"
              name="p_rule.time_by_time_interval.intervals"
              rules={[
                {
                  required: false,
                  message: '请输入',
                },
              ]}
              {...formItemLayout}
            >
              <PeakTime
                disabled={type === 'show'}
                initialValue={_.get(data, 'p_rule.time_by_time_interval.intervals')}
                // wrappedComponentRef={(ref) => {
                //   this.time_by_time_interval_p_ref = ref;
                // }}
                keyTitle="p_time_price"
                type={type}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="普通时段单价(元/分钟)"
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
              name="d_rule.time_unit_price"
              initialValue={_.get(data, 'd_rule.time_unit_price')}
              {...formItemLayoutAgain}
            >
              <InputNumber disabled={type === 'show'} min={0} />
            </Form.Item>
            <Form.Item
              label="高峰时段"
              name="d_rule.time_by_time_interval.intervals"
              rules={[
                {
                  required: false,
                  message: '请输入',
                },
              ]}
              {...formItemLayout}
            >
              <PeakTime
                disabled={type === 'show'}
                initialValue={_.get(data, 'd_rule.time_by_time_interval.intervals')}
                // wrappedComponentRef={(ref) => {
                //   this.time_by_time_interval_d_ref = ref;
                // }}
                keyTitle="d_time_price"
                type={type}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="超公里费">
        <Row gutter={16}>
          <Col span={12} className="detailsSuper details">
            <Form.Item label="分段里程" name="p_rule.empty_by_distance_serial_interval.intervals">
              <SubSection
                type={type}
                initialValue={_.get(data, 'p_rule.empty_by_distance_serial_interval.intervals')}
                keyTitle="p_empty_by_distance"
                // ref={empty_by_distance_serial_p_ref}
                // wrappedComponentRef={(ref) => {
                //   this.empty_by_distance_serial_p_ref = ref;
                // }}
              />
            </Form.Item>
          </Col>
          <Col span={12} className="detailsSupers">
            <Form.Item label="分段里程" name="d_rule.empty_by_distance_serial_interval.intervals">
              <SubSection
                type={type}
                initialValue={_.get(data, 'd_rule.empty_by_distance_serial_interval.intervals')}
                keyTitle="d_empty_by_distance"
                // wrappedComponentRef={(ref) => {
                //   this.empty_by_distance_serial_d_ref = ref;
                // }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="生效时间">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="开始时间"
              name="start_time"
              initialValue={
                type !== 'new'
                  ? moment(_.get(data, 'start_time'), 'YYYY-MM-DD HH:mm:ss')
                  : moment().endOf('day')
              }
              {...formItemLayout}
            >
              <DatePicker disabled={type === 'show'} showTime placeholder="请选择开始时间" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="结束时间"
              name="end_time"
              initialValue={
                type !== 'new'
                  ? moment(_.get(data, 'end_time'), 'YYYY-MM-DD HH:mm:ss')
                  : moment('2030-01-01', 'YYYY-MM-DD HH:mm:ss').startOf('day')
              }
              {...formItemLayout}
            >
              <DatePicker disabled={type === 'show'} showTime placeholder="请选择结束时间" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {type === 'review' && (
        <Card title="历史记录">
          <Row gutter={24}>
            <Col span={24}>{getTable(_.get(data, 'op_log'))}</Col>
          </Row>
        </Card>
      )}
      {(type === 'edit' || type === 'new' || type === 'copy') && (
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button loading={btnLoading} type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Col>
        </Row>
      )}
      {type === 'review' && (
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="danger" onClick={() => setAuthDisable({ id: data.id, status: '3' })}>
                审核不通过
              </Button>
              <Button type="primary" onClick={() => setAuthDisable({ id: data.id, status: '2' })}>
                审核通过
              </Button>
            </Space>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default forwardRef(CreateCityPriceModal);
