import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal, Table, Badge, Form, Input, message, Space } from 'antd';
import { history, connect } from 'umi';
import { useDispatch, useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { TableDropdown } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { DRIVER_AUDIT_STATUS, DRIVER_ACCOUNT_STATUS } from '@/utils/constant';
import moment from 'moment';
import {
  API_DRIVER_LIST,
  API_DRIVER_ADD,
  API_DRIVER_DETAIL,
  API_DRIVER_AUDIT,
  API_DRIVER_TRANSFER,
  API_DRIVER_LOGS,
  API_DRIVER_SETBAN,
} from './constant';
import { driverList, driverChannels, driverSaveRemark } from './service';
import SearchForm from './components/SearchForm';
import BannedModal from './components/BannedModal';
import DeblockingModal from './components/DeblockingModal';
import ModifyModal from './components/ModifyModal';
// import FreezeModal from './components/FreezeModal';
// import UnFreezeModal from './components/UnFreezeModal';
import LogModal from './components/LogModal';

const { TextArea } = Input;
// 加盟司机管理
const Analysis = (props) => {
  const { userApiAuth, userInfo } = props;
  const dispatch = useDispatch();
  const searchValue = useSelector(({ global }) => global.searchValue);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [form] = Form.useForm();
  const childrenRef = useRef(null);
  const childrenRefModify = useRef(null);
  const childrenRefSearch = useRef(null);
  const childrenDeblockingRef = useRef(null);
  const childrenFreezeRef = useRef(null);
  const childrenUnFreezeRef = useRef(null);

  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showType, setShowType] = useState();
  const [selectRecord, setSelectRecord] = useState();
  const [selectDriver, setSelectDriver] = useState();
  const [channels, setChannels] = useState([]);
  const [showRemark, setShowRemark] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    if (userApiAuth && userApiAuth[API_DRIVER_LIST]) {
      getDriverList();
      getDriverChannels();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo]);

  /**
   * @description: 弹窗显示
   * @param {string} type 弹窗类型
   * @param {object} record 该司机信息
   * @return {*}
   */
  const confirmOk = (type, record) => {
    setShowType(type);
    setSelectDriver(record);
  };

  /**
   * @description: 弹窗确认
   * @return {*}
   */
  const handleOk = () => {
    // 封禁
    if (showType === 'banned') {
      childrenRef.current.onFinish();
    }
    // 解封
    if (showType === 'deblocking') {
      childrenDeblockingRef.current.onFinish();
    }
    // 冻结
    if (showType === 'freeze') {
      childrenFreezeRef.current.onFinish();
    }
    // 解冻
    if (showType === 'unfreeze') {
      childrenUnFreezeRef.current.onFinish();
    }
    // 变更
    if (showType === 'modify') {
      childrenRefModify.current.onFinish();
    }
  };

  /**
   * @description: 新增司机 查看司机 审核司机
   * @param {string} type 操作司机类型
   * @param {object} record 司机信息
   * @return {*}
   */
  const operationDriver = (type, record) => {
    setSelectDriver(record);
    dispatch({
      type: 'join/saveJoinType',
      payload: {
        joinType: type,
      },
    });
    history.push(`/capacity/join-new?driver_id=${record.driver_id}&type=${type}`);
  };

  /**
   * @description: 获取渠道列表
   * @return {*}
   */
  const getDriverChannels = async () => {
    const res = await driverChannels();
    if (res) {
      setChannels(res.data);
    }
  };

  /**
   * @description: 获取司机列表
   * @param {object} params 查询司机的参数
   * @return {*}
   */
  const getDriverList = async (params = searchValue) => {
    setLoading(true);
    const res = await driverList(params);
    if (res) {
      if (res.data.info) {
        res.data.info.map((x, index) => (x.serial = index + 1 + 10 * (res.data.pageIndex - 1)));
      }
      setDataSource(res.data);
      setLoading(false);
    }
  };

  /**
   * @description: 显示操作日志
   * @param {object} record 选择项信息
   * @return {*}
   */
  const showLogModalOpt = (record) => {
    setShowLogModal(true);
    setSelectRecord(record);
  };

  /**
   * @description: 表格查询翻页
   * @param {string} current 查询的页码
   * @return {*}
   */
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    if (values.submit_time) {
      values.start_time = moment(values.submit_time[0]).format('YYYY-MM-DD');
      values.end_time = moment(values.submit_time[1]).format('YYYY-MM-DD');
    }
    delete values.submit_time;
    values.page_index = current;
    const parasm = {
      ...values,
    };
    dispatch({
      type: 'global/saveJoinSearchValue',
      payload: {
        searchValue: values,
      },
    });
    getDriverList(parasm);
  };

  /**
   * @description: 选择操作
   * @param {*}
   * @return {*}
   */
  const selectType = (type, record) => {
    // 封禁
    if (type == 'banned') {
      confirmOk('banned', record);
    }
    // 操作日志
    if (type == 'log') {
      showLogModalOpt(record);
    }
    // 变更公司
    if (type == 'modify') {
      confirmOk('modify', record);
    }
    // 解封
    if (type == 'deblocking') {
      confirmOk('deblocking', record);
    }
    // 备注
    if (type == 'remark') {
      saveRmark(record);
    }
  };

  /**
   * @description: 显示备注弹窗
   * @param {*}
   * @return {*}
   */
  const saveRmark = async (record) => {
    setShowRemark(true);
    setSelectRecord(record);
  };

  /**
   * @description: 确认备注
   * @param {*}
   * @return {*}
   */
  const handleOkRemark = async () => {
    const values = await form.validateFields();
    console.log(values, 'values');
    const params = {
      driver_id: selectRecord.driver_id,
      ...values,
    };
    const res = await driverSaveRemark(params);
    if (res) {
      message.success('操作成功');
      setShowRemark(false);
      getDriverList();
    }
  };

  // 页码配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    current: dataSource.pageIndex,
    pageSizeOptions: [10],
    onChange: (current) => changePage(current),
  };
  // 表格配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'serial',
      align: 'center',
      key: 'serial',
      fixed: 'left',
      // width: 30,
    },
    {
      title: '司机ID',
      dataIndex: 'driver_id',
      key: 'driver_id',
      align: 'left',
      fixed: 'left',
      // width: 75,
    },
    {
      title: '司机姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      fixed: 'left',
      ellipsis: true,
      // width: 40,
    },
    {
      title: '手机号',
      dataIndex: 'cell',
      key: 'cell',
      align: 'left',
      fixed: 'left',
      // width: 55,
    },
    {
      title: '车牌号',
      dataIndex: 'plate_no',
      key: 'plate_no',
      align: 'left',
      fixed: 'left',
      // width: 45,
      ellipsis: true,
    },
    {
      title: '首次提交资料时间',
      dataIndex: '_create_time',
      key: '_create_time',
      align: 'left',
      // width: 80,
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
      align: 'left',
      // width: 40,
      ellipsis: true,
      render: (area_id) => {
        let city_name = null;
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area_id);
          if (city_name) {
            city_name = cityCountyList.find((x) => x.city == area_id).city_name;
          } else {
            city_name = '无该城市ID';
          }
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '区县',
      align: 'left',
      ellipsis: true,
      // width: 40,
      render: (record) => {
        let county_name = null;
        if (cityCountyList) {
          county_name = cityCountyList.find((x) => x.city == record.area_id);
          if (county_name) {
            county_name = cityCountyList
              .find((x) => x.city == record.area_id)
              .county_infos.find((x) => x.county == record.county_id).county_name;
          } else {
            county_name = '无该区县ID';
          }
        }
        return <span>{county_name || '--'}</span>;
      },
    },
    {
      title: '报名公司',
      dataIndex: 'first_company_name',
      key: 'first_company_name',
      align: 'left',
      // width: 70,
      ellipsis: true,
    },
    {
      title: '所属公司',
      align: 'left',
      dataIndex: 'company_name',
      key: 'company_name',
      // width: 70,
      ellipsis: true,
    },
    {
      title: '审核状态',
      dataIndex: 'audit_status',
      key: 'audit_status',
      align: 'left',
      // width: 50,
      ellipsis: true,
      render: (audit_status) => {
        // return <span>{DRIVER_AUDIT_STATUS[audit_status].value}</span>;
        return (
          <Badge
            color={audit_status == 1 ? 'green' : 'red'}
            text={DRIVER_AUDIT_STATUS[audit_status].value}
          />
        );
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel_source',
      key: 'channel_source',
      align: 'left',
      // width: 50,
      ellipsis: true,
      render: (channel_source) => {
        return (
          <span>
            {channels.length > 0 && channels.find((x) => x.id == channel_source)
              ? channels.find((x) => x.id == channel_source).name
              : ''}
          </span>
        );
      },
    },
    {
      title: '邀请人手机号',
      align: 'left',
      dataIndex: 'intive_phone',
      key: 'intive_phone',
      // width: 55,
    },
    {
      title: '处理时间',
      align: 'left',
      dataIndex: 'op_time',
      key: 'op_time',
      // width: 80,
    },
    {
      title: '处理人',
      align: 'left',
      // width: 40,
      ellipsis: true,
      dataIndex: 'op_user_name',
      key: 'op_user_name',
    },
    {
      title: '账户状态',
      dataIndex: 'account_status',
      key: 'account_status',
      align: 'left',
      // width: 45,
      render: (account_status) => {
        // return <span>{DRIVER_ACCOUNT_STATUS[account_status]}</span>;
        return (
          <Badge
            color={account_status == 1 ? 'green' : 'red'}
            text={DRIVER_ACCOUNT_STATUS[account_status]}
          />
        );
      },
    },
    {
      title: '合规认证',
      align: 'left',
      dataIndex: 'license_auth_name',
      key: 'license_auth_name',
      // width: 40,
    },

    // {
    //   title: '到期证件',
    //   align: 'center',
    //   dataIndex: 'license_expired_name',
    //   key: 'license_expired_name',
    // },
    // {
    //   title: '到期时间',
    //   align: 'center',
    //   dataIndex: 'license_expired_date',
    //   key: 'license_expired_date',
    // },
    {
      title: '备注',
      align: 'center',
      // width: 35,
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'left',
      width: 150,
      fixed: 'right',
      render: (record) => {
        return (
          <Space>
            {userApiAuth && userApiAuth[API_DRIVER_DETAIL] && (
              <Button
                className="padding-zero"
                onClick={() => operationDriver('check', record)}
                type="link"
              >
                证件信息
              </Button>
            )}
            {
              <Button
                className="padding-zero"
                onClick={() => history.push(`/capacity/invited-driver-detail/${record.driver_id}`)}
                type="link"
              >
                司机详情
              </Button>
            }
            {
              // <Button onClick={() => saveRmark(record)} type="link">
              //   备注
              // </Button>
            }
            {(record.account_status == 3 || record.account_status == 4) &&
              userApiAuth &&
              userApiAuth[API_DRIVER_SETBAN] && (
                <Button onClick={() => confirmOk('deblocking', record)} type="link">
                  解封
                </Button>
              )}
            {record.account_status != 3 &&
              record.account_status != 4 &&
              userApiAuth &&
              userApiAuth[API_DRIVER_SETBAN] && (
                <Button onClick={() => confirmOk('banned', record)} type="link">
                  封禁
                </Button>
              )}
            {record.audit_status != 1 &&
              userApiAuth &&
              userApiAuth[API_DRIVER_DETAIL] &&
              userApiAuth[API_DRIVER_AUDIT] && (
                <Button
                  className="padding-zero"
                  onClick={() => operationDriver('audit', record)}
                  type="link"
                >
                  审核
                </Button>
              )}
            {/* {
              <Button onClick={() => confirmOk('freeze', record)} type="link">
                冻结
              </Button>
            }
            {
              <Button onClick={() => confirmOk('unfreeze', record)} type="link">
                解冻
              </Button>
            } */}
            {/* 只有内部公司可以操作变更公司 */}
            {/* {userInfo &&
              userInfo['agent_type'] == 0 &&
              userApiAuth &&
              userApiAuth[API_DRIVER_TRANSFER] && (
                <Button onClick={() => confirmOk('modify', record)} type="link">
                  变更公司
                </Button>
              )} */}
            {/* {userApiAuth && userApiAuth[API_DRIVER_LOGS] && (
              <Button onClick={() => showLogModalOpt(record)} type="link">
                操作日志
              </Button>
            )} */}
            <TableDropdown
              onSelect={(e) => selectType(e, record)}
              key="actionGroup"
              menus={[
                { key: 'remark', name: '备注' },
                
                (userInfo &&
                  userInfo['agent_type'] == 0 &&
                  userApiAuth &&
                  userApiAuth[API_DRIVER_TRANSFER] && { key: 'modify', name: '变更公司' }) ||
                  {},
                (userApiAuth && userApiAuth[API_DRIVER_LOGS] && { key: 'log', name: '操作日志' }) ||
                  {},
              ]}
            />
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      title="加盟司机管理"
      extra={
        userApiAuth &&
        userApiAuth[API_DRIVER_ADD] && [
          <Button
            onClick={() => operationDriver('new', {})}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新增司机
          </Button>,
        ]
      }
    >
      <Card
        title={
          <SearchForm
            channels={channels}
            current={dataSource.pageIndex}
            ref={childrenRefSearch}
            getDriverList={getDriverList}
          />
        }
      >
        <Table
          rowKey={(e) => e.serial}
          scroll={{x: 'max-content'}}
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.info || []}
          pagination={paginationProps}
        />
      </Card>
      {/* 操作日志 */}
      <Modal
        title="操作日志"
        visible={showLogModal}
        onCancel={() => setShowLogModal(false)}
        destroyOnClose
        footer={null}
        width={644}
        className="orderModal"
        bodyStyle={{ padding: '0 14px 24px 14px' }}
      >
        <LogModal selectRecord={selectRecord} />
      </Modal>
      {/* 封禁 变更 */}
      <Modal
        title={'操作选项'}
        visible={showType}
        destroyOnClose
        onCancel={() => setShowType()}
        onOk={handleOk}
        width={544}
      >
        {/* 封禁 */}
        {showType === 'banned' && (
          <BannedModal
            onCancel={() => setShowType()}
            getDriverList={getDriverList}
            selectDriver={selectDriver}
            ref={childrenRef}
          />
        )}
        {/* 解封 */}
        {showType === 'deblocking' && (
          <DeblockingModal
            onCancel={() => setShowType()}
            getDriverList={getDriverList}
            selectDriver={selectDriver}
            ref={childrenDeblockingRef}
          />
        )}
        {/* 变更 */}
        {showType === 'modify' && (
          <ModifyModal
            selectDriver={selectDriver}
            getDriverList={getDriverList}
            onCancel={() => setShowType()}
            ref={childrenRefModify}
          />
        )}
        {/* 冻结 */}
        {/* {showType === 'freeze' && (
          <FreezeModal
            onCancel={() => setShowType()}
            getDriverList={getDriverList}
            selectDriver={selectDriver}
            ref={childrenFreezeRef}
          />
        )} */}
        {/* 解冻 */}
        {/* {showType === 'unfreeze' && (
          <UnFreezeModal
            onCancel={() => setShowType()}
            getDriverList={getDriverList}
            selectDriver={selectDriver}
            ref={childrenUnFreezeRef}
          />
        )} */}
      </Modal>
      {/* 备注 */}
      <Modal
        title="备注"
        visible={showRemark}
        onCancel={() => setShowRemark(false)}
        onOk={handleOkRemark}
        destroyOnClose
        width={544}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="remark"
            label="司机备注"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  userApiAuth: global.userApiAuth,
  userInfo: global.userInfo,
}))(Analysis);
