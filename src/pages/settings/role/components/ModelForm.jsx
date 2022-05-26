import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { message, Form, Input } from 'antd';
import { createRole, updateRole } from '../service';
const { Item: FormItem } = Form;
const { TextArea } = Input;
const ModelForm = (props, ref) => {
  const { type, roleDetail } = props;
  const [form] = Form.useForm();
  // 获取详情
  useEffect(() => {
    if (type === 'edit') {
      form.resetFields();
    }
  }, [roleDetail]);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [type]);
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 编辑
          if (type === 'edit') {
            values.role_id = roleDetail.id;
            modificationRole(values);
          } else {
            // 添加
            addRole(values);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));

  // 新建角色
  const addRole = async (values) => {
    const res = await createRole(values);
    if (res) {
      const { handleCancel, getRoleList } = props;
      message.success('添加成功');
      const params = {
        page_size: 10,
        page_index: 1,
      };
      handleCancel();
      getRoleList(params);
    }
  };

  // 更新角色
  const modificationRole = async (values) => {
    const res = await updateRole(values);
    if (res) {
      const { handleCancel, getRoleList } = props;
      message.success('更新成功');
      const params = {
        page_size: 10,
        page_index: 1,
      };
      handleCancel();
      getRoleList(params);
    }
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  if (!roleDetail && type === 'edit') return;
  return (
    <Form {...layout} form={form} layout="horizontal">
      <FormItem
        initialValue={(roleDetail && roleDetail.name) || null}
        rules={[
          {
            required: true,
            message: '请输入角色名称',
          },
        ]}
        name="name"
        label="角色名称"
      >
        <Input placeholder="请输入角色名称" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请输入角色描述',
          },
        ]}
        initialValue={(roleDetail && roleDetail.description) || null}
        name="description"
        label="角色描述"
      >
        <TextArea rows={2} placeholder="请输入角色描述" />
      </FormItem>
    </Form>
  );
};

export default forwardRef(ModelForm);
