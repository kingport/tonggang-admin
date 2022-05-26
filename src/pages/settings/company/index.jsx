import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal, Popconfirm, message, Table, Badge, Space } from 'antd';
import { history, connect } from 'umi';
import { useDispatch } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { AGENT_TYPE_NAME, COOPERATION_MODE_NAME } from '@/utils/constant';

import {
  API_ADD,
  API_DETAIL_COMPANY,
  API_UPDATE_COMPANY,
  API_TERMINATION_COMPANY,
  API_OPEN_COMPANY,
  API_DELETE_COMPANY,
} from './constant';
import {
  companyList,
  terminationCompany,
  openCompany,
  deleteCompany,
  transferCompanyList,
} from './service';
import SearchForm from './components/SearchForm';
import HistoryOperation from './components/HistoryOperation';
import CompanyDelectModle from './components/CompanyDelectModle';

const Company = (props) => {
  const { cityCountyList, userApiAuth } = props;
  const childrenRefSearch = useRef(null);
  const childrenRefTrans = useRef(null);
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [showDelectModle, setShowDelectModle] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [transferList, setTransferList] = useState([]);
  const [removeCompanyId, setRemoveCompanyId] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    getCompanyList();
  }, []);

  // 确认操作
  const confirmOk = (type, record) => {
    if (type === 'open') {
      startCompany(record.company_id);
    }
    if (type === 'terminate') {
      terminateCompany(record.company_id);
    }
    if (type === 'delect') {
      setShowDelectModle(true);
      getTransferCompanyList(record.company_id);
      setRemoveCompanyId(record.company_id);
    }
  };

  // 删除公司
  const removeCompany = async (params) => {
    const res = await deleteCompany(params);
    if (res) {
      message.success('删除成功');
      // 刷新列表
      setTimeout(() => {
        getCompanyList();
        setShowDelectModle(false);
      }, 1000);
    }
  };
  // 终止公司
  const terminateCompany = async (company_id) => {
    const params = {
      company_id,
    };
    const res = await terminationCompany(params);
    if (res) {
      message.success('终止成功');
      // 刷新列表
      // 这是一个后台bug 需要查看 如果不延时请求状态会不对
      setTimeout(() => {
        getCompanyList();
      }, 1000);
    }
  };
  // 开启合作
  const startCompany = async (company_id) => {
    const params = {
      company_id,
    };
    const res = await openCompany(params);
    if (res) {
      message.success('开启成功');
      // 刷新列表
      getCompanyList();
    }
  };
  // 新建公司
  const newCompany = () => {
    // 清空缓存
    dispatch({
      type: 'companyNew/saveBasicData',
      payload: { basicData: {} },
    });
    dispatch({
      type: 'companyNew/qualificationData',
      payload: { qualificationData: {} },
    });
    dispatch({
      type: 'companyNew/bankCardData',
      payload: { bankCardData: {} },
    });
    dispatch({
      type: 'companyNew/signData',
      payload: { signData: {} },
    });
    history.push('/settings/company-new');
  };
  // 获取公司列表
  const getCompanyList = async (params = {}) => {
    setLoading(true);
    const res = await companyList(params);
    if (res) {
      setDataSource(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // 获取转移公司列表
  const getTransferCompanyList = async (company_id) => {
    const params = {
      company_id,
    };
    const res = await transferCompanyList(params);
    if (res) {
      setTransferList(res.data);
    }
  };

  // 确定删除
  const handleOk = async () => {
    const values = await childrenRefTrans.current.validateFields();
    const params = {
      company_id: removeCompanyId,
      transfer: 1,
      ...values,
    };
    removeCompany(params);
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
    getCompanyList(parasm);
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
      title: '公司ID',
      dataIndex: 'company_id',
      align: 'center',
      key: 'company_id',
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'center',
    },
    {
      title: '代理商类型',
      dataIndex: 'agent_type',
      key: 'agent_type',
      align: 'center',
      render: (agent_type) => {
        return <span>{AGENT_TYPE_NAME[agent_type] || '内部公司'}</span>;
      },
    },
    {
      title: '合作模式',
      dataIndex: 'cooperative_mode',
      key: 'cooperative_mode',
      align: 'center',
      render: (cooperative_mode) => {
        return <span>{COOPERATION_MODE_NAME[cooperative_mode]}</span>;
      },
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
      align: 'left',
      // width: 300,
      render: (area_id) => {
        let city_name = '';
        if (area_id == '') {
          city_name = '全国丶';
        } else {
          let arr_area = area_id.split(',');
          if (cityCountyList) {
            arr_area.map((item) => {
              city_name += cityCountyList.find((x) => x.city == item).city_name + '、';
            });
          }
        }
        return <span>{city_name.slice(0, -1) || '--'}</span>;
      },
    },
    {
      title: '合作到期时间',
      dataIndex: 'cooperate_date',
      key: 'cooperate_date',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'company_status',
      key: 'company_status',
      align: 'center',
      render: (company_status) => {
        return (
          <div>
            {company_status == 2 && <Badge status="error" text="已删除" />}
            {company_status == 1 && <Badge status="warning" text="已终止" />}
            {company_status == 0 && <Badge status="success" text="合作中" />}
          </div>
        );
      },
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        const agent_type = record.agent_type;
        return (
          <Space>
            {userApiAuth && userApiAuth[API_DETAIL_COMPANY] && record.agent_type != 0 && (
              <Button
                onClick={() =>
                  history.push(
                    `/settings/company-new?type=check&companyId=${record.company_id}&status=${record._status}`,
                  )
                }
                type="link"
                className="padding-zero"
              >
                查看
              </Button>
            )}
            {userApiAuth &&
              userApiAuth[API_UPDATE_COMPANY] &&
              record.company_status != 2 &&
              agent_type != 0 && (
                <Button
                  onClick={() =>
                    history.push(`/settings/company-new?type=edit&companyId=${record.company_id}`)
                  }
                  className="padding-zero"
                  type="link"
                >
                  编辑
                </Button>
              )}

            {userApiAuth &&
              userApiAuth[API_TERMINATION_COMPANY] &&
              record.company_status == 0 &&
              AGENT_TYPE_NAME[agent_type] && (
                <Popconfirm
                  title="终止后该公司相关账号将无法登录系统，公司内部账号全部冻结"
                  onConfirm={() => confirmOk('terminate', record)}
                  okText="立即终止"
                  cancelText="暂不终止"
                >
                  <Button className="padding-zero" type="link">
                    终止合作
                  </Button>
                </Popconfirm>
              )}

            {userApiAuth &&
              userApiAuth[API_OPEN_COMPANY] &&
              record.company_status == 1 &&
              AGENT_TYPE_NAME[agent_type] && (
                <Popconfirm
                  title="确定开启合作吗？"
                  onConfirm={() => confirmOk('open', record)}
                  okText="立即开启"
                  cancelText="暂不开启"
                >
                  <Button className="padding-zero" type="link">
                    开启合作
                  </Button>
                </Popconfirm>
              )}

            {userApiAuth &&
              userApiAuth[API_DELETE_COMPANY] &&
              record.company_status == 1 &&
              record.company_status != 2 &&
              AGENT_TYPE_NAME[agent_type] && (
                <Button
                  className="padding-zero"
                  onClick={() => confirmOk('delect', record)}
                  type="link"
                >
                  删除
                </Button>
              )}
            {record.agent_type != 0 && (
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
      title="运营公司管理"
      extra={
        userApiAuth &&
        userApiAuth[API_ADD] && [
          <Button onClick={newCompany} icon={<PlusOutlined />} key="1" type="primary">
            新建公司
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} getCompanyList={getCompanyList} />}>
        <Table
          rowKey={(e) => e.company_id}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info}
          pagination={paginationProps}
        />
      </Card>
      {/* 操作历史 */}
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={800}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <HistoryOperation selectRecord={selectRecord} />
      </Modal>
      {/* 删除公司 */}
      <Modal
        title="删除公司"
        visible={showDelectModle}
        destroyOnClose
        onCancel={() => setShowDelectModle(false)}
        onOk={handleOk}
        // footer={null}
        width={800}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <CompanyDelectModle ref={childrenRefTrans} transferList={transferList} />
      </Modal>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  cityCountyList: global.cityCountyList,
  cityList: global.cityList,
  userApiAuth: global.userApiAuth,
}))(Company);
