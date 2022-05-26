import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { Spin, Tag, Table, Card } from 'antd';
import { useSelector } from 'dva';
import SearchForm from './SearchForm';
import { fullTimeDriverList } from '../service';

const AddDriverModle = (props, ref) => {
  const { onSelectChange, clearAll, selectedRowKeys, buttonLoading } = props;
  const childrenRef = useRef(null);

  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});

  useEffect(() => {
    getPartTimeDriverList();
  }, []);

  useImperativeHandle(ref, () => ({
    updataPartTimeDriverList: () => {
      return getPartTimeDriverList();
    },
  }));

  /**
   * @description: 获取兼职司机列表
   * @param {object} params 参数
   * @return {object} res
   */
  const getPartTimeDriverList = async (values = {}) => {
    setLoading(true);
    const params = {
      work_type: 1,
      ...values,
    };
    try {
      const res = await fullTimeDriverList(params);
      if (res && res.data) {
        res.data.info.map((x) => (x.key = x.driver_id));
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
      work_type: 1,
      page_index: current,
      ...values,
    };
    getPartTimeDriverList(parasm);
  };
  // 页脚配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    current: dataSource.pageIndex * 1,
    pageSize: 20,
    pageSizeOptions: [20],
    onChange: (current) => changePage(current),
  };
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '司机手机号',
      dataIndex: 'cell',
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
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
      title: '所属公司',
      dataIndex: 'join_company_name',
    },
  ];

  const init = () => {
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        {
          key: 'cancelAll',
          text: '取消全选',
          onSelect: () => {
            clearAll();
          },
        },
      ],
    };
    return (
      <Table
        title={() => <Tag color="#87d068">勾选司机设置为全职司机</Tag>}
        size="small"
        bordered
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource.info || []}
        pagination={paginationProps}
      />
    );
  };

  return (
    <Spin spinning={buttonLoading}>
      <Card
        title={
          <SearchForm type="add" getFullTimeDriverList={getPartTimeDriverList} ref={childrenRef} />
        }
      >
        {init()}
      </Card>
    </Spin>
  );
};
export default forwardRef(AddDriverModle);
