import React, { forwardRef, useImperativeHandle } from 'react';
import { message, Form, Input } from 'antd';
import { adminResetPassword } from '../service';
const { Item: FormItem } = Form;

const PasswordForm = (props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          const { userId } = props;
          values.user_id = userId
          modificationPwd(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));

  // 修改密码
  const modificationPwd = async (params = {}) => {
    const res = await adminResetPassword(params);
    if (res) {
      message.success('修改成功');
      props.handleCancelPwd();
    }
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
  const onFinish = (e) => {
    // console.log(e);
  };
  return (
    <Form labelAlign="left" {...formItemLayout} form={form} onFinish={onFinish}>
      <FormItem
        rules={[{ required: true, message: '请输入密码' }]}
        name="new_password"
        label="新密码"
      >
        <Input.Password placeholder="请输入密码" />
      </FormItem>
      <FormItem
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('new_password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('您输入的两个密码不匹配');
            },
          }),
        ]}
        name="new_password_agin"
        label="确认密码"
      >
        <Input.Password placeholder="请输入密码" />
      </FormItem>
    </Form>
  );
};

export default forwardRef(PasswordForm);
