import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { Button, Card, Modal, Table, Space, Tag } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { COUPON_TEXT } from '@/utils/constant';

import { API_SYSTEM_LIST } from './constant';
import { getSystemCouponList } from './service';
import SearchForm from './components/SearchForm';
import TableTitle from './components/TableTitle';
import CreateTicketForm from './components/CreateTicketForm';

const SystemList = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const [type, setType] = useState();
  const [id, setId] = useState();
  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);
  const [dataSource, setDataSource] = useState({});

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_SYSTEM_LIST] && userInfo.agent_type != 3) {
      systemCouponList();
    }
  }, [userApiAuth]);

  // 获取系统优惠券列表
  const systemCouponList = async (params = {}) => {
    setLoading(true);
    const res = await getSystemCouponList(params);
    if (res) {
      setDataSource(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // 添加优惠券
  const showModal = (record, type) => {
    switch (type) {
      case 'new':
        setType(type);
        break;
      case 'check':
        setType(type);
        setId(record.coupon_id);
        break;

      default:
        break;
    }
    setVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    childrenRef.current.onReset();
    setVisible(false);
  };

  // 确定创建系统优惠券
  const handleOk = () => {
    childrenRef.current.onFinish();
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    // console.log(values)
    const parasm = {
      page_no: current,
      ...values,
    };
    // console.log(a)
    systemCouponList(parasm);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '优惠码',
      dataIndex: 'coupon_code',
      align: 'coupon_code',
      key: 'test1',
    },
    {
      title: '面值',
      dataIndex: 'denomination',
      key: 'denomination',
      align: 'center',
      render: (denomination) => {
        return <span>{denomination / 100}元</span>;
      },
    },
    {
      title: '乘客手机号',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'op_user_name',
      key: 'op_user_name',
      align: 'center',
    },
    {
      title: '发放时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      // render: (create_time) => {
      //   return <span>{moment(create_time).format('YYYY-MM-DD')}</span>;
      // },
    },
    {
      title: '到期时间',
      dataIndex: 'end_time',
      key: 'end_time',
      align: 'center',
      render: (end_time) => {
        return (
          <Space>
            <span>{moment(end_time).format('YYYY-MM-DD')}</span>
            <Tag color={moment(end_time).fromNow().indexOf('前') > -1 ? 'red' : 'green'}>
              {moment(end_time).fromNow().indexOf('前') > -1 ? '已过期' : '正常'}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const COLOR = {
          0: '#2db7f5', // 未使用
          1: '#87d068', // 已使用
          2: 'red', // 已过期
        };
        return <Tag color={COLOR[status]}>{COUPON_TEXT[status]}</Tag>;
      },
    },
    {
      title: '使用时间',
      dataIndex: 'used_time',
      key: 'used_time',
      align: 'center',
    },
    {
      title: '订单编号',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      render: (order_id) => {
        return <span>{(order_id == 0 && '--') || order_id}</span>;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <Button onClick={() => showModal(record, 'check')} type="link">
              详情
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="系统发券列表">
      <Card title={<SearchForm ref={childrenRefSearch} systemCouponList={systemCouponList} />}>
        <Table
          title={() => <TableTitle showModal={() => showModal({}, 'new')} />}
          rowKey={(e) => e.coupon_code}
          scroll={{x: 'max-content'}}
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.list}
          pagination={paginationProps}
        />
      </Card>
      {/* 发补偿券 */}
      <Modal
        maskClosable={false}
        width={1000}
        title={type === 'check' ? '补偿券详情' : '添加补偿券'}
        visible={visible}
        footer={
          type == 'new'
            ? [
                <Button key="back" onClick={handleCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  确定
                </Button>,
              ]
            : null
        }
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CreateTicketForm
          id={type === 'check' ? id : null}
          systemCouponList={systemCouponList}
          handleCancel={handleCancel}
          ref={childrenRef}
          type={type}
        />
      </Modal>
    </PageContainer>
  );
};

export default SystemList;
