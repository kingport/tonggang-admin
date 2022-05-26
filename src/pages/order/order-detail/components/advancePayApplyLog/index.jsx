/* 垫付记录 */
import React, { useState, useRef, useEffect } from 'react';
import { Table, Row } from 'antd';
import { advanceFlow } from '../../service';

const AdvancePayApplyLog = (props) => {
  const { order_id } = props.orderData;
  const [tableLoading, setTableLoading] = useState(false);
  const [operationLogtData, setOperationLogtData] = useState([]);
  useEffect(() => {
    getAdvancePayApplyLog();
  }, []);

  /**
   * @description: 获取订单操作日志列表，操作时调用
   * @param {*}
   * @return {*}
   */
  const getAdvancePayApplyLog = async () => {
    setTableLoading(true);
    const params = {
      oid: order_id,
      caller: 'workbench',
    };
    const res = await advanceFlow(params);
    if (res) {
      const { data = [] } = res;
      const dataSource = data.map((item, index) => {
        item.key = index;
        return item;
      });
      setOperationLogtData(dataSource);
    }
    setTableLoading(false);
  };
  const columns = [
    {
      title: '操作时间',
      dataIndex: '_create_time',
      key: '_create_time',
      render: (text) => {
        if (text == '1971-01-01 00:00:00') {
          return '';
        }
        return text;
      },
    },
    {
      title: '申请垫付金额（元）',
      dataIndex: 'advance_pay_total',
      key: 'advance_pay_total',
    },
    {
      title: '附加费用（元）',
      dataIndex: 'other_pay',
      key: 'other_pay',
      render: (text, record) => {
        if (record.extra_info && record.extra_info.length > 0) {
          let extra_info = JSON.parse(record.extra_info);
          let other_pay = 0;
          for (let key in extra_info) {
            other_pay += Number(extra_info[key]);
          }
          other_pay = other_pay.toFixed(2);
          return other_pay;
        }
        return '';
      },
    },
    {
      title: '操作员',
      dataIndex: 'audit_user_name',
      key: 'audit_user_name',
    },
    {
      title: '审核状态',
      dataIndex: 'advance_audit_status',
      key: 'advance_audit_status',
      render: (text, record) => (
        <Row>
          <span style={{ color: '#189FFF' }}>
            {record.advance_audit_status == 1 ? '待审核' : ''}
          </span>
          <span style={{ color: '#FF151F' }}>
            {record.advance_audit_status == 2 ? '已驳回' : ''}
          </span>
          <span style={{ color: '#4ECE3D' }}>
            {record.advance_audit_status == 3 ? '已垫付' : ''}
          </span>
          <span>{record.advance_audit_status == 4 ? '乘客已支付' : ''}</span>
        </Row>
      ),
    },
    {
      title: '备注',
      dataIndex: 'advance_audit_status_msg',
      key: 'advance_audit_status_msg',
    },
  ];

  return (
    <div className="advancePayApplyLog">
      <Table
        pagination={operationLogtData.length > 20 || false}
        loading={tableLoading}
        bordered
        columns={columns}
        dataSource={operationLogtData}
      />
    </div>
  );
};

export default AdvancePayApplyLog;
