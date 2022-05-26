import React, { useState, useImperativeHandle, useEffect, forwardRef } from 'react';
import { Select, Form, Row, Col, message } from 'antd';

import { transferCompanyList, transferCompany } from '../service';

const { Item: FormItem } = Form;
const { Option } = Select;

const ModifyModal = (props, ref) => {
  const [companyList, setCompanyList] = useState(false);
  const [form] = Form.useForm();
  const { selectDriver } = props;

  useEffect(() => {
    getTransferCompanyList();
  }, []);

  /**
   * @description: 可选转移公司列表
   * @param {string} driver_id 司机id
   * @return {*}
   */
  const getTransferCompanyList = async (driver_id = '') => {
    const params = {
      driver_id: selectDriver.driver_id,
    };
    const res = await transferCompanyList(params);
    if (res) {
      setCompanyList(res.data);
    }
  };

  /**
   * @description: 转移公司
   * @param {string} driver_id 司机id
   * @param {string} transfer_company_id 被转移公司id
   * @return {*}
   */
  const setTransferCompany = async (transfer_company_id) => {
    const params = {
      driver_id: selectDriver.driver_id,
      transfer_company_id: transfer_company_id,
    };
    const res = await transferCompany(params);
    if (res) {
      const { onCancel, getDriverList } = props;
      message.success('操作成功');
      onCancel();
      getDriverList();
    }
  };

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          setTransferCompany(values.transfer_company_id);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {},
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
            label="转移公司（转移后，该司机将归属到新公司旗下）"
            name="transfer_company_id"
          >
            <Select placeholder="请选择" allowClear showSearch>
              {companyList &&
                companyList.map((item) => {
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
export default forwardRef(ModifyModal);
