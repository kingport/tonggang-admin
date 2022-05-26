import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  Modal,
  Popconfirm,
  message,
  Table,
  Tag,
  Form,
  Input,
  Space,
  Select,
} from 'antd';
import { history } from 'umi';
import { useSelector } from 'dva';
// import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import { ORDER_CENTER_CHANNEL, ORDER_CENTER_ADVANCE } from '@/utils/constant';
import SearchForm from './components/SearchForm';
import RejectModal from './components/RejectModal';
import {
  advanceList,
  advancecommit,
  usersList,
  saveRemark,
  batchSetSpecificUser,
  advancepayLogs,
} from './service';
import {
  API_ORDER_ADVANCELIST,
  API_ORDER_DETAIL,
  API_ORDER_REJECT,
  API_ORDER_COMMIT,
} from './constant.js';
const { TextArea } = Input;
const { Option } = Select;

const AdvancepayList = () => {
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const childrenRefSearch = useRef(null);
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState({});
  const [userData, setUserData] = useState([]);
  const [payStatusMap] = useState({
    0: '未支付',
    1: '已支付',
  });
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [showRemark, setShowRemark] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectUser, setSelectUser] = useState(null);

  const [showLog, setShowLog] = useState(false);
  const [dataSourceLog, setDataSourceLog] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    if (userApiAuth && userApiAuth[API_ORDER_ADVANCELIST] && userInfo && userInfo.agent_type == 0) {
      async function fetchData() {
        const values = await childrenRefSearch.current.validateFields();
        getAdvanceList(values);
      }
      fetchData();
      getUserList();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo, userApiAuth]);

  /**
   * @description: 获取垫付列表
   * @param {*}
   * @return {*}
   */
  const getAdvanceList = async (parasm = {}) => {
    setLoading(true);
    const res = await advanceList(parasm);
    if (res) {
      const { data } = res;
      if (data) {
        data.list.map((x, index) => {
          x.serial = index + 1 + 10 * (data.page_no * 1 - 1);
          x.key = x.order_id;
        });
        setDataSource(res.data);
      }
    }
    setLoading(false);
  };

  /**
   * @description: 确认垫付订单
   * @param {object} record 选中该订单的信息
   * @return {*}
   */
  const confirm = async (record) => {
    const params = {
      oid: record.order_id,
      passenger_id: record.passenger_id,
      advance_audit_status_msg: '',
    };
    const res = await advancecommit(params);
    if (res) {
      message.success('操作成功!');
      getAdvanceList();
    }
  };
  /**
   * @description: 垫付驳回
   * @param {object}record 选中该订单的信息
   * @return {*}
   */
  const showRejectModal = async (record) => {
    setShowReject(true);
    setSelectRecord(record);
  };
  /**
   * @description: 备注
   * @param {object}record 选中该订单的信息
   * @return {*}
   */
  const showRemarkModal = async (record) => {
    setShowRemark(true);
    setSelectRecord(record);
  };

  /**
   * @description:  获取处理人列表
   * @param {*}
   * @return {*}
   */
  const getUserList = async (params = {}) => {
    const res = await usersList(params);
    if (res) {
      setUserData(res.data);
    }
  };

  /**
   * @description: 备注
   * @param {*}
   * @return {*}
   */
  const optRemarks = async () => {
    const values = await form.getFieldsValue();
    if (values.remark) {
      const order_id = selectRecord.order_id;
      const params = {
        ...values,
        order_id,
      };
      const res = await saveRemark(params);
      if (res) {
        message.success('操作成功');
        setShowRemark(false);
        getAdvanceList();
      }
    }
  };

  /**
   * @description: 选中
   * @param {*}
   * @return {*}
   */
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * @description: 批量管理
   * @param {*}
   * @return {*}
   */
  const batchManage = async () => {
    if (selectUser) {
      const params = {
        order_ids: JSON.stringify(selectedRowKeys),
        user_id: selectUser,
      };

      const res = await batchSetSpecificUser(params);
      if (res) {
        message.success('操作成功');
        getAdvanceList();
        setSelectedRowKeys([]);
      }
    }
  };

  /**
   * @description: 选中处理人
   * @param {*}
   * @return {*}
   */
  const selcetBatchUser = (userId) => {
    if (userId) {
      setSelectUser(userId);
    }
  };

  /**
   * @description: 显示操作日志
   * @param {*}
   * @return {*}
   */
  const showLogModal = async (record) => {
    setShowLog(true);
    const params = {
      order_id: record.order_id,
    };
    const res = await advancepayLogs(params);
    if (res) {
      const { data = [] } = res;
      setDataSourceLog(data);
    }
  };

  /**
   * @description: 获取日志
   * @param {*}
   * @return {*}
   */
  const getTable = () => {
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
        // sorter: (a, b) => moment(a.op_time) - moment(b.op_time),
      },
      {
        title: '操作内容',
        dataIndex: 'op_reasons',
        key: 'op_reasons',
        render: (text, record) => {
          return (
            <>
              <div>{text || record.op_remarks}</div>
            </>
          );
        },
      },
    ];

    return (
      <Table
        rowKey={(e) => e.op_id}
        // loading={tableLogLoading}
        bordered={false}
        size="middle"
        pagination={dataSourceLog.length > 10}
        columns={columns}
        dataSource={dataSourceLog}
      />
    );
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    delete values.time;
    const params = {
      page_no: current,
      ...values,
    };
    getAdvanceList(params);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    // pageSize: 10,
    current: dataSource.page_no * 1,
    onChange: (current) => changePage(current),
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'serial',
      // width: 50,
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: '_create_time',
      // width: 150,
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'audit_time',
      align: 'center',
      // width: 150,
      render: (text) => {
        if (text == '1971-01-01 00:00:00') {
          return '';
        }
        return text;
      },
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
      align: 'center',
    },
    {
      title: '城市',
      dataIndex: 'area',
      // width: 80,
      align: 'center',
      render: (text) => {
        const data = (cityCountyList && cityCountyList.find((item) => item.city == text)) || {};
        return <span>{data.city_name}</span>;
      },
    },
    {
      title: '司机手机号码',
      dataIndex: 'driver_phone',
      align: 'center',
      // width: 120,
    },
    {
      title: '乘客手机号码',
      dataIndex: 'passenger_phone',
      align: 'center',
      // width: 120,
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      align: 'center',
      // width: 80,

      render: (text) => {
        const typeMap = {
          0: '实时',
          1: '预约',
        };
        return typeMap[text];
      },
    },
    {
      title: '呼叫类型',
      dataIndex: 'channel',
      align: 'center',
      // width: 100,
      render: (text) => {
        return ORDER_CENTER_CHANNEL[text].value;
      },
    },
    {
      title: '申请垫付金额（元）',
      dataIndex: 'total_fee',
      align: 'center',
      // width: 80,
    },
    {
      title: '附加费用（元）',
      align: 'center',
      // width: 80,
      render: (record) => {
        let other_pay = 0;
        for (const key in record.extra_info) {
          other_pay += Number(record.extra_info[key]);
        }
        other_pay = other_pay.toFixed(2);
        return other_pay;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'advance_audit_status',
      align: 'center',
      // width: 100,
      render: (text) => <span>{ORDER_CENTER_ADVANCE[text].value}</span>,
    },
    {
      title: '乘客支付状态',
      dataIndex: 'is_pay',
      align: 'center',
      // width: 100,

      render: (text) => <Tag color={Number(text) ? '#87d068' : '#f50'}>{payStatusMap[text]}</Tag>,
    },
    {
      title: '指定处理人',
      dataIndex: 'specific_user_name',
      align: 'center',
      // width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      // width: 100,
    },
    {
      title: '操作',
      // width: 230,
      render: (record) => (
        <Space>
          {userApiAuth && userApiAuth[API_ORDER_DETAIL] && (
            <Button
              className="padding-zero"
              type="link"
              onClick={() => {
                history.push(`/order/order-detail?order_id=${record.order_id}`);
              }}
            >
              订单详情
            </Button>
          )}

          {userApiAuth &&
            userApiAuth[API_ORDER_COMMIT] &&
            (record.advance_audit_status == 1 || record.advance_audit_status == 2) &&
            Number(record.is_pay) === 0 && (
              <Popconfirm
                title="垫付的订单将不再支持改价免单操作，请谨慎操作"
                onConfirm={() => confirm(record)}
                okText="垫付"
                cancelText="取消"
                placement="topRight"
              >
                <Button className="padding-zero" type="link" style={{ color: '#4ECE3D' }}>
                  垫付
                </Button>
              </Popconfirm>
            )}
          {record.advance_audit_status == 1 &&
            Number(record.is_pay) === 0 &&
            userApiAuth &&
            userApiAuth[API_ORDER_REJECT] && (
              <Button
                className="padding-zero"
                type="link"
                style={{ color: '#FF151F' }}
                onClick={() => showRejectModal(record)}
              >
                驳回
              </Button>
            )}
          <Button className="padding-zero" type="link" onClick={() => showRemarkModal(record)}>
            备注
          </Button>
          <Button className="padding-zero" type="link" onClick={() => showLogModal(record)}>
            操作日志
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer title="垫付列表">
      <Card
        title={
          userInfo &&
          userInfo.agent_type == 0 &&
          userApiAuth &&
          userApiAuth[API_ORDER_ADVANCELIST] && (
            <SearchForm
              getAdvanceList={getAdvanceList}
              userData={userData}
              ref={childrenRefSearch}
            />
          )
        }
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Select
                style={{ width: 200 }}
                placeholder="批量操作"
                showSearch
                onChange={selcetBatchUser}
                filterOption={filterOption}
                allowClear
              >
                {userData.map((item, index) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              <Button
                disabled={selectedRowKeys.length == 0 || !selectUser}
                onClick={batchManage}
                type="primary"
              >
                确定
              </Button>
            </Space>
          </div>
          {userInfo &&
            userInfo.agent_type == 0 &&
            userApiAuth &&
            userApiAuth[API_ORDER_ADVANCELIST] && (
              <Table
                rowSelection={rowSelection}
                rowKey={(e) => e.order_id}
                bordered
                scroll={{ x: 'max-content' }}
                size="small"
                loading={loading}
                columns={columns}
                dataSource={dataSource.list}
                pagination={paginationProps}
              />
            )}
        </div>
      </Card>
      {/* 驳回Modal */}
      <Modal
        title="驳回确认"
        visible={showReject}
        destroyOnClose
        onCancel={() => setShowReject(false)}
        width={544}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
        footer={null}
      >
        <RejectModal
          selectRecord={selectRecord}
          onCancel={() => setShowReject(false)}
          getAdvanceList={getAdvanceList}
        />
      </Modal>
      {/* 备注 */}
      <Modal
        title="备注"
        visible={showRemark}
        destroyOnClose
        onCancel={() => setShowRemark(false)}
        onOk={() => optRemarks()}
        width={544}
      >
        <Form form={form}>
          <Form.Item
            name="remark"
            rules={[
              {
                required: true,
                message: '请输入备注',
              },
            ]}
          >
            <TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 操作日志 */}
      <Modal
        title="操作日志"
        visible={showLog}
        destroyOnClose
        onCancel={() => setShowLog(false)}
        footer={null}
        width={544}
      >
        {dataSourceLog && getTable()}
      </Modal>
    </PageContainer>
  );
};

export default AdvancepayList;
