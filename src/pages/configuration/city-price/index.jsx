import React, { useState, useRef, useEffect } from 'react';
import { Card, Modal, Table, Badge, Tag, Button, Popconfirm, Row, Col, Space, message } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import OperationLogModal from '@/components/OperationLogModal';

import {
  ORDER_CENTER_CHANNEL,
  CONFIG_CITY_PRICE_TYPE,
  CONFIG_CITY_PRICE_STATUS,
} from '@/utils/constant';
import moment from 'moment';

import { cityPriceList, cityPriceDetail, cityPriceDisable } from './service';
import SearchForm from './components/SearchForm';
import CreateCityPriceModal from './components/CreateForm';
import {
  API_PRICE_LIST,
  API_PRICE_ADD,
  API_PRICE_DETAIL,
  API_PRICE_UPDATE,
  API_PRICE_REVIEW,
} from './constant';
import './index.less';

const cityPrice = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  // 弹窗显示
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectRecord, setSelectRecord] = useState();

  const childrenRef = useRef(null);
  const childrenRefSearch = useRef(null);

  const [type, setType] = useState('');
  const [cityPriceData, setCityPriceData] = useState();
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_PRICE_LIST]) {
      getCityPriceList();
    }
  }, [userApiAuth, userInfo]);

  /**
   * @description: 获取计价配置列表
   * @param {*}
   * @return {*}
   */
  const getCityPriceList = async (params = {}) => {
    setLoading(true);
    const res = await cityPriceList(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };
  /**
   * @description: 获取该城市的计价详情配置
   * @param {*} record
   * @param {*} type
   * @return {*}
   */
  const getCityPriceDetail = async (params = {}) => {
    const res = await cityPriceDetail(params);
    if (res) {
      setCityPriceData(res.data);
    }
  };
  /**
   * @description: 选择查看 编辑 复制 审核
   * @param {*} record
   * @param {*} type
   * @return {*}
   */
  const operationDriver = (record, type) => {
    setType(type);
    if (type == 'log') {
      setShowLog(true);
      setSelectRecord(record);
    }
    if (type != 'new' && type !== 'log') {
      const params = {
        id: record.id,
      };
      getCityPriceDetail(params);
    } else {
      setCityPriceData();
    }
  };

  /**
   * @description: 终止计价配置
   * @param {*}
   * @return {*}
   */
  const stopCityPrice = async (record) => {
    const params = {
      id: record.id,
      status: '4',
    };
    const res = await cityPriceDisable(params);
    if (res) {
      message.success('操作成功');
      setType('');
      getCityPriceList();
    }
  };

  /**
   * @description: 获取历史操作
   * @param {*}
   * @return {*}
   */
  const getTable = (data) => {
    const dataSource =
      data &&
      data.map((item, index) => {
        item.key = index;
        return item;
      });
    const columns = [
      {
        title: '操作时间',
        dataIndex: 'op_time',
        key: 'op_time',
      },
      {
        title: '操作人',
        dataIndex: 'op_user_name',
        key: 'op_user_name',
      },
      {
        title: '操作详情',
        dataIndex: 'op_type',
        key: 'op_type',
      },
    ];

    return (
      <Table
        bordered={false}
        size="small"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
      />
    );
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    values.per_page = 10;
    values.page = current;
    getCityPriceList(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    pageSizeOptions: [10],
    current: dataSource.current_page,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '平台',
      dataIndex: 'channel',
      key: 'channel',
      align: 'center',
      render: (channel) => {
        return (
          <span>{ORDER_CENTER_CHANNEL[channel] ? ORDER_CENTER_CHANNEL[channel].value : ''}</span>
        );
      },
    },
    {
      title: '产品类型',
      dataIndex: 'product_id',
      key: 'product_id',
      align: 'center',
      render: (product_id) => {
        return <span>{CONFIG_CITY_PRICE_TYPE[product_id]}</span>;
      },
    },
    {
      title: '城市',
      dataIndex: 'area',
      key: 'area',
      align: 'left',
      ellipsis: true,
      render: (area) => {
        let city_name = null;
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area);
          if (city_name) {
            city_name = cityCountyList.find((x) => x.city == area).city_name;
          } else {
            city_name = '无该城市ID';
          }
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '区县',
      dataIndex: 'abstract_district',
      key: 'abstract_district',
      render: (text, record) => {
        const code = record.abstract_district.split(',')[1];
        const one = record.abstract_district.split(',')[0];
        const countyInfos =
          cityCountyList &&
          cityCountyList[
            _.findIndex(cityCountyList, (o) => {
              return o.district_code === one;
            })
          ];
        const countyName =
          countyInfos &&
          countyInfos.county_infos[
            _.findIndex(countyInfos.county_infos, (o) => {
              return o.county === code * 1;
            })
          ];
        return <span>{countyName && countyName.county_name}</span>;
      },
    },
    {
      title: '计费模式',
      dataIndex: 'price_mode',
      key: 'price_mode',
      align: 'center',
      render: (price_mode) => {
        return (
          <Tag color={price_mode == 1 ? '#f55' : '#87d068'}>
            {price_mode == 0 ? '起步价' : '一口价'}
          </Tag>
        );
      },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return <span>{CONFIG_CITY_PRICE_STATUS[status]}</span>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      align: 'center',
    },
    {
      title: '失效时间',
      render: (text, record) => {
        if (moment(record.end_time).fromNow().indexOf('前') > -1) {
          return (
            <Tag color="red">
              {moment(record.end_time).fromNow()}
              已失效
            </Tag>
          );
        }
        return (
          <Tag color="green">
            {moment(record.end_time).fromNow()}
            失效
          </Tag>
        );
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
    },
    {
      title: '日期类型',
      dataIndex: 'day_type',
      key: 'day_type',
      align: 'center',
      render: (day_type) => {
        return (
          <>
            {day_type === '1' && <span>常规</span>}
            {day_type === '2' && <span>节假日</span>}
            {day_type === '3' && <span>自定义</span>}
          </>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'oper',
      key: 'oper',
      width: 285,
      render: (text, record) => (
        <Space size={5}>
          {userApiAuth && userApiAuth[API_PRICE_DETAIL] && (
            <Button
              className="padding-zero"
              type="link"
              onClick={() => operationDriver(record, 'show')}
            >
              查看
            </Button>
          )}
          {record.status * 1 === 1 &&
            userApiAuth &&
            userApiAuth[API_PRICE_DETAIL] &&
            userApiAuth[API_PRICE_UPDATE] && (
              <Button
                className="padding-zero"
                onClick={() => operationDriver(record, 'edit')}
                type="link"
              >
                编辑
              </Button>
            )}
          {userApiAuth && userApiAuth[API_PRICE_DETAIL] && (
            <Button
              className="padding-zero"
              type="link"
              onClick={() => operationDriver(record, 'copy')}
            >
              复制
            </Button>
          )}
          {record.status * 1 === 1 && userApiAuth && userApiAuth[API_PRICE_REVIEW] && (
            <Button
              className="padding-zero"
              type="link"
              onClick={() => operationDriver(record, 'review')}
            >
              审核
            </Button>
          )}
          {record.status * 1 === 2 && userApiAuth && userApiAuth[API_PRICE_REVIEW] && (
            <Popconfirm
              onConfirm={() => stopCityPrice(record)}
              title="确定要操作吗?"
              okText="确定"
              cancelText="取消"
            >
              <Button className="padding-zero" type="link">
                终止
              </Button>
            </Popconfirm>
          )}
          {
            <Button
              className="padding-zero"
              type="link"
              onClick={() => operationDriver(record, 'log')}
            >
              操作日志
            </Button>
          }
        </Space>
      ),
    },
  ];
  return (
    <PageContainer
      title="城市定价管理"
      extra={
        userInfo &&
        userInfo.agent_type != 3 &&
        userApiAuth &&
        userApiAuth[API_PRICE_ADD] && [
          <Button
            onClick={() => operationDriver({}, 'new')}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新增
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm ref={childrenRefSearch} getCityPriceList={getCityPriceList} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          loading={loading}
          columns={columns}
          dataSource={dataSource.list}
          pagination={paginationProps}
        />
      </Card>
      {/* 计价配置 新增 复制 查看 编辑 */}
      <Modal
        visible={['new', 'show', 'edit', 'review', 'copy'].indexOf(type) > -1}
        width={900}
        footer={null}
        onCancel={() => {
          setType('');
          setCityPriceData();
        }}
        className="cityPrice"
      >
        <CreateCityPriceModal
          ref={childrenRef}
          onCancel={() => {
            setType('');
            setCityPriceData();
          }}
          getCityPriceList={getCityPriceList}
          data={cityPriceData}
          type={type}
        />
      </Modal>
      {/* 操作日志 */}
      {/* <Modal title="操作日志" visible={showLog} footer={null} onCancel={() => setShowLog(false)}>
        {getTable(_.get(cityPriceData, 'op_log'))}
      </Modal> */}
      <Modal
        title="操作日志"
        visible={showLog}
        destroyOnClose
        onCancel={() => setShowLog(false)}
        footer={null}
        width={544}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={5}
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

export default cityPrice;
