import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'dva';
import {
  Col,
  message,
  Row,
  Select,
  Form,
  Input,
  Popconfirm,
  Skeleton,
  Card,
  Table,
  Avatar,
  List,
  Button,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { API_CITY_AUTH_REMOVE } from '../constant';
import { addUser, removeUser } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const ModelForm = (props, ref) => {
  const [form] = Form.useForm();
  const {
    handleCancel,
    type,
    userListData,
    areaUserData,
    getUserList,
    areaId,
    getAreaUserList,
    loading,
    companyData,
  } = props;
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const res = await form.validateFields();
      if (res) {
        return res;
      } else {
        return null;
      }
    },
    onsubmit: async () => {
      const params = {
        area: areaId,
        user_ids: selectedRowKeys.join(),
      };
      if (selectedRowKeys.length > 0) {
        const res = await addUser(params);
        if (res) {
          message.success('操作成功');
          setSelectedRowKeys([]);
          handleCancel();
        }
      } else {
        return message.info('请指定新增人');
      }
    },
    resetFields: () => {
      form.resetFields();
    },
  }));

  // 删除
  const onConfirm = async (item) => {
    const params = {
      area: areaId,
      user_ids: item.user_id,
    };
    const res = await removeUser(params);
    if (res) {
      message.success('操作成功');
      getAreaUserList({ area: areaId });
    }
  };

  const onFinish = (values) => {
    getUserList({
      area: areaId,
      ...values,
    });
  };

  // 分页
  const changePage = async (current) => {
    const values = await form.validateFields();
    const params = {
      area: areaId,
      pageIndex: current,
      ...values,
    };
    getUserList(params);
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys,
    onSelect: (record, selected) => {
      let newSelectedRows = _.cloneDeep(selectedRows);
      if (selected) {
        newSelectedRows.push(record);
      }
      if (!selected) {
        newSelectedRows = newSelectedRows.filter((item) => item.user_id !== record.user_id);
      }
      const newSelectedRowKeys = newSelectedRows.map((item) => item.user_id);
      setSelectedRows(newSelectedRows);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelectAll: (selected, _, changeRows) => {
      let newSelectedRows = _.cloneDeep(selectedRows);
      const changeRowKeys = changeRows.map((item) => item.user_id);
      if (selected) {
        setSelectedRowKeys(selectedRowKeys.concat(changeRowKeys));
        setSelectedRows(newSelectedRows.concat(changeRows));
      }
      if (!selected) {
        newSelectedRows = newSelectedRows.filter((item) => changeRowKeys.indexOf(item.user_id) === -1);
        const newSelectedRowKeys = newSelectedRows.map((item) => item.user_id);
        setSelectedRows(newSelectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
      }
    },
    getCheckboxProps(value) {
      return {
        // defaultChecked: value.status == 1 ? true : false,
        disabled: value.status == 1 ? true : false,
      };
    },
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${userListData && userListData.total}条`,
    total: userListData && userListData.total,
    pageSize: 10,
    pageSizeOptions: [10],
    current: userListData && userListData.page * 1,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '公司',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'center',
    },
  ];

  return (
    <>
      {type == 'check' && (
        <div
          style={{
            height: 300,
            overflow: 'auto',
          }}
        >
          <List
            className="demo-loadmore-list"
            loading={false}
            itemLayout="horizontal"
            dataSource={areaUserData}
            renderItem={(item) => (
              <List.Item
                actions={
                  userApiAuth &&
                  userApiAuth[API_CITY_AUTH_REMOVE] && [
                    <Popconfirm
                      onConfirm={() => onConfirm(item)}
                      title="确定删除该用户吗？"
                      okText="确定"
                      cancelText="取消"
                    >
                      <a key="list-loadmore-edit">删除</a>
                    </Popconfirm>,
                  ]
                }
              >
                <Skeleton avatar title={false} loading={false} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                    }
                    title={<a>{item.name}</a>}
                    description={item.phone}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      )}
      {type == 'new' && (
        <Card
          title={
            <Form form={form} onFinish={onFinish}>
              <Row>
                <Col span={8}>
                  <FormItem name="phone" label="手机号">
                    <Input placeholder="请输入手机号" />
                  </FormItem>
                </Col>
                <Col flex={2}>
                  <Form.Item name="company_name" label="租赁公司">
                    <Select allowClear showSearch filterOption={filterOption} placeholder="请选择">
                      {companyData &&
                        companyData.map((item) => {
                          return (
                            <Option key={item.company_id} value={item.company_name}>
                              {item.company_name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    style={{ margin: '0 8px' }}
                    htmlType="button"
                    onClick={() => form.resetFields()}
                  >
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          }
        >
          <Table
            rowSelection={rowSelection}
            loading={loading}
            rowKey={(e) => e.user_id}
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
            columns={columns}
            dataSource={userListData && userListData.info}
            pagination={paginationProps}
          />
        </Card>
      )}
    </>
  );
};

export default forwardRef(ModelForm);
