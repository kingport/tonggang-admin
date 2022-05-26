/* 子table组件 */
import React from 'react';
import { Table, Descriptions } from 'antd';

const { Item: DescriptionsItem } = Descriptions;

class OpTable extends React.PureComponent {
  state = {
    tableData: [
      {
        driverOld: '',
        passengerOld: '',
        driverNew: '',
        passengerNew: '',
        driverRefund: '',
        passengerRefund: '',
        opResult: '',
      },
    ],
  };

  // paramList
  paramList = (params = []) => {
    return params.map((item) => {
      const { name, value } = item;
      return <DescriptionsItem key={name} label={name}>{`${value || 0}元`}</DescriptionsItem>;
    });
  };

  // 获取表格
  getTable = () => {
    const { tableData } = this.state;
    // 传入的操作前后数据
    const { type, op_before = {}, op_submit = {}, op_status, op_result, op_type_txt } = this.props;
    const dataSource = tableData.map((item, index) => {
      item.key = index;
      return item;
    });

    // 表格
    let columns = [];
    // 关单
    if (type === 'finish') {
      columns = [
        {
          title: '操作',
          dataIndex: 'op',
          key: 'op',
          width: 560,
          render: () => '结束订单',
        },
        {
          title: '操作结果',
          dataIndex: 'opResult',
          key: 'opResult',
          width: 80,
          render: () => {
            const result = op_status ? '成功' : '失败';
            return (
              <>
                <div>{result}</div>
                {op_result && <div>{`(${op_result})`}</div>}
              </>
            );
          },
        },
      ];
    }
    // 免单
    if (type === 'freeCharge') {
      columns = [
        {
          title: '操作',
          dataIndex: 'op',
          key: 'op',
          width: 560,
          render: () => '免支付订单',
        },
        {
          title: '操作结果',
          dataIndex: 'opResult',
          key: 'opResult',
          width: 80,
          render: () => {
            const result = op_status ? '成功' : '失败';
            return (
              <>
                <div>{result}</div>
                {op_result && <div>{`(${op_result})`}</div>}
              </>
            );
          },
        },
      ];
    }
    if (type === 'changePrice') {
      columns = [
        {
          title: '改价前',
          children: [
            {
              title: '乘客',
              dataIndex: 'passengerOld',
              key: 'passengerOld',
              width: 140,
              render: () => {
                const { passenger_bill } = op_before;
                return (
                  <Descriptions size="small" column={1}>
                    {this.paramList(passenger_bill)}
                  </Descriptions>
                );
              },
            },
            {
              title: '司机',
              dataIndex: 'driverOld',
              key: 'driverOld',
              width: 140,
              render: () => {
                const { driver_bill } = op_before;
                return (
                  <Descriptions size="small" column={1}>
                    {this.paramList(driver_bill)}
                  </Descriptions>
                );
              },
            },
          ],
        },
        {
          title: '改价后',
          children: [
            {
              title: '乘客',
              dataIndex: 'passengerNew',
              key: 'passengerNew',
              width: 140,
              render: () => {
                const { passenger_bill } = op_submit;
                return (
                  <Descriptions size="small" column={1}>
                    {this.paramList(passenger_bill)}
                  </Descriptions>
                );
              },
            },
            {
              title: '司机',
              dataIndex: 'driverNew',
              key: 'driverNew',
              width: 140,
              render: () => {
                const { driver_bill } = op_submit;
                return (
                  <Descriptions size="small" column={1}>
                    {this.paramList(driver_bill)}
                  </Descriptions>
                );
              },
            },
          ],
        },
        {
          title: '操作结果',
          dataIndex: 'opResult',
          key: 'opResult',
          width: 80,
          render: () => {
            const result = op_status ? '成功' : '失败';
            return (
              <>
                <div>{result}</div>
                {op_result && <div>{`(${op_result})`}</div>}
              </>
            );
          },
        },
      ];
    }

    // 退款表格
    if (type === 'refund') {
      columns = [
        {
          title: '乘客',
          dataIndex: 'passengerRefund',
          key: 'passengerRefund',
          width: 280,
          render: () => {
            const { refund_info = [] } = op_submit;
            const data = refund_info.filter((item) => item.name === '乘客退款')[0] || {};
            return `${data.value || 0}元`;
          },
        },
        {
          title: '司机',
          dataIndex: 'driverRefund',
          key: 'driverRefund',
          width: 280,
          render: () => {
            const { refund_info = [] } = op_submit;
            const data = refund_info.filter((item) => item.name === '司机扣款')[0] || {};
            return `${data.value || 0}元`;
          },
        },
        {
          title: '操作结果',
          dataIndex: 'opResult',
          key: 'opResult',
          width: 80,
          render: () => {
            const result = op_status ? '成功' : '失败';
            return (
              <>
                <div>{result}</div>
                {op_result && <div>{`(${op_result})`}</div>}
              </>
            );
          },
        },
      ];
    }

    // 资产普通表格
    if (type === 'normal') {
      columns = [
        {
          title: '操作',
          dataIndex: 'op',
          key: 'op',
          width: 200,
          render: () => op_type_txt,
        },
        {
          title: '操作结果',
          dataIndex: 'opResult',
          key: 'opResult',
          width: 80,
          render: () => {
            const result = op_status ? '成功' : '失败';
            return (
              <>
                <div>{result}</div>
                {op_result && <div>{`(${op_result})`}</div>}
              </>
            );
          },
        },
      ];
    }

    return (
      <Table scroll={{x: 'max-content'}} size="middle" pagination={false} bordered={false} columns={columns} dataSource={dataSource} />
    );
  };

  render() {
    return <>{this.getTable()}</>;
  }
}

export default OpTable;
