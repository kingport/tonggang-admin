import React, { useImperativeHandle, forwardRef } from 'react';
import { DatePicker, Input, Form } from 'antd';
import moment from 'moment';
import { useDispatch } from 'dva';
import UploadElement from '@/components/UploadElement';

const { Item: FormItem } = Form;
const QualificationForm = (props, ref) => {
  const { type, editDetail } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  function disabledDate(current) {
    // 不能小于今天以前
    return (
      (current && current < moment().add(0, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }
  // 下一步表单
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          if (values.business_license_valid_date) {
            values.business_license_valid_date = moment(values.business_license_valid_date)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss');
          }
          // 缓存资质信息
          dispatch({
            type: 'companyNew/qualificationData',
            payload: { qualificationData: values },
          });
          props.nextStepOk();
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
  }));
  // 表单赋值
  const setField = (params) => {
    form.setFieldsValue(params);
  };
  const qualificationData = props.qualificationData;
  // 查看详情 编辑详情
  if (!editDetail && (type === 'check' || type === 'edit')) {
    return;
  } else {
    form.resetFields();
  }
  return (
    <Form labelAlign="left" {...formItemLayout} layout="horizontal" form={form}>
      <FormItem
        initialValue={
          (editDetail && editDetail.identifier_code) || qualificationData.identifier_code || ''
        }
        rules={[
          {
            required: true,
            message: '请填写统一社会信用代码',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/;
              if (pattern.test(value)) {
                // console.log(value);
                return Promise.resolve();
              }
              return Promise.reject('您输入的统一社会信用代码格式不正确');
            },
          }),
        ]}
        name="identifier_code"
        label="统一社会信用代码"
      >
        <Input
          style={{ width: 200 }}
          disabled={type === 'check'}
          placeholder="请填写统一社会信用代码"
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.legal_name) || qualificationData.legal_name || ''}
        rules={[
          {
            required: true,
            message: '请填写企业法人姓名',
          },
        ]}
        name="legal_name"
        label="企业法人姓名"
      >
        <Input
          style={{ width: 200 }}
          disabled={type === 'check'}
          placeholder="请填写企业法人姓名"
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.legal_idno) || qualificationData.legal_idno || ''}
        rules={[
          {
            required: true,
            message: '请填写企业法人身份证号',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
              if (pattern.test(value)) {
                // console.log(value);
                return Promise.resolve();
              }
              return Promise.reject('您输入的身份证格式不正确');
            },
          }),
        ]}
        name="legal_idno"
        label="企业法人身份号"
      >
        <Input
          style={{ width: 200 }}
          disabled={type === 'check'}
          placeholder="请填写企业法人身份证号"
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.legal_photo) || qualificationData.legal_photo || ''}
        rules={[
          {
            required: true,
            message: '请填写企业法人手机号',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^1\d{10}$/;
              if (pattern.test(value)) {
                // console.log(value);
                return Promise.resolve();
              }
              return Promise.reject('您输入的手机号格式不正确');
            },
          }),
        ]}
        name="legal_photo"
        label="企业法人手机号"
      >
        <Input
          style={{ width: 200 }}
          disabled={type === 'check'}
          placeholder="请填写企业法人手机号"
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.email) || qualificationData.email || ''}
        rules={[
          {
            required: true,
            message: '请填写签约邮箱',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
              if (pattern.test(value)) {
                // console.log(value);
                return Promise.resolve();
              }
              return Promise.reject('您输入的邮箱格式不正确');
            },
          }),
        ]}
        name="email"
        label="签约邮箱"
      >
        <Input style={{ width: 200 }} disabled={type === 'check'} placeholder="请填写签约邮箱" />
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && moment(editDetail.business_license_valid_date)) ||
          moment(qualificationData.business_license_valid_date) ||
          moment(new Date()).endOf('day')
        }
        rules={[
          {
            required: true,
            message: '请选择营业执照失效时间',
          },
        ]}
        name="business_license_valid_date"
        label="营业执照失效时间"
      >
        <DatePicker disabledDate={disabledDate} disabled={type === 'check'} format="YYYY-MM-DD" />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请上传营业执照扫描件（正本）',
          },
        ]}
        name="business_license_photo"
        label="营业执照扫描件（正本）"
      >
        <UploadElement
          disabled={type === 'check'}
          initialImageUrl={
            (editDetail && editDetail.business_license_photo) ||
            qualificationData.business_license_photo ||
            ''
          }
          setField={setField}
          itemName="business_license_photo"
          uploadTxt="营业执照扫描件（正本）"
        />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请上传法人身份证正面照',
          },
        ]}
        name="legal_id_front_photo"
        label="法人身份证正面照"
      >
        <UploadElement
          disabled={type === 'check'}
          initialImageUrl={
            (editDetail && editDetail.legal_id_front_photo) ||
            qualificationData.legal_id_front_photo ||
            ''
          }
          setField={setField}
          itemName="legal_id_front_photo"
          uploadTxt="法人身份证正面照"
        />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
            message: '请上传法人身份证背面照',
          },
        ]}
        name="legal_id_backend_photo"
        label="法人身份证背面照"
      >
        <UploadElement
          disabled={type === 'check'}
          initialImageUrl={
            (editDetail && editDetail.legal_id_backend_photo) ||
            qualificationData.legal_id_backend_photo ||
            ''
          }
          setField={setField}
          itemName="legal_id_backend_photo"
          uploadTxt="法人身份证背面照"
        />
      </FormItem>
    </Form>
  );
};
export default forwardRef(QualificationForm);
