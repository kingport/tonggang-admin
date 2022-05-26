/* 结束订单组件 */
import React, { useState } from 'react';
import { useSelector } from 'dva';
import { Form, Button, Row, message, Modal, Select, Col } from 'antd';
import { toAddCity } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;

const AddCityModal = (props) => {
  const { onCancel, getCityListConfig } = props;
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  const [form] = Form.useForm();

  const [countyList, setCountyList] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  /**
   * @description: 新建开城配置
   * @param {*} params 参数
   * @return {*}
   */
  const onFinish = async (values) => {
    setButtonDisabled(true);
    const params = {
      ...values,
      county: values.county.join(','),
    };
    const res = await toAddCity(params);
    if (res) {
      message.success('操作成功');
      onCancel();
      getCityListConfig();
    }
    setButtonDisabled(false);
  };
  /**
   * @description: 选择城市
   * @param {string} e 城市码
   * @return {*}
   */
  const changeCity = (e) => {
    if (e) {
      let county = cityCountyList.find((x) => x.city === e).county_infos;
      setCountyList(county);
    } else {
      setCountyList([]);
    }
    form.setFieldsValue({
      county: [],
    });
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <FormItem
        label="产品类型"
        name="product_id"
        rules={[
          {
            required: true,
            message: '请选择产品类型',
          },
        ]}
      >
        <Select placeholder="请选择产品类型">
          {[{ value: 1, name: '快车' }].map((item) => {
            return (
              <Option value={item.value} key={item.value}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        label="城市"
        name="area"
        rules={[
          {
            required: true,
            message: '请选择城市',
          },
        ]}
      >
        <Select
          onChange={changeCity}
          allowClear
          showSearch
          filterOption={filterOption}
          placeholder="请选择"
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
      <Form.Item name="county" label="选择区县">
        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={filterOption}
          placeholder="请选择"
        >
          {countyList &&
            countyList.map((item) => {
              return (
                <Option key={item.county} value={item.county}>
                  {item.county_name}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <Row>
        <Col style={{ textAlign: 'right' }} span={24}>
          <Button onClick={onCancel}>取消</Button>
          <Button
            style={{ display: 'inline-block', marginLeft: 8 }}
            loading={buttonDisabled}
            type="primary"
            htmlType="submit"
          >
            开启
          </Button>
        </Col>
      </Row>
    </Form>
  );
  // }
};

export default AddCityModal;
