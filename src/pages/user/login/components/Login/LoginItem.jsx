import { Button, Col, Input, Row, Form, message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import omit from 'omit.js';
import { getFakeCaptcha } from '@/services/login';
import ItemMap from './map';
import LoginContext from './LoginContext';
import styles from './index.less';

const FormItem = Form.Item;

const getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }) => {
  const options = {
    rules: rules || customProps.rules,
  };

  if (onChange) {
    options.onChange = onChange;
  }

  if (defaultValue) {
    options.initialValue = defaultValue;
  }

  return options;
};

const LoginItem = (props) => {
  const [count, setCount] = useState(props.countDown || 0);
  const [timing, setTiming] = useState(false); // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil

  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getCaptchaButtonText,
    getCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    ...restProps
  } = props;
  // 获取验证码
  const onGetCaptcha = useCallback(async (values) => {
    const params = {
      phone: values
    }
    const result = await getFakeCaptcha(params);
    if(result) {
      message.success('获取验证码成功,请在手机上查收!');
      setTiming(true);
    }
  }, []);
  useEffect(() => {
    let interval = 0;
    const { countDown } = props;

    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数

            return countDown || 60;
          }

          return preSecond - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing]);

  if (!name) {
    return null;
  }

  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  if (type === 'Captcha') {
    const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
    return (
      <FormItem shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                disabled={timing}
                className={styles.getCaptcha}
                size="large"
                onClick={() => {
                  const value = getFieldValue('phone');
                  onGetCaptcha(value);
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }

  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems = {};
Object.keys(ItemMap).forEach((key) => {
  const item = ItemMap[key];

  LoginItems[key] = (props) => (
    <LoginContext.Consumer>
      {(context) => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});
export default LoginItems;
