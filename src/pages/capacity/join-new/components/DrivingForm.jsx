// 驾驶证信息
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Select, Card, Space, Form, Button, DatePicker, Row, Col, Input, message } from 'antd';
import { useDispatch } from 'dva';
import { DRIVER_LICENSE_LEVEL } from '@/utils/constant';
import moment from 'moment';
import UploadElement from '@/components/UploadElement';
import { driverDistinguish } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const DrivingForm = (props, ref) => {
  const [count, setCount] = useState(300);
  const [timing, setTiming] = useState(false);
  const [discernLoading, setDiscernLoading] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // console.log(joinType, 'joinType DrivingForm');
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }
  function disabledDateStart(current) {
    return current && current > moment().add(0, 'days');
  }
  // 表单赋值
  const setField = (params) => {
    form.setFieldsValue(params);
  };

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

          if (values.lic_issue_date) {
            values.lic_issue_date = moment(values.lic_issue_date).format('YYYY-MM-DD');
          }
          if (values.lic_valid_date) {
            values.lic_valid_date = moment(values.lic_valid_date).format('YYYY-MM-DD');
          }

          dispatch({
            type: 'joinNew/saveDriverLicense',
            payload: {
              driverLicense: values,
            },
          });
          // console.log(values, 'DrivingData');
          return values;
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          return message.error('请填写完整的驾驶证信息');
        });
    },
    getValues: async () => {
      try {
        return await form.validateFields();
      } catch (error) {
        throw message.error('请填写完整的驾驶证信息');
      }
    },
  }));

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

  // 识别身份信息
  const discernMessage = async () => {
    setDiscernLoading(true);
    // 识别成功倒计时300s
    const values = form.getFieldsValue();
    // setTiming(true);
    if (values.lic_valid_date) {
      values.lic_valid_date = moment(values.lic_valid_date).format('YYYY-MM-DD');
    }
    if (values.lic_issue_date) {
      values.lic_issue_date = moment(values.lic_issue_date).format('YYYY-MM-DD');
    }
    let driver_license = JSON.stringify({
      driver_license: values,
    });
    const params = {
      card_type: 'driver_license',
      card_info: driver_license,
    };
    const res = await driverDistinguish(params);
    if (res) {
      setDiscernLoading(false);
      const { lic_valid_date, lic_issue_date, lic_no, lic_class } = res.data.driver_license;
      form.setFieldsValue({
        lic_no,
        lic_valid_date: moment(lic_valid_date),
        lic_issue_date: moment(lic_issue_date),
        lic_class,
      });
    } else {
      setDiscernLoading(false);
    }
  };

  const { detail, type } = props;
  return (
    <Card
      title={
        <div>
          <Space>
            <span>驾驶证信息:(注意：加*为必填字段)</span>
            {type === 'audit' && (
              <Button
                loading={discernLoading}
                onClick={discernMessage}
                disabled={type === 'check' || timing}
                type="primary"
              >
                {timing ? `${count} 秒` : '识别'}
              </Button>
            )}
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
                  message: '请输入驾驶证号',
                },
              ]}
              name="lic_no"
              label="#驾驶证号"
              initialValue={(detail && detail.lic_no) || ''}
            >
              <Input disabled={type === 'check'} placeholder="请输入驾驶证号" />
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择驾照类型',
                },
              ]}
              name="lic_class"
              label="#驾照类型"
              initialValue={(detail && `${detail.lic_class}`) || null}
            >
              <Select
                disabled={type === 'check'}
                placeholder="请选择驾照类型"
                allowClear
                showSearch
              >
                {DRIVER_LICENSE_LEVEL &&
                  Object.keys(DRIVER_LICENSE_LEVEL).map((key) => {
                    return (
                      <Option key={key} value={DRIVER_LICENSE_LEVEL[key].value}>
                        {DRIVER_LICENSE_LEVEL[key].value}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择驾驶证有效期',
                },
              ]}
              name="lic_valid_date"
              label="#驾驶证有效期"
              initialValue={(detail && moment(detail.lic_valid_date)) || ''}
            >
              {/* <RangePicker disabled={joinType === 'check'} format="YYYY-MM-DD" /> */}
              <DatePicker
                disabledDate={disabledDate}
                disabled={type === 'check'}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择初次领取驾驶证时间',
                },
              ]}
              name="lic_issue_date"
              label="#初次领取驾驶证时间"
              initialValue={(detail && moment(detail.lic_issue_date)) || ''}
            >
              <DatePicker
                disabledDate={disabledDateStart}
                disabled={type === 'check'}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请上传驾驶证正本',
                },
              ]}
              name="lic_left_photo"
              label="驾驶证正本"
            >
              <UploadElement
                disabled={type === 'check'}
                initialImageUrl={(detail && detail.lic_left_photo) || ''}
                setField={setField}
                itemName="lic_left_photo"
                uploadTxt="驾驶证正本"
              />
            </FormItem>
          </Col>
          {/* <Col span={12}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请上传驾驶证副本',
                },
              ]}
              name="lic_right_photo"
              label="驾驶证副本"
            >
              <UploadElement
                disabled={type === 'check'}
                initialImageUrl={(detail && detail.lic_right_photo) || ''}
                setField={setField}
                itemName="lic_right_photo"
                uploadTxt="驾驶证副本"
              />
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    </Card>
  );
};
export default forwardRef(DrivingForm);
