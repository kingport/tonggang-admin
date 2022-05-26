import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Space, Popconfirm, message, Table, Modal, Form, Input } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { CONFIG_PASSENGER_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';
import { history } from 'umi';

import { API_FLY_ORDER_LIST, API_HANDLE_FLY_ORDER } from './constant';
import { flyOrderList, setInvitationEntranceStatus, handleFlyOrder } from './service';
import SearchForm from './components/SearchForm';
// import CreateCityForm from './components/CreateCityForm';
const { TextArea } = Input;
const RiskControl = () => {
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
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_FLY_ORDER_LIST]) {
      getFlyOrderList();
    }
  }, []);

  /**
   * @description: 获取飞单列表
   * @param {object} params 参数
   * @return {*}
   */
  const getFlyOrderList = async (param = {}) => {
    setLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await flyOrderList(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };

  /**
   * @description: 飞单处理备注
   * @param {*}
   * @return {*}
   */
  const setHandleFlyOrder = async (params) => {
    const res = await handleFlyOrder(params);
    if (res) {
      message.success('操作成功');
      setVisible(false);
      getFlyOrderList();
    }
  };

  /**
   * @description:  处理订单备注
   * @param {*}
   * @return {*}
   */
  const remarkOrder = (record) => {
    setSelectRecord(record);
    setVisible(true);
  };

  // 确定
  const handleOk = () => {
    const values = form.getFieldsValue();
    const params = {
      fly_order_id: selectRecord.fly_order_id,
      ...values,
    };
    setHandleFlyOrder(params);
  };

  // 分页
  const changePage = async (current) => {
    const params = {
      page_index: current,
    };
    getFlyOrderList(params);
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
      title: '订单号',
      key: 'fly_order_id',
      dataIndex: 'fly_order_id',
      align: 'center',
    },
    {
      title: '城市',
      key: 'code',
      dataIndex: 'code',
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
      title: '司机接单',
      key: 'take_time',
      dataIndex: 'take_time',
      align: 'center',
    },
    {
      title: '服务结束',
      key: 'serve_time',
      dataIndex: 'serve_time',
      align: 'center',
    },
    {
      title: '司机',
      key: 'driver_name',
      dataIndex: 'driver_name',
      align: 'center',
    },
    {
      title: '手机号',
      key: 'cell',
      dataIndex: 'cell',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return <span>{status == 1 ? '未处理' : '已处理'}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'left',
      width: 200,
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {
              <Button
                className="padding-zero"
                onClick={() => history.push(`/order/order-detail?order_id=${record.fly_order_id}`)}
                type="link"
              >
                查看订单
              </Button>
            }

            {record.status == 1 &&
              userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_FLY_ORDER_LIST] && (
                <Button className="padding-zero" onClick={() => remarkOrder(record)} type="link">
                  处理完成
                </Button>
              )}

            <Button className="padding-zero" onClick={() => showOperationLog(record)} type="link">
              操作日志
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer title="飞单列表">
      <Card title={<SearchForm ref={childrenRefSearch} getFlyOrderList={getFlyOrderList} />}>
        <Table
          rowKey={(e) => e.fly_order_id}
          bordered
          size="small"
          scroll={{x: 'max-content'}}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info || []}
          pagination={paginationProps}
        />
      </Card>
      {/* 新增城市弹窗 */}
      <Modal
        maskClosable={false}
        width={400}
        title="确定已处理完成？"
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form}>
          <Form.Item name="remark">
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
          id={selectRecord && selectRecord.fly_order_id}
          type={20}
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
export default RiskControl;
