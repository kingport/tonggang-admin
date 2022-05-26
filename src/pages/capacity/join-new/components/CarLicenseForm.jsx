// 车证信息
import React, { useImperativeHandle, forwardRef } from 'react';
import { Card, Input, Form, message, DatePicker, Row, Col, Space, Popconfirm, Button } from 'antd';
import { useDispatch } from 'dva';
import moment from 'moment';
import UploadElement from '@/components/UploadElement';

const { Item: FormItem } = Form;

const CarLicenseForm = (props, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }
  // 表单赋值
  const setField = (params) => {
    form.setFieldsValue(params);
  };

  // 表单信息
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // 过滤空项
          Object.keys(values).forEach((key) => {
            if (!values[key]) {
              delete values[key];
            }
          });
          if (values.net_trans_permit_issue_date) {
            values.net_trans_permit_issue_date = moment(values.net_trans_permit_issue_date).format(
              'YYYY-MM-DD',
            );
          }
          if (values.net_trans_permit_valid_date) {
            values.net_trans_permit_valid_date = moment(values.net_trans_permit_valid_date).format(
              'YYYY-MM-DD',
            );
          }
          dispatch({
            type: 'joinNew/saveDriverOnlineDrivingLicense',
            payload: {
              driverOnlineDrivingLicense: values,
            },
          });
          // console.log(values, 'carLicenseData');
          return values;
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          return message.error('请填写完整的车证信息');
        });
    },
    getValues: async () => {
      try {
        return await form.validateFields();
      } catch (error) {
        throw message.error('请填写完整的车证信息');
      }
    },
  }));

  const { detail, type, delectLicense, mustDriverConfig } = props;

  return (
    <Card
      title={
        <Space>
          <span>车证信息:(注意：加*为必填字段)</span>
          {(type == 'edit' || type == 'audit') && (
            <Popconfirm
              title="确定删除车证信息吗?"
              onConfirm={() => {
                delectLicense('car');
              }}
              // onCancel={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary">删除</Button>
            </Popconfirm>
          )}
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              initialValue={(detail && detail.net_trans_permit_id) || ''}
              name="net_trans_permit_id"
              label="网约车车证号"
              rules={[
                {
                  required: mustDriverConfig.must_dodl == 1 && type == 'new' ? true : false,
                },
              ]}
            >
              <Input disabled={type === 'check'} placeholder="请输入网约车车证号" />
            </FormItem>
          </Col>
          {/* <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              initialValue={(detail && moment(detail.net_trans_permit_issue_date)) || ''}
              name="net_trans_permit_issue_date"
              label="发证日期"
            >
              <DatePicker
                disabledDate={disabledDate_start}
                disabled={type === 'check'}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col> */}
          <Col xs={12} sm={12} md={12} lg={12} xl={4}>
            <FormItem
              rules={[
                {
                  required: mustDriverConfig.must_dodl == 1 && type == 'new' ? true : false,
                },
              ]}
              initialValue={(detail && moment(detail.net_trans_permit_valid_date)) || ''}
              name="net_trans_permit_valid_date"
              label="有效期"
            >
              {/* <RangePicker
                disabledDate={disabledDate}
                disabled={joinType === 'check'}
                format="YYYY-MM-DD"
              /> */}
              <DatePicker
                disabledDate={disabledDate}
                disabled={type === 'check'}
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem
              rules={[
                {
                  required: mustDriverConfig.must_dodl == 1  && type == 'new' ? true : false,
                },
              ]}
              name="net_trans_permit_photo"
              label="网约车车证"
            >
              <UploadElement
                initialImageUrl={(detail && detail.net_trans_permit_photo) || ''}
                setField={setField}
                itemName="net_trans_permit_photo"
                uploadTxt="网约车车证"
                disabled={type === 'check'}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default forwardRef(CarLicenseForm);
