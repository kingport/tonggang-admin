import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Badge, Popconfirm, message, Table, Modal, Space } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { CONFIG_PASSENGER_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';

import { API_SET_AREA, API_GET_AREA } from './constant';
import { getActivityArea, setActivityArea } from './service';
import SearchForm from './components/SearchForm';
import CreateCityForm from './components/CreateCityForm';

const InvitedPassengerConfig = () => {
  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [dataSource, setDataSource] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  /**
   * 获取活动列表
   * @param
   */
  const activityArea = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getActivityArea(params);
      if (res) {
        setDataSource(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // 该功能只有内部公司可以使用 切拥有配置权限
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_GET_AREA]) {
      activityArea();
    }
  }, [userApiAuth]);

  // 终止 or 开始
  const confirm = (record, type) => {
    switch (type) {
      // 开启
      case 'start':
        operateEvent(record, 1);
        break;
      // 关闭
      case 'stop':
        operateEvent(record, 2);
        break;
      default:
        break;
    }
  };

  // 开启活动 关闭活动
  const operateEvent = async (record, status) => {
    const params = {
      area_id: record.area_id,
      status: status,
    };
    const res = await setActivityArea(params);
    if (res) {
      message.success('操作活动成功');
      activityArea();
    }
  };
  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      page_no: current,
      ...values,
    };
    activityArea(parasm);
  };
  // 分页
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current,
    onChange: (current) => changePage(current),
  };

  // 确定
  const handleOk = () => {
    childrenRef.current.onFinish();
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  const columns = [
    {
      title: '可使用地区',
      key: 'area_id',
      dataIndex: 'area_id',
      align: 'center',
      render: (area_id) => {
        return <span>{cityCountyList.find((x) => x.city === area_id).city_name}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return (
          <Badge
            status={CONFIG_PASSENGER_STATUS[status].status}
            text={CONFIG_PASSENGER_STATUS[status].label}
          />
        );
      },
    },
    {
      title: '配置时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userApiAuth && userApiAuth[API_SET_AREA] && record.status == 2 && (
              <Popconfirm
                title="确定开始该活动吗？"
                onConfirm={() => confirm(record, 'start')}
                // onCancel={cancel}
                okText="确定"
                cancelText="取消"
              >
                <Button className="padding-zero" type="link">
                  开始
                </Button>
              </Popconfirm>
            )}
            {userApiAuth && userApiAuth[API_SET_AREA] && record.status == 1 && (
              <Popconfirm
                title="确定关闭该活动吗？"
                onConfirm={() => confirm(record, 'stop')}
                // onCancel={cancel}
                okText="确定"
                cancelText="我再想想"
              >
                <Button className="padding-zero" type="link">
                  关闭
                </Button>
              </Popconfirm>
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
      title="邀请乘客配置"
      extra={
        userApiAuth &&
        userApiAuth[API_SET_AREA] && [
          <Button onClick={() => setVisible(true)} icon={<PlusOutlined />} key="1" type="primary">
            新增城市
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} activityArea={activityArea} />}>
        <Table
          rowKey={(e) => e.area_id}
          bordered
          scroll={{x: 'max-content'}}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.list || []}
          pagination={paginationProps}
        />
      </Card>
      {/* 新增城市弹窗 */}
      <Modal
        maskClosable={false}
        width={400}
        title="新增城市"
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <CreateCityForm
          activityArea={activityArea}
          ref={childrenRef}
          onCancel={() => setVisible(false)}
        />
      </Modal>
      {/* 操作日志 */}
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.area_id}
          type={14}
          addColumns={[
            {
              title: '操作结果',
              dataIndex: 'op_status',
              key: 'op_status',
              width: 80,
              render: (text) => {
                return (
                  <>
                    <div>{text ? '成功' : '失败'}</div>
                  </>
                );
              },
            },
          ]}
        />
      </Modal>
    </PageContainer>
  );
};
export default InvitedPassengerConfig;
