import React, { useImperativeHandle, forwardRef } from 'react';
import { message, DatePicker, InputNumber, Input, Form } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { useDispatch } from 'dva';
import { addCompany, updateCompany } from '../service';
const { Item: FormItem } = Form;
const SignForm = (props, ref) => {
  const { type, editDetail, companyId } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const dispatch = useDispatch();
  function disabledDate(current) {
    // 不能小于今天以前
    return (
      (current && current < moment().add(0, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          if (values.cooperate_date) {
            values.cooperate_date = moment(values.cooperate_date)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss');
          }
          // 缓存签名信息
          dispatch({
            type: 'companyNew/signData',
            payload: { signData: values },
          });

          // 确认提交
          const { basicData, qualificationData, bankCardData } = props;
          // 如果是多选城市数组则需要处理 转换为string 且以,相隔
          if (basicData.area_id instanceof Array) {
            basicData.area_id = basicData.area_id.join(',');
          }
          const params = {
            ...basicData,
            ...qualificationData,
            ...bankCardData,
            ...values,
          };
          // console.log(params, '最后提交的信息');
          if (type === 'edit') {
            params.company_id = companyId;
            // 更新编辑
            editCompany(params);
          } else {
            acertCompany(params);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
  }));

  // 编辑公司
  const editCompany = async (params) => {
    const res = await updateCompany(params);
    if (res) {
      message.success('编辑成功');
      history.push('/settings/company');
    }
  };
  // 新建公司
  const acertCompany = async (params) => {
    const res = await addCompany(params);
    if (res) {
      message.success('新建成功');
      history.push('/settings/company');
    }
  };
  const signData = props.signData;
  // 查看详情 编辑详情
  if (!editDetail && (type === 'check' || type === 'edit')) {
    return;
  }
  return (
    <Form
      labelAlign="left"
      style={{ width: '40%' }}
      {...formItemLayout}
      layout="horizontal"
      form={form}
    >
      <FormItem
        initialValue={(editDetail && editDetail.broker_name) || signData.broker_name || ''}
        rules={[
          {
            required: true,
            message: '请输入对接人姓名',
          },
        ]}
        name="broker_name"
        label="对接人姓名"
      >
        <Input disabled={type === 'check'} placeholder="请输入对接人姓名" />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.broker_phone) || signData.broker_phone || ''}
        rules={[
          {
            required: true,
            message: '请输入对接人手机号',
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
        name="broker_phone"
        label="对接人手机号"
      >
        <Input disabled={type === 'check'} placeholder="请输入对接人手机号" />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.broker_idno) || signData.broker_idno || ''}
        rules={[
          {
            required: true,
            message: '请输入对接人身份证号',
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
        name="broker_idno"
        label="对接人身份证号"
      >
        <Input disabled={type === 'check'} placeholder="请输入对接人身份证号" />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.broker_email) || signData.broker_email || ''}
        rules={[
          {
            required: true,
            message: '请输入对接人邮箱',
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
        name="broker_email"
        label="对接人邮箱"
      >
        <Input disabled={type === 'check'} placeholder="请输入对接人邮箱" />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.max_acount_num) || signData.max_acount_num || ''}
        rules={[
          {
            required: true,
            message: '请输入系统开设用户上限',
          },
        ]}
        name="max_acount_num"
        label="系统开设用户上限"
      >
        <InputNumber
          disabled={type === 'check'}
          style={{ width: 200 }}
          min={0}
          max={50}
          placeholder="最大可输入50"
        />
      </FormItem>
      <FormItem
        initialValue={(editDetail && moment(editDetail.cooperate_date)) || null}
        rules={[
          {
            required: true,
            message: '请选择签约合作期限',
          },
        ]}
        name="cooperate_date"
        label="签约合作期限"
      >
        <DatePicker disabledDate={disabledDate} disabled={type === 'check'} format="YYYY-MM-DD" />
      </FormItem>
    </Form>
  );
};
export default forwardRef(SignForm);
