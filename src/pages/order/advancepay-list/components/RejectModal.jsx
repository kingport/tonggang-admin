import React, { useState } from 'react';
import { Form, Input, Button, Row, message, Col } from 'antd';
import { advancereject } from '../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const RejectModal = (props) => {
  const { onCancel, getAdvanceList, selectRecord } = props;
  const [form] = Form.useForm();

  const [buttonDisabled] = useState(false);

  // 确认操作
  const reject = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        values.oid = selectRecord.order_id;
        const res = await advancereject(values);
        if (res) {
          message.success('操作成功');
          onCancel();
          getAdvanceList();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form layout="vertical" form={form} className="rejectForm">
      <FormItem
        rules={[
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,500})$/g;
              if (pattern.test(value) || !value) {
                return Promise.resolve();
              }
              return Promise.reject('请输入内容为500个字符以内');
            },
          }),
        ]}
        name="advance_audit_status_msg"
        label="备注"
      >
        <TextArea rows={4} placeholder="请输入备注" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button style={{ display: 'inline-block' }} onClick={onCancel}>
            取消
          </Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
            loading={buttonDisabled}
            onClick={reject}
            type="primary"
          >
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default RejectModal;
