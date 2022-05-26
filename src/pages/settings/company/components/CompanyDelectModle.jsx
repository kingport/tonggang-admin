import React, { useImperativeHandle, forwardRef } from 'react';
import { Row, Select, Form, Col } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;
const CompanyDelectModle = (props,ref) => {
  const { transferList } = props
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));

  return (
    <Form form={form} layout="vertical">
      <Row>
        <Col span={24}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请选择公司',
              },
            ]}
            label="删除后，该公司司机将归属到新公司旗下"
            name="driver_to_company_id"
          >
            <Select placeholder="请选择" allowClear showSearch>
              {transferList &&
                transferList.map((item) => {
                  return (
                    <Option key={item.company_id} value={item.company_id}>
                      {item.company_name}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(CompanyDelectModle);
