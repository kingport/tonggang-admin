import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useSelector } from 'dva';
import { Tag, message, Tree, Select, Form, Input } from 'antd';
import { createUser, getInfo, updateUser, getUserRoleList, getCompanyListAuth } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;

const ModelForm = (props, ref) => {
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const [form] = Form.useForm();
  const { userId, type } = props;
  const [detail, setDetail] = useState({});
  const [roleData, setRoleData] = useState({});
  const [treeData, setTreeData] = useState([]);

  const [expandedKeys, setExpandedKeys] = useState();
  const [checkedKeys, setCheckedKeys] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 获取角色列表
  useEffect(() => {
    form.resetFields();
    getRoleList();
    getCompanyList();
  }, []);
  // 获取编辑用户信息
  useEffect(() => {
    if (type === 'edit') {
      userDetail(userId);
    }
    if (type === 'new') {
      setExpandedKeys(null);
      setCheckedKeys(null);
      setDetail({});
      form.setFieldsValue({
        name: null,
        phone: null,
        email: null,
        role_ids: null
      })
    }
  }, [type, userId]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          if (checkedKeys) {
            values.own_companys_id = checkedKeys.join(',');
          }
          // 编辑
          if (type === 'edit') {
            values.user_id = userId;
            editUser(values);
          } else {
            // 添加
            addUser(values);
          }
        })
        .catch((info) => {
          console.error('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
      setDetail({});
    },
  }));

  // 获取账户拥有的公司权限
  const getCompanyList = async () => {
    const res = await getCompanyListAuth();
    if (res) {
      const { data = {} } = res;
      const treeDataArr = [
        {
          title: '全选',
          key: 'unwanted',
          children: [],
        },
      ];
      Object.keys(data).forEach((key) => {
        let obj = {
          title: key !== '省级代理' && key !== '内部公司' ? searchCity(key) : key,
          key: `unwanted-${data[key][0].company_id}`,
          children: [],
        };
        data[key].map((_item) => {
          let _obj = {
            title: _item.company_name,
            key: `${_item.company_id}`,
          };
          obj.children.push(_obj);
        });
        treeDataArr[0].children.push(obj);
      });
      setTreeData(treeDataArr);
    }
  };

  // 查找城市
  const searchCity = (key) => {
    if (cityCountyList) {
      return cityCountyList.filter((x) => x.city == key * 1)[0].city_name;
    }
  };
  // 获取角色列表
  const getRoleList = async () => {
    const res = await getUserRoleList();
    if (res) {
      setRoleData(res.data);
    }
  };

  // 创建用户
  const addUser = async (values) => {
    const params = {
      ...values,
    };
    const res = await createUser(params);
    if (res) {
      message.success('新增成功');
      const params = {
        is_disable: 0,
      };
      props.userList(params);
      props.handleCancel();
    }
  };

  // 编辑用户
  const editUser = async (values) => {
    const params = {
      ...values,
    };
    const res = await updateUser(params);
    if (res) {
      message.success('编辑成功');
      const params = {
        is_disable: 0,
      };
      props.userList(params);
      // 重新请求公司数据权限
      getCompanyList();
      props.handleCancel();
    }
  };

  // 获取用户信息
  const userDetail = async (userId) => {
    const params = {
      user_id: userId,
    };
    const res = await getInfo(params);
    if (res) {
      setDetail(res.data.user_detail);
      setExpandedKeys(res.data.own_company_ids);
      setCheckedKeys(res.data.own_company_ids);
    }
    // 重置表单
    form.resetFields();
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys) => {
    // 过滤不需要的key
    const checkedKeys_ = checkedKeys.filter((x) => x.indexOf('unwanted') == -1);
    setCheckedKeys(checkedKeys_);
  };

  const onSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  if (JSON.stringify(detail) == '{}' && type === 'edit') return;

  if(detail.agent_type!==undefined){
    if(detail.agent_type!=0){
      //非内部员工
      //找到超级管理员
      const index = roleData.list.findIndex(item=>item.id===1);
      if(index!=-1){
        roleData.list.splice(index, 1);
      }
    }
  }

  return (
    <Form labelAlign="left" {...formItemLayout} form={form}>
      <FormItem
        initialValue={(detail && detail.name) || null}
        rules={[{ required: true, message: '请输入姓名' }]}
        name="name"
        label="姓名"
      >
        <Input placeholder="请输入姓名" />
      </FormItem>
      <FormItem
        initialValue={(detail && detail.phone) || null}
        rules={[
          { required: true, message: '请输入手机号' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^1\d{10}$/;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('您输入的手机号格式不正确');
            },
          }),
        ]}
        name="phone"
        label="手机号"
      >
        <Input disabled={detail && detail.is_broker == 1} placeholder="请输入手机号" />
      </FormItem>
      <FormItem
        initialValue={(detail && detail.email) || null}
        rules={[
          { required: true, message: '请输入邮箱号' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('您输入的邮箱格式不正确');
            },
          }),
        ]}
        name="email"
        label="邮箱号"
      >
        <Input disabled={detail && detail.is_broker == 1} placeholder="请输入邮箱号" />
      </FormItem>
      {type == 'new' && (
        <FormItem rules={[{ required: true, message: '请输入密码' }]} name="password" label="密码">
          <Input.Password placeholder="请输入8-30位数字加字母组合密码" />
        </FormItem>
      )}
      {type == 'new' && (
        <FormItem
          rules={[
            { required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('您输入的两个密码不匹配');
              },
            }),
          ]}
          name="passwordAgain"
          label="确认密码"
        >
          <Input.Password placeholder="请输入8-30位数字加字母组合密码" />
        </FormItem>
      )}
      {((detail && (detail.agent_type == userInfo.agent_type || detail.is_broker == 1)) ||
        type === 'new') && (
        <FormItem
          rules={[
            {
              required: true,
              message: '请选择角色',
            },
          ]}
          name="role_ids"
          label="角色"
          initialValue={(detail && detail.role_ids * 1) || null}
        >
          <Select placeholder="请选择角色" style={{ width: 200 }} allowClear>
            {roleData && roleData.list &&
              roleData.list.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      )}
      {((detail && detail.agent_type == userInfo.agent_type) || type === 'new') &&
        detail.is_all_authority != 1 && (
          <FormItem
            rules={[
              {
                required: false,
                message: '请选择租赁公司',
              },
            ]}
            name="company_id"
            initialValue={1}
            label="数据权限"
          >
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </FormItem>
        )}
      {detail && detail.is_broker == 1 && (
        <FormItem label="数据权限">
          <Tag color="#87d068">{detail && detail.company_name}</Tag>
        </FormItem>
      )}
      {detail && detail.is_all_authority == 1 && (
        <FormItem label="数据权限">
          <Tag color="#87d068">拥有全部数据权限</Tag>
        </FormItem>
      )}
    </Form>
  );
};

export default forwardRef(ModelForm);
