/* 操作历史组件 */
import React, { useEffect } from 'react';
import { Table, Row } from 'antd';
import moment from 'moment';
import OpTable from '@/components/OpTable';
const OperationHistory = (props) => {
  const { tableLoading, operationLogtData, getOrderOperationLog } = props;

  useEffect(() => {
    getOrderOperationLog();
  }, []);

  const columns = [
    {
      title: '操作内容',
      dataIndex: 'op_type_txt',
      key: 'op_type_txt',
      width: 150

    },
    {
      title: '工单编号',
      dataIndex: 'op_work_id',
      key: 'op_work_id',
      sorter: (a, b) => a.op_work_id - b.op_work_id,
      width: 150

    },
    {
      title: '操作人',
      dataIndex: 'op_user_name',
      key: 'op_user_name',
      width: 150
    },
    {
      title: '操作时间',
      dataIndex: 'op_time',
      key: 'op_time',
      width: 160,
      sorter: (a, b) => moment(a.op_time) - moment(b.op_time),
    },
    {
      title: '具体原因',
      dataIndex: 'op_reasons',
      key: 'op_reasons',
      ellipsis: true,
      width: 150,
      render: (text) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '操作记录',
      dataIndex: 'oplog',
      key: 'oplog',
      className: 'opStyle',
      // width: 640,
      render: (text, record) => {
        if (record.op_type_txt === '免单操作') {
          const { op_result, op_status } = record;
          return (
            <Row className="beforeSubmit">
              <OpTable op_result={op_result} op_status={op_status} type="freeCharge" />
            </Row>
          );
        }
        if (record.op_type_txt === '关单操作') {
          const { op_result, op_status } = record;
          return (
            <Row className="beforeSubmit">
              <OpTable op_result={op_result} op_status={op_status} type="finish" />
            </Row>
          );
        }
        if (record.op_type_txt === '改价操作') {
          const { op_before, op_submit, op_status, op_result } = record;
          return (
            <Row className="beforeSubmit">
              <OpTable
                op_before={op_before}
                op_status={op_status}
                op_result={op_result}
                op_submit={op_submit}
                type="changePrice"
              />
            </Row>
          );
        }
        if (record.op_type_txt === '退款操作') {
          const { op_before, op_submit, op_status, op_result } = record;
          return (
            <Row
              style={{
                display: 'flex',
              }}
              className="beforeSubmit"
            >
              <OpTable
                op_before={op_before}
                op_status={op_status}
                op_result={op_result}
                op_submit={op_submit}
                type="refund"
              />
            </Row>
          );
        }
        return '';
      },
    },
  ];

  return (
    <div className="operationHistory">
      <Table
        pagination={operationLogtData.length > 20 || false}
        loading={tableLoading}
        // scroll={{x: 'max-content'}}
        bordered
        columns={columns}
        dataSource={operationLogtData}
      />
    </div>
  );
};

export default OperationHistory;
