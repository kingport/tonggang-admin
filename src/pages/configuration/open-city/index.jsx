// 开城配置
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import {
  Button,
  Table,
  PageHeader,
  Card,
  Row,
  Divider,
  Pagination,
  Modal,
  Space,
  message,
  Popconfirm,
  Tag,
} from 'antd';

import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import OperationLogModal from '@/components/OperationLogModal';
import { cityListConfig, toOprCity } from './service';
import { API_OPEN_CITY_LIST, API_OPEN_CITY_ADD, API_OPEN_CITY_UPDATA } from './constant';

import SearchForm from './components/SearchForm';
import CreateCity from './components/CreateCity';

const OpenCity = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRefSearch = useRef(null);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [tableData, setTableData] = useState({});
  // console.log(userApiAuth, 'userApiAuth');

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_OPEN_CITY_LIST]) {
      getCityListConfig();
    }
  }, [userApiAuth]);
  // 获取配置列表
  const getCityListConfig = async (params = {}) => {
    setTableLoading(true);
    const res = await cityListConfig(params);
    if (res) {
      setTableData(res.data);
    }
    setTableLoading(false);
  };

  // 关闭开启
  const toSetOprCity = async (status, id) => {
    const params = {
      id,
      status,
    };
    const res = await toOprCity(params);
    if (res) {
      message.success('操作成功');
      getCityListConfig();
    }
  };

  const getCountyName = (areaId, countys) => {
    // 找到对应城市数据
    const data = cityCountyList && cityCountyList.filter((item) => item.city == areaId)[0];
    const countyData = data ? data.county_infos : [];
    // 生成区县名字
    let countysName = '';
    countys.map((item) => {
      if (item) {
        const countyPitch =
          countyData.filter((countyItem) => countyItem.county === parseInt(item, 10))[0] || {};
        if (countyPitch.county_name) {
          countysName += ` ${countyPitch.county_name} `;
        }
      }
      return item;
    });
    return countysName;
  };

  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    console.log(values, 'BB');
    values.page_index = current;
    getCityListConfig(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${tableData.total}条`,
    total: tableData.total,
    pageSize: 10,
    current: tableData.page_index,
    onChange: (current) => changePage(current),
  };

  const columns = [
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
      title: '二级区县',
      dataIndex: 'county',
      key: 'county',
      render: (text, record) => {
        const countys = text ? text.split(',') : [];
        return <div>{getCountyName(parseInt(record.area, 10), countys)}</div>;
      },
    },
    {
      title: '配置时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <>
            {record.status === '1' && <Tag color="green">开启</Tag>}
            {record.status === '2' && <Tag color="#aaa">关闭</Tag>}
          </>
        );
      },
    },
    // {
    //   title: '操作人员',
    //   dataIndex: 'operator_name',
    //   key: 'operator_name',
    // },
    {
      title: '操作',
      // width: 170,
      render: (record) => (
        <Space>
          {record.status === '1' && userApiAuth && userApiAuth[API_OPEN_CITY_UPDATA] && (
            <Popconfirm
              title="确定要操作吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => toSetOprCity('2', record.id)}
            >
              <Button style={{ padding: 0 }} type="link">
                关闭
              </Button>
            </Popconfirm>
          )}
          {record.status === '2' && userApiAuth && userApiAuth[API_OPEN_CITY_UPDATA] && (
            <Popconfirm
              title="确定要操作吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => toSetOprCity('1', record.id)}
            >
              <Button style={{ padding: 0 }} type="link">
                启动
              </Button>
            </Popconfirm>
          )}
          <Button
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              setShowOperationLogModal(true);
              setSelectRecord(record);
            }}
          >
            操作日志
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer
      title="开城配置"
      extra={
        userApiAuth &&
        userApiAuth[API_OPEN_CITY_ADD] && [
          <Button
            onClick={() => setShowAddCityModal(true)}
            icon={<PlusOutlined />}
            key="1"
            type="primary"
          >
            新建城市
          </Button>,
        ]
      }
    >
      <Card title={<SearchForm getCityListConfig={getCityListConfig} ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.id}
          bordered
          scroll={{x: 'max-content'}}
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData.list}
        />
      </Card>
      <Modal
        title="新增城市"
        visible={showAddCityModal}
        destroyOnClose
        onCancel={() => setShowAddCityModal(false)}
        footer={null}
        width={480}
        className="orderModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <CreateCity
          onCancel={() => setShowAddCityModal(false)}
          getCityListConfig={getCityListConfig}
        />
      </Modal>
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="teamModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={7}
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

export default OpenCity;
