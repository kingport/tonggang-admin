/* 操作日志组件 */
import React from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { getOrderOperationLog } from '@/services/login';

class OperationLogModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLogLoading: false, // 表格加载
      logData: [], // 表格数据
    };
  }

  componentDidMount() {
    const { selectRecord, type, id } = this.props;
    const params = {
      op_res_id: id || '',
      op_res_type: type || '',
    };
    // 获取日志
    this.setState({ tableLogLoading: true });
    getOrderOperationLog(params).then((res) => {
      if (res) {
        this.setState({
          logData: res.data || [],
          tableLogLoading: false,
        });
      }
    });
  }

  // 获取表格
  getTable = () => {
    const { addColumns = [] } = this.props;
    const { tableLogLoading, logData } = this.state;
    const dataSource = logData.map((item, index) => {
      item.key = index;
      return item;
    });

    // 操作内容是op_reasons优先，为空用op_remarks
    const columns = [
      {
        title: '操作人',
        dataIndex: 'op_user_name',
        key: 'op_user_name',
      },
      {
        title: '操作时间',
        dataIndex: 'op_time',
        key: 'op_time',
        sorter: (a, b) => moment(a.op_time) - moment(b.op_time),
      },
      {
        title: '操作内容',
        dataIndex: 'op_reasons',
        key: 'op_reasons',
        render: (text, record) => {
          return (
            <>
              <div>
                {record.op_reasons && record.op_reasons.trim() != ''
                  ? record.op_reasons
                  : record.op_remarks && record.op_remarks.trim() != ''
                  ? record.op_remarks
                  : record.op_type_txt && record.op_type_txt.trim() != ''
                  ? record.op_type_txt
                  : ''}
              </div>
            </>
          );
        },
      },
    ];

    return (
      <Table
        loading={tableLogLoading}
        bordered={false}
        size="middle"
        pagination={logData.length > 10}
        columns={[...columns, ...addColumns]}
        dataSource={dataSource}
      />
    );
  };

  render() {
    return <div style={{ minHeight: 200 }}>{this.getTable()}</div>;
  }
}

export default OperationLogModal;
