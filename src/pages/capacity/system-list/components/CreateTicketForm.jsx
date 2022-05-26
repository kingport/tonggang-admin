import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, Space, DatePicker, InputNumber, Select, Form, Input, message } from 'antd';
import moment from 'moment';
import { useSelector } from 'dva';
import { createSystemCoupon, couponDetail } from '../service';
import { layout, PlatformList } from '@/utils/constant';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateTicketForm = (props, ref) => {
  const { id, type } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const check = type === 'check';
  const [countyList, setCountyList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [form] = Form.useForm();

  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }

  useEffect(() => {
    if (type === 'check') {
      getDetail(id);
    }
  }, [id]);

  // 重置表单
  useEffect(() => {
    return () => {
      form.resetFields();
      setDetail(null);
    };
  }, [type]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 日期格式化
          if (values.time) {
            values.begin_time = moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            values.end_time = moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
          }
          delete values.time;
          if (values.city) {
            values.city = values.city;
          }
          // 使用门槛分 转换
          if (values.threshold) {
            values.threshold = values.threshold * 100; // 单位分
          }
          // 面额门槛分 转换
          if (values.denomination) {
            values.denomination = values.denomination * 100; // 单位分
          }
          if (values.threshold < values.denomination) {
            return message.error('门槛必须大于面额');
          }
          // console.log(values, '创建系统优惠券的表单信息');

          // 提交表单
          systemCoupon(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
      // 取消弹窗记得清空详细
      setDetail(null);
    },
  }));

  // 获取券详情
  const getDetail = async (id) => {
    const params = {
      coupon_id: id,
    };
    const res = await couponDetail(params);
    if (res) {
      if (res.data.city) {
        // 找出该城市下的区县
        const arr = cityCountyList.find((x) => x.city === res.data.city).county_infos;
        setCountyList(arr);
        // console.log(arr);
      }
      setDetail(res.data);
      // 必须重置表单不然 有表单缓存数据 跟antd的form有关
      form.resetFields();
      if (res.data.district != 0) {
        form.setFieldsValue({ district: res.data.district });
      }
    }
  };

  // 创建优惠券
  const systemCoupon = async (values) => {
    const res = await createSystemCoupon(values);
    if (res) {
      message.success('创建成功');
      // 刷新列表
      props.systemCouponList();
      props.handleCancel();
    }
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  // 选择城市
  const changeCity = (e) => {
    if (e) {
      // console.log(e);
      // 多选暂时不支持 功能已写好
      // const citys = e;
      // const countys = [];
      // citys.map((code) => {
      //   console.log(code);
      //   let county = COUNTY_OPTION.find((x) => x.value === code);
      //   countys.push(county);
      // });
      // let countysAll = countys;
      // countys.map((item) => {
      //   countysAll = countysAll.concat(item.children);
      // });
      // setCountyList(countysAll);
      // 找出所有的区县

      let county = cityCountyList.find((x) => x.city === e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
    form.setFieldsValue({ district: null });
  };
  // console.log(detail, 'detail');
  // console.log(type, 'type');
  if (!detail && check) return;
  return (
    <Form {...layout} form={form}>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择优惠券类型',
          },
        ]}
        name="coupon_type"
        label="优惠券类型"
        initialValue={2}
      >
        <Select
          disabled
          style={{ width: 200 }}
          placeholder="请选择优惠券类型"
          // onChange={changeTicket}
          allowClear
          showSearch
        >
          <Option key={2} value={2}>
            系统发券
          </Option>
        </Select>
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择发放平台',
          },
        ]}
        initialValue={1001}
        name="area_id1"
        label="发放平台"
      >
        <Select
          style={{ width: 200 }}
          placeholder="请选择发放平台"
          // onChange={this.getCounty}
          allowClear
          showSearch
          // disabled={check}
          disabled
        >
          {PlatformList.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        initialValue="选择优惠券类型即可自动填充"
        rules={[
          {
            required: true,
            message: '请填写优惠券名称',
          },
        ]}
        name="coupon_name"
        label="优惠券名称"
        initialValue="补偿券"
      >
        <Input disabled style={{ width: 300 }} placeholder="请填写优惠券名称" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择城市',
          },
        ]}
        name="city"
        label="城市"
        initialValue={(detail && detail.city) || null}
      >
        <Select
          style={{ width: 200 }}
          placeholder="请选择"
          onChange={changeCity}
          allowClear
          showSearch
          disabled={check}
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
      {countyList.length > 0 && (
        <FormItem
          initialValue={(detail && detail.district) || null}
          name="district"
          label="二级区县"
        >
          <Select
            style={{ width: 200 }}
            allowClear
            showSearch
            placeholder="可选择二级区县"
            filterOption={filterOption}
            disabled={check}
            // mode="multiple"
          >
            {countyList.length > 0 &&
              countyList.map((item) => {
                return (
                  <Option key={item.county} value={item.county}>
                    {item.county_name}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      )}
      <FormItem
        rules={[
          {
            required: true,
            message: '请填写手机号码',
          },
        ]}
        name="phone"
        label="手机号码"
        initialValue={(detail && detail.phone) || null}
      >
        <Input disabled={check} style={{ width: 300 }} placeholder="请填写手机号码" />
      </FormItem>
      <FormItem label="券信息">
        <Space direction="vertical">
          <Card style={{ background: '#f6f6f6' }}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '面值只能是数值，0.01-20，限2位小数',
                },
                // ({ getFieldValue }) => ({
                //   validator(rule, value) {
                //     // console.log(value, 'denomination')
                //     // console.log(getFieldValue(`${key}.threshold`), 'getFieldValue')
                //     if (!value || getFieldValue(`threshold`) > value) {
                //       return Promise.resolve();
                //     }

                //     return Promise.reject('面额必须小于门槛');
                //   },
                // }),
              ]}
              name="denomination"
              label="面额(元)"
              initialValue={(detail && detail.denomination && detail.denomination / 100) || null}
            >
              <InputNumber
                disabled={check}
                // formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={(value) => value.replace(/\￥\s?|(,*)/g, '')}
                min={0.01}
                max={20}
                precision={2}
              />
            </FormItem>
            <FormItem
              style={{ marginTop: 10 }}
              rules={[
                {
                  required: true,
                  message: '请填写使用门槛',
                },
              ]}
              name="threshold"
              label="每人限领1张 使用门槛满(元)"
              initialValue={
                (detail && detail.threshold && detail.threshold / 100) ||
                (detail && detail.threshold == 0 && '0') ||
                null
              }
            >
              <InputNumber
                min={0.02}
                max={1000}
                disabled={check}
                // formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={(value) => value.replace(/\￥\s?|(,*)/g, '')}
                precision={2}
              />
            </FormItem>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择有效期',
                },
              ]}
              name="time"
              label="有效期"
              initialValue={
                (detail && [moment(detail.begin_time), moment(detail.end_time)]) || null
              }
              // initialValue={[moment(new Date()).add(-7, 'days'), moment(new Date()).endOf('day')]}
            >
              <RangePicker
                disabledDate={disabledDate}
                disabled={check ? [true, true] : [true, false]}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Card>
        </Space>
      </FormItem>
    </Form>
  );
};

export default forwardRef(CreateTicketForm);
