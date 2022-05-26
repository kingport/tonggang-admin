import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, DatePicker } from 'antd';

const { Item: FormItem } = Form;
const { RangePicker } = DatePicker;

const DownloadForm = (props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));
  const dateChange = () => {};
  return (
    <Form form={form} className="downloadForm">
      <h4 style={{ marginBottom: 10 }}>请先选择流水区间(更精确）</h4>
      <FormItem name="time">
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={['开始', '结束']}
          onChange={dateChange}
        />
      </FormItem>
    </Form>
  );
};

export default forwardRef(DownloadForm);
