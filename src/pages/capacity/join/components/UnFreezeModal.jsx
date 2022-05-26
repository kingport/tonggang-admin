import React, { useImperativeHandle, forwardRef } from 'react';
import { message, Form, Row, Col, Input } from 'antd';
import { freezeAccount } from '../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const UnFreezeModal = (props, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          const { selectDriver } = props;
          // 司机id
          values.driver_id = selectDriver.driver_id;
          values.freeze_status = 0;
          setFreezeAccount(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {},
  }));

  /**
   * @description: 冻结账号
   * @param {object} params 冻结参数
   * @return {*}
   */
  const setFreezeAccount = async (params) => {
    const res = await freezeAccount(params);
    if (res) {
      message.success('操作成功');
      const { onCancel, getDriverList } = props;
      onCancel();
      getDriverList();
    }
  };

  return (
    <Form form={form}>
      <Row>
        <Col span={24}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请填写解冻原因',
              },
            ]}
            label="解冻原因"
            name="remark"
          >
            <TextArea rows={4} />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
export default forwardRef(UnFreezeModal);
