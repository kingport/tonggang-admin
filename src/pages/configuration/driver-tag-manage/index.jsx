import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, message, Table, Tag, Modal, Form, Input, Space, Radio, Select } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';

import { cancelJudgeTypeDriverList, batchSetCancelJudgeType } from './service';
import SearchForm from './components/SearchForm';

const { TextArea } = Input;
const { Option } = Select;

const DriverTagManage = () => {
  const childrenRefSearch = useRef(null);

  // const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectUser, setSelectUser] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.agent_type == 0) {
      getcancelJudgeTypeDriverList();
    }
  }, []);

  /**
   * @description: 获取取消订单判责列表
   * @param {object} params 参数
   * @return {*}
   */
  const getcancelJudgeTypeDriverList = async (param = {}) => {
    setLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await cancelJudgeTypeDriverList(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };

  // 确定取消司机管控
  const handleOk = async () => {
    const values = form.getFieldsValue();
    if (values.driver_ids) {
      values.driver_ids = Array.from(new Set(values.driver_ids.split(',')));
      // 只能输入纯数字和,号
      const reg = /^[0-9,]+$/;
      if (reg.test(values.driver_ids)) {
        // console.log('ok');
        values.driver_ids = values.driver_ids.join(',');
        if (values.driver_ids.charAt(values.driver_ids.length - 1) == ',') {
          values.driver_ids = values.driver_ids.slice(0, -1);
        }
      } else {
        return message.error('请严格按照指定格式输入');
      }
      console.log(values.driver_ids, 'values.driver_ids');
    }
    // console.log(values, 'PP')
    const params = {
      ...values,
    };
    const res = await batchSetCancelJudgeType(params);
    if (res) {
      message.success('操作成功');
      getcancelJudgeTypeDriverList();
      setVisible(false);
    }
  };

  //批量取消司机管控
  const batchManage = async () => {
    const driver_ids = selectedRowKeys.join(',');
    // console.log(phone_list);
    const params = {
      driver_ids,
      cancel_judge_type: 2,
    };
    const res = await batchSetCancelJudgeType(params);
    if (res) {
      message.success('操作成功');
      getcancelJudgeTypeDriverList();
      setVisible(false);
    }
  };

  /**
   * @description: 选中
   * @param {*}
   * @return {*}
   */
  const onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * @description: 选中标签
   * @param {*}
   * @return {*}
   */
  const selcetBatchUser = (userId) => {
    if (userId) {
      setSelectUser(userId);
    }
  };

  // 分页
  const changePage = async (current) => {
    const params = {
      page_index: current,
    };
    getcancelJudgeTypeDriverList(params);
  };
  // 分页
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    pageSize: 10,
    current: dataSource.pageIndex,
    onChange: (current) => changePage(current),
  };

  // 显示操作日志
  const showOperationLog = (record) => {
    // console.log(record);
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: '司机姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '司机手机号',
      key: 'cell',
      dataIndex: 'cell',
      align: 'center',
    },
    {
      title: '司机ID',
      key: 'driver_id',
      dataIndex: 'driver_id',
      align: 'center',
    },
    {
      title: '城市',
      key: 'area_id',
      dataIndex: 'area_id',
      align: 'center',
      render: (code) => {
        let cityName = '';
        if (cityCountyList && cityCountyList.find((x) => x.city == code)) {
          cityName = cityCountyList.find((x) => x.city == code).city_name;
        }
        return <span>{cityName}</span>;
      },
    },
    {
      title: '所属公司',
      key: 'join_company_name',
      dataIndex: 'join_company_name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'left',
      render: (record) => {
        return (
          <Space>
            <Button className="padding-zero" onClick={() => showOperationLog(record)} type="link">
              操作日志
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer title="司机标签管理">
      <Card
        title={
          <SearchForm
            ref={childrenRefSearch}
            getcancelJudgeTypeDriverList={getcancelJudgeTypeDriverList}
            totalCount={dataSource.totalCount}
          />
        }
      >
        <div>
          <Table
            title={() => (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <Select
                    style={{ width: 200 }}
                    placeholder="批量操作"
                    onChange={selcetBatchUser}
                    allowClear
                  >
                    {[
                      {
                        name: '删除取消管控司机',
                        value: '2',
                      },
                    ].map((item, index) => {
                      return (
                        <Option key={item.value} value={item.value}>
                          <Tag>{item.name}</Tag>
                        </Option>
                      );
                    })}
                  </Select>
                  <Button
                    disabled={selectedRowKeys.length == 0 || !selectUser}
                    onClick={batchManage}
                    type="primary"
                  >
                    确定
                  </Button>
                </Space>
                <Space>
                  {/* <Button onClick={() => setVisible(true)} type="primary">
                    删除司机标签
                  </Button> */}
                  <Button onClick={() => setVisible(true)} type="primary">
                    添加司机标签
                  </Button>
                </Space>
              </div>
            )}
            rowKey={(e) => e.driver_id}
            bordered
            scroll={{x: 'max-content'}}
            size="small"
            loading={loading}
            columns={columns}
            dataSource={dataSource.info || []}
            pagination={paginationProps}
            rowSelection={rowSelection}
          />
        </div>
      </Card>
      {/* 打标签弹窗 */}
      <Modal
        // maskClosable={false}
        width={400}
        title="添加司机标签"
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="cancel_judge_type"
            label="标签名称"
            initialValue="1"
          >
            <Radio.Button checked>取消管控司机</Radio.Button>
          </Form.Item>
          <Form.Item
            name="driver_ids"
            label="指定司机"
            rules={[
              {
                required: true,
                message: '请输入指定司机',
              },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="请输入司机ID，以“,”隔开，不要输入空格，最大支持输入50个"
            />
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
          id={selectRecord && selectRecord.driver_id}
          type={22}
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
export default DriverTagManage;
