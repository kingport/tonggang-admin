import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Card, Modal, Table, Space } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';

import { API_CITY_AUTH_LIST, API_CITY_AUTH_ADD, API_CITY_AUTH_CHECK } from './constant';
import { areaList, areaUserList, userList, companyList } from './service';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';

const CityUserAuth = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  // 弹窗显示
  const [visible, setVisible] = useState(false);

  const [dataSource, setDataSource] = useState({});
  const [areaUserData, setAreaUserData] = useState();
  const [userListData, setUserListData] = useState();

  const [areaId, setAreaId] = useState();
  const [roleData, setRoleData] = useState();
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [companyData, setCompanyData] = useState([]);

  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);

  const [type, setType] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    // 只有内部公司可以用
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CITY_AUTH_LIST]) {
      // 获取城市权限列表
      getAreaList();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo]);

  /**
   * @description: 获取租赁公司列表
   * @param {string} area_id 城市码
   * @return {*}
   */
  const getCompanyList = async (area_id) => {
    const params = {
      area_id,
    };
    const res = await companyList(params);
    if (res) {
      setCompanyData(res.data);
    }
  };

  // 获取城市权限列表
  const getAreaList = async (page = 1) => {
    const values = await childrenRefSearch.current.validateFields();
    setLoading(true);
    const params = {
      ...values,
      page,
    };
    const res = await areaList(params);
    if (res) {
      const { data } = res;
      if (res.data.info) {
        res.data.info.map((x, index) => (x.serial = index + 1 + 10 * (res.data.page - 1)));
      }
      setDataSource(data);
      setLoading(false);
    }
  };

  // 配置用户列表
  const getAreaUserList = async (params = {}) => {
    setLoading(true);
    const res = await areaUserList(params);
    if (res) {
      const { data } = res;
      setAreaUserData(data);
      setLoading(false);
    }
  };

  // 获取用户列表
  const getUserList = async (params) => {
    setLoading(true);
    const res = await userList(params);
    if (res) {
      setUserListData(res.data);
    }
    setLoading(false);
  };

  // 新建 编辑
  const showModal = (record, type) => {
    setAreaId(record.area);
    setVisible(true);
    setType(type);
    switch (type) {
      case 'check':
        getAreaUserList({ area: record.area });
        break;
      case 'new':
        getCompanyList(record.area);
        // getUserList({
        //   area: record.area,
        // });
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

  // 确认
  const handleOk = () => {
    if (type == 'check') {
      return handleCancel();
    }
    childrenRef.current.onsubmit();
    getAreaList();
  };
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    setType('');
    childrenRef.current.resetFields();
    setUserListData();
  };

  // 分页
  const changePage = async (current) => {
    getAreaList(current);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    pageSizeOptions: [10],
    current: dataSource.page,
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
      title: '城市',
      dataIndex: 'area',
      key: 'area',
      align: 'center',
      ellipsis: true,
      render: (area) => {
        let city_name = null;
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area);
          if (city_name) {
            city_name = cityCountyList.find((x) => x.city == area).city_name;
          } else {
            city_name = '无该城市ID';
          }
        }
        return <span>{city_name || '--'}</span>;
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
              userApiAuth[API_CITY_AUTH_CHECK] && (
                <Button
                  className="padding-zero"
                  onClick={() => showModal(record, 'check')}
                  type="link"
                >
                  查看
                </Button>
              )}
            {userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CITY_AUTH_ADD] && (
              <Button className="padding-zero" onClick={() => showModal(record, 'new')} type="link">
                新增
              </Button>
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
    <PageContainer title="用户城市权限配置">
      <Card
        title={
          userInfo &&
          userInfo.agent_type == 0 &&
          useMemo(
            () => (
              <SearchForm getAreaList={getAreaList} roleData={roleData} ref={childrenRefSearch} />
            ),
            [],
          )
        }
      >
        <Table
          rowKey={(e) => e.area}
          bordered
          scroll={{ x: 'max-content' }}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.info}
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
        width={700}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.area}
          type={24}
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
      {/* */}
      <Modal
        maskClosable={false}
        width={800}
        title={type === 'check' ? '成员管理' : '新增成员'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ModelForm
          type={type}
          loading={loading}
          userListData={userListData}
          handleCancel={handleCancel}
          getAreaList={getAreaList}
          getUserList={getUserList}
          getAreaUserList={getAreaUserList}
          areaId={areaId}
          areaUserData={areaUserData}
          companyData={companyData}
          ref={childrenRef}
        />
      </Modal>
    </PageContainer>
  );
};

export default CityUserAuth;
