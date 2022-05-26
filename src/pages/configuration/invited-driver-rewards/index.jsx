import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  Modal,
  Popover,
  message,
  Table,
  Form,
  Popconfirm,
  Space,
  Badge,
  Input,
} from 'antd';
import { connect } from 'umi';
import { useSelector } from 'dva';

import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { INVITER_ACTIVE_STATUS } from '@/utils/constant';
import OperationLogModal from '@/components/OperationLogModal';

import {
  activeConfigList,
  auditActiveConfig,
  stopActiveConfig,
  remarkActiveConfig,
} from './service';
import {
  API_ACTIVE_LIST,
  API_ACTIVE_DETAIL,
  API_ACTIVE_EDIT,
  API_ACTIVE_AUDIT,
  API_ACTIVE_STOP,
  API_ACTIVE_REMARK,
  API_ACTIVE_CREAT,
} from './constant';
import SearchForm from './components/SearchForm';
import AddConfig from './components/AddConfig';

const { TextArea } = Input;

// 加盟司机管理
const InvitedDriverRewards = (props) => {
  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);
  const [form] = Form.useForm();

  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  const [showType, setShowType] = useState();
  const [visibleRemark, setVisibleRemark] = useState(false);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();

  const [loading, setLoading] = useState(false);
  const [recordDetail, setRecordDetail] = useState();
  const [dataSource, setDataSource] = useState({});
  const TITLS_TEXT = {
    new: '新增配置',
    edit: '编辑配置',
    check: '查看配置',
  };
  useEffect(() => {
    if (userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ACTIVE_LIST]) {
      getActiveConfigList();
    }
  }, [userApiAuth]);

  // 获取配置列表
  const getActiveConfigList = async (params = {}) => {
    setLoading(true);
    const res = await activeConfigList(params);
    if (res) {
      setDataSource(res.data);
      setLoading(false);
    }
  };

  // 审核操作
  const auditConfig = async (params) => {
    const res = await auditActiveConfig(params);
    if (res) {
      message.success('操作成功');
      getActiveConfigList();
    }
  };

  // 终止
  const stopConfig = async (params) => {
    const res = await stopActiveConfig(params);
    if (res) {
      message.success('操作成功');
      getActiveConfigList();
    }
  };

  //
  const confirmOk = (type, record) => {
    let params;
    switch (type) {
      case 'audit':
        params = {
          config_id: record.id,
          inviter_active_status: 1,
        };
        auditConfig(params);
        break;
      case 'refuse':
        params = {
          config_id: record.id,
          inviter_active_status: 2,
        };
        auditConfig(params);
        break;
      case 'stop':
        params = {
          config_id: record.id,
        };
        stopConfig(params);
        break;

      default:
        break;
    }
  };

  // 确定操作
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  // 显示弹窗
  const showModal = (record, type) => {
    setRecordDetail(record);
    setShowType(type);
  };
  // 显示备注
  const showRemark = (record) => {
    setVisibleRemark(true);
    setRecordDetail(record);
  };

  // 添加备注
  const handleRemarkOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const params = {
          config_id: recordDetail.id,
          ...values,
        };
        const res = await remarkActiveConfig(params);
        if (res) {
          message.success('备注成功');
          getActiveConfigList();
          setVisibleRemark(false);

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
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      page_index: current,
      ...values,
    };
    getActiveConfigList(parasm);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.page_index,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '城市',
      dataIndex: 'area',
      align: 'center',
      key: 'area',
      render: (area) => {
        let city_name = '';
        city_name = cityCountyList.find((x) => x.city == area).city_name;
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '发放奖励公司',
      key: 'company_id',
      align: 'center',
      render: (record) => {
        const content = (
          <div>
            {record.company_id.split(',').map((item) => {
              return <p key={item}>{item}</p>;
            })}
          </div>
        );
        return (
          <Popover placement="rightTop" title="发放奖励公司" content={content} trigger="click">
            <Button type="link">详情</Button>
          </Popover>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'inviter_active_status',
      align: 'center',
      key: 'inviter_active_status',
      align: 'center',
      render: (inviter_active_status) => {
        const status_color = {
          // 待审核
          0: 'processing',
          1: 'success',
          2: 'error',
          3: 'warning',
          4: 'error',
          5: 'error',
        };
        return (
          <Badge
            status={status_color[inviter_active_status]}
            text={INVITER_ACTIVE_STATUS[inviter_active_status].value}
          />
        );
      },
    },
    {
      title: '开始日期',
      dataIndex: 'start_time',
      align: 'center',
      key: 'start_time',
    },
    {
      title: '结束日期',
      dataIndex: 'end_time',
      align: 'center',
      key: 'end_time',
    },
    {
      title: '入口状态',
      dataIndex: 'entrance_status',
      align: 'center',
      key: 'entrance_status',
      render: (status) => {
        return (
          <Badge status={status == 1 ? 'success' : 'error'} text={status == 1 ? '开启' : '关闭'} />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark',
      // width: 100,
    },
    {
      title: '操作',
      key: 'ops',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            {userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ACTIVE_DETAIL] && (
              <Button className="padding-zero" onClick={() => showModal(record, 'check')} type="link">
                查看
              </Button>
            )}
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_ACTIVE_EDIT] &&
              record.inviter_active_status == 0 && (
                <Button className="padding-zero" onClick={() => showModal(record, 'edit')} type="link">
                  编辑
                </Button>
              )}
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_ACTIVE_AUDIT] &&
              record.inviter_active_status == 0 && (
                <Popconfirm
                  title="确定通过审核吗？"
                  onConfirm={() => confirmOk('audit', record)}
                  onCancel={() => confirmOk('refuse', record)}
                  okText="通过审核"
                  cancelText="审核驳回"
                >
                  <Button className="padding-zero" type="link">审核</Button>
                </Popconfirm>
              )}
            {userInfo && userInfo.agent_type == 0 && (
              <Button className="padding-zero" onClick={() => showModal(record, 'copy')} type="link">
                复制
              </Button>
            )}
            {userInfo &&
              userInfo.agent_type == 0 &&
              userApiAuth &&
              userApiAuth[API_ACTIVE_STOP] &&
              record.inviter_active_status == 1 && (
                <Popconfirm
                  title="确定终止吗？"
                  onConfirm={() => confirmOk('stop', record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button className="padding-zero" type="link">终止</Button>
                </Popconfirm>
              )}
            {userInfo && userInfo.agent_type == 0 && userApiAuth && userApiAuth[API_ACTIVE_REMARK] && (
              <Button className="padding-zero" onClick={() => showRemark(record)} type="link">
                备注
              </Button>
            )}
            {userInfo && userInfo.agent_type == 0 && userInfo && userInfo.agent_type == 0 && (
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
    <PageContainer
      title="招募司机奖励配置"
      extra={
        userInfo &&
        userInfo.agent_type == 0 &&
        userApiAuth &&
        userApiAuth[API_ACTIVE_CREAT] && [
          <Button
            onClick={() => showModal({}, 'new')}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新增配置
          </Button>,
        ]
      }
    >
      <Card
        title={<SearchForm ref={childrenRefSearch} getActiveConfigList={getActiveConfigList} />}
      >
        <Table
          rowKey={(e) => e.id}
          bordered
          size="small"
          scroll={{x: 'max-content'}}
          columns={columns}
          dataSource={dataSource.list}
          loading={loading}
          pagination={paginationProps}
        />
      </Card>
      {/* 新增 编辑 查看 复制 配置 */}
      <Modal
        title={TITLS_TEXT[showType]}
        visible={
          showType === 'new' || showType === 'check' || showType === 'edit' || showType === 'copy'
        }
        destroyOnClose
        onCancel={() => setShowType()}
        onOk={handleOk}
        width={700}
      >
        <AddConfig
          onCancel={() => setShowType()}
          getActiveConfigList={getActiveConfigList}
          ref={childrenRef}
          type={showType}
          recordDetail={recordDetail}
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
          id={selectRecord && selectRecord.id}
          type={18}
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

export default connect(({ global, join }) => ({
  userApiAuth: global.userApiAuth,
}))(InvitedDriverRewards);
