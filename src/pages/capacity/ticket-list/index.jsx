import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Badge,
  Card,
  Modal,
  Popconfirm,
  message,
  Table,
  Form,
  Input,
  Space,
  Tag,
} from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';
import { CHANNEL, COUPON_TYPE, COUPON_STAUTS } from '@/utils/constant';
import {
  getActivityList,
  auditActivity,
  stopActivity,
  pauseActivity,
  continueActivity,
  activityRemark,
} from './service';
import {
  API_DETAIL_COUPON,
  API_AUDIT_COUPON,
  API_PAUSE_COUPON,
  API_CONTINUE_COUPON,
  API_STOP_COUPON,
  API_COUPON_LIST,
} from './constant';
import SearchForm from './components/SearchForm';
import TableTitle from './components/TableTitle';
import CreateTicketForm from './components/CreateTicketForm';
const { TextArea } = Input;

const TicketList = (props) => {
  const { userApiAuth, userInfo } = props;
  const [visible, setVisible] = useState(false);
  const [visibleRemark, setVisibleRemark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [activityId, setActivityId] = useState();
  const [form] = Form.useForm();
  const [editData, setEditData] = useState({});
  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);
  const [type, setType] = useState();
  const [id, setId] = useState();
  /**
   * 获取活动列表
   * @param
   */
  const getActivity = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getActivityList(params);
      if (res) {
        setDataSource(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // console.log(userApiAuth, 'userApiAuth')
    if (userApiAuth && userApiAuth[API_COUPON_LIST] && userInfo && userInfo.agent_type != 3) {
      getActivity();
    }
  }, [userApiAuth]);

  /**
   * 删除  审核  终止
   * @param
   */
  const confirm = (record, type) => {
    switch (type) {
      // 审核
      case 'audit':
        auditEvent(record.activity_id, 1);
        break;
      // 终止
      case 'discontinue':
        discontinueEvent(record.activity_id);
        break;
      // 暂停
      case 'stop':
        stopEvent(record.activity_id);
        break;
      // 继续
      case 'continue':
        continueEvent(record.activity_id);
        break;
      default:
        break;
    }
  };

  // 审核拒绝
  const refuse = (record) => {
    auditEvent(record.activity_id, 0);
  };

  // 添加优惠券 编辑优惠券
  const showModal = (record, type) => {
    // console.log(record, type);
    switch (type) {
      case 'new':
        setType(type);
        setEditData({});
        break;
      case 'edit':
        setType(type);
        setId(record.activity_id);
        // getEditData(record.activity_id);
        // 获取详情
        break;
      default:
        break;
    }
    setVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    setType('');
    childrenRef.current.onReset();
  };

  // 查看活动
  const detailPage = (record) => {
    history.push(`/capacity/detail/${record.activity_id}`);
  };

  // 添加优惠券
  const handleOk = () => {
    childrenRef.current.onFinish();
  };

  // 审核活动
  const auditEvent = async (activity_id, status) => {
    const params = {
      activity_id,
      audit: status,
    };
    const res = await auditActivity(params);
    // console.log(res);
    if (res) {
      message.success('操作成功');
      // 刷新列表
      getActivity();
    }
  };

  // 终止活动
  const discontinueEvent = async (activity_id) => {
    const params = {
      activity_id,
      // operation_user: 'wdk',
      // operation_user_id: 123,
    };
    const res = await stopActivity(params);
    // console.log(res);
    if (res) {
      message.success('终止活动成功');
      // 刷新列表
      getActivity();
    }
  };

  //继续活动
  const continueEvent = async (activity_id) => {
    const params = {
      activity_id,
    };
    const res = await continueActivity(params);
    // console.log(res);
    if (res) {
      message.success('继续活动成功');
      // 刷新列表
      getActivity();
    }
  };

  // 暂停活动
  const stopEvent = async (activity_id) => {
    const params = {
      activity_id,
    };
    const res = await pauseActivity(params);
    // console.log(res);
    if (res) {
      message.success('暂停活动成功');
      // 刷新列表
      getActivity();
    }
  };

  // 显示备注
  const addRemark = (record) => {
    // console.log(record, 'record');
    setVisibleRemark(true);
    setActivityId(record.activity_id);
    // setSelectRecord(record);
  };

  // 添加备注
  const handleRemarkOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        // console.log(values, 'L');
        const params = {
          activity_id: activityId,
          ...values,
        };
        const res = await activityRemark(params);
        if (res) {
          message.success('备注成功');
          setVisibleRemark(false);
          getActivity();
          form.setFieldsValue({
            remark: null,
          });
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    // console.log(record);
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  // 分页
  const changePage = async (current) => {
    // console.log(current)
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      page_no: current,
      ...values,
    };
    getActivity(parasm);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current,
    onChange: (current) => changePage(current),
  };

  const filterColumns =
    userInfo && userInfo.agent_type == 0
      ? [
          {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            align: 'center',
            // width: 100,
          },
        ]
      : [];

  const columns = [
    {
      title: '编号',
      dataIndex: 'activity_id',
      align: 'center',
      key: 'activity_id',
      // width: 50,
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'center',
      // width: 200,
    },
    {
      title: '优惠券名称',
      dataIndex: 'coupon_name',
      key: 'coupon_name',
      align: 'center',
      // width: 70,
    },
    {
      title: '平台',
      key: 'channel',
      dataIndex: 'channel',
      align: 'center',
      // width: 50,
      render: (channel) => {
        return <span>{CHANNEL[channel]}</span>;
      },
    },
    {
      title: '优惠券类型',
      dataIndex: 'coupon_type',
      key: 'coupon_type',
      align: 'center',
      // width: 80,
      render: (coupon_type) => {
        return <span>{COUPON_TYPE[coupon_type]}</span>;
      },
    },
    {
      title: '可使用地区',
      // key: 'city',
      // dataIndex: 'city',
      align: 'center',
      // width: 100,
      render: (record) => {
        let city_name = '';
        let district_name = '';
        if (record.city) {
          const { cityCountyList } = props;
          city_name = cityCountyList.find((x) => x.city === record.city).city_name;
          if (record.district != 0) {
            district_name = cityCountyList
              .find((x) => x.city === record.city)
              .county_infos.find((y) => y.county === record.district).city_name;
          }
        }
        return (
          <span>
            {city_name}
            {district_name}
          </span>
        );
      },
    },
    {
      title: '面值',
      dataIndex: 'denomination',
      key: 'denomination',
      align: 'center',
      // width: 200,
      render: (denomination) => {
        const denominationArr = JSON.parse(denomination);
        let denominationName = '';
        denominationArr.map((item, index) => {
          if (index + 1 < denominationArr.length) {
            item = item / 100 + '元、';
          } else {
            item = item / 100 + '元';
          }
          return (denominationName += item);
        });
        return <div>{denominationName}</div>;
      },
    },
    {
      title: '总发行量（张）',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
    {
      title: '当前剩余（张）',
      dataIndex: 'remain',
      key: 'remain',
      align: 'center',
    },
    {
      title: '有效期',
      // dataIndex: 'end_time',
      // key: 'end_time',
      align: 'center',
      render: (record) => {
        return (
          <Space>
            <span>
              {moment(record.begin_time).format('YYYY/MM/DD')}至
              {moment(record.end_time).format('YYYY/MM/DD')}
            </span>
            <Tag color={moment(record.end_time).fromNow().indexOf('前') > -1 ? 'red' : 'green'}>
              {moment(record.end_time).fromNow().indexOf('前') > -1 ? '已过期' : '正常'}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      // width: 100,
      render: (status) => {
        const status_color = {
          // 待审核
          0: 'processing',
          1: 'error',
          2: 'success',
          3: 'warning',
          4: 'error',
          5: 'error',
        };
        return <Badge status={status_color[status]} text={COUPON_STAUTS[status]} />;
      },
    },
    ...filterColumns,
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userApiAuth && userApiAuth[API_DETAIL_COUPON] && (
              <Button className="padding-zero" onClick={() => detailPage(record)} type="link">
                查看
              </Button>
            )}
            {record.status == 0 && (
              <Button className="padding-zero" onClick={() => showModal(record, 'edit')} type="link">
                编辑
              </Button>
            )}
            {userApiAuth &&
              userApiAuth[API_AUDIT_COUPON] &&
              record.status == 0 &&
              userInfo &&
              userInfo.agent_type == 0 && (
                <Popconfirm
                  title="审核通过之后券即对外开放"
                  onConfirm={() => confirm(record, 'audit')}
                  onCancel={() => refuse(record)}
                  okText="通过"
                  cancelText="拒绝"
                >
                  <Button className="padding-zero" type="link">审核</Button>
                </Popconfirm>
              )}
            {userApiAuth &&
              userApiAuth[API_CONTINUE_COUPON] &&
              record.status == 3 &&
              record.status != 4 && (
                <Popconfirm
                  title="确定开始该券吗？"
                  onConfirm={() => confirm(record, 'continue')}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">开始</Button>
                </Popconfirm>
              )}
            {userApiAuth &&
              userApiAuth[API_PAUSE_COUPON] &&
              record.status != 3 &&
              record.status != 4 &&
              record.status == 2 && (
                <Popconfirm
                  title="确定暂停该券吗？"
                  onConfirm={() => confirm(record, 'stop')}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">暂停</Button>
                </Popconfirm>
              )}
            {userApiAuth && userApiAuth[API_STOP_COUPON] && record.status == 3 && (
              <Popconfirm
                title="确定终止吗？"
                onConfirm={() => confirm(record, 'discontinue')}
                // onCancel={cancel}
                okText="确定"
                cancelText="我再想想"
              >
                <Button className="padding-zero" type="link">终止</Button>
              </Popconfirm>
            )}
            {userInfo && userInfo.agent_type == 0 && (
              <Button className="padding-zero" onClick={() => addRemark(record)} type="link">
                备注
              </Button>
            )}
            {userInfo && userInfo.agent_type == 0 && (
              <Button className="padding-zero" onClick={() => showOperationLog(record)} type="link">
                操作日志
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer title="优惠券列表">
      <Card title={<SearchForm ref={childrenRefSearch} getActivity={getActivity} />}>
        <Table
          title={() => <TableTitle showModal={() => showModal({}, 'new')} />}
          rowKey={(e) => e.activity_id}
          bordered
          scroll={{x: 'max-content'}}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.list}
          pagination={paginationProps}
        />
      </Card>
      {/* 添加优惠券 */}
      <Modal
        maskClosable={false}
        width={1000}
        title={type === 'edit' ? '编辑优惠券' : '添加优惠券'}
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CreateTicketForm
          editData={type === 'edit' ? props.editData : null}
          type={type}
          id={type === 'edit' ? id : null}
          getActivity={getActivity}
          handleCancel={handleCancel}
          ref={childrenRef}
        />
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
          id={selectRecord && selectRecord.activity_id}
          type={15}
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
      {/* 添加备注 */}
      <Modal
        maskClosable={false}
        width={500}
        title="添加备注"
        okText="确定"
        cancelText="取消"
        visible={visibleRemark}
        onOk={handleRemarkOk}
        onCancel={() => setVisibleRemark(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请填写备注',
              },
            ]}
            label="备注"
            name="remark"
          >
            <TextArea placeholder="请添加备注" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default connect(({ ticketList, global }) => ({
  editData: ticketList.editData,
  userApiAuth: global.userApiAuth,
  userInfo: global.userInfo,
  cityCountyList: global.cityCountyList,
}))(TicketList);
