import React, { useState, useRef, useEffect } from 'react';
import { Card, Table } from 'antd';
import { useSelector } from 'dva';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import { intentionDriverList } from './service';
import SearchForm from './components/SearchForm';

const IntendedDriversList = () => {
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRef = useRef(null);

  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    getIntendedDriverList();
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  /**
   * @description: 获取意向司机列表
   * @param {object} params 参数
   * @return {object} res
   */
  const getIntendedDriverList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await intentionDriverList(params);
      if (res && res.data) {
        if (res.data.list) {
          res.data.list.map((x, index) => (x.index = index + 1));
        }
        setDataSource(res.data);
        setLoading(false);
      } else {
        setDataSource([]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description: 分页查询列表
   * @param {string} current 当前页码
   * @return {object} res
   */
  const changePage = async (current) => {
    const values = await childrenRef.current.validateFields();
    const parasm = {
      page_index: current,
      ...values,
    };
    getIntendedDriverList(parasm);
  };
  // 页脚配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    current: dataSource.page_index,
    pageSizeOptions: [10],
    onChange: (current) => changePage(current),
  };

  // 表格列配置项
  const columns = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '申请时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'cell',
      key: 'cell',
      align: 'center',
    },
    {
      title: '报名公司',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'center',
    },
    {
      title: '运营城市',
      dataIndex: 'city_code',
      key: 'city_code',
      align: 'center',
      render: (city_code) => {
        let city_name = '';
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == city_code)
            ? cityCountyList.find((x) => x.city == city_code).city_name
            : '无该城市ID';
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '运营区县',
      align: 'center',
      render: (record) => {
        let county_name = '';
        if (cityCountyList) {
          county_name = cityCountyList
            .find((x) => x.city == record.city_code)
            .county_infos.find((x) => x.county == record.county_code).county_name;
        }
        return <span>{county_name || '--'}</span>;
      },
    },
    {
      title: '邀请人手机号',
      dataIndex: 'inviter_user_cell',
      key: 'inviter_user_cell',
      align: 'center',
    },
  ];
  return (
    <PageContainer title="意向司机列表">
      <Card title={<SearchForm ref={childrenRef} getIntendedDriverList={getIntendedDriverList} />}>
        <Table
          rowKey={(e) => e.id}
          scroll={{x: 'max-content'}}
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.list || []}
          pagination={paginationProps}
        />
      </Card>
    </PageContainer>
  );
};

export default IntendedDriversList;
