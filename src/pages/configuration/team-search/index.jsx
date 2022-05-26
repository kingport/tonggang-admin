// 开城配置
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import {
  Button,
  Table,
  Card,
  Row,
  Modal,
  Badge,
  message,
  Popconfirm,
  Popover,
  Descriptions,
  Space,
  Tag,
  Image,
} from 'antd';

import _, { isBuffer } from 'lodash';
import { history } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';
import { accountShowTrans, addOpterationLog, proxyForwarder } from './service';
import { API_EVENT_LIST, API_EVENT_CREATE, API_EVENT_OPERATE } from './constant';
import SearchForm from './components/SearchForm';
import CreateForm from './components/CreateForm';
// import DownloadForm from './components/DownloadForm';
import './index.less';
const { Item: DescriptionsItem } = Descriptions;

const TeamSearch = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRefSearch = useRef(null);
  const downloadRef = useRef(null);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [tableData, setTableData] = useState();
  const [type, setType] = useState();
  useEffect(() => {
    if (userApiAuth && userApiAuth[API_EVENT_LIST]) {
      getEventList();
    }
  }, []);

  /**
   * @description: 获取活动配置列表
   * @param {*}
   * @return {*}
   */
  const getEventList = async (pageIndex = 1) => {
    setTableLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      service_module: 'POPE',
      service_api: '/sparrow/weisswal/api/activity/list',
      service_params: {
        ...values,
        page: pageIndex,
        size: 10,
      },
    };
    const res = await proxyForwarder(params);
    if (res) {
      setTableData(res);
    }
    setTableLoading(false);
  };

  /**
   * @description: 获取城市名称
   * @param {*}
   * @return {*}
   */
  const getCityName = (cities) => {
    let citiesName = '';
    cities.map((item) => {
      if (item) {
        const data =
          (cityCountyList && cityCountyList.filter((cityItem) => cityItem.city === item)[0]) || {};
        if (data.city_name) {
          citiesName += ` ${data.city_name} `;
        }
      }
      return item;
    });
    return citiesName;
  };

  /**
   * @description: 获取区县名称
   * @param {*}
   * @return {*}
   */
  const getCountyName = (record) => {
    const cities = record.cities;
    const counties = record.counties;
    let countyName = '';
    if (cities) {
      const city =
        cityCountyList && cityCountyList.filter((x) => x.city == cities[0])[0].county_infos;
      counties.map((item) => {
        const data = (city && city.filter((x) => x.county === item)[0]) || {};
        if (item) {
          if (data.county_name) {
            if (countyName.length !== 0) {
              countyName += ` ,${data.county_name}`;
            } else {
              countyName += ` ${data.county_name}`;
            }
          }
        }
        return item;
      });
      return countyName;
    }
  };

  /**
   * @description: 活动配置规则
   * @param {*} teamConfig
   * @return {*}
   */
  const teamConfig = (teamConfig) => {
    const teamActions = teamConfig ? JSON.parse(teamConfig) : [];
    return (
      <Descriptions size="small" column={1}>
        {teamActions.map((item) => {
          const { order_num, cash } = item;
          return (
            <DescriptionsItem key={order_num} label={`完成单数>=${order_num}单`}>{`奖励${
              cash || 0
            }元`}</DescriptionsItem>
          );
        })}
      </Descriptions>
    );
  };

  // 分页
  const changePage = async (current) => {
    getEventList(current);
  };

  const publishStop = async (status, id) => {
    const userName = userInfo && userInfo.name;
    const params = {
      service_module: 'POPE',
      service_api: '/sparrow/weisswal/api/activity/status_operate',
      service_params: {
        activity_id: id,
        status,
        user_name: userName,
      },
    };
    const res = await proxyForwarder(params);
    if (res) {
      message.success('操作成功');
      getEventList();
    }
  };

  // 显示日志
  const modalChange = (record) => {
    setSelectRecord(record);
    setShowOperationLogModal(true);
  };

  /**
   * @description: 添加详情日志
   * @param {*} async
   * @return {*}
   */
  const addLog = async (record) => {
    const params = {
      id: record.id,
    };
    const res = await addOpterationLog(params);
    if (res) {
    }
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${tableData && tableData.page_info.total}条`,
    total: tableData && tableData.page_info.total,
    pageSize: 10,
    current: tableData && tableData.page_info.page_index * 1 + 1,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '活动ID',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return <span>{text == 1 ? '天活动' : '周期活动'}</span>;
      },
    },
    {
      title: '城市',
      dataIndex: 'cities',
      key: 'cities',
      // width: 200,
      ellipsis: true,
      render: (cities) => {
        return (
          <Popover placement="topLeft" content={getCityName(cities || [])}>
            {getCityName(cities || [])}
          </Popover>
        );
      },
    },
    {
      title: '区县',
      // width: 100,
      ellipsis: true,
      render: (text, record) => {
        return (
          <DescriptionsItem label="开通区县">
            {record.counties != null && record.counties != '' && (
              <Popover
                content={getCountyName(record)}
                trigger="click"
                overlayStyle={{ width: 250 }}
              >
                <Button type="link">详情</Button>
              </Popover>
            )}
          </DescriptionsItem>
        );
      },
    },
    {
      title: '有效期',
      dataIndex: 'validity',
      key: 'validity',
      render: (text, record) => (
        <div>
          <span>{record.start_day}</span>
          <span>至</span>
          <span>{record.end_day}</span>
        </div>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '活动设置',
      width: 235,
      render: (record) => {
        const { activity_start_time, activity_end_time, rules = '', action } = record;
        return (
          <Row>
            <Descriptions className="descriptions" size="small" column={1}>
              <DescriptionsItem label="生效时段">
                <span>{`${activity_start_time}-${activity_end_time}`}</span>
              </DescriptionsItem>
              <DescriptionsItem label="奖励规则">
                <Popover content={rules} trigger="click" overlayStyle={{ width: 250 }}>
                  <Button type="link">详情</Button>
                </Popover>
              </DescriptionsItem>
              <DescriptionsItem label="活动配置">
                <Popover content={teamConfig(action)} trigger="click" overlayStyle={{ width: 250 }}>
                  <Button onClick={() => addLog(record)} type="link">
                    详情
                  </Button>
                </Popover>
              </DescriptionsItem>
            </Descriptions>
          </Row>
        );
      },
    },
    {
      title: '活动状态',
      render: (record) => {
        const { start_day, activity_start_time, end_day, activity_end_time } = record;
        const teamStatus = [
          {
            key: 4,
            name: '待审核',
          },
          {
            key: 1,
            name: '审核通过',
          },
          {
            key: 2,
            name: '审核未通过',
          },
          {
            key: 3,
            name: '已终止',
          },
        ];
        const data = teamStatus.filter((item) => item.key == record.status)[0];
        if (data && data.key === 1) {
          const currentTime = new Date().getTime();
          const startTime = moment(`${start_day} ${activity_start_time}`).valueOf();
          const endTime = moment(`${end_day} ${activity_end_time}`).valueOf();
          if (currentTime > endTime) {
            return <span style={{ color: '#00000073' }}>已结束</span>;
          }
          if (startTime <= currentTime <= endTime) {
            return <Badge status="processing" text="进行中" />;
          }
          return '';
        }
        return data ? data.name : '';
      },
    },
    {
      title: '操作',
      // width: 250,
      render: (record) => {
        const { start_day, activity_start_time, end_day, activity_end_time } = record;
        const startTime = moment(`${start_day} ${activity_start_time}`).valueOf();
        const currentTime = new Date().getTime();
        const endTime = moment(`${end_day} ${activity_end_time}`).valueOf();
        return (
          <Space>
            {record.status == 4 && (
              <Button
                className="padding-zero"
                type="link"
                onClick={() => {
                  setType('edit');
                  setSelectRecord(record);
                }}
              >
                编辑
              </Button>
            )}
            {record.status == 4 && userApiAuth && userApiAuth[API_EVENT_OPERATE] && (
              <Popconfirm
                title="确定要操作吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => publishStop(1, record.id)}
              >
                <Button className="padding-zero" type="link">
                  发布
                </Button>
              </Popconfirm>
            )}

            {
              <Button className="padding-zero" type="link" onClick={() => modalChange(record)}>
                操作日志
              </Button>
            }
            {record.status == 1 &&
              !(currentTime > endTime) &&
              userApiAuth &&
              userApiAuth[API_EVENT_OPERATE] && (
                <Popconfirm
                  title="确定要操作吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => publishStop(3, record.id)}
                >
                  <Button className="padding-zero" type="link">
                    终止
                  </Button>
                </Popconfirm>
              )}
            {(record.status == 3 || (currentTime > endTime && record.status == 1)) && (
              <Button
                className="padding-zero"
                type="link"
                href={`${window.location.origin}/saasbench/v1/activity/rewardDownload/index?activity_id=${record.id}`}
              >
                活动数据
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      title="活动查询"
      extra={
        userApiAuth &&
        userApiAuth[API_EVENT_CREATE] && [
          <Button onClick={() => setType('add')} icon={<PlusOutlined />} key="1" type="primary">
            新建活动
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} getEventList={getEventList} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          scroll={{ x: 'max-content' }}
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData && tableData.data}
          size="small"
        />
      </Card>
      <Modal
        visible={type == 'add' || type == 'edit'}
        onCancel={() => {
          setType();
          setSelectRecord({});
        }}
        footer={null}
        width={544}
      >
        <CreateForm
          selectRecord={selectRecord}
          getEventList={getEventList}
          type={type}
          onCancel={() => {
            setType('');
            setSelectRecord({});
          }}
        />
      </Modal>
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => {
          setShowOperationLogModal(false);
          setSelectRecord({});
        }}
        footer={null}
        width={544}
        className="teamModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={6}
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

export default TeamSearch;
