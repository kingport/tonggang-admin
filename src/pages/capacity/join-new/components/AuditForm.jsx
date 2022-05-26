// 驾驶证信息
import React, { useState, forwardRef, useEffect } from 'react';
import {
  Card,
  Space,
  Form,
  Button,
  Row,
  Col,
  Radio,
  Checkbox,
  Table,
  Divider,
  message,
} from 'antd';
import { history } from 'umi';

import { auditDriver, driverLogs } from '../service';

const { Item: FormItem } = Form;

const AuditForm = (props, ref) => {
  const [form] = Form.useForm();
  const { driverId, detail } = props;

  const [loading, setLoading] = useState(false);
  const [auditType, setAuditType] = useState(1);
  const [auditMsg, setAuditMsg] = useState();
  const [auditRecord, setAuditRecord] = useState([]);

  useEffect(() => {
    if (detail) {
      setAuditType(detail.audit_status);
      if (detail.audit_status == 2 || detail.audit_status == 3) {
        if (detail.audit_msg_json != '') {
          let audit_msg_json = JSON.parse(detail.audit_msg_json);
          setAuditMsg(audit_msg_json);
        }
      }
      getDriverLogs();
    }
  }, [detail]);

  /**
   * @description: 获取司机审核日志
   * @param {*}
   * @return {*}
   */
  const getDriverLogs = async () => {
    const params = {
      op_res_type: 2,
      op_types: '200010,200015,200016,200017',
      driver_id: driverId,
    };
    const res = await driverLogs(params);
    if (res) {
      setAuditRecord(res.data);
    }
  };
  const plainOptions_iden = [
    { label: '身份证（头像页）反光', value: 'front_img_reflective' },
    { label: '身份证（国徽页）反光', value: 'backend_img_reflective' },
    { label: '手持身份证反光', value: 'front_in_hand_reflective' },
    { label: '身份证（头像页）模糊', value: 'front_img_blur' },
    { label: '身份证（国徽页）模糊', value: 'backend_img_blur' },
    { label: '手持身份证模糊', value: 'front_in_hand_blur' },
    { label: '身份证（头像页）不符', value: 'front_img_mismatch' },
    { label: '身份证（国徽页）不符', value: 'backend_img_mismatch' },
    { label: '手持身份证不符', value: 'front_in_hand_mismatch' },
  ];
  // 驾驶证
  const plainOptions_driving = [
    { label: '驾驶证正面反光', value: 'front_img_reflective' },
    // { label: '驾驶证反面反光', value: 'backend_img_reflective' },
    { label: '驾驶证正面模糊', value: 'front_img_blur' },
    // { label: '驾驶证反面模糊', value: 'backend_img_blur' },
    { label: '驾驶证正面不符', value: 'front_img_mismatch' },
    // { label: '驾驶证反面不符', value: 'backend_img_mismatch' },
  ];
  // 行驶证
  const plainOptions_license = [
    { label: '行驶证正面反光', value: 'front_img_reflective' },
    { label: '行驶证反面反光', value: 'backend_img_reflective' },
    { label: '行驶证正面模糊', value: 'front_img_blur' },
    { label: '行驶证反面模糊', value: 'backend_img_blur' },
    { label: '行驶证正面不符', value: 'front_img_mismatch' },
    { label: '行驶证反面不符', value: 'backend_img_mismatch' },
  ];
  // 车辆
  const plainOptions_car = [
    { label: '车辆照片反光', value: 'main_img_reflective' },
    { label: '车辆照片模糊', value: 'main_img_blur' },
    { label: '车辆照片不符', value: 'main_img_mismatch' },
  ];
  // 网约车人证
  const plainOptions_online_p = [
    // { label: '网约车人证反光', value: 'front_img_reflective' },
    // { label: '网约车人证模糊', value: 'front_img_blur' },
    { label: '网约车人证不符', value: 'front_img_mismatch' },
  ];
  // 网约车车证
  const plainOptions_online_c = [
    // { label: '网约车车证反光', value: 'front_img_reflective' },
    // { label: '网约车车证模糊', value: 'front_img_blur' },
    { label: '网约车车证不符', value: 'front_img_mismatch' },
  ];

  const columns = [
    {
      title: '审查时间',
      dataIndex: 'op_time',
      align: 'center',
      key: 'op_time',
      width: 150,
    },
    {
      title: '审查人',
      dataIndex: 'op_user_name',
      align: 'center',
      key: 'op_user_name',
      width: 100,
    },
    {
      title: '审查结果',
      dataIndex: 'op_type_txt',
      align: 'center',
      key: 'op_type_txt',
      width: 100,
    },
    {
      title: '原因',
      dataIndex: 'op_remarks',
      align: 'left',
      key: 'op_remarks',
    },
  ];

  /**
   * @description: 获取表单信息
   * @param {*}
   * @return {*}
   */
  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        // 删除空数组
        Object.keys(values).map((x) => {
          if (values[x] && values[x].length == 0) {
            delete values[x];
          }
        });
        values.driver_id = driverId;
        let data = JSON.stringify({
          driver_car: values.driver_car,
          driver_idcard: values.driver_idcard,
          driver_driving_license: values.driver_driving_license,
          driver_license: values.driver_license,
          driver_online_driving_license: values.driver_online_driving_license,
          driver_online_license: values.driver_online_license,
        });
        if (data == '{}' && values.audit_status != 1) {
          return message.error('请至少勾选一项');
        }
        const params = {
          driver_id: driverId,
          audit_msg_json: data,
          audit_status: values.audit_status,
        };
        setAuditDriver(params);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
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
      history.push('/capacity/join');
    }
  };

  /**
   * @description: 选择审核结果
   * @param {number} e 选择某项
   * @return {*}
   */
  const onChange = (e) => {
    setAuditType(e.target.value);
  };

  const paginationProps = {
    showQuickJumper: false,
    // showTotal: () => `共${dataSource.total}条`,
    // total: dataSource.total,
    pageSize: 20,
    // current: dataSource.current,
    // onChange: (current) => changePage(current),
  };
  return (
    <Card>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Divider orientation="left">审查结果</Divider>
        <Row gutter={24}>
          <Col span={24}>
            <Space size={40}>
              <FormItem initialValue={(detail && detail.audit_status) || 0} name="audit_status">
                <Radio.Group onChange={onChange}>
                  <Radio value={2}>初审不通过</Radio>
                  <Radio value={1}>审核通过</Radio>
                  <Radio value={3}>非营运车辆</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem>
                <Button htmlType="submit" type="primary">
                  确认
                </Button>
              </FormItem>
            </Space>
          </Col>
        </Row>

        {(auditType == 2 || auditType == 3) && (
          <>
            <Divider style={{ color: 'red' }} orientation="left">
              初审不通过需要重新上传
            </Divider>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_idcard}
                name="driver_idcard"
                label="身份证"
              >
                <Checkbox.Group options={plainOptions_iden}></Checkbox.Group>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_license}
                name="driver_license"
                label="驾驶证"
              >
                <Checkbox.Group options={plainOptions_driving}></Checkbox.Group>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_driving_license}
                name="driver_driving_license"
                label="行驶证"
              >
                <Checkbox.Group options={plainOptions_license}></Checkbox.Group>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_car}
                name="driver_car"
                label="车辆"
              >
                <Checkbox.Group options={plainOptions_car}></Checkbox.Group>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_online_license}
                name="driver_online_license"
                label="网约车人证"
              >
                <Checkbox.Group options={plainOptions_online_p}></Checkbox.Group>
              </FormItem>
            </Row>
            <Row>
              <FormItem
                initialValue={auditMsg && auditMsg.driver_online_driving_license}
                name="driver_online_driving_license"
                label="网约车车证"
              >
                <Checkbox.Group options={plainOptions_online_c}></Checkbox.Group>
              </FormItem>
            </Row>
          </>
        )}

        <Divider orientation="left">审查记录</Divider>
        <Row>
          <Col span={24}>
            <Table
              rowKey={(e) => e.op_id}
              bordered
              scroll={{x: 'max-content'}}
              size="small"
              loading={loading}
              columns={columns}
              dataSource={auditRecord}
              pagination={paginationProps}
            />
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default forwardRef(AuditForm);
