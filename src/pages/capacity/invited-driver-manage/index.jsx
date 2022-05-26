import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Table } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

import { companyList } from './service';
import SearchForm from './components/SearchForm';

const InvitedDriverManage = (props) => {
  const { cityCountyList } = props;

  const childrenRefSearch = useRef(null);

  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    getCompanyList();
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  /**
   * @description: 获取邀请人列表
   * @param {object} params 请求参数
   * @return {*}
   */
  const getCompanyList = async (params = {}) => {
    setLoading(true);
    const res = await companyList(params);
    if (res) {
      res.data.info.map((x, index) => (x.serial = index + 1));
      setDataSource(res.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  /**
   * @description: 查询分页
   * @param {string} current 查询当前页码
   * @return {*}
   */
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    const parasm = {
      page_index: current,
      ...values,
    };
    getCompanyList(parasm);
  };

  // 页码配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.page_index,
    onChange: (current) => changePage(current),
  };

  // 表格配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'serial',
      align: 'center',
      key: 'serial',
    },
    {
      title: '邀请人手机号',
      dataIndex: 'cell',
      key: 'cell',
      align: 'center',
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
      align: 'left',
      render: (area_id) => {
        let city_name = '';
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area_id).city_name;
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '公司',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'center',
    },
    {
      title: '邀请司机数（审核通过）',
      dataIndex: 'inviter_count',
      key: 'inviter_count',
      align: 'center',
    },
    {
      title: '达标司机数',
      dataIndex: 'finished_count',
      key: 'finished_count',
      align: 'center',
    },
    {
      title: '历史累计奖励（元）',
      dataIndex: 'inviter_history_amount',
      key: 'inviter_history_amount',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      // width: 350,
      render: (record) => {
        return (
          <div>
            {
              <Button
                onClick={() => history.push(`/capacity/invited-driver-detail/${record.driver_id}`)}
                type="link"
              >
                查看
              </Button>
            }
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="邀请司机列表">
      <Card title={<SearchForm ref={childrenRefSearch} getCompanyList={getCompanyList} />}>
        <Table
          rowKey={(e) => e.serial}
          bordered
          scroll={{x: 'max-content'}}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource.info}
          pagination={paginationProps}
        />
      </Card>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  userApiAuth: global.userApiAuth,
  cityCountyList: global.cityCountyList,
}))(InvitedDriverManage);
