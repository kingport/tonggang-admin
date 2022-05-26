import React, { useState, useEffect } from 'react';
import { Card, Table, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { COUPON_TEXT, COUPON_TYPE } from '@/utils/constant';
import { checkActivity, getCouponList } from './service';
import SearchForm from './components/SearchForm';
import TableTitle from './components/TableTitle';
import CardGrid from './components/CardGrid';

const Detail = (props) => {
  const { id } = props.match.params;

  const [detail, setDetail] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [activityId] = useState(id);

  useEffect(() => {
    getDetail();
    const params = {
      activity_id: activityId,
    };
    couponList(params);
  }, []);

  /**
   * @description: 获取优惠券详情
   * @param {string} activity_id 活动id
   * @return {object} res
   */
  const getDetail = async () => {
    const params = {
      activity_id: activityId,
    };
    const res = await checkActivity(params);
    setDetail(res.data);
  };

  /**
   * @description: 获取优惠券使用列表
   * @param {object} params 参数
   * @return {object} res
   */
  const couponList = async (params) => {
    const res = await getCouponList(params);
    if (res) {
      setDataSource(res.data);
    }
  };

  /**
   * @description: 分页请求优惠券列表
   * @param {number} current 请求页数
   * @return {object} res
   */
  const changePage = (current) => {
    const parasm = {
      page_no: current,
      activity_id: activityId,
    };
    couponList(parasm);
  };

  /**
   * @constant {object}
   * @desc 页脚
   */
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current,
    onChange: (current) => changePage(current),
  };

  /**
   * @constant {Array}
   * @desc 表格列配置项
   */
  const columns = [
    {
      title: '优惠码',
      dataIndex: 'coupon_code',
      key: 'coupon_code',
      align: 'center',
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
      title: '领取会员',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '领取方式',
      dataIndex: 'coupon_type',
      key: 'coupon_type',
      align: 'center',
      render: (coupon_type) => {
        return <span>{COUPON_TYPE[coupon_type]}</span>;
      },
    },
    {
      title: '领取时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return <span>{COUPON_TEXT[status]}</span>;
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
    },
  ];
  return (
    <PageContainer onBack={() => window.history.back()} title="优惠券明细">
      <Space style={{ width: '100%' }} direction="vertical">
        <CardGrid detail={detail} />
        <Card title={<SearchForm activityId={activityId} couponList={couponList} />}>
          <Table
            title={() => <TableTitle />}
            rowKey={(e) => e.coupon_code}
            bordered
            size="small"
            columns={columns}
            dataSource={dataSource.list}
            pagination={paginationProps}
          />
        </Card>
      </Space>
    </PageContainer>
  );
};

export default Detail;
