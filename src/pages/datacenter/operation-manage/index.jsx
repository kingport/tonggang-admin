import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, message, Table, Tag, Modal, Form, Input, Space } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { RISK_CONTROL_CANCEL } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';
import { history } from 'umi';
import { API_CACEL_ORDER_LIST, API_SET_ORDER } from './constant';
import { cancelOrderJudgeList, cancelOrderJudge } from './service';
import SearchForm from './components/SearchForm';

const { TextArea } = Input;

const OperationManage = () => {
  const childrenRefSearch = useRef(null);

  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();

  useEffect(() => {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_CACEL_ORDER_LIST]) {
      getCancelOrderJudgeList();
    }
  }, []);

  /**
   * @description: 获取取消订单判责列表
   * @param {object} params 参数
   * @return {*}
   */
  const getCancelOrderJudgeList = async (param = {}) => {
    setLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await cancelOrderJudgeList(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };

  /**
   * @description:  判定弹窗
   * @param {*}
   * @return {*}
   */
  const judgeModal = (record) => {
    setSelectRecord(record);
    setVisible(true);
  };

  // 确定改判
  const handleOk = async () => {
    const values = form.getFieldsValue();
    const params = {
      order_id: selectRecord.order_id,
      status: 2,
      ...values,
    };
    const res = await cancelOrderJudge(params);
    if (res) {
      message.success('操作成功');
      getCancelOrderJudgeList();
      setVisible(false);
    }
  };

  // 分页
  const changePage = async (current) => {
    const params = {
      page_index: current,
    };
    getCancelOrderJudgeList(params);
  };
  // 分页
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    pageSize: 10,
    current: dataSource.pageIndex,
    onChange: (current) => changePage(current),
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    // console.log(record);
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  const columns = [
    {
      title: '日期',
      key: 'order_id',
      dataIndex: 'order_id',
      align: 'center',
    },
    {
      title: '城市',
      key: 'area',
      dataIndex: 'area',
      align: 'center',
      render: (code) => {
        let cityName = '';
        if (cityCountyList && cityCountyList.find((x) => x.city == code)) {
          cityName = cityCountyList.find((x) => x.city == code).city_name;
        }
        return <span>{cityName}</span>;
      },
    },
    {
      title: '租赁公司',
      key: 'driver_phone',
      dataIndex: 'driver_phone',
      align: 'center',
    },
    {
      title: 'GMV',
      key: 'starting_name',
      dataIndex: 'starting_name',
      align: 'center',
    },
    {
      title: '应答数',
      key: 'dest_name',
      dataIndex: 'dest_name',
      align: 'center',
    },
    {
      title: '完单率',
      key: 'assigned_time',
      dataIndex: 'assigned_time',
      align: 'center',
    },
    {
      title: '接单后司机取消率',
      key: 'cancelled_time',
      dataIndex: 'cancelled_time',
      align: 'center',
    },
    {
      title: '在线司机数',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '接单司机数',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '完单司机数',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
  ];
  return (
    <PageContainer title="运营概况">
      <Card
        title={
          <SearchForm ref={childrenRefSearch} getCancelOrderJudgeList={getCancelOrderJudgeList} />
        }
      >
        <Table
          rowKey={(e) => e.order_id}
          bordered
          size="small"
          scroll={{x: 'max-content'}}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info || []}
          pagination={paginationProps}
        />
      </Card>
      {/* 判责弹窗 */}
      <Modal
        maskClosable={false}
        width={400}
        title="改判为无责？"
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="remark" label={<Tag color="red">请谨慎处理，只可操作一次改判！</Tag>}>
            <TextArea placeholder="选填，在此处输入备注内容" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 操作日志 */}
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.order_id}
          type={21}
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
          ]}
        />
      </Modal>
    </PageContainer>
  );
};
export default OperationManage;
