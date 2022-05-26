import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal, Popconfirm, message, Table, Tooltip, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';

import { roleList, roleUserList, getPermissionAll, getInfo, roleDelete } from './service';
import { API_ADD_ROLE, API_UPDATE_ROLE, API_DELETE_ROLE, API_USERLIST_ROLE } from './constant';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';
import PermissionSetting from './components/PermissionSetting';
import UserList from './components/UserList';

const Role = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const childrenRef = useRef(null);
  const childrenRefAuth = useRef(null);
  const childrenRefSearch = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  // 弹窗显示
  const [visible, setVisible] = useState(false);
  const [visibleMember, setVisibleMember] = useState(false);
  const [visibleAuth, setVisibleAuth] = useState(false);
  const [type, setType] = useState('');
  const [roleDetail, setRoleDetail] = useState({});
  const [dataSource, setDataSource] = useState({});

  // 设置权限组件
  const [allAuthIdMap, setAllAuthIdMap] = useState({});
  const [allAuthKeyMap, setAllAuthKeyMap] = useState({});
  const [roleInfo, setRoleInfo] = useState(null);
  const [filterRoleInfo, setFilterRoleInfo] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [userListData, setUserListData] = useState([]);
  // const [roleDetail, setRoleDetail] = useState();

  useEffect(() => {
    // 角色列表
    const params = {
      page_size: 10,
      page_index: 1,
    };
    getRoleList(params);
    // 全部权限列表
    permissionAll();
  }, []);

  // 获取全部权限列表
  const permissionAll = async () => {
    const res = await getPermissionAll();
    if (res) {
      const { data = [] } = res;
      // tag 一级导航
      const tagArr = [];
      // page tag下的页面
      const pageArr = [];
      let allAuthIdMap_ = {};
      let allAuthKeyMap_ = {};

      // 将值作为key 为Object
      data.map((item) => {
        allAuthIdMap_[item.id] = item;
        allAuthKeyMap_[`${item.module}.${item.uri}`] = item;
      });
      setAllAuthIdMap(allAuthIdMap_);
      setAllAuthKeyMap(allAuthKeyMap_);
      data.map((item) => {
        if (item.type == 'tag') {
          item.title = item.name;
          item.key = 'no-' + item.uri;
          item.children = [];
          tagArr.push(item);
        }
        if (item.type == 'api' && item.sup_id == 0) {
          item.title = item.name;
          item.key = `${item.module}.${item.uri}`;
        }
      });

      // 找出type=page
      data.map((item) => {
        if (item.type == 'page') {
          item.children = [];
          item.title = item.name;
          item.key = `${item.module}.${item.uri}`;
          pageArr.push(item);
        }
      });

      data.map((item) => {
        pageArr.map((itemPage) => {
          if (item.sup_id === itemPage.id) {
            item.title = item.name;
            item.key = `${item.module}.${item.uri}`;
            itemPage.title = itemPage.name;
            itemPage.key = `${itemPage.module}.${itemPage.uri}`;
            itemPage.children.push(item);
          }
        });
      });
      // page 放入tag
      tagArr.map((item) => {
        pageArr.map((_item, _index) => {
          if (item.id == _item.sup_id) {
            item.children.push(_item);
          }
        });
      });
      setModalData(tagArr);
    }
  };

  // 获取该角色的权限
  const getRoleAuth = async (record) => {
    const params = {
      role_id: record.id,
    };
    const res = await getInfo(params);
    if (res) {
      const { data } = res;
      let authArr = [];
      if (data && data.permissions) {
        Object.keys(data.permissions).forEach((key) => {
          authArr.push(key);
        });
      }
      setRoleInfo(authArr);
      // 过滤掉树形空间最顶层，让子集自动填充
      setFilterRoleInfo(authArr.filter((item) => item.indexOf('api.') > -1 || item.indexOf('pope.') > -1));
    }
  };

  // 获取所有角色列表
  const getRoleList = async (params = {}) => {
    setLoading(true);
    const res = await roleList(params);
    if (res) {
      setDataSource(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  // 新建 编辑
  const showModal = (record, type) => {
    // 派发类型
    setType(type);

    switch (type) {
      case 'edit':
        setVisible(true);
        setRoleDetail(record);
        break;
      case 'new':
        setVisible(true);
        setRoleDetail({});
        break;
      case 'settings':
        setVisibleAuth(true);
        setRoleDetail(record);
        getRoleAuth(record);
        break;

      default:
        break;
    }
  };

  // 获取该角色下的账号列表
  const showVisibleMember = (record) => {
    setVisibleMember(true);
    userList(record);
  };

  // 删除角色
  const roleRemove = async (params) => {
    const res = await roleDelete(params);
    if (res) {
      message.success('删除成功');
      // 刷新
      const params = {
        page_size: 10,
        page_index: 1,
      };
      getRoleList(params);
    }
  };

  // 获取角色账号列表
  const userList = async (record) => {
    setInitLoading(true);
    const params = {
      role_id: record.id,
    };
    const res = await roleUserList(params);
    if (res) {
      setUserListData(res.data);
      setInitLoading(false);
    }
  };
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  const handleCancel = () => {
    setVisible(false);
    childrenRef.current.onReset();
  };

  // 确认权限弹窗
  const handleOkAuth = () => {
    childrenRefAuth.current.submit();
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      page_size: 10,
      page_index: current,
      ...values,
    };
    getRoleList(parasm);
  };

  // 删除角色账号
  const confirm = (record) => {
    if (record.user_num !== 0) return;
    const params = {
      role_id: record.id,
    };
    roleRemove(params);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.count}条`,
    total: dataSource.count,
    pageSize: 10,
    current: dataSource.page_index,
    onChange: (current) => changePage(current),
  };
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '数量',
      dataIndex: 'user_num',
      key: 'user_num',
      align: 'center',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      // width: 300
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        // 系统超级管理员不能自己设置 只能数据库操作
        if (record.id == 1) return;
        return (
          <Space>
            {userApiAuth && userApiAuth[API_UPDATE_ROLE] && (
              <Button
                className="padding-zero"
                onClick={() => showModal(record, 'edit')}
                type="link"
              >
                编辑
              </Button>
            )}
            {userApiAuth && userApiAuth[API_UPDATE_ROLE] && (
              <Button
                className="padding-zero"
                onClick={() => showModal(record, 'settings')}
                type="link"
              >
                设置权限
              </Button>
            )}

            {userApiAuth && userApiAuth[API_DELETE_ROLE] && (
              <Popconfirm
                title="确定删除该账号吗？"
                onConfirm={() => confirm(record)}
                // onCancel={cancel}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip placement="bottom" title="该角色下数量为0时才可以删除">
                  <Button className="padding-zero" disabled={record.user_num != 0} type="link">
                    删除
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
            {userApiAuth && userApiAuth[API_USERLIST_ROLE] && (
              <Button
                className="padding-zero"
                onClick={() => showVisibleMember(record)}
                type="link"
              >
                成员管理
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      title="角色管理"
      extra={
        userApiAuth &&
        userApiAuth[API_ADD_ROLE] && [
          <Button
            onClick={() => showModal({}, 'new')}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新建角色
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm getRoleList={getRoleList} ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={dataSource.list}
          pagination={paginationProps}
        />
      </Card>
      {/* 新建角色 编辑角色弹窗 */}
      <Modal
        title={type === 'edit' ? '编辑角色' : '新建角色'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <ModelForm
          roleDetail={roleDetail}
          getRoleList={getRoleList}
          handleCancel={handleCancel}
          type={type}
          ref={childrenRef}
        />
      </Modal>
      {/* 成员管理弹窗 */}
      <Modal
        title="用户列表"
        visible={visibleMember}
        // onOk={handleOk}
        onCancel={() => setVisibleMember(false)}
        maskClosable={false}
        footer={null}
      >
        <UserList
          initLoading={initLoading}
          onCancel={() => setVisibleMember(false)}
          getRoleList={getRoleList}
          userList={userListData}
        />
      </Modal>
      {/* 设置权限 */}
      <Modal
        title="设置角色权限"
        visible={visibleAuth}
        onOk={handleOkAuth}
        onCancel={() => setVisibleAuth(false)}
        maskClosable={false}
      >
        <PermissionSetting
          // getRoleAuth={() => this.getRoleAuth()}
          roleInfo={roleInfo}
          filterRoleInfo={filterRoleInfo}
          onCancel={() => setVisibleAuth(false)}
          // selectRecord={selectRecord}
          roleDetail={roleDetail}
          allAuthIdMap={allAuthIdMap}
          allAuthKeyMap={allAuthKeyMap}
          modalData={modalData}
          ref={childrenRefAuth}
        />
      </Modal>
    </PageContainer>
  );
};

export default Role;
