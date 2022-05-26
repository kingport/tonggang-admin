import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, message, Table, Tag, Modal, Form, Input, Space } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { DRIVER_SOUCER_STATUS, DRIVER_BOUND_STATUS, DRIVER_CHECK_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import {
  API_ADD_CAR,
  API_CAR_LIST,
  API_BIND_DRIVER,
  API_DETAIL_CAR,
  API_AUDIT_CAR,
} from './constant';
import { cancelOrderJudge, driverCatList, bindDriver } from './service';
import SearchForm from './components/SearchForm';
import LogModal from './components/LogModal';

const { TextArea } = Input;

const DriverCarList = () => {
  const childrenRefSearch = useRef(null);

  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_CAR_LIST]) {
      getDriverCatList();
    }
  }, []);

  /**
   * @description: 获取车辆列表
   * @param {object} params 参数
   * @return {*}
   */
  const getDriverCatList = async (param = {}) => {
    setLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await driverCatList(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };

  // 新增车辆
  const operationDriver = (type, record) => {
    if (_.isEmpty(record)) {
      history.push(`/capacity/add-car?type=${type}`);
    } else {
      history.push(`/capacity/add-car?type=${type}&gvid=${record.gvid}`);
    }
  };

  /**
   * @description:  判定弹窗
   * @param {*}
   * @return {*}
   */
  const judgeModal = (record) => {
    setSelectRecord(record);
    setVisible(true);
  };

  // 确定绑定
  const handleOk = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const params = {
          gvid: selectRecord.gvid,
          ...values,
          bind_status: 1,
        };
        const res = await bindDriver(params);
        if (res) {
          message.success('操作成功');
          getDriverCatList();
          setVisible(false);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // 分页
  const changePage = async (current) => {
    const params = {
      page_index: current,
    };
    getDriverCatList(params);
  };
  // 分页
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    pageSize: 10,
    current: dataSource.pageIndex*1,
    onChange: (current) => changePage(current),
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    setShowLogModal(true);
    setSelectRecord(record);
  };

  const columns = [
    {
      title: '车牌号',
      key: 'plate_no',
      dataIndex: 'plate_no',
      align: 'center',
    },
    {
      title: '司机',
      key: 'driver_name',
      dataIndex: 'driver_name',
      align: 'center',
    },
    {
      title: '运营城市',
      key: 'area_id',
      dataIndex: 'area_id',
      align: 'center',
      render: (area_id) => {
        let cityName = '';
        if (cityCountyList && cityCountyList.find((x) => x.city == area_id)) {
          cityName = cityCountyList.find((x) => x.city == area_id).city_name;
        }
        return <span>{cityName}</span>;
      },
    },
    {
      title: '所属公司',
      key: 'join_company_name',
      dataIndex: 'join_company_name',
      align: 'center',
    },
    {
      title: '新增时间',
      key: '_create_time',
      dataIndex: '_create_time',
      align: 'center',
    },
    {
      title: '来源',
      key: 'source',
      dataIndex: 'source',
      align: 'center',
      render: (source) => {
        return <span>{DRIVER_SOUCER_STATUS[source].value}</span>;
      },
    },
    {
      title: '绑定司机状态',
      key: 'bind_status',
      dataIndex: 'bind_status',
      align: 'center',
      render: (bind_status) => {
        return <span>{DRIVER_BOUND_STATUS[bind_status].value}</span>;
      },
    },
    {
      title: '车辆审核状态',
      key: 'audit_status',
      dataIndex: 'audit_status',
      align: 'center',
      render: (audit_status) => {
        return <span>{DRIVER_CHECK_STATUS[audit_status].value}</span>;
      },
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userApiAuth && userApiAuth[API_DETAIL_CAR] && (
              <Button
                className="padding-zero"
                onClick={() => operationDriver('check', record)}
                type="link"
              >
                查看
              </Button>
            )}
            {record.audit_status == 0 &&
              userApiAuth &&
              userApiAuth[API_AUDIT_CAR] &&
              userInfo &&
              userInfo.agent_type == 0 && (
                <Button
                  className="padding-zero"
                  onClick={() => operationDriver('audit', record)}
                  type="link"
                >
                  审核
                </Button>
              )}
            {record.bind_status == 0 &&
              record.audit_status == 1 &&
              userApiAuth &&
              userApiAuth[API_BIND_DRIVER] && (
                <Button className="padding-zero" onClick={() => judgeModal(record)} type="link">
                  绑定司机
                </Button>
              )}

            <Button className="padding-zero" onClick={() => showOperationLog(record)} type="link">
              操作日志
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      title="车辆管理列表"
      extra={
        userApiAuth &&
        userApiAuth[API_ADD_CAR] && [
          <Button
            onClick={() => operationDriver('new', {})}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新增车辆
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} getDriverCatList={getDriverCatList} />}>
        <Table
          rowKey={(e) => e.plate_no}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info || []}
          pagination={paginationProps}
        />
      </Card>
      {/* 判责弹窗 */}
      <Modal
        maskClosable={false}
        width={400}
        title="绑定司机"
        okText="确定绑定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const pattern = /^[0-9]*$/;
                  if (pattern.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('司机ID为纯数字');
                },
              }),
            ]}
            name="driver_id"
            label="司机ID"
          >
            <Input placeholder="请输入司机ID" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 操作日志 */}
      <Modal
        title="操作日志"
        visible={showLogModal}
        onCancel={() => setShowLogModal(false)}
        destroyOnClose
        footer={null}
        width={644}
        className="orderModal"
        bodyStyle={{ padding: '0 14px 24px 14px' }}
      >
        <LogModal selectRecord={selectRecord} />
      </Modal>
    </PageContainer>
  );
};
export default DriverCarList;
