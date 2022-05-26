// 车辆信息
import React, { useState, useEffect } from 'react';
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
  InputNumber,
  message,
} from 'antd';
import { useSelector } from 'dva';
import _ from 'lodash';
import { history } from 'umi';
import moment from 'moment';
import { DRIVER_CAR_ENERGY, DRIVER_CAR_NATURE, DRIVER_CAR_COLOR } from '@/utils/constant';
import UploadElement from '@/components/UploadElement';
import { PageContainer } from '@ant-design/pro-layout';
import {
  addDriverCar,
  detailDriver,
  driverDistinguish,
  driverCarUpdate,
  auditDriver,
} from './service';
import AuditForm from './components/AuditForm';
const { Item: FormItem } = Form;
const { Option } = Select;
const TITLE_TEXT = {
  check: '查看车辆',
  new: '添加车辆',
  edit: '编辑车辆',
  audit: '审核车辆',
};
const CarInformation = (props, ref) => {
  const { type, gvid } = props.location.query;

  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  const [count, setCount] = useState(300);
  const [timing, setTiming] = useState(false);
  const [detail, setDetail] = useState({});

  const [discernLoading, setDiscernLoading] = useState(false);
  const [form] = Form.useForm();
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }
  function disabledDate_start(current) {
    return current && current > moment().add(0, 'days');
  }

  useEffect(() => {
    if (type != 'new') {
      getDetailDriver();
    }
  }, [type]);
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  // 表单赋值
  const setField = (params) => {
    form.setFieldsValue(params);
  };

  // 提交表单
  const onFinish = (values, status = '') => {
    // 过滤
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        delete values[key];
      }
    });
    // 保险有效期
    if (values.ins_valid_date) {
      values.ins_valid_date = moment(values.ins_valid_date).format('YYYY-MM-DD');
    }
    // 车辆注册日期
    if (values.register_date) {
      values.register_date = moment(values.register_date).format('YYYY-MM-DD');
    }
    // 行驶证注册日期
    if (values.reg_date) {
      values.reg_date = moment(values.reg_date).format('YYYY-MM-DD');
    }
    // 行驶证发证日期
    if (values.issue_date) {
      values.issue_date = moment(values.issue_date).format('YYYY-MM-DD');
    }
    // 下次年检日期
    if (values.annual_check_date) {
      values.annual_check_date = moment(values.annual_check_date).format('YYYY-MM-DD');
    }
    // 车证有效期
    if (values.net_trans_permit_valid_date) {
      values.net_trans_permit_valid_date = moment(values.net_trans_permit_valid_date).format(
        'YYYY-MM-DD',
      );
    }

    // 行驶证信息
    const driver_driving_license = {
      reg_date: values.reg_date,
      issue_date: values.issue_date,
      driving_license_photo: values.driving_license_photo,
      driving_check_photo: values.driving_check_photo,
    };
    // 网约车证信息
    const driver_online_driving_license = {
      net_trans_permit_id: values.net_trans_permit_id,
      net_trans_permit_photo: values.net_trans_permit_photo,
      net_trans_permit_valid_date: values.net_trans_permit_valid_date,
    };
    // 车辆信息
    const driver_car = {
      ...values,
    };

    const params = {
      driver_driving_license: JSON.stringify(driver_driving_license),
      driver_car: JSON.stringify(driver_car),
      driver_online_driving_license: JSON.stringify(driver_online_driving_license),
    };
    if (type == 'audit') {
      params.gvid = gvid;
      dDriverCarUpdate(params);
    }
    if (type == 'edit') {
      params.gvid = gvid;
      dDriverCarUpdate(params, type);
    }
    if (type == 'new') {
      dAddDriverCar(params);
    }
  };

  /**
   * @description: 添加司机车辆
   * @param {*}
   * @return {*}
   */
  const dAddDriverCar = async (params) => {
    const res = await addDriverCar(params);
    if (res) {
      message.success('操作成功');
      history.push('/capacity/driver-car-list');
    }
  };

  /**
   * @description: 获取车辆详情
   * @param {*}
   * @return {*}
   */
  const getDetailDriver = async () => {
    const params = {
      gvid: gvid,
    };
    const res = await detailDriver(params);
    if (res) {
      setDetail(res.data);
    }
  };

  /**
   * @description: 编辑车辆信息
   * @param {*}
   * @return {*}
   */
  const dDriverCarUpdate = async (params, type = '') => {
    const res = await driverCarUpdate(params);
    if (res && type != 'edit') {
      message.success('操作成功');
      history.push(`/capacity/add-car?type=audit&gvid=${gvid}`);
    } else {
      if (userInfo && userInfo.agent_type == 0) {
        const params = {
          gvid: gvid,
          audit_msg_json: {},
          audit_status: 1,
        };
        setAuditDriver(params);
      } else {
        message.success('操作成功');
        history.push(`/capacity/add-car?type=audit&gvid=${gvid}`);
      }
    }
  };

  /**
   * @description: 司机审核
   * @param {object} params 审核参数
   * @return {*}
   */
  const setAuditDriver = async (params) => {
    const res = await auditDriver(params);
    if (res) {
      message.success('操作成功');
      history.push('/capacity/driver-car-list');
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

  // 识别身份信息
  const discernMessage = async () => {
    // 识别成功倒计时300s
    // setTiming(true);
    setDiscernLoading(true);
    const values = form.getFieldsValue();
    // 保险有效期
    if (values.ins_valid_date) {
      values.ins_valid_date = moment(values.ins_valid_date).format('YYYY-MM-DD');
    }
    // 车辆注册日期
    if (values.register_date) {
      values.register_date = moment(values.register_date).format('YYYY-MM-DD');
    }
    // 行驶证注册日期
    if (values.reg_date) {
      values.reg_date = moment(values.reg_date).format('YYYY-MM-DD');
    }
    // 行驶证发证日期
    if (values.issue_date) {
      values.issue_date = moment(values.issue_date).format('YYYY-MM-DD');
    }
    // 下次年检日期
    if (values.annual_check_date) {
      values.annual_check_date = moment(values.annual_check_date).format('YYYY-MM-DD');
    }
    // 行驶证下次年间日期
    if (values.driving_valid_date) {
      values.driving_valid_date = moment(values.driving_valid_date).format('YYYY-MM-DD');
    }
    // 行驶证
    const driving_license = {
      driving_license_photo: values.driving_license_photo,
      driving_check_photo: values.driving_check_photo,
      reg_date: values.reg_date,
      issue_date: values.issue_date,
    };
    const car_info = {
      plate_no: values.plate_no,
      owner: values.owner,
      owner_address: values.owner_address,
      vin: values.vin,
      engine_no: values.engine_no,
      seat_num: values.seat_num,
      init_style_price: values.init_style_price,
      wheelbases: values.wheelbases,
      length: values.length,
      width: values.width,
      height: values.height,
    };
    let driver_driving_license = JSON.stringify({
      driver_driving_license: driving_license,
      driver_car: car_info,
    });
    const params = {
      card_type: 'driver_driving_license',
      card_info: driver_driving_license,
      card_side: 'FRONT',
    };
    const res = await driverDistinguish(params);
    if (res) {
      setDiscernLoading(false);
      const { engine_no, owner, owner_address, plate_no, vin } = res.data.driver_car;
      const { issue_date, reg_date } = res.data.driver_driving_license;
      form.setFieldsValue({
        issue_date: moment(issue_date),
        reg_date: moment(reg_date),
        engine_no,
        owner,
        owner_address,
        plate_no,
        vin,
      });
    } else {
      setDiscernLoading(false);
    }

    const paramsBack = {
      card_type: 'driver_driving_license',
      card_info: driver_driving_license,
      card_side: 'BACK',
    };
    const resBack = await driverDistinguish(paramsBack);
    if (resBack) {
      setDiscernLoading(false);
      const {
        height,
        init_style_price,
        length,
        seat_num,
        wheelbases,
        width,
      } = resBack.data.driver_car;
      form.setFieldsValue({
        height,
        init_style_price,
        length,
        seat_num,
        wheelbases,
        width,
      });
    } else {
      setDiscernLoading(false);
    }
  };

  // 保存并通过车辆信息
  const saveFormData = async () => {
    const values = form.getFieldsValue();
    onFinish(values, 'PASS');
  };

  if (_.isEmpty(detail) && type != 'new') {
    return false;
  }
  return (
    <PageContainer
      onBack={() => window.history.back()}
      title={TITLE_TEXT[type]}
      extra={
        type != 'new' && [
          userApiAuth && type == 'check' && detail.base_info && detail.base_info.source != 1 && (
            <Button
              onClick={() => history.push(`/capacity/add-car?type=edit&gvid=${gvid}`)}
              key="1"
              type="primary"
            >
              编辑
            </Button>
          ),
          userApiAuth && type == 'edit' && (
            <Button onClick={() => saveFormData()} key="2" type="primary">
              保存{userInfo && userInfo.agent_type == 0 ? '且通过' : ''}
            </Button>
          ),
        ]
      }
    >
      <Card
        title={
          <div>
            <Space>
              <span>车辆信息:(注意：加*为必填字段)</span>
              {(type === 'new' || type == 'audit') && (
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
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={24}>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message:
                      '新能源车牌号码长度8位，普通车牌车牌号码长度7位 字母必须大写！请不要输入空格！！！！',
                  },
                ]}
                name="plate_no"
                label="#车牌号"
                initialValue={(detail.driver_car && detail.driver_car.plate_no) || ''}
              >
                <Input
                  disabled={type === 'check'}
                  placeholder="新能源车牌号码长度8位，普通车牌车牌号码长度7位 字母必须大写！请不要输入空格！！！！"
                />
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
                initialValue={(detail.driver_car && detail.driver_car.area_id) || null}
              >
                <Select
                  disabled={type === 'check'}
                  filterOption={filterOption}
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
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请填写车辆所有人（公司）',
                  },
                ]}
                name="owner"
                label="#车辆所有人（公司）"
                initialValue={(detail.driver_car && detail.driver_car.owner) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写车辆所有人（公司）" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请填写车辆所有人（公司）地址',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const pattern = /^[\s\S]{1,30}$/;
                      if (pattern.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('车辆所有人（公司）地址不得超过30个字符');
                    },
                  }),
                ]}
                name="owner_address"
                label="#车辆所有人（公司）地址"
                initialValue={(detail.driver_car && detail.driver_car.owner_address) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写车辆所有人（公司）地址" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                name="engine_no"
                label="#发动机号"
                initialValue={(detail.driver_car && detail.driver_car.engine_no) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写发动机号" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请选择能源类型',
                  },
                ]}
                name="fuel_id"
                label="能源类型"
                initialValue={(detail.driver_car && `${detail.driver_car.fuel_id}`) || null}
              >
                <Select
                  disabled={type === 'check'}
                  placeholder="请选择能源类型"
                  allowClear
                  showSearch
                >
                  {DRIVER_CAR_ENERGY &&
                    Object.keys(DRIVER_CAR_ENERGY).map((key) => {
                      return (
                        <Option key={key} value={key}>
                          {DRIVER_CAR_ENERGY[key].value}
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
                    message: '请输入品牌/型号',
                  },
                ]}
                name="brand_name"
                label="品牌/型号"
                initialValue={(detail.driver_car && detail.driver_car.brand_name) || null}
              >
                <Input disabled={type === 'check'} placeholder="请输入，如：宝马" />
                {/* <Select
                disabled={type === 'check'}
                placeholder="请选择品牌/型号"
                filterOption={filterOption}
                onChange={changeBrand}
                allowClear
                showSearch
              >
                {CAR_LIST &&
                  CAR_LIST.map((item) => {
                    return (
                      <Option key={item.brand_id} value={item.brand_id}>
                        {item.brand_name}
                      </Option>
                    );
                  })}
              </Select> */}
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请输入车系',
                  },
                ]}
                name="series_name"
                label="车系"
                initialValue={(detail.driver_car && detail.driver_car.series_name) || null}
              >
                <Input disabled={type === 'check'} placeholder="请输入，如：5系" />

                {/* <Select disabled={type === 'check'} placeholder="请选择车系" allowClear showSearch>
                {seriesList &&
                  seriesList.map((item) => {
                    return (
                      <Option key={item.series_id} value={item.series_id}>
                        {item.series_name}
                      </Option>
                    );
                  })}
              </Select> */}
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请选择车辆性质',
                  },
                ]}
                name="property"
                label="车辆性质"
                initialValue={(detail.driver_car && `${detail.driver_car.property}`) || null}
              >
                <Select
                  disabled={type === 'check'}
                  placeholder="请选择车辆性质"
                  allowClear
                  showSearch
                >
                  {DRIVER_CAR_NATURE &&
                    Object.keys(DRIVER_CAR_NATURE).map((key) => {
                      return (
                        <Option key={key} value={key}>
                          {DRIVER_CAR_NATURE[key].value}
                        </Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                name="delivery"
                label="排量"
                initialValue={(detail.driver_car && `${detail.driver_car.delivery}`) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写排量" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请填写座位数',
                  },
                ]}
                name="seat_num"
                label="#座位数"
                initialValue={(detail.driver_car && `${detail.driver_car.seat_num}`) || ''}
              >
                <InputNumber
                  min={1}
                  max={99}
                  precision={0}
                  disabled={type === 'check'}
                  placeholder="请填写座位数"
                />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                name="init_style_price"
                label="出厂指导价（万）"
                initialValue={(detail.driver_car && `${detail.driver_car.init_style_price}`) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写出厂指导价（万）" />
              </FormItem>
            </Col>
            <Col style={{ display: 'flex' }} xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem name="a11g11ent_ty1p1e12" label="#外观尺寸mm(长*宽*高)">
                <Space>
                  <FormItem
                    initialValue={(detail.driver_car && `${detail.driver_car.length}`) || ''}
                    name="length"
                  >
                    <Input style={{ width: 60 }} disabled={type === 'check'} placeholder="长(mm)" />
                  </FormItem>
                  <FormItem
                    initialValue={(detail.driver_car && `${detail.driver_car.width}`) || ''}
                    name="width"
                  >
                    <Input style={{ width: 60 }} disabled={type === 'check'} placeholder="宽(mm)" />
                  </FormItem>
                  <FormItem
                    initialValue={(detail.driver_car && `${detail.driver_car.height}`) || ''}
                    name="height"
                  >
                    <Input style={{ width: 60 }} disabled={type === 'check'} placeholder="高(mm)" />
                  </FormItem>
                </Space>
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请填写行驶里程（km）',
                  },
                ]}
                name="drive_distance"
                label="行驶里程（km）"
                initialValue={(detail.driver_car && `${detail.driver_car.drive_distance}`) || ''}
              >
                <Input disabled={type === 'check'} placeholder="请填写行驶里程（km）" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={(detail.driver_car && `${detail.driver_car.vin}`) || ''}
                name="vin"
                label="#车辆VN码"
              >
                <Input disabled={type === 'check'} placeholder="请填写车辆VN码" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请选择车辆颜色',
                  },
                ]}
                name="color"
                label="车辆颜色"
                initialValue={(detail.driver_car && `${detail.driver_car.color}`) || null}
              >
                <Select
                  disabled={type === 'check'}
                  placeholder="请选择车辆颜色"
                  allowClear
                  showSearch
                >
                  {DRIVER_CAR_COLOR &&
                    Object.keys(DRIVER_CAR_COLOR).map((key) => {
                      return (
                        <Option key={key} value={DRIVER_CAR_COLOR[key].value}>
                          {DRIVER_CAR_COLOR[key].value}
                        </Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={(detail.driver_car && moment(detail.driver_car.ins_valid_date)) || ''}
                name="ins_valid_date"
                label="保险有效期"
              >
                {/* <RangePicker disabledDate={disabledDate} disabled={joinType === 'check'} format="YYYY-MM-DD" /> */}
                <DatePicker
                  disabledDate={disabledDate}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={(detail.driver_car && moment(detail.driver_car.register_date)) || ''}
                name="register_date"
                label="车辆注册日期"
              >
                <DatePicker
                  disabledDate={disabledDate_start}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={
                  (detail.driver_car && moment(detail.driver_car.annual_check_date)) || ''
                }
                name="annual_check_date"
                label="下次年检日期"
              >
                <DatePicker
                  disabledDate={disabledDate}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            {/* 行驶证模块 */}
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={
                  (detail.driving_license && moment(detail.driving_license.reg_date)) || ''
                }
                name="reg_date"
                label="#行驶证注册日期"
              >
                <DatePicker
                  disabledDate={disabledDate_start}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={
                  (detail.driving_license && moment(detail.driving_license.issue_date)) || ''
                }
                name="issue_date"
                label="#行驶证发证日期"
              >
                <DatePicker
                  disabledDate={disabledDate_start}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            {/* <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              initialValue={(detail && moment(detail.driving_valid_date)) || ''}
              name="driving_valid_date"
              label="行驶证下次年检日期"
            >
              <DatePicker
                disabledDate={disabledDate}
                disabled={type === 'check'}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col> */}
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                rules={[
                  {
                    required: false,
                    message: '请填写网约车车证号',
                  },
                ]}
                name="net_trans_permit_id"
                label="网约车车证号"
                initialValue={
                  (detail.driver_online_driving_license &&
                    detail.driver_online_driving_license.net_trans_permit_id) ||
                  null
                }
              >
                <Input disabled={type === 'check'} placeholder="请输入网约车车证号" />
              </FormItem>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={4}>
              <FormItem
                initialValue={
                  (detail.driver_online_driving_license &&
                    moment(detail.driver_online_driving_license.net_trans_permit_valid_date)) ||
                  ''
                }
                name="net_trans_permit_valid_date"
                label="网约车车证有效期"
              >
                <DatePicker
                  disabledDate={disabledDate}
                  disabled={type === 'check'}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请上传车辆照片',
                  },
                ]}
                name="car_photo"
                label="车辆照片"
              >
                <UploadElement
                  initialImageUrl={(detail.driver_car && detail.driver_car.car_photo) || ''}
                  setField={setField}
                  itemName="car_photo"
                  uploadTxt="车辆照片"
                  disabled={type === 'check'}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请上传行驶证正本',
                  },
                ]}
                name="driving_license_photo"
                label="行驶证正本"
              >
                <UploadElement
                  initialImageUrl={
                    (detail.driving_license && detail.driving_license.driving_license_photo) || ''
                  }
                  setField={setField}
                  itemName="driving_license_photo"
                  uploadTxt="行驶证正本"
                  disabled={type === 'check'}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <FormItem
                rules={[
                  {
                    required: true,
                    message: '请上传行驶证副本',
                  },
                ]}
                name="driving_check_photo"
                label="行驶证副本"
              >
                <UploadElement
                  initialImageUrl={
                    (detail.driving_license && detail.driving_license.driving_check_photo) || ''
                  }
                  setField={setField}
                  itemName="driving_check_photo"
                  uploadTxt="行驶证副本"
                  disabled={type === 'check'}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <FormItem
                rules={[
                  {
                    required: false,
                    message: '请上传车证',
                  },
                ]}
                name="net_trans_permit_photo"
                label="车证照片"
              >
                <UploadElement
                  initialImageUrl={
                    (detail.driver_online_driving_license &&
                      detail.driver_online_driving_license.net_trans_permit_photo) ||
                    ''
                  }
                  setField={setField}
                  itemName="net_trans_permit_photo"
                  uploadTxt="车证照片"
                  disabled={type === 'check'}
                />
              </FormItem>
            </Col>
          </Row>
          {type == 'new' && (
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item>
                  <Button size="large" style={{ width: '100%' }} type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          )}
          {type == 'audit' && (
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item>
                  <Button size="large" style={{ width: '100%' }} type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
      {type === 'audit' && userInfo && userInfo.agent_type == 0 && (
        <AuditForm
          gvid={gvid}
          // getDetail={getDetail}
          // detail={detail && detail.base_info}
          // driverId={driver_id}
        />
      )}
    </PageContainer>
  );
};
export default CarInformation;
