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
  Image,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import _ from 'lodash';
import { history } from 'umi';

import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';
import DownloadForm from '@/components/DownloadForm';

import { accountShowTrans, showTransDetail } from './service';
// import { API_ACCOUNT_LIST, API_OPEN_CITY_ADD, API_OPEN_CITY_UPDATA } from './constant';
import { data1 } from './mock/index';
import SearchForm from './components/SearchForm';
import CreateForm from './components/CreateForm';
import CreditReduceForm from './components/CreditReduceForm';
import './index.less';

const AwardAccountManagement = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRefSearch = useRef(null);
  const downloadRef = useRef(null);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [tableData, setTableData] = useState({});
  const [type, setType] = useState();
  useEffect(() => {
    // if (userApiAuth && userApiAuth[API_ACCOUNT_LIST]) {
    //   getAccountList();
    // }
    getAccountList();
  }, []);

  /**
   * @description: 获取司机账户管理列表
   * @param {*}
   * @return {*}
   */
  const getAccountList = async () => {
    // const res = await accountList()
    const res = data1;
    if (res) {
      setTableData(data1.data);
    }
  };
  /**
   * @description: 查看订单号
   * @param {*}
   * @return {*}
   */
  const checkOrderId = async (record) => {
    const order_id = JSON.parse(record.attach).order_id;
    const params = {
      order_id,
    };
    const res = await showTransDetail(params);
    if (res) {
      const { data } = res;
      if (data) {
        history.push(`/order/order-detail?order_id=${data.oid}`);
      } else {
        return message.error('该订单号不存在请联系管理员');
      }
    }
  };

  /**
   * @description: 显示弹窗
   * @param {*}
   * @return {*}
   */
  const modalChange = (type, record) => {
    setSelectRecord(record);
    setType(type);
  };

  /**
   * @description: 司机退款表格
   * @param {*}
   * @return {*}
   */
  const getDriverTable = (data) => {
    const dataSource =
      data &&
      data.map((item, index) => {
        item.key = index;
        return item;
      });
    const columns = [
      {
        title: '退款说明',
        dataIndex: 'action_type',
        key: 'action_type',
      },
      {
        title: '退款时间',
        dataIndex: '_create_time',
        key: '_create_time',
      },
      {
        title: '退款金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {
          return <span>{(text / 100).toFixed(2)}</span>;
        },
      },
      {
        title: '账户余额（元）',
        dataIndex: 'balance',
        key: 'balance',
        render: (text) => {
          return <span>{(text / 100).toFixed(2)}</span>;
        },
      },
      {
        title: '订单号',
        render: (record) => {
          return (
            <Button onClick={() => checkOrderId(record)} type="link">
              查看订单
            </Button>
          );
        },
      },
    ];

    return (
      <Table
        bordered={false}
        size="small"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
      />
    );
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    values.page_index = current;
    getAccountList(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${tableData.page_info && tableData.page_info.total}条`,
    total: tableData.page_info && tableData.page_info.total,
    pageSize: 10,
    current: tableData.page_info && tableData.page_info.page_index,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '账户ID',
      dataIndex: 'account_id',
      key: 'account_id',
      width: 250,
    },
    {
      title: '账户名称',
      dataIndex: 'account_name',
      key: 'account_name',
    },
    {
      title: '产品线',
      dataIndex: 'product_category',
      key: 'product_category',
      render: (product_category) => <span>{product_category == 1 && '快车'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '创建原因',
      dataIndex: 'desc',
      key: 'desc',
      width: 140,
      ellipsis: true,
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'operator_name',
      key: 'operator_name',
    },
    {
      title: '余额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      key: 'oper',
      width: 250,
      render: (text, record) => (
        <Space>
          <Button
            className="padding-zero"
            type="link"
            onClick={() => modalChange('recharge', record)}
          >
            充值
          </Button>
          <Button className="padding-zero" type="link" onClick={() => modalChange('reduce', record)}>
            减扣
          </Button>
          <Popconfirm
            placement="leftBottom"
            title={<DownloadForm />}
            trigger="click"
            // onConfirm={() => this.confirm(record.account_id)}
          >
            <Button className="padding-zero" type="link">
              下载流水
            </Button>
          </Popconfirm>

          <Button
            className="padding-zero"
            type="link"
            // onClick={() =>
            //   this.modalChange('showOperationLogModal', { ...record, id: record.account_id })
            // }
          >
            操作日志
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer
      title="奖励账户管理"
      extra={
        userApiAuth && [
          <Button onClick={() => setType('add')} icon={<PlusOutlined />} key="1" type="primary">
            创建账户
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData.list}
          size="small"
        />
      </Card>
      <Modal
        title="创建账户"
        visible={type == 'add'}
        onCancel={() => setType()}
        footer={null}
        width={544}
      >
        <CreateForm
          selectRecord={selectRecord}
          getAccountList={getAccountList}
          type={type}
          onCancel={() => setType()}
        />
      </Modal>
      <Modal
        title={type == 'recharge' ? '充值操作' : '减扣操作'}
        visible={type == 'recharge' || type == 'reduce'}
        onCancel={() => setType()}
        footer={null}
        width={544}
      >
        <CreditReduceForm
          selectRecord={selectRecord}
          getAccountList={getAccountList}
          type={type}
          onCancel={() => setType()}
        />
      </Modal>
      <Modal
        title={'司机退款明细'}
        visible={showDriverDetail}
        onCancel={() => setType()}
        footer={null}
        width={544}
      >
        <Row>{getDriverTable()}</Row>
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
          type={8}
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
            {
              title: '工单ID',
              dataIndex: 'op_work_id',
              key: 'op_work_id',
            },
            {
              title: '备注',
              dataIndex: 'op_remarks',
              key: 'op_remarks',
              width: 100,
              render: (text) => {
                return <div>{text}</div>;
              },
            },
          ]}
        />
      </Modal>
    </PageContainer>
  );
};

export default AwardAccountManagement;
