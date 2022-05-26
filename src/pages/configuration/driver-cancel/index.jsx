import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Card, Modal, Popconfirm, message, Table, Space } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import OperationLogModal from '@/components/OperationLogModal';

import { API_CANCEL_RULE, API_CANCEL_LIST, API_CANCEL_DELECT } from './constant';
import { cancelCountList, deleteCancelCount } from './service';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';

const CancelConfiguration = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  // 弹窗显示
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState({});
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
      // 获取取消次数列表
      getCancelCountList();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo]);

  // 获取取消列表
  const getCancelCountList = async (params = {}) => {
    setLoading(true);
    const res = await cancelCountList(params);
    if (res) {
      const { data } = res;
      if (res.data.info) {
        res.data.info.map((x, index) => (x.serial = index + 1 + 10 * (res.data.pageIndex - 1)));
      }
      setDataSource(data);
      setLoading(false);
    }
  };
  // 新建 编辑
  const showModal = (record, type) => {
    switch (type) {
      case 'edit':
        setVisible(true);
        setType(type);
        setSelectRecord(record);
        break;
      case 'new':
        setVisible(true);
        setType(type);
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

  // 确认创建or编辑
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  // 关闭弹窗
  const handleCancel = () => {
    setType('');
    setVisible(false);
    setSelectRecord();
    childrenRef.current.onReset();
  };

  // 开启or关闭操作
  const confirm = async (record) => {
    const params = {
      id: record.id,
    };
    const res = await deleteCancelCount(params);
    if (res) {
      message.success('操作成功');
      getCancelCountList();
    }
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    values.pageSize = 10;
    values.pageIndex = current;
    getCancelCountList(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    pageSize: 10,
    current: dataSource.pageIndex,
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
      render: (area_id) => {
        let city_name = '';
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area_id)
            ? cityCountyList.find((x) => x.city == area_id).city_name
            : '不存在该城市码';
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '司机取消次数',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CANCEL_RULE] && (
              <Button
                className="padding-zero"
                onClick={() => showModal(record, 'edit')}
                type="link"
              >
                修改
              </Button>
            )}
            {userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CANCEL_DELECT] && (
              <Popconfirm
                title="确定关闭吗？"
                onConfirm={() => confirm(record)}
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
      title="司机取消次数配置"
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
            () => <SearchForm getCancelCountList={getCancelCountList} ref={childrenRefSearch} />,
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
        width={544}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={23}
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
        title={type === 'edit' ? '修改司机取消次数配置' : '新增司机取消次数配置'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Card>
          <ModelForm
            type={type}
            handleCancel={handleCancel}
            getCancelCountList={getCancelCountList}
            selectRecord={selectRecord}
            ref={childrenRef}
          />
        </Card>
      </Modal>
    </PageContainer>
  );
};

export default CancelConfiguration;
