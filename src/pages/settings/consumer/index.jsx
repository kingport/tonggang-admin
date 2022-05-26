import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Card, Modal, Popconfirm, message, Table, Badge, Switch, Space } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { ACCOUNT_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';

import { API_ADD_USER, API_UPDATE_USER, API_SWITCH_ROLE, API_RESET_ROLE } from './constant';
import { getUserList, switchStatus, getUserRoleList, updateUserAuthority } from './service';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';
import PasswordForm from './components/PasswordForm';

const Consumer = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  // 弹窗显示
  const [visible, setVisible] = useState(false);
  const [visiblePwd, setVisiblePwd] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [userId, setUserId] = useState();
  const [roleData, setRoleData] = useState();
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [switching, setSwitching] = useState(false);

  const childrenRef = useRef(null);
  const childrenRefPwd = useRef(null);
  const childrenRefSearch = useRef(null);

  const [type, setType] = useState();

  useEffect(() => {
    userList();
    getRoleList();
  }, []);

  // 新建 编辑
  const showModal = (record, type) => {
    switch (type) {
      case 'edit':
        setVisible(true);
        setType(type);
        setUserId(record.id);
        break;
      case 'new':
        setVisible(true);
        setType(type);
        break;
      case 'pwd':
        setVisiblePwd(true);
        setUserId(record.id);
        break;
      default:
        break;
    }
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  // 获取角色列表
  const getRoleList = async () => {
    const res = await getUserRoleList();
    if (res) {
      setRoleData(res.data.list);
    }
  };

  // 获取用户列表
  const userList = async (params = { is_disable: 0 }) => {
    setLoading(true);
    const res = await getUserList(params);
    if (res) {
      setDataSource(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  /**
   * @description: 设置权限开启or关闭
   * @param {*}
   * @return {*}
   */
  const switchChange = async (status, record) => {
    setSelectRecord(record);
    setSwitching(true);
    const params = {
      user_id: record.id,
      is_all_authority: status ? 1 : 0,
    };
    const res = await updateUserAuthority(params);
    if (res) {
      message.success('操作成功');
      userList();
    }
    setSwitching(false);
  };
  // 确认创建or编辑
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    setType('');
    setUserId();
    setSelectRecord();
  };

  // 确认修改密码
  const handleOkPwd = () => {
    childrenRefPwd.current.onFinish();
  };
  // 关闭修改密码弹窗
  const handleCancelPwd = () => {
    setVisiblePwd(false);
  };

  // 封禁账号
  const confirm = async (record) => {
    const params = {
      user_id: record.id,
    };
    const res = await switchStatus(params);
    if (res) {
      message.success('封禁成功');
      userList();
    }
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      size: 10,
      page: current,
      ...values,
    };
    userList(parasm);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.page,
    onChange: (current) => changePage(current),
  };

  let filterColumns = [];
  if (userInfo) {
    switch (userInfo.agent_type) {
      case 0:
        filterColumns = [
          {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
            align: 'center',
          },
          {
            title: '代理商级别',
            dataIndex: 'agent_type',
            key: 'agent_type',
            align: 'center',
          },
          {
            title: '旗下公司数据',
            align: 'center',
            dataIndex: 'is_all_authority',
            key: 'is_all_authority',
            render: (is_all_authority, record) => {
              if (record.company_id == userInfo.company_id && record.is_broker != 1) {
                return (
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked={is_all_authority * 1}
                    checked={is_all_authority * 1}
                    onChange={(event) => switchChange(event, record)}
                    loading={switching && selectRecord == record}
                  />
                );
              }
            },
          },
        ];
        break;
      case 1:
        filterColumns = [
          {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
            align: 'center',
          },
          {
            title: '旗下公司数据',
            align: 'center',
            dataIndex: 'is_all_authority',
            key: 'is_all_authority',
            render: (is_all_authority, record) => {
              if (record.company_id == userInfo.company_id && record.is_broker != 1) {
                return (
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked={is_all_authority * 1}
                    checked={is_all_authority * 1}
                    onChange={(event) => switchChange(event, record)}
                    loading={switching && selectRecord == record}
                  />
                );
              }
            },
          },
        ];
        break;
      case 2:
        filterColumns = [
          {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
            align: 'center',
          },
          {
            title: '旗下公司数据',
            align: 'center',
            dataIndex: 'is_all_authority',
            key: 'is_all_authority',
            render: (is_all_authority, record) => {
              if (record.company_id == userInfo.company_id && record.is_broker != 1) {
                return (
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked={is_all_authority * 1}
                    checked={is_all_authority * 1}
                    onChange={(event) => switchChange(event, record)}
                    loading={switching && selectRecord == record}
                  />
                );
              }
            },
          },
        ];
        break;
      case 3:
        filterColumns = [];
        break;

      default:
        break;
    }
  }

  const columns = [
    {
      title: '用户名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    ...filterColumns,
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center',
    },
    {
      title: '账号状态',
      dataIndex: 'is_disable',
      key: 'is_disable',
      align: 'left',
      render: (is_disable) => {
        return (
          <Badge
            status={ACCOUNT_STATUS[is_disable].status}
            text={ACCOUNT_STATUS[is_disable].label}
          />
        );
      },
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {!record.is_broker && userApiAuth && userApiAuth[API_UPDATE_USER] && (
              <Button
                className="padding-zero"
                onClick={() => showModal(record, 'edit')}
                type="link"
              >
                编辑
              </Button>
            )}
            {!record.is_broker && userApiAuth && userApiAuth[API_RESET_ROLE] && (
              <Button className="padding-zero" onClick={() => showModal(record, 'pwd')} type="link">
                修改密码
              </Button>
            )}
            {!record.is_broker &&
              userApiAuth &&
              userApiAuth[API_SWITCH_ROLE] &&
              record.is_disable == 0 && (
                <Popconfirm
                  title="确定删除该账号吗？"
                  onConfirm={() => confirm(record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">
                    删除
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
      title="用户管理"
      extra={
        userApiAuth &&
        userApiAuth[API_ADD_USER] && [
          <Button
            onClick={() => {
              showModal({}, 'new');
            }}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            创建用户
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm roleData={roleData} ref={childrenRefSearch} userList={userList} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info}
          pagination={paginationProps}
        />
      </Card>
      {/* 新建用户 编辑用户 */}
      <Modal
        maskClosable={false}
        width={600}
        title={type === 'edit' ? '编辑用户' : '新建用户'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Card>
          <ModelForm
            userList={userList}
            type={type}
            userId={type === 'edit' ? userId : null}
            handleCancel={handleCancel}
            ref={childrenRef}
          />
        </Card>
      </Modal>

      {/* 修改密码 */}
      <Modal
        maskClosable={false}
        width={600}
        title="修改密码"
        okText="确定"
        cancelText="取消"
        visible={visiblePwd}
        onOk={handleOkPwd}
        onCancel={handleCancelPwd}
      >
        <Card>
          <PasswordForm userId={userId} handleCancelPwd={handleCancelPwd} ref={childrenRefPwd} />
        </Card>
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
          id={selectRecord && selectRecord.id}
          type={13}
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

export default Consumer;
