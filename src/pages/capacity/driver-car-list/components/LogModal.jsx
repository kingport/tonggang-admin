import React, { useState, useImperativeHandle, useEffect, forwardRef } from 'react';
import { Table, Form } from 'antd';
import moment from 'moment';
import { driverLogs } from '../service';

const LogModal = (props, ref) => {
  const [tableLogLoading, setTableLogLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { selectRecord } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    getDriverLogs();
  }, []);

  // useImperativeHandle(ref, () => ({
  //   onFinish: () => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         const { selectDriver } = props;
  //         // 司机id
  //         values.driver_id = selectDriver.driver_id;
  //         values.freeze_status = 1;
  //         setFreezeAccount(values);
  //       })
  //       .catch((info) => {
  //         console.log('Validate Failed:', info);
  //       });
  //   },
  //   onReset: () => {},
  // }));

  // 司机操作日志
  const getDriverLogs = async () => {
    const params = {
      gvid: selectRecord.gvid,
    };
    setTableLogLoading(true);
    const res = await driverLogs(params);
    if (res) {
      setDataSource(res.data);
      setTableLogLoading(false);
    }
  };

  //表格配置项
  const columns = [
    {
      title: '操作人',
      dataIndex: 'op_user_name',
      key: 'op_user_name',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'op_time',
      key: 'op_time',
      width: 200,
      sorter: (a, b) => moment(a.op_time) - moment(b.op_time),
    },
    {
      title: '操作内容',
      dataIndex: 'op_reasons',
      key: 'op_reasons',
      render: (text, record) => {
        return (
          <>
            <div>{text || record.op_reasons}</div>
          </>
        );
      },
    },
  ];

  return (
    <Table
      rowKey={(x) => x.op_id}
      loading={tableLogLoading}
      bordered
      size="middle"
      columns={[...columns]}
      dataSource={dataSource}
    />
  );
};
export default forwardRef(LogModal);
