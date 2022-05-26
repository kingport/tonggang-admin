import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Result, Tag, Table } from 'antd';
import { history, connect } from 'umi';
import { useDispatch } from 'dva';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import { getDriverBandding } from './service';
import SearchForm from './components/SearchForm';

const InvitedPassengerList = (props) => {
  const childrenRef = useRef(null);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { driverPhone } = props;

  // 如果有手机号缓存
  useEffect(() => {
    if (driverPhone) {
      childrenRef.current.setPhone();
      const params = {
        driver_phone: driverPhone,
      };
      driverBandding(params);
    }
  }, []);

  /**
   * @description: 获取司机查询列表
   * @param {object} params 参数
   * @return {*}
   */
  const driverBandding = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getDriverBandding(params);
      if (res && res.data) {
        // 缓存手机号
        dispatch({
          type: 'global/saveDriverPhone',
          payload: { driverPhone: params.driver_phone },
        });
        let list = [];
        list.push(res.data);
        setDataSource(list);
        setLoading(false);
      } else {
        setDataSource([]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 表格配置项
  const columns = [
    {
      title: '邀请者身份',
      align: 'center',
      render: () => {
        return <Tag color="#87d068">司机</Tag>;
      },
    },
    {
      title: '邀请好友数',
      align: 'center',
      render: (record) => {
        return (
          <span>
            {record.effect_count * 1 + record.expired_count * 1 + record.invain_count * 1}
          </span>
        );
      },
    },
    {
      title: '生效中好友',
      dataIndex: 'effect_count',
      key: 'effect_count',
      align: 'center',
    },
    {
      title: '邀请未打车好友数',
      dataIndex: 'invain_count',
      key: 'invain_count',
      align: 'center',
    },
    {
      title: '已失效好友数',
      dataIndex: 'expired_count',
      key: 'expired_count',
      align: 'center',
    },
    {
      title: '累计奖励（元）',
      dataIndex: 'total_fee',
      key: 'total_fee',
      align: 'center',
      render: (total_fee) => {
        return <span>{total_fee / 100}</span>;
      },
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <div>
            <Button
              onClick={() => history.push(`/capacity/invited-passenger-detail/${record.driver_id}`)}
              type="link"
            >
              查看明细
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="邀请乘客列表">
      <Card
        title={
          <SearchForm ref={childrenRef} driverPhone={driverPhone} driverBandding={driverBandding} />
        }
      >
        {!dataSource && <Result title="请输入手机号进行查询" />}
        {dataSource && (
          <Table
            rowKey={(e) => e.invain_count}
            bordered
            size="small"
            loading={loading}
            columns={columns}
            dataSource={dataSource || []}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  driverPhone: global.driverPhone,
}))(InvitedPassengerList);
