import { Checkbox, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit, PwdChange } = LoginForm;

const Login = (props) => {
  const { submitting } = props;
  const childrenRef = useRef(null);

  const [autoLogin, setAutoLogin] = useState(true);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('account-phone');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  // 展示修改密码弹窗
  const changePwd = () => {
    setVisible(true);
  };

  // 关闭修改弹窗
  const handleCancel = () => {
    setVisible(false);
  };

  // 确定
  const handleOk = () => {
    childrenRef.current.onFinish();
  };
  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account-phone" tab="手机账号登录">
          <UserName
            name="phone"
            placeholder="请输入手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="account" tab="邮箱密码登录">
          <UserName
            name="email"
            placeholder="请输入邮箱号"
            rules={[
              {
                required: true,
                message: '请输入邮箱号',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>

        <Tab key="phone" tab="验证码登录">
          <Mobile
            name="phone"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="code"
            placeholder="验证码"
            countDown={60}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          {type !== 'phone' && (
            <a onClick={changePwd} style={{ float: 'right' }}>
              忘记密码
            </a>
          )}
        </div>
        <Submit loading={submitting}>登录</Submit>
        {/* 修改密码弹窗 */}
        <Modal
          maskClosable={false}
          width={600}
          title="修改密码"
          okText="确定"
          cancelText="取消"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <PwdChange handleCancel={handleCancel} ref={childrenRef} type={type} />
        </Modal>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
