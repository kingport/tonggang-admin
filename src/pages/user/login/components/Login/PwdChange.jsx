import { Button, Form, Input, Row, Col, message } from 'antd';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { mailVerify, chengePassword, phoneChangePasswordVerify } from '@/services/login';

const FormItem = Form.Item;
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

const PwdChange = (props, ref) => {
  const { type } = props;
  const [form] = Form.useForm();
  const [timing, setTiming] = useState(false);
  const [count, setCount] = useState(60);
  // 倒计时
  useEffect(() => {
    let interval = 0;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数

            return count || 60;
          }

          return preSecond - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // console.log(values, '修改密码表单信息');
          modificationPwd(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
      setDetail(null);
    },
  }));

  // 确认修改密码
  const modificationPwd = async (values) => {
    const res = await chengePassword(values);
    if (res) {
      message.success('修改成功');
      // 关闭弹窗
      const { handleCancel } = props;
      handleCancel();
    }
  };

  // 发送验证码
  const getCode = async (type) => {
    // console.log(type, 'type')
    // console.log(form.getFieldValue('email'), 'form');
    // 邮箱验证码
    if (form.getFieldValue('email') && type === 'account') {
      try {
        const params = {
          mail: form.getFieldValue('email'),
        };
        const res = await mailVerify(params);
        if (res) {
          // console.log(res);
          message.success('验证码发送成功！');
          setTiming(true);
        }
      } catch (error) {
        message.error(error);
      }
    }
    // 手机验证码
    if (form.getFieldValue('phone') && type === 'account-phone') {
      try {
        const params = {
          phone: form.getFieldValue('phone'),
        };
        const res = await phoneChangePasswordVerify(params);
        if (res) {
          // console.log(res);
          message.success('验证码发送成功！');
          setTiming(true);
        }
      } catch (error) {
        message.error(error);
      }
    }
  };
  return (
    <Form labelAlign="left" {...formItemLayout} form={form}>
      {type === 'account' && (
        <FormItem
          rules={[
            { required: true, message: '请填写账号' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (pattern.test(value)) {
                  // console.log(value);
                  return Promise.resolve();
                }

                return Promise.reject('您输入的邮箱格式不正确');
              },
            }),
          ]}
          name="email"
          label="邮箱账号"
          style={{ marginTop: 15 }}
        >
          <Input style={{ width: 300 }} placeholder="请输入邮箱号码" />
        </FormItem>
      )}
      {type === 'account-phone' && (
        <FormItem
          rules={[{ required: true, message: '请填写手机号' }]}
          name="phone"
          label="手机号"
          style={{ marginTop: 15 }}
        >
          <Input style={{ width: 300 }} placeholder="请输入手机号码" />
        </FormItem>
      )}
      <FormItem
        name="code"
        rules={[
          {
            required: true,
            message: '请填写验证码',
          },
        ]}
        label="验证码"
        // extra="确保您的邮箱可以收到验证码"
      >
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              noStyle
              rules={[
                {
                  required: true,
                  message: '请填写验证码',
                },
              ]}
            >
              <Input placeholder="请填写验证码" />
            </FormItem>
          </Col>
          <Col span={12}>
            <Button type="primary" disabled={timing} onClick={() => getCode(type)}>
              {timing ? `${count} 秒` : '获取验证码'}
            </Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem rules={[{ required: true, message: '请输入密码' }]} name="password" label="新密码">
        <Input.Password placeholder="请输入密码" />
      </FormItem>
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
        name="new_password_agin"
        label="确认密码"
      >
        <Input.Password placeholder="请输入密码" />
      </FormItem>
    </Form>
  );
};

export default forwardRef(PwdChange);
