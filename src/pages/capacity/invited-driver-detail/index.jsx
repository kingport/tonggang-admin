import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Table, Space, Button, Image, Modal } from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { UnorderedListOutlined, ProfileOutlined } from '@ant-design/icons';

import {
  driverDetail,
  driverInviterList,
  inviterIncomeList,
  recognizeMaskList,
  inviteeIncomeList,
} from './service';
import DescriptionsDriver from './components/DescriptionsDriver';

const { TabPane } = Tabs;

const InvitedDriverDetail = (props) => {
  const { id } = props.match.params;
  // TODO 有时间再弄吧
  // const [recordHeader] = useState([
  //   {
  //     id: 1,
  //     title: '邀请管理',
  //     icon: <UnorderedListOutlined />,
  //     type: '',
  //   },
  //   {
  //     id: 2,
  //     title: '收益记录',
  //     icon: <UnorderedListOutlined />,
  //     type: '',
  //   },
  //   {
  //     id: 3,
  //     title: '识别记录',
  //     icon: <UnorderedListOutlined />,
  //     type: '',
  //   },
  //   {
  //     id: 4,
  //     title: '奖励记录',
  //     icon: <UnorderedListOutlined />,
  //     type: '',
  //   },
  // ]);
  const [inviterList, setInviterList] = useState({});
  const [inviterLoading, setInviterLoading] = useState(false);

  const [incomeList, setIncomeList] = useState({});
  const [incomeLoading, setIncomeLoading] = useState(false);

  const [epidemicList, setEpidemicList] = useState({});
  const [epidemicLoading, setEpidemicLoading] = useState(false);

  const [inviteeList, setInviteeList] = useState({});
  const [inviteeLoading, setInviteeLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [detailDriver, setDetailDrive] = useState();

  useEffect(() => {
    getDetail(id);
    const params = {
      driver_id: id,
    };
    getDriverInviterList(params);
  }, []);

  /**
   * @description: 获取司机详情
   * @param {string} id 司机id
   * @return {object} res
   */
  const getDetail = async (id) => {
    setLoading(true);
    const params = {
      driver_id: id,
    };
    const res = await driverDetail(params);
    if (res) {
      setDetailDrive(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  /**
   * @description: 获取邀请人列表
   * @param {object} params 参数
   * @return {*}
   */
  const getDriverInviterList = async (params) => {
    setInviterLoading(true);
    const res = await driverInviterList(params);
    if (res) {
      setInviterList(res.data);
      setInviterLoading(false);
    } else {
      setInviterLoading(false);
    }
  };

  /**
   * @description: 获取收益记录
   * @param {object} params 参数
   * @return {*}
   */
  const getInviterIncomeList = async (params) => {
    setIncomeLoading(true);
    const res = await inviterIncomeList(params);
    if (res) {
      setIncomeList(res.data);
      setIncomeLoading(false);
    } else {
      setIncomeLoading(false);
    }
  };

  /**
   * @description: 获取司机打卡记录
   * @param {*}
   * @return {*}
   */
  const getRecognizeMaskList = async (parms) => {
    setEpidemicLoading(true);

    const res = await recognizeMaskList(parms);
    if (res) {
      setEpidemicList(res.data);
    }
    setEpidemicLoading(false);
  };

  /**
   * @description: 获取司机奖励记录
   * @param {*}
   * @return {*}
   */
  const getInviteeIncomeList = async (parms) => {
    setInviteeLoading(true);
    const res = await inviteeIncomeList(parms);
    if (res) {
      setInviteeList(res.data);
    }
    setInviteeLoading(false);
  };

  // 邀请记录表格配置项
  const columnsInvite = [
    {
      title: '时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
    },
    {
      title: '被邀请司机手机号',
      dataIndex: 'cell',
      align: 'center',
      key: 'cell',
    },
    {
      title: '邀请状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
    },
  ];
  // 邀请奖励表格配置项
  const columnsRewards = [
    {
      title: '时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
    },
    {
      title: '被邀请司机手机号',
      dataIndex: 'cell',
      align: 'center',
      key: 'cell',
    },
    {
      title: '收益（元）',
      dataIndex: 'award_amount',
      align: 'center',
      key: 'award_amount',
    },
    {
      title: '奖励转到钱包',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
    },
  ];
  // 打卡记录配置项
  const columnsEpidemic = [
    {
      title: '时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
    },
    {
      title: '识别状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (status) => {
        return <span>{status == 1 ? '成功' : '失败'}</span>;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record) => {
        if (record.status == 1) {
          return (
            <Button
              onClick={() => {
                return Modal.info({
                  title: '打卡照片',
                  content: (
                    <Image
                      src={`${window.location.origin}/saasbench/v1/file/show/index?key=${record.mask_pic}`}
                    />
                  ),
                  onOk() {},
                });
              }}
              type="link"
            >
              查看图片
            </Button>
          );
        }
      },
    },
  ];
  // 奖励记录配置项目
  const columnReward = [
    {
      title: '时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
    },
    {
      title: '奖励（元）',
      dataIndex: 'award_amount',
      align: 'center',
      key: 'award_amount',
    },
    {
      title: '奖励发到钱包状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
    },
  ];
  const [columns, setColumns] = useState(columnsInvite);

  /**
   * @description: 切换表格
   * @param {string} key 类别区分表格
   * @return {*}
   */
  const onChange = (key) => {
    if (key == 1) {
      setColumns(columnsInvite);
      const params = {
        driver_id: id,
      };
      getDriverInviterList(params);
    }
    if (key == 2) {
      setColumns(columnsRewards);
      const params = {
        driver_id: id,
      };
      getInviterIncomeList(params);
    }

    if (key == 3) {
      setColumns(columnsEpidemic);
      const params = {
        driver_id: id,
      };
      getRecognizeMaskList(params);
    }

    if (key == 4) {
      setColumns(columnReward);
      const params = {
        driver_id: id,
      };
      getInviteeIncomeList(params);
    }
  };

  /**
   * @description: 分页查询
   * @param {string} current 当前页码
   * @return {*}
   */
  const changePage = async (current) => {
    const params = {
      page_index: current,
      driver_id: id,
    };
    getDriverInviterList(params);
  };

  /**
   * @description: 分页查询
   * @param {string} current 当前页码
   * @return {*}
   */
  const changePageincomeList = async (current) => {
    const params = {
      page_index: current,
      driver_id: id,
    };
    getInviterIncomeList(params);
  };

  const changePageEpidemicList = async (current) => {
    const params = {
      page_index: current,
      driver_id: id,
    };
    getRecognizeMaskList(params);
  };

  const changePageInviteeList = async (current) => {
    const params = {
      page_index: current,
      driver_id: id,
    };
    getInviteeIncomeList(params);
  };

  // 页码配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${inviterList.total}条`,
    total: inviterList.total,
    pageSize: 10,
    current: inviterList.page_index,
    onChange: (current) => changePage(current),
  };

  // 页码配置项
  const paginationPropsincomeList = {
    showQuickJumper: false,
    showTotal: () => `共${incomeList.total}条`,
    total: incomeList.total,
    pageSize: 10,
    current: incomeList.page_index,
    onChange: (current) => changePageincomeList(current),
  };

  // 页码配置项
  const paginationEpidemicList = {
    showQuickJumper: false,
    showTotal: () => `共${epidemicList.totalCount}条`,
    total: epidemicList.totalCount,
    pageSize: 10,
    current: epidemicList.pageIndex,
    onChange: (current) => changePageEpidemicList(current),
  };

  // 页码配置项
  const paginationInviteeList = {
    showQuickJumper: false,
    showTotal: () => `共${inviteeList.total}条`,
    total: inviteeList.total,
    pageSize: 10,
    current: inviteeList.page_index,
    onChange: (current) => changePageInviteeList(current),
  };

  return (
    <PageContainer onBack={() => history.push('/capacity/join')} title="司机详情">
      <Spin spinning={loading}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Card title="基本信息">
            <DescriptionsDriver
              getDetail={getDetail}
              getDriverInviterList={getDriverInviterList}
              detail={detailDriver}
            />
          </Card>
          <Card>
            <Tabs onChange={onChange} defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <UnorderedListOutlined />
                    邀请管理
                  </span>
                }
                key="1"
              >
                <Table
                  rowKey={(e) => e.id}
                  loading={inviterLoading}
                  bordered
                  size="small"
                  columns={columns}
                  dataSource={inviterList && inviterList.info}
                  pagination={paginationProps}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ProfileOutlined />
                    收益记录
                  </span>
                }
                key="2"
              >
                <Table
                  rowKey={(e) => e.id}
                  bordered
                  size="small"
                  loading={incomeLoading}
                  columns={columns}
                  dataSource={incomeList && incomeList.list}
                  pagination={paginationPropsincomeList}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ProfileOutlined />
                    识别记录
                  </span>
                }
                key="3"
              >
                <Table
                  rowKey={(e) => e.create_time}
                  bordered
                  size="small"
                  loading={epidemicLoading}
                  columns={columns}
                  dataSource={epidemicList && epidemicList.info}
                  pagination={paginationEpidemicList}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ProfileOutlined />
                    奖励记录
                  </span>
                }
                key="4"
              >
                <Table
                  rowKey={(e) => e.create_time}
                  bordered
                  size="small"
                  loading={inviteeLoading}
                  columns={columns}
                  dataSource={inviteeList && inviteeList.list}
                  pagination={paginationInviteeList}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Space>
      </Spin>
    </PageContainer>
  );
};

export default connect(({ global, join }) => ({
  userApiAuth: global.userApiAuth,
}))(InvitedDriverDetail);
