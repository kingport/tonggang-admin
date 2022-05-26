import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Card, Modal, Popconfirm, message, Table, Badge, Popover, Space } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { CONFIG_CHANNEL, CONFIG_CANCEL_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';

import { API_CANCEL_RULE, API_CANCEL_LIST, API_CANCEL_EDIT, API_CANCEL_SET } from './constant';
import { cancelRuleList, setCancelRuleStatus } from './service';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';

const CancelConfiguration = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  // 弹窗显示
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [userId, setUserId] = useState();
  const [roleData, setRoleData] = useState();
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();

  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);

  const [type, setType] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    // 只有内部公司可以用
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CANCEL_LIST]) {
      // 获取取消列表
      getCancelRuleList();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo]);

  // 获取取消列表
  const getCancelRuleList = async (params = {}) => {
    setLoading(true);
    const res = await cancelRuleList(params);
    if (res) {
      const { data } = res;
      if (res.data.list) {
        res.data.list.map((x, index) => (x.serial = index + 1 + 10 * (res.data.current_page - 1)));
      }
      setDataSource(data);
      setLoading(false);
    }
  };
  // 新建 编辑
  const showModal = (record, type) => {
    switch (type) {
      case 'edit':
        // 显示弹窗
        setVisible(true);
        // 派发类型
        setType(type);
        // 用户id
        setUserId(record.id);
        break;
      case 'new':
        // 显示弹窗
        setVisible(true);
        // 派发类型
        setType(type);
        break;
      default:
        break;
    }
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    // console.log(record);
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  // 确认创建or编辑
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    setType('');
    childrenRef.current.onReset();
  };

  // 开启or关闭操作
  const confirm = async (record) => {
    const params = {
      id: record.id,
      status: record.status == 0 ? 1 : 0,
    };
    const res = await setCancelRuleStatus(params);
    if (res) {
      message.success('操作成功');
      getCancelRuleList();
    }
  };

  // 分页
  const changePage = async (current) => {
    // console.log(current)
    const values = await childrenRefSearch.current.validateFields();
    values.per_page = 10;
    values.page = current;
    getCancelRuleList(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current_page,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'serial',
      key: 'serial',
      align: 'center',
    },
    {
      title: '平台',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
      render: (channel) => {
        return <span>{CONFIG_CHANNEL[channel]}</span>;
      },
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      render: (area_id) => {
        let city_name = '';
        if (area_id == '') {
          city_name = '全国丶';
        } else {
          let arr_area = area_id.split(',');
          if (cityCountyList) {
            arr_area.map((item) => {
              city_name += cityCountyList.find((x) => x.city == item).city_name + '、';
            });
          }
        }

        // console.log(city_name)
        return <span>{city_name.slice(0, -1) || '--'}</span>;
      },
    },
    {
      title: '取消费配置',
      align: 'center',
      render: (record) => {
        const content = (
          <div>
            <p>
              司机接单<span style={{ color: 'red' }}>{record.strived_duration / 60}</span>
              分钟后，乘客取消，乘客支付取消费
              <span style={{ color: 'red' }}>{record.strived_fee / 100}</span>元；
            </p>
            <p>
              司机到达上车点，且等待时长超过
              <span style={{ color: 'red' }}>{record.arrived_duration / 60}</span>
              分钟后，司机可以免责取消，乘客支付取消费
              <span style={{ color: 'red' }}>{record.arrived_fee / 100}</span>元；
            </p>
          </div>
        );
        return (
          <Popover placement="rightTop" title="配置详情" content={content} trigger="click">
            <Button type="link">详情</Button>
          </Popover>
        );
      },
    },
    {
      title: '取消费状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        if (status == 1) {
          return <Badge status="processing" text={CONFIG_CANCEL_STATUS[status].value} />;
        } else {
          return <Badge status="error" text={CONFIG_CANCEL_STATUS[status].value} />;
        }
      },
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_CANCEL_EDIT] &&
              record.status == 0 && (
                <Button
                  className="padding-zero"
                  onClick={() => showModal(record, 'edit')}
                  type="link"
                >
                  修改
                </Button>
              )}
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_CANCEL_SET] &&
              record.status == 0 && (
                <Popconfirm
                  title="确定开启吗？"
                  onConfirm={() => confirm(record)}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">
                    开启
                  </Button>
                </Popconfirm>
              )}
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_CANCEL_SET] &&
              record.status == 1 && (
                <Popconfirm
                  title="确定关闭吗？"
                  onConfirm={() => confirm(record)}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">
                    关闭
                  </Button>
                </Popconfirm>
              )}

            {!record.is_broker && (
              <Button className="padding-zero" onClick={() => showOperationLog(record)} type="link">
                操作日志
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      title="取消费配置"
      extra={
        userInfo &&
        userInfo.agent_type == 0 &&
        userApiAuth &&
        userApiAuth[API_CANCEL_RULE] && [
          <Button
            onClick={() => showModal({}, 'new')}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新增
          </Button>,
        ]
      }
    >
      <Card
        title={
          userInfo &&
          userInfo.agent_type == 0 &&
          useMemo(
            () => (
              <SearchForm
                getCancelRuleList={getCancelRuleList}
                roleData={roleData}
                ref={childrenRefSearch}
              />
            ),
            [],
          )
        }
      >
        <Table
          rowKey={(e) => e.id}
          bordered
          scroll={{ x: 'max-content' }}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.list}
          pagination={paginationProps}
        />
      </Card>
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
          id={selectRecord && selectRecord.id}
          type={16}
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
      {/* 新增取消配置or修改取消配置 */}
      <Modal
        maskClosable={false}
        width={800}
        title={type === 'edit' ? '修改取消配置' : '新增取消配置'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Card>
          <ModelForm
            type={type}
            userId={type === 'edit' ? userId : null}
            handleCancel={handleCancel}
            getCancelRuleList={getCancelRuleList}
            ref={childrenRef}
          />
        </Card>
      </Modal>
    </PageContainer>
  );
};

export default CancelConfiguration;
