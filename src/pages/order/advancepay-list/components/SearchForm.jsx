import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import { Button, Row, Select, Form, Input, Col, DatePicker } from 'antd';
import moment from 'moment';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { ORDER_CENTER_CHANNEL, ORDER_CENTER_ADVANCE } from '@/utils/constant';

const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm = (props, ref) => {
  const { getAdvanceList, userData } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const searchAdvancepayValue = useSelector(({ global }) => global.searchAdvancepayValue);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      const values = await form.validateFields();
      if (values.time) {
        values.start_time = moment(values.time[0]).format('YYYY-MM-DD 00:00:00');
        values.end_time = moment(values.time[1]).format('YYYY-MM-DD 23:59:59');
      }
      return values;
    },
  }));

  useEffect(() => {
    if (!_.isEmpty(searchAdvancepayValue)) {
      Object.keys(searchAdvancepayValue).map((key) => {
        if (key == 'start_time') {
          form.setFieldsValue({
            time: [
              moment(searchAdvancepayValue['start_time']),
              moment(searchAdvancepayValue['end_time']),
            ],
          });
        }
        form.setFieldsValue({
          [key]: searchAdvancepayValue[key],
        });
      });
      // getAdvanceList(searchAdvancepayValue);
    }
  }, []);

  const onFinish = (values) => {
    if (values.time) {
      values.start_time = moment(values.time[0]).format('YYYY-MM-DD 00:00:00');
      values.end_time = moment(values.time[1]).format('YYYY-MM-DD 23:59:59');
    }
    delete values.time;
    dispatch({
      type: 'global/saveAdvancepaySearchValue',
      payload: {
        searchAdvancepayValue: values,
      },
    });
    getAdvanceList(values);
  };
  // ????????????
  const onReset = () => {
    form.resetFields();
  };
  // ??????
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  return (
    <Form form={form} onFinish={onFinish} hideRequiredMark>
      <Row gutter={24}>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="city" label="????????????">
            <Select allowClear showSearch filterOption={filterOption} placeholder="?????????">
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
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="driver_phone" label="????????????">
            <Input placeholder="???????????????" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="passenger_phone" label="????????????">
            <Input placeholder="???????????????" />
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="type" label="????????????">
            <Select allowClear filterOption={filterOption} placeholder="?????????">
              {[{ key: 0, value: '??????' }].map((item) => (
                <Option value={item.key} key={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="channel" label="????????????">
            <Select allowClear showSearch filterOption={filterOption} placeholder="?????????">
              {Object.keys(ORDER_CENTER_CHANNEL).map((key) => {
                return (
                  <Option key={key} value={key}>
                    {ORDER_CENTER_CHANNEL[key].value}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="is_pay" label="????????????">
            <Select placeholder="???????????????????????????" allowClear>
              {[
                { key: 0, value: '?????????' },
                { key: 1, value: '?????????' },
              ].map((item) => (
                <Option value={item.key} key={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="advance" label="????????????">
            <Select placeholder="?????????" allowClear>
              {ORDER_CENTER_ADVANCE &&
                Object.keys(ORDER_CENTER_ADVANCE).map((key) => {
                  return (
                    <Option key={key} value={key}>
                      {ORDER_CENTER_ADVANCE[key].value}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="specific_user_id" label="????????????">
            <Select
              placeholder="????????????????????????"
              showSearch
              filterOption={filterOption}
              allowClear
            >
              {userData.map((item, index) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem initialValue={0} name="apply_time_sort" label="????????????">
            <Select placeholder="???????????????" allowClear>
              {[
                {
                  value: 0,
                  name: '??????',
                },
                {
                  value: 1,
                  name: '??????',
                },
              ].map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <FormItem name="time" label="????????????">
            <RangePicker format="YYYY-MM-DD" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            ??????
          </Button>
          <Button
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
            htmlType="button"
            onClick={onReset}
          >
            ??????
          </Button>
          {/* <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => {
              importsExcel(e).then(
                function (data) {
                  addCompanyList(data);
                  // actionList(data);
                },
                function (data) {
                  console.log(data);
                },
              );
            }}
          /> */}
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(SearchForm);
