// 身份信息
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import {
  Select,
  Card,
  Input,
  Form,
  Space,
  Button,
  DatePicker,
  Row,
  Col,
  Cascader,
  message,
} from 'antd';
import { useDispatch } from 'dva';
import moment from 'moment';
import { DRIVER_GENDER } from '@/utils/constant';
import UploadElement from '@/components/UploadElement';

import { driverDistinguish, cityList } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const IdentitiesForm = (props, ref) => {
  const [count, setCount] = useState(300);
  const [timing, setTiming] = useState(false);
  const [discernLoading, setDiscernLoading] = useState(false);
  const [cityData, setCityData] = useState([]);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // console.log(joinType, 'joinType IdentitiesForm');
  // console.log(JSON.stringify(CITY_LIST))
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }

  useEffect(() => {
    getCityList();
  }, []);
  // 表单赋值
  const setField = (params) => {
    form.setFieldsValue(params);
  };

  /**
   * @description: 获取城市列表
   * @param {*}
   * @return {*}
   */
  const getCityList = async () => {
    const res = await cityList();
    if (res) {
      setCityData(JSON.parse(res.data));
    }
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

          if (values.id_valid_date) {
            values.id_valid_date = moment(values.id_valid_date).format('YYYY-MM-DD');
          }
          // 户籍所在地
          if (values.census_place) {
            values.census_place = values.census_place.join(',');
          }
          dispatch({
            type: 'joinNew/saveDriverIdcard',
            payload: {
              driverIdcard: values,
            },
          });
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          return message.error('请填写完整的身份信息');
        });
    },
    getValues: async () => {
      try {
        return await form.validateFields();
      } catch (error) {
        throw message.error('请填写完整的身份信息');
      }
    },
  }));

  // 识别身份信息
  const discernMessage = () => {
    // 识别成功倒计时300s
    // setTiming(true);
    discernIdentities();
  };

  // 级联选择
  const onChange = () => {};
  // 识别是身份信息
  const discernIdentities = async () => {
    setDiscernLoading(true);
    const values = form.getFieldsValue();
    if (values.id_valid_date) {
      values.id_valid_date = moment(values.id_valid_date).format('YYYY-MM-DD');
    }

    let driver_idcard = JSON.stringify({
      driver_idcard: values,
    });
    const params = {
      card_type: 'id_card',
      card_info: driver_idcard,
      card_side: 'FRONT'
    };

    const res = await driverDistinguish(params);
    if (res) {
      setDiscernLoading(false);
      const { id_no, sex, name } = res.data.driver_idcard;
      form.setFieldsValue({
        id_no,
        sex: `${sex}`,
        name,
      });
    } else {
      setDiscernLoading(false);
    }

    const paramsBack = {
      card_type: 'id_card',
      card_info: driver_idcard,
      card_side: 'BACK'
    };
    const resBack = await driverDistinguish(paramsBack);
    if (resBack) {
      setDiscernLoading(false);
      const { id_valid_date } = resBack.data.driver_idcard;
      form.setFieldsValue({
        id_valid_date: moment(id_valid_date),
      });
    } else {
      setDiscernLoading(false);
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

  const { detail, type } = props;

  return (
    <Card
      title={
        <div>
          <Space>
            <span>身份信息:(注意：加*为必填字段)</span>
            {type === 'audit' && (
              <Button
                loading={discernLoading}
                onClick={discernMessage}
                disabled={type === 'check' || timing}
                type="primary"
                // loading
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
                  message: '请输入司机姓名',
                },
              ]}
              name="name"
              label="#姓名"
              initialValue={(detail && detail.name) || ''}
            >
              <Input disabled={type === 'check'} placeholder="请输入司机姓名" />
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请输入身份证号',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    if (pattern.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('您输入的身份证格式不正确');
                  },
                }),
              ]}
              name="id_no"
              label="#身份证号"
              initialValue={(detail && detail.id_no) || ''}
            >
              <Input disabled={type === 'check'} placeholder="请输入身份证号" />
            </FormItem>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请选择身份证有效期',
                },
              ]}
              name="id_valid_date"
              label="#身份证有效期"
              initialValue={(detail && moment(detail.id_valid_date)) || ''}
            >
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
                  required: false,
                  message: '请选择性别',
                },
              ]}
              name="sex"
              label="#性别"
              initialValue={(detail && `${detail.sex}`) || null}
            >
              <Select disabled={type === 'check'} placeholder="请选择性别" allowClear>
                {DRIVER_GENDER &&
                  Object.keys(DRIVER_GENDER).map((key) => {
                    return (
                      <Option key={key} value={key}>
                        {DRIVER_GENDER[key].value}
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
                  required: false,
                  message: '请选择户籍所在地',
                },
              ]}
              name="census_place"
              label="户籍所在地"
              initialValue={(detail && detail.census_place.split(',')) || []}
            >
              <Cascader
                disabled={type === 'check'}
                options={cityData}
                onChange={onChange}
                placeholder="请选择"
              />
            </FormItem>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              name="address"
              label="当前地址"
              initialValue={(detail && detail.address) || ''}
            >
              <Input disabled={type === 'check'} placeholder="请输入当前地址" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请上传身份证头像页',
                },
              ]}
              name="id_front_photo"
              label="身份证头像页"
            >
              <UploadElement
                initialImageUrl={(detail && detail.id_front_photo) || ''}
                setField={setField}
                itemName="id_front_photo"
                uploadTxt="身份证头像页"
                disabled={type === 'check'}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <FormItem
              rules={[
                {
                  required: true,
                  message: '请上传身份证国徽页',
                },
              ]}
              name="id_backend_photo"
              label="身份证国徽页"
            >
              <UploadElement
                initialImageUrl={(detail && detail.id_backend_photo) || ''}
                setField={setField}
                itemName="id_backend_photo"
                uploadTxt="身份证国徽页"
                disabled={type === 'check'}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <FormItem
              rules={[
                {
                  required: false,
                  message: '请上传手持身份证',
                },
              ]}
              name="idcard_front_photo"
              label="手持身份证"
            >
              <UploadElement
                initialImageUrl={(detail && detail.idcard_front_photo) || ''}
                setField={setField}
                itemName="idcard_front_photo"
                uploadTxt="手持身份证"
                disabled={type === 'check'}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default forwardRef(IdentitiesForm);
