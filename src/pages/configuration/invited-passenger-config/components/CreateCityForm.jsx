import React, { useImperativeHandle, forwardRef } from 'react';
import { message, Select, Form } from 'antd';
import _ from 'lodash';
import { layout } from '@/utils/constant';
import { useSelector } from 'dva';
import { setActivityArea } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;

const CreateCityForm = (props, ref) => {
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          //
          values.status = 1;
          addActivityArea(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 新增城市
  const addActivityArea = async (values) => {
    const res = await setActivityArea(values);
    if (res) {
      const { onCancel, activityArea } = props;
      message.success('新增成功！');
      onCancel();
      activityArea();
    }
  };

  return (
    <Form {...layout} form={form}>
      {/* <FormItem
        rules={[
          {
            required: true,
            message: '请选择产品类型',
          },
        ]}
        name="coupon_type"
        label="产品类型"
        initialValue={(type === 'edit' && editData.coupon_type) || null}
      >
        <Select style={{ width: 200 }} placeholder="请选择产品类型" allowClear showSearch>
          {ticketType.map((item) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      </FormItem> */}
      <FormItem
        rules={[
          {
            required: true,
            message: '请选择城市',
          },
        ]}
        name="area_id"
        label="城市"
      >
        <Select
          style={{ width: 200 }}
          allowClear
          showSearch
          placeholder="请选择城市"
          filterOption={filterOption}
          // mode="multiple"
        >
          {userCityCountyList &&
            userCityCountyList.map((item) => {
              return (
                <Option key={item.city} value={item.city}>
                  {item.city_name}
                </Option>
              );
            })}
        </Select>
      </FormItem>
    </Form>
  );
};

export default forwardRef(CreateCityForm);
