import React, { useImperativeHandle, forwardRef } from 'react';
import { Select, InputNumber, Input, Form } from 'antd';
import { useDispatch, useSelector } from 'dva';

const { Item: FormItem } = Form;
const { Option } = Select;
const BankCardForm = (props, ref) => {
  const { bankCardData, basicData, type, editDetail } = props;
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          // console.log(values, '基本信息');
          // 缓存基本信息
          dispatch({
            type: 'companyNew/bankCardData',
            payload: { bankCardData: values },
          });
          props.nextStepOk();
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
  }));

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };
  // console.log(bankCardData, 'bankCardData');

  if (!editDetail && (type === 'check' || type === 'edit')) {
    return;
  } else if (editDetail) {
    form.resetFields();
  }
  return (
    <Form labelAlign="left" {...formItemLayout} layout="horizontal" form={form}>
      <FormItem
        initialValue={
          (editDetail && editDetail.legal_area * 1) || bankCardData.legal_area * 1 || null
        }
        rules={[
          {
            required: true,
            message: '请选择对公账户开设城市',
          },
        ]}
        name="legal_area"
        label="对公账户开设城市"
      >
        <Select
          disabled={type === 'check'}
          filterOption={filterOption}
          placeholder="请选择对公账户开设城市"
          style={{ width: 200 }}
          allowClear
          showSearch
        >
          {cityCountyList.map((item) => {
            return (
              <Option key={item.city} value={item.city}>
                {item.city_name}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.bank_name) || bankCardData.bank_name || ''}
        rules={[
          {
            required: true,
            message: '请输入开户银行',
          },
        ]}
        name="bank_name"
        label="开户银行"
      >
        <Input style={{ width: 300 }} disabled={type === 'check'} placeholder="请输入开户银行" />
      </FormItem>
      <FormItem
        initialValue={
          (editDetail && editDetail.account_opening_branch) ||
          bankCardData.account_opening_branch ||
          ''
        }
        rules={[
          {
            required: true,
            message: '请输入开户支行',
          },
        ]}
        name="account_opening_branch"
        label="开户支行"
      >
        <Input style={{ width: 300 }} disabled={type === 'check'} placeholder="请输入开户支行" />
      </FormItem>
      <FormItem
        initialValue={(editDetail && editDetail.bank_code) || bankCardData.bank_code || ''}
        rules={[
          {
            required: true,
            message: '请输入银行卡号',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^[0-9]\d{9,29}$/;
              if (pattern.test(value)) {
                // console.log(value);
                return Promise.resolve();
              }
              return Promise.reject('您输入的银行卡号格式不正确');
            },
          }),
        ]}
        name="bank_code"
        label="银行卡号"
      >
        <Input style={{ width: 300 }} disabled={type === 'check'} placeholder="请输入银行卡号" />
      </FormItem>
      {basicData.cooperative_mode != 2 && (
        <FormItem
          initialValue={
            (editDetail && editDetail.public_driver_order_profit) ||
            bankCardData.public_driver_order_profit ||
            0
          }
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          name="public_driver_order_profit"
          label="订单分润设置(公海司机)"
        >
          <InputNumber
            disabled={type === 'check'}
            precision={1}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
        </FormItem>
      )}
      {basicData.cooperative_mode != 2 && (
        <FormItem
          initialValue={
            bankCardData.third_driver_order_profit ||
            (editDetail && editDetail.third_driver_order_profit) ||
            3
          }
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          name="third_driver_order_profit"
          label="订单分润设置(非公海司机)"
        >
          <InputNumber
            disabled={type === 'check'}
            precision={1}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
        </FormItem>
      )}

      {basicData.cooperative_mode == 2 && (
        <FormItem
          initialValue={
            (editDetail && editDetail.agent_b_order_profit) ||
            bankCardData.agent_b_order_profit ||
            15
          }
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          name="agent_b_order_profit"
          label="代理b订单抽成设置"
        >
          <InputNumber
            disabled={type === 'check'}
            precision={1}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
        </FormItem>
      )}
    </Form>
  );
};
export default forwardRef(BankCardForm);
