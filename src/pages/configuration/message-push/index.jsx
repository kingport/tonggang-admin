// 开城配置
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import {
  Button,
  Table,
  PageHeader,
  Card,
  Row,
  Divider,
  Pagination,
  Modal,
  Space,
  message,
  Popconfirm,
  Tag,
} from 'antd';

import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import OperationLogModal from '@/components/OperationLogModal';
import { cityListConfig, toOprCity } from './service';
import { API_OPEN_CITY_LIST, API_OPEN_CITY_ADD, API_OPEN_CITY_UPDATA } from './constant';

import SearchForm from './components/SearchForm';
import CreateMessage from './components/CreateMessage';

import { dataMock } from './mock/index';

const MessagePush = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRefSearch = useRef(null);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [tableData, setTableData] = useState({});
  // console.log(userApiAuth, 'userApiAuth');

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_OPEN_CITY_LIST]) {
      getCityListConfig();
    }
  }, [userApiAuth]);
  // 获取配置列表
  const getCityListConfig = async (params = {}) => {
    setTableLoading(true);
    // const res = await cityListConfig(params);
    const res = dataMock;
    if (res) {
      setTableData(res.data);
    }
    setTableLoading(false);
  };

  // 关闭开启
  const toSetOprCity = async (status, id) => {
    const params = {
      id,
      status,
    };
    const res = await toOprCity(params);
    if (res) {
      message.success('操作成功');
      getCityListConfig();
    }
  };

  const getCountyName = (areaId, countys) => {
    // 找到对应城市数据
    const data = cityCountyList && cityCountyList.filter((item) => item.city == areaId)[0];
    const countyData = data ? data.county_infos : [];
    // 生成区县名字
    let countysName = '';
    countys.map((item) => {
      if (item) {
        const countyPitch =
          countyData.filter((countyItem) => countyItem.county === parseInt(item, 10))[0] || {};
        if (countyPitch.county_name) {
          countysName += ` ${countyPitch.county_name} `;
        }
      }
      return item;
    });
    return countysName;
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    console.log(values, 'BB');
    values.page_index = current;
    getCityListConfig(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${tableData.total}条`,
    total: tableData.total,
    pageSize: 10,
    current: tableData.page_index,
    onChange: (current) => changePage(current),
  };
  const columns = [
    {
      title: '消息ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: '消息类别',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text, record) => (
        <div className="oper">
          {
            <span style={{ padding: 0, paddingRight: 20 }}>
              {text == 2 ? '活动消息' : text == 1 ? '安全消息' : ''}
            </span>
          }
        </div>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'send_time',
      key: 'send_time',
      align: 'center',
    },
    {
      title: '城市',
      dataIndex: 'area',
      key: 'area',
      align: 'left',
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
      title: '发送范围',
      dataIndex: 'range_person',
      key: 'range_person',
      align: 'center',
      render: (text, record) => (
        <div className="oper">
          {
            <span style={{ padding: 0, paddingRight: 20 }}>
              {text == 0
                ? '全部司机'
                : text == 1
                ? '指定司机'
                : text == 2
                ? 'IOS'
                : text == 3
                ? '安卓'
                : ''}
            </span>
          }
        </div>
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'audit_status',
      key: 'audit_status',
      align: 'center',
      width: 120,
      render: (text, record) => (
        <div className="oper">
          {
            <span style={{ padding: 0, paddingRight: 20 }}>
              {text == 0 ? (
                <Tag color="#2db7f5">待审核</Tag>
              ) : text == 1 ? (
                <Tag color="#87d068">已通过</Tag>
              ) : text == 2 ? (
                <Tag color="#f50">已拒绝</Tag>
              ) : (
                ''
              )}
            </span>
          }
        </div>
      ),
    },
    {
      title: '发布状态',
      dataIndex: 'send_status',
      key: 'send_status',
      align: 'center',
      width: 120,
      render: (text, record) => (
        <div className="oper">
          {
            <span style={{ padding: 0, paddingRight: 20 }}>
              {text == 1 ? '已发布' : text == 2 ? '未发布' : ''}
            </span>
          }
        </div>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operator_name',
      key: 'operator_name',
      align: 'center',
    },
    {
      title: '消息简介',
      dataIndex: 'content_summary',
      key: 'content_summary',
      width: 300,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operator_id',
      key: 'operator_id',
      align: 'left',
      // width: 250,
      render: (text, record) => (
        <Space className="oper">
          <Button
            // onClick={() => showCheckMessageModal('showCheckMessage', record)}
            type="link"
            style={{ padding: 0 }}
          >
            查看
          </Button>

          <Button
            // onClick={() => showEditMessageModal('showEditMessage', record)}
            type="link"
            style={{ padding: 0}}
          >
            编辑
          </Button>
          <Popconfirm
            title="审核通过之后即按照设定时间发送"
            cancelText="拒绝"
            okText="通过"
            // onCancel={() => this.onCancel(record)}
            // onConfirm={() => this.onConfirm(record)}
          >
            <Button type="link" style={{ padding: 0,  }}>
              审核
            </Button>
          </Popconfirm>

          <Button
            // onClick={() => showLogMessageModal('showLogMessage', record)}
            type="link"
            style={{ padding: 0,  }}
          >
            操作日志
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="消息推送"
      extra={
        userApiAuth &&
        userApiAuth[API_OPEN_CITY_ADD] && [
          <Button
            onClick={() => setShowAddCityModal(true)}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新建消息
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm getCityListConfig={getCityListConfig} ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          scroll={{x: 'max-content'}}
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData.list}
          size="small"
        />
      </Card>
      <Modal
        title="新增消息"
        visible={showAddCityModal}
        destroyOnClose
        onCancel={() => setShowAddCityModal(false)}
        footer={null}
        width={600}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <CreateMessage
          onCancel={() => setShowAddCityModal(false)}
          getCityListConfig={getCityListConfig}
        />
      </Modal>
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="teamModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={7}
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

export default MessagePush;
