import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import {
  SearchOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useSelector } from 'dva';
import {
  Button,
  Row,
  Form,
  Input,
  Col,
  Radio,
  Space,
  Descriptions,
  message,
  Select,
  DatePicker,
  Spin,
  TimePicker,
  Collapse,
  InputNumber,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { accountBalanceIncrease, proxyForwarder } from '../service';
const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const CreateForm = (props, ref) => {
  const { onCancel, selectRecord, type, getEventList } = props;
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const [form] = Form.useForm();

  const [btnLoading, setBtnLoading] = useState(false);
  const [countyList, setCountyList] = useState([]);
  const [dates, setDates] = useState();
  const [eventType, setEventType] = useState(1);
  const [disabledCounty, setDisabledCounty] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(selectRecord)) {
      console.log('edit');
      form.setFieldsValue({
        time: [moment(selectRecord.start_day), moment(selectRecord.end_day)],
      });
      changeCity(selectRecord.cities);
      form.setFieldsValue({
        type: selectRecord.type,
        title: selectRecord.title,
        city: selectRecord.cities,
        county: selectRecord.counties,
        rules: selectRecord.rules,
        purpose: selectRecord.purpose,
        activity_start_time: moment(selectRecord.activity_start_time, 'HH:mm:ss'),
        activity_end_time: moment(selectRecord.activity_end_time, 'HH:mm:ss'),
      });
      setEventType(selectRecord.type);
      if (selectRecord.action) {
        let action = JSON.parse(selectRecord.action);
        action.map((item, index) => {
          item.name = index;
          item.key = index;
          item.fieldKey = index;
          item.isListField = true;
        });
        form.setFieldsValue({
          action,
        });
      }
    } else {
      console.log('new');

      form.resetFields();
      setEventType(1);
      form.setFieldsValue({
        action: [{ name: 0, key: 0, isListField: true, fieldKey: 0 }],
      });
    }
  }, [selectRecord]);

  useEffect(() => {
    addPanel();
  }, []);

  useImperativeHandle(ref, () => ({
    validateFields: async () => {
      return await form.validateFields();
    },
  }));

  const onFinish = async (values) => {
    if (values.time) {
      values.start_day = moment(values.time[0]).format('YYYY-MM-DD');
      values.end_day = moment(values.time[1]).format('YYYY-MM-DD');
    }
    if (values.activity_start_time) {
      values.activity_start_time = moment(values.activity_start_time).format('HH:mm:ss');
    }
    if (values.activity_end_time) {
      values.activity_end_time = moment(values.activity_end_time).format('HH:mm:ss');
    }
    if (values.type == 2) {
      values.activity_start_time = '00:00:00';
      values.activity_end_time = '23:59:59';
    }
    delete values.time;
    const verify = toVerification(values.action);
    if (!verify) {
      return message.warning(
        '???????????????????????????,??????????????????????????????????????????,?????????????????????????????????',
        4,
      );
    }
    // ??????
    if (type == 'edit') {
      values.activity_id = selectRecord.id;
    }
    if (moment(values.start_day).isSame(values.end_day, 'day') && values.type == 2) {
      return message.error('????????????????????????1???');
    }
    const params = {
      service_module: 'POPE',
      service_api: '/sparrow/weisswal/api/activity/create',
      service_params: { ...values },
    };
    const res = await proxyForwarder(params);
    setBtnLoading(true);
    if (res) {
      message.success('????????????');
      onCancel();
      getEventList();
    }
    setBtnLoading(false);
  };

  // ????????????????????????
  const toVerification = (data = []) => {
    let verify = true;
    // ???????????????
    const newData = data.filter((item) => item);
    newData.map((item, index) => {
      if (!item.order_num) {
        verify = false;
      }
      if (index + 1 < newData.length) {
        // ?????????????????????????????????????????????
        if (item.order_num >= newData[index + 1].order_num) {
          verify = false;
        }
      }
      return item;
    });
    return verify;
  };

  /**
   * @description: ????????????
   * @param {*} disabledDate
   * @return {*}
   */
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  /**
   * @description: ????????????
   * @param {string} e ?????????
   * @return {*}
   */
  const changeCity = (e) => {
    form.setFieldsValue({ county: [] });
    if (e) {
      if (e.length == 1) {
        let county = cityCountyList.find((x) => x.city == e).county_infos;
        setCountyList(county);
        setDisabledCounty(false);
      } else {
        setDisabledCounty(true);
      }
    } else {
      setCountyList([]);
    }
  };

  const addPanel = (add) => {};

  /**
   * @description: ??????????????????
   * @param {*} changeEvent
   * @return {*}
   */
  const changeEvent = (e) => {
    setEventType(e.target.value);
  };
  // ??????
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  if (_.isEmpty(selectRecord) && type == 'edit') {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        name="type"
        label="????????????"
        initialValue={1}
      >
        <Radio.Group onChange={changeEvent} buttonStyle="solid">
          <Radio.Button value={1}>?????????</Radio.Button>
          <Radio.Button value={2}>????????????</Radio.Button>
        </Radio.Group>
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,12})$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('??????????????????12???????????????');
            },
          }),
        ]}
        name="title"
        label="????????????"
        initialValue={selectRecord.title}
      >
        <Input placeholder="???????????????????????????12??????" />
      </FormItem>
      <FormItem
        name="city"
        rules={[
          {
            required: true,
          },
        ]}
        label="????????????"
        initialValue={selectRecord.cities || []}
      >
        <Select
          allowClear
          showSearch
          mode="multiple"
          onChange={changeCity}
          filterOption={filterOption}
          placeholder="?????????"
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
      <Form.Item name="county" label="????????????">
        <Select
          placeholder="?????????"
          mode="multiple"
          showSearch
          allowClear
          filterOption={filterOption}
          initialValue={selectRecord.counties || []}
          disabled={disabledCounty}
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
      <FormItem
        label="???????????????"
        rules={[
          {
            required: true,
          },
        ]}
        name="time"
      >
        <RangePicker
          format="YYYY-MM-DD"
          placeholder={['????????????', '????????????']}
          disabledDate={disabledDate}
          onCalendarChange={(val) => setDates(val)}
        />
      </FormItem>
      <FormItem
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,24})$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('??????????????????24???????????????');
            },
          }),
        ]}
        label="????????????"
        name="purpose"
        initialValue={selectRecord.purpose}
      >
        <Input placeholder="???????????????????????????24???)" />
      </FormItem>
      <Row style={{ color: '#000000d9', fontSize: 16, fontWeight: 500 }}>????????????</Row>

      {eventType == 1 && (
        <Row style={{ marginBottom: 10 }}>
          <Space>
            <FormItem
              rules={[
                {
                  required: true,
                },
              ]}
              label="??????????????????"
              name="activity_start_time"
            >
              <TimePicker style={{ width: 180 }} />
            </FormItem>
            <FormItem
              rules={[
                {
                  required: true,
                },
              ]}
              label="??????????????????"
              name="activity_end_time"
            >
              <TimePicker style={{ width: 180 }} />
            </FormItem>
          </Space>
        </Row>
      )}
      <Form.List name="action">
        {(fields, { add, remove }) => (
          <Collapse defaultActiveKey={['0', '1', '2', '3', '4', '5']}>
            {fields.map((field, index) => (
              <Panel
                showArrow={false}
                header={
                  <span style={{ color: '#000', fontWeight: 500 }}>{`??????${index + 1}`}</span>
                }
                key={index}
                extra={
                  <Space>
                    {fields.length > 1 && fields.length - 1 === index && (
                      <MinusCircleOutlined
                        onClick={(event) => {
                          event.stopPropagation();
                          remove(field.name);
                        }}
                      />
                    )}

                    {fields.length - 1 === index && fields.length < 6 && (
                      <PlusCircleOutlined
                        onClick={(event) => {
                          event.stopPropagation();
                          add();
                        }}
                      />
                    )}
                  </Space>
                }
              >
                <Space>
                  <span>??????</span>
                  <Select
                    style={{ width: 104, marginRight: 8, marginLeft: 8 }}
                    defaultValue="????????????"
                  >
                    {['????????????'].map((item) => {
                      return (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                  <span>????????????</span>
                  <Form.Item
                    {...field}
                    name={[field.name, 'order_num']}
                    fieldKey={[field.fieldKey, 'order_num']}
                    rules={[{ required: true, message: '?????????' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber min={0} max={99999} precision={2} />
                  </Form.Item>
                  <span>???</span>
                </Space>
                <Space style={{ marginTop: 16 }}>
                  <span>??????</span>
                  <Select
                    style={{ width: 154, marginRight: 8, marginLeft: 8 }}
                    defaultValue="????????????????????????"
                  >
                    {['????????????????????????'].map((item) => {
                      return (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      );
                    })}
                  </Select>
                  <Form.Item
                    {...field}
                    name={[field.name, 'cash']}
                    fieldKey={[field.fieldKey, 'cash']}
                    rules={[{ required: true, message: '?????????' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber min={1} max={99999} />
                  </Form.Item>
                  <span>???</span>
                </Space>
              </Panel>
            ))}
          </Collapse>
        )}
        {/* <PhaseElements list={teamActions} form={form} FormItem={FormItem} /> */}
      </Form.List>
      <FormItem
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const pattern = /^([\W\w\s]{0,500})$/g;
              if (pattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('??????????????????500???????????????');
            },
          }),
        ]}
        name="rules"
        label="??????????????????"
        initialValue={selectRecord.rules}
      >
        <TextArea placeholder="???????????????????????????????????????500???????????????" />
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ margin: '0 8px' }}>
            ??????
          </Button>
          <Button loading={btnLoading} type="primary" htmlType="submit">
            ??????
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(CreateForm);
