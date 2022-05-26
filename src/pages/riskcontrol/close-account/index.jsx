import React, { useState, useRef, useEffect } from 'react';
import { Card, Modal, Table, Badge } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { CONFIG_CHANNEL, CONFIG_CANCEL_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';

import { API_CANCEL_LIST } from './constant';
import { cancelRuleList } from './service';
import SearchForm from './components/SearchForm';
import ModelForm from './components/ModelForm';

const CloseAccount = () => {
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
    // 只有内部公司可以用
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CANCEL_LIST]) {
      // 获取取消列表
      getCancelRuleList();
    }
  }, [userInfo]);

  // 获取取消列表
  const getCancelRuleList = async (params = {}) => {
    setLoading(true);
    const res = await cancelRuleList(params);
    if (res) {
      const { data } = res;
      setDataSource(data);
      setLoading(false);
    }
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

  // 分页
  const changePage = async (current) => {
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
      title: '注消时间',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '首次登录时间',
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

        return <span>{city_name.slice(0, -1) || '--'}</span>;
      },
    },

    {
      title: '公司',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      render: (status) => {
        if (status == 1) {
          return <Badge status="processing" text={CONFIG_CANCEL_STATUS[status].value} />;
        } else {
          return <Badge status="error" text={CONFIG_CANCEL_STATUS[status].value} />;
        }
      },
    },
    {
      title: '司机手机号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '账户余额',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '注销原因',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
  ];
  return (
    <PageContainer title="注销账号">
      <Card
        title={
          userInfo &&
          userInfo.agent_type == 0 && (
            <SearchForm
              getCancelRuleList={getCancelRuleList}
              roleData={roleData}
              ref={childrenRefSearch}
            />
          )
        }
      >
        <Table
          rowKey={(e) => e.id}
          bordered
          size="small"
          scroll={{x: 'max-content'}}
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

export default CloseAccount;
