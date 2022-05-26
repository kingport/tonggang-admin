import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Spin, message, Col, Space, Row } from 'antd';
import { history, connect } from 'umi';
import { useDispatch } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import ProSkeleton from '@ant-design/pro-skeleton';

import moment from 'moment';
import { API_DRIVER_EDIT } from './constant';
import './index.less';

import { addDriver, driverDetail, driverEdit, auditDriver, driverConfig } from './service';
// 身份信息
import IdentitiesForm from './components/IdentitiesForm';
// 驾驶证
import DrivingForm from './components/DrivingForm';
// 车辆信息
import CarInformation from './components/CarInformationForm';
// 人证
import PersonInformationForm from './components/PersonInformationForm';
// 车证
import CarLicenseForm from './components/CarLicenseForm';
// 审核
import AuditForm from './components/AuditForm';
// 申请信息
import DriverApplyForm from './components/DriverApplyForm';

// 加盟司机管理
const JoinNew = (props) => {
  const { userApiAuth } = props;
  const { driver_id, type } = props.location.query;

  const dispatch = useDispatch();
  const TITLE_TEXT = {
    check: '查看司机',
    new: '添加司机',
    edit: '编辑司机',
    audit: '审核司机',
  };

  const refDriverApply = useRef(null);
  const refIdentities = useRef(null);
  const refDriving = useRef(null);
  const refCarInformation = useRef(null);
  const refPersonInformation = useRef(null);
  const refCarLicense = useRef(null);

  const [loading, setLoading] = useState(false);
  const [spinLoading, setSpinLoading] = useState(false);

  const [detail, setDetail] = useState();

  const [isDelectCarLicense, setDelectCarLicense] = useState(false);
  const [isPersonInformation, setPersonInformation] = useState(false);

  const [mustDriverConfig, setMustDriverConfig] = useState({});

  // 获取司机详情
  useEffect(() => {
    const abortController = new AbortController();
    if (type != 'new') {
      getDetail();
      return function cleanup() {
        abortController.abort();
      };
    }
  }, []);

  // 获取司机双证是否需要上传
  const getDriverConfig = async (city_code, area_code) => {
    const params = {
      area_code,
      city_code,
    };
    const res = await driverConfig(params);
    if (res) {
      const { data = {} } = res;
      setMustDriverConfig(data);
    }
  };

  // 获取司机详情
  const getDetail = async () => {
    setSpinLoading(true);
    const params = {
      driver_id: driver_id,
    };
    const res = await driverDetail(params);
    if (res) {
      // 行驶证
      let driving_license = res.data.driving_license;
      // 车辆信息
      let driver_car = res.data.driver_car;
      let driver_car_info = Object.assign(driving_license, driver_car);
      res.data.driver_car_info = driver_car_info;
      setDetail(res.data);
      setSpinLoading(false);
    }
  };

  // 点击编辑按钮
  const setDriverType = () => {
    history.push(`/capacity/join-new?driver_id=${driver_id}&type=edit`);
  };

  // 编辑司机
  const setDriverEdit = async (params, type) => {
    const res = await driverEdit(params);
    if (res) {
      message.success('操作成功');
      if (type == 1) {
        history.push(`/capacity/join-new?driver_id=${driver_id}&type=editAudit`);
      }
      getDetail();
    }
  };

  // 添加司机
  const createDriver = async (params) => {
    setLoading(true);
    const res = await addDriver(params);
    if (res) {
      // 清空
      dispatch({
        type: 'joinNew/clearDriverInfo',
        payload: {
          // 申请信息
          driverApply: null,
          // 身份信息
          driverIdcard: null,
          // 驾驶证
          driverLicense: null,
          // 车辆信息
          driverCar: null,
          // 行驶证
          driverDrivingLicense: null,
          // 人证
          driverOnlineLicense: null,
          // 车证
          driverOnlineDrivingLicense: null,
        },
      });
      message.success('添加成功');
      setLoading(false);
      setSpinLoading(false);
      // 刷新列表
      history.push('/capacity/join');
    } else {
      setLoading(false);
      setSpinLoading(false);
    }
  };

  // 司机通过
  const driverPass = async (params) => {
    const res = await auditDriver(params);
    if (res) {
      message.success('操作成功');
      getDetail();
      history.push(`/capacity/join-new?driver_id=${driver_id}&type=check`);
    }
  };

  // TODO 可以优化 编辑司机保存资料
  const saveFormData = async (type) => {
    // 申请信息
    let driver_apply = await refDriverApply.current.getValues();
    // console.log(driver_apply, 'driver_apply');
    if (driver_apply.biz_source == 2) {
      if (!driver_apply.company_id) {
        return message.error('请选择公司');
      }
    }

    let driver_idcard = await refIdentities.current.getValues();
    let driver_license = await refDriving.current.getValues();
    let driver_car = await refCarInformation.current.getValues();

    let driver_online_driving_license;
    let driver_online_license;
    if (!isDelectCarLicense) {
      driver_online_driving_license = await refCarLicense.current.getValues();
    }
    if (!isPersonInformation) {
      driver_online_license = await refPersonInformation.current.getValues();
    }

    if (driver_apply && driver_idcard && driver_license && driver_car) {
      // 司机id
      driver_apply.driver_id = driver_id;
      // 时间处理
      if (driver_idcard.id_valid_date) {
        driver_idcard.id_valid_date = moment(driver_idcard.id_valid_date).format('YYYY-MM-DD');
      }
      // 户籍所在地
      if (driver_idcard.census_place) {
        driver_idcard.census_place = driver_idcard.census_place.join(',');
      }

      if (driver_license.lic_issue_date) {
        driver_license.lic_issue_date = moment(driver_license.lic_issue_date).format('YYYY-MM-DD');
      }
      if (driver_license.lic_valid_date) {
        driver_license.lic_valid_date = moment(driver_license.lic_valid_date).format('YYYY-MM-DD');
      }

      // 保险有效期
      if (driver_car.ins_valid_date) {
        driver_car.ins_valid_date = moment(driver_car.ins_valid_date).format('YYYY-MM-DD');
      }
      // 车辆注册日期
      if (driver_car.register_date) {
        driver_car.register_date = moment(driver_car.register_date).format('YYYY-MM-DD');
      }
      // 行驶证注册日期
      if (driver_car.reg_date) {
        driver_car.reg_date = moment(driver_car.reg_date).format('YYYY-MM-DD');
      }
      // 行驶证发证日期
      if (driver_car.issue_date) {
        driver_car.issue_date = moment(driver_car.issue_date).format('YYYY-MM-DD');
      }
      // 下次年检日期
      if (driver_car.annual_check_date) {
        driver_car.annual_check_date = moment(driver_car.annual_check_date).format('YYYY-MM-DD');
      }

      if (driver_online_license) {
        if (driver_online_license.qualification_id_valid_date) {
          driver_online_license.qualification_id_valid_date = moment(
            driver_online_license.qualification_id_valid_date,
          ).format('YYYY-MM-DD');
        }
      }
      if (driver_online_driving_license) {
        if (driver_online_driving_license.net_trans_permit_valid_date) {
          driver_online_driving_license.net_trans_permit_valid_date = moment(
            driver_online_driving_license.net_trans_permit_valid_date,
          ).format('YYYY-MM-DD');
        }
      }

      // 行驶证信息抽离
      const driver_driving_license = {
        reg_date: driver_car.reg_date,
        issue_date: driver_car.issue_date,
        driving_license_photo: driver_car.driving_license_photo,
        driving_check_photo: driver_car.driving_check_photo,
      };

      const params = {
        driver_apply: JSON.stringify(driver_apply),
        driver_idcard: JSON.stringify(driver_idcard),
        driver_license: JSON.stringify(driver_license),
        driver_driving_license: JSON.stringify(driver_driving_license),
        driver_car: JSON.stringify(driver_car),
        driver_online_license: JSON.stringify(driver_online_license),
        driver_online_driving_license: JSON.stringify(driver_online_driving_license),
      };
      setDriverEdit(params, type);
    }
  };

  // TODO 可以优化 新增司机
  const newDriver = async () => {
    // 申请信息
    let driver_apply = await refDriverApply.current.getValues();
    // console.log(driver_apply, 'driver_apply');
    if (driver_apply.biz_source == 2) {
      if (!driver_apply.company_id) {
        return message.error('请选择公司');
      }
    }

    let driver_idcard = await refIdentities.current.getValues();
    let driver_license = await refDriving.current.getValues();
    let driver_car = await refCarInformation.current.getValues();
    let driver_online_license = await refPersonInformation.current.getValues();
    let driver_online_driving_license = await refCarLicense.current.getValues();
    // 时间处理
    if (driver_idcard.id_valid_date) {
      driver_idcard.id_valid_date = moment(driver_idcard.id_valid_date).format('YYYY-MM-DD');
    }
    // 户籍所在地
    if (driver_idcard.census_place) {
      driver_idcard.census_place = driver_idcard.census_place.join(',');
    }

    if (driver_license.lic_issue_date) {
      driver_license.lic_issue_date = moment(driver_license.lic_issue_date).format('YYYY-MM-DD');
    }
    if (driver_license.lic_valid_date) {
      driver_license.lic_valid_date = moment(driver_license.lic_valid_date).format('YYYY-MM-DD');
    }

    // 保险有效期
    if (driver_car.ins_valid_date) {
      driver_car.ins_valid_date = moment(driver_car.ins_valid_date).format('YYYY-MM-DD');
    }
    // 车辆注册日期
    if (driver_car.register_date) {
      driver_car.register_date = moment(driver_car.register_date).format('YYYY-MM-DD');
    }
    // 行驶证注册日期
    if (driver_car.reg_date) {
      driver_car.reg_date = moment(driver_car.reg_date).format('YYYY-MM-DD');
    }
    // 行驶证发证日期
    if (driver_car.issue_date) {
      driver_car.issue_date = moment(driver_car.issue_date).format('YYYY-MM-DD');
    }
    // 下次年检日期
    if (driver_car.annual_check_date) {
      driver_car.annual_check_date = moment(driver_car.annual_check_date).format('YYYY-MM-DD');
    }

    if (driver_online_license.qualification_id_valid_date) {
      driver_online_license.qualification_id_valid_date = moment(
        driver_online_license.qualification_id_valid_date,
      ).format('YYYY-MM-DD');
    }

    if (driver_online_driving_license.net_trans_permit_valid_date) {
      driver_online_driving_license.net_trans_permit_valid_date = moment(
        driver_online_driving_license.net_trans_permit_valid_date,
      ).format('YYYY-MM-DD');
    }

    // 行驶证信息抽离
    const driver_driving_license = {
      reg_date: driver_car.reg_date,
      issue_date: driver_car.issue_date,
      driving_license_photo: driver_car.driving_license_photo,
      driving_check_photo: driver_car.driving_check_photo,
    };

    const params = {
      driver_apply: JSON.stringify(driver_apply),
      driver_idcard: JSON.stringify(driver_idcard),
      driver_license: JSON.stringify(driver_license),
      driver_driving_license: JSON.stringify(driver_driving_license),
      driver_car: JSON.stringify(driver_car),
      driver_online_license: JSON.stringify(driver_online_license),
      driver_online_driving_license: JSON.stringify(driver_online_driving_license),
    };

    createDriver(params);
  };

  // TODO 可以优化 编辑后通过审核
  const editPassDriver = async () => {
    // 申请信息
    let driver_apply = await refDriverApply.current.getValues();
    // console.log(driver_apply, 'driver_apply');
    if (driver_apply.biz_source == 2) {
      if (!driver_apply.company_id) {
        return message.error('请选择公司');
      }
    }
    let driver_idcard = await refIdentities.current.getValues();
    let driver_license = await refDriving.current.getValues();
    let driver_car = await refCarInformation.current.getValues();
    let driver_online_driving_license;
    let driver_online_license;
    if (!isDelectCarLicense) {
      driver_online_driving_license = await refCarLicense.current.getValues();
    }
    if (!isPersonInformation) {
      driver_online_license = await refPersonInformation.current.getValues();
    }
    // 时间处理
    if (driver_idcard.id_valid_date) {
      driver_idcard.id_valid_date = moment(driver_idcard.id_valid_date).format('YYYY-MM-DD');
    }
    // 户籍所在地
    if (driver_idcard.census_place) {
      driver_idcard.census_place = driver_idcard.census_place.join(',');
    }

    if (driver_license.lic_issue_date) {
      driver_license.lic_issue_date = moment(driver_license.lic_issue_date).format('YYYY-MM-DD');
    }
    if (driver_license.lic_valid_date) {
      driver_license.lic_valid_date = moment(driver_license.lic_valid_date).format('YYYY-MM-DD');
    }

    // 保险有效期
    if (driver_car.ins_valid_date) {
      driver_car.ins_valid_date = moment(driver_car.ins_valid_date).format('YYYY-MM-DD');
    }
    // 车辆注册日期
    if (driver_car.register_date) {
      driver_car.register_date = moment(driver_car.register_date).format('YYYY-MM-DD');
    }
    // 行驶证注册日期
    if (driver_car.reg_date) {
      driver_car.reg_date = moment(driver_car.reg_date).format('YYYY-MM-DD');
    }
    // 行驶证发证日期
    if (driver_car.issue_date) {
      driver_car.issue_date = moment(driver_car.issue_date).format('YYYY-MM-DD');
    }
    // 下次年检日期
    if (driver_car.annual_check_date) {
      driver_car.annual_check_date = moment(driver_car.annual_check_date).format('YYYY-MM-DD');
    }

    if (driver_online_license) {
      if (driver_online_license.qualification_id_valid_date) {
        driver_online_license.qualification_id_valid_date = moment(
          driver_online_license.qualification_id_valid_date,
        ).format('YYYY-MM-DD');
      }
    }
    if (driver_online_driving_license) {
      if (driver_online_driving_license.net_trans_permit_valid_date) {
        driver_online_driving_license.net_trans_permit_valid_date = moment(
          driver_online_driving_license.net_trans_permit_valid_date,
        ).format('YYYY-MM-DD');
      }
    }

    // 行驶证信息抽离
    const driver_driving_license = {
      reg_date: driver_car.reg_date,
      issue_date: driver_car.issue_date,
      driving_license_photo: driver_car.driving_license_photo,
      driving_check_photo: driver_car.driving_check_photo,
    };

    const params = {
      driver_apply: JSON.stringify(driver_apply),
      driver_idcard: JSON.stringify(driver_idcard),
      driver_license: JSON.stringify(driver_license),
      driver_driving_license: JSON.stringify(driver_driving_license),
      driver_car: JSON.stringify(driver_car),
      driver_online_license: JSON.stringify(driver_online_license),
      driver_online_driving_license: JSON.stringify(driver_online_driving_license),
    };

    let data = {
      driver_id: driver_id,
      audit_msg_json: JSON.stringify(params),
      audit_status: 1,
    };
    driverPass(data);
  };

  // 删除车证认证
  const delectLicense = (type) => {
    if (type == 'car') {
      setDelectCarLicense(true);
    }
    if (type == 'person') {
      setPersonInformation(true);
    }
  };

  if (!detail && type != 'new') {
    return (
      <div
        style={{
          background: '#fafafa',
          padding: 24,
        }}
      >
        <ProSkeleton type="list" />
      </div>
    );
  }

  return (
    <PageContainer
      onBack={() => window.history.back()}
      title={TITLE_TEXT[type]}
      extra={
        type != 'new' && [
          userApiAuth && userApiAuth[API_DRIVER_EDIT] && type == 'check' && (
            <Button onClick={() => setDriverType('edit')} key="1" type="primary">
              编辑
            </Button>
          ),
          userApiAuth && userApiAuth[API_DRIVER_EDIT] && type == 'edit' && (
            <Button onClick={() => saveFormData(1)} key="2" type="primary">
              保存
            </Button>
          ),
          type == 'editAudit' && (
            <Button onClick={editPassDriver} key="3" type="primary">
              通过
            </Button>
          ),
        ]
      }
    >
      {/* 后期优化下 不用多表单嵌套 */}
      <Spin spinning={spinLoading}>
        <Space direction="vertical">
          {/* 申请信息 */}
          <DriverApplyForm
            type={type}
            detail={detail && detail.driver_apply}
            cancelLoading={() => setLoading(false)}
            ref={refDriverApply}
            getDriverConfig={getDriverConfig}
            setMustDriverConfig={setMustDriverConfig}
          />
          {/* 身份信息 */}
          <IdentitiesForm
            type={type}
            detail={detail && detail.driver_idcard}
            cancelLoading={() => setLoading(false)}
            ref={refIdentities}
          />
          {/* 驾驶证 */}
          {
            <DrivingForm
              type={type}
              detail={detail && detail.driver_license}
              cancelLoading={() => setLoading(false)}
              ref={refDriving}
            />
          }

          {/* 车辆信息 */}
          <CarInformation
            type={type}
            detail={detail && detail.driver_car_info}
            driverId={detail && detail.base_info.driver_id}
            getDetail={getDetail}
            cancelLoading={() => setLoading(false)}
            ref={refCarInformation}
          />

          {/* 人证 */}
          {!isPersonInformation && (
            <PersonInformationForm
              type={type}
              detail={detail && detail.driver_online_license}
              cancelLoading={() => setLoading(false)}
              ref={refPersonInformation}
              delectLicense={() => delectLicense('person')}
              mustDriverConfig={mustDriverConfig}
            />
          )}
          {/* 车证 */}
          {!isDelectCarLicense && (
            <CarLicenseForm
              type={type}
              detail={detail && detail.driver_online_driving_license}
              cancelLoading={() => setLoading(false)}
              ref={refCarLicense}
              delectLicense={() => delectLicense('car')}
              mustDriverConfig={mustDriverConfig}
            />
          )}

          {type === 'new' && (
            <Row align="center">
              <Col span={24}>
                <Button
                  style={{ width: '100%', height: 50 }}
                  loading={loading}
                  onClick={newDriver}
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  立即上传
                </Button>
              </Col>
            </Row>
          )}
          {type === 'audit' && userApiAuth && userApiAuth[API_DRIVER_EDIT] && (
            <Row align="center">
              <Col span={24}>
                <Button
                  style={{ width: '100%', height: 50 }}
                  onClick={() => saveFormData(2)}
                  size="large"
                  type="primary"
                  // shape="round"
                  htmlType="submit"
                >
                  保存更改
                </Button>
              </Col>
            </Row>
          )}
          {type === 'audit' && (
            <AuditForm
              getDetail={getDetail}
              detail={detail && detail.base_info}
              driverId={driver_id}
            />
          )}
        </Space>
      </Spin>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  userApiAuth: global.userApiAuth,
}))(JoinNew);
