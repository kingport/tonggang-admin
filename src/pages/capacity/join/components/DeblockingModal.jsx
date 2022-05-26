import React, { useImperativeHandle, forwardRef } from 'react';
import { message, Form, Row, Col, Input } from 'antd';
import { driverSetBan } from '../service';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const DeblockingModal = (props, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          const { selectDriver } = props;
          // 司机id
          values.driver_id = selectDriver.driver_id;
          values.ban_code = 0;

          delete values.time;
          driverBanned(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {},
  }));

  /**
   * @description: 解封司机
   * @param {object} params 解封参数
   * @return {*}
   */
  const driverBanned = async (params) => {
    const res = await driverSetBan(params);
    if (res) {
      const { getDriverList, onCancel } = props;
      message.success('操作成功!');
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
                message: '请填写解封原因',
              },
            ]}
            label="解封原因"
            name="reason"
          >
            <TextArea rows={4} />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
export default forwardRef(DeblockingModal);
