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

import _ from 'lodash';
import { history } from 'umi';

import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';
import { accountShowTrans, showTransDetail } from './service';
// import { API_ACCOUNT_LIST, API_OPEN_CITY_ADD, API_OPEN_CITY_UPDATA } from './constant';
import { data1 } from './mock/index';
import SearchForm from './components/SearchForm';
import CreateForm from './components/CreateForm';
import DownloadForm from './components/DownloadForm';
import './index.less';

const DriverManage = () => {
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
   * @description: 操作选项
   * @param {*}
   * @return {*}
   */
  const operatingOptions = (record, type) => {
    setType(type);
    setSelectRecord(record);
  };
  /**
   * @description: 下载流水
   * @param {*}
   * @return {*}
   */
  const confirm = async (id) => {
    const values = await downloadRef.current.validateFields();
    const { time } = values;
    const start_date = time[0] && time[0].format('YYYY-MM-DD HH:mm:ss');
    const end_date = time[1] && time[1].format('YYYY-MM-DD HH:mm:ss');
    window.location.href = `${window.location.origin}/workbench/v1/account/trans/index?driver_id=${id}
    &start_date=${start_date}&end_date=${end_date}`;
  };
  /**
   * @description: 查看退款明细
   * @param {*}
   * @return {*}
   */
  const confirmDriverRefund = async (id) => {
    const values = await downloadRef.current.validateFields();
    const { time } = values;
    const start_date = time[0] && time[0].format('YYYY-MM-DD HH:mm:ss');
    const end_date = time[1] && time[1].format('YYYY-MM-DD HH:mm:ss');
    const params = {
      driver_id: id,
      limit: 100,
      start_date: start_date,
      end_date: end_date,
    };
    const res = await accountShowTrans(params);
    if (res) {
      setShowDriverDetail(true);
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
    showTotal: () => `共${tableData.total}条`,
    total: tableData.total,
    pageSize: 10,
    current: tableData.page_index,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '司机ID',
      dataIndex: 'driver_id',
      key: 'driver_id',
    },
    {
      title: '司机手机号',
      dataIndex: 'cell',
      key: 'cell',
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <>
            {status == 0 && <Tag color="green">正常</Tag>}
            {status == 1 && <Tag color="#aaa">冻结</Tag>}
          </>
        );
      },
    },
    {
      title: '账户余额',
      dataIndex: 'real_balance',
      key: 'real_balance',
    },

    {
      title: '操作',
      width: 300,
      render: (record) => (
        <Space>
          <Button
            className="padding-zero"
            onClick={(record) => operatingOptions(record, 'award')}
            type="link"
          >
            奖励
          </Button>
          <Button
            className="padding-zero"
            onClick={(record) => operatingOptions(record, 'penalty')}
            type="link"
          >
            惩罚
          </Button>
          <Popconfirm
            placement="leftBottom"
            title={<DownloadForm ref={downloadRef} />}
            onConfirm={(record) => confirm(record.driver_id)}
          >
            <Button className="padding-zero" type="link">
              下载流水
            </Button>
          </Popconfirm>
          <Popconfirm
            placement="leftBottom"
            title={<DownloadForm ref={downloadRef} />}
            onConfirm={(record) => confirmDriverRefund(record.driver_id)}
          >
            <Button className="padding-zero" type="link">
              查看退款
            </Button>
          </Popconfirm>

          <Button className="padding-zero" type="link">
            操作日志
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer title="司机账户管理">
      <Card title={<SearchForm ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.driver_id}
          bordered
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData.info}
          size="small"
        />
      </Card>
      <Modal
        title={type == 'award' ? '奖励' : '惩罚'}
        visible={type == 'award' || type == 'penalty'}
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

export default DriverManage;
