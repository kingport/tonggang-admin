/* 设置日期 */
import React, { useState } from 'react';
import { Form, Button, Row, message, Input, Radio, Col } from 'antd';
import { toSetDate } from '../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const SetDateModal = (props) => {
  const { onCancel, selectDate, selectMoment, fetchData } = props;
  const [form] = Form.useForm();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // 获取数据
  const submitOperation = async () => {
    console.log(form, 'form');
    const values = await form.validateFields();
    console.log(values, 'values');
    const params = {
      day: selectDate,
      ...values,
    };
    setButtonDisabled(true);
    const res = await toSetDate(params);
    if (res) {
      onCancel();
      fetchData(selectMoment);
      message.success('设置成功');
    }
    setButtonDisabled(false);
  };

  return (
    <Form layout="vertical" form={form}>
      <FormItem
        name="day_type"
        rules={[
          {
            required: true,
            message: '请选择日期类型',
          },
        ]}
        label="日期类型"
      >
        <Radio.Group>
          <Radio value={1}>工作日</Radio>
          <Radio value={2}>节假日</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem
        name="description"
        rules={[
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,500})$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('请输入内容为500个字符以内');
            },
          }),
        ]}
        label="日期描述"
      >
        <TextArea rows={2} placeholder="请输入日期描述" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button style={{ display: 'inline-block' }} onClick={onCancel}>
            取消
          </Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
            loading={buttonDisabled}
            onClick={submitOperation}
            type="primary"
          >
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
  //  }
};

export default SetDateModal;
