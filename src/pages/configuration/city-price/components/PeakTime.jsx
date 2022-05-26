import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, InputNumber, Button, Row, TimePicker, Col, Space } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { addRandomKey, getRandomString } from '@/utils/utils';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';

// 设置组件
const format = 'HH:mm';
const PeakTime = (props, ref) => {
  const { type, form, keyTitle = '' } = props;

  const [list, setList] = useState();

  useEffect(() => {
    convertValue2List(props.initialValue);
  }, []);

  useImperativeHandle(ref, () => ({
    getData: async () => {
      const data = await form.getFieldsValue();
      if (data !== false) {
        // _.map(data, (item) => {
        //   console.log(item, 'KKKKKKKK');
        // });
        // return _.map(data, (item) => ({
        //   price: item.price,
        //   begin: moment(item.begin).format('HH:mm'),
        //   end: moment(item.end).format('HH:mm'),
        // }));
      }
      return false;
    },
  }));

  const convertValue2List = (value) => {
    setList(_.mapKeys(addRandomKey(value), (item) => item.key));
  };

  const delect = (key) => {
    const newList = _.omit(list, [key]);
    setList(newList);
  };
  // 添加选项
  const add = () => {
    const newList = _.cloneDeep(list);
    const key = getRandomString();
    newList[key] = {};
    setList(newList);
  };

  return (
    <div>
      <Form.Item layout="inline">
        {_.map(list, (item, key) => (
          <div key={key} className="heightTime">
            <Row>
              <Col
                style={{
                  marginRight: 5,
                }}
                span={12}
              >
                <Form.Item
                  name={`${key}.${keyTitle}.begin`}
                  initialValue={
                    type !== 'add' && _.get(item, 'begin')
                      ? moment(_.get(item, 'begin'), format)
                      : moment().startOf('day')
                  }
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TimePicker disabled={type === 'show'} format={format} placeholder="开始时间" />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={`${key}.${keyTitle}.end`}
                  initialValue={
                    type !== 'add' && _.get(item, 'end')
                      ? moment(_.get(item, 'end'), format)
                      : moment().endOf('day')
                  }
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TimePicker disabled={type === 'show'} format={format} placeholder="结束时间" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col style={{ marginBottom: 5 }} span={20}>
                <Space>
                  <Form.Item
                    style={{ margin: 0 }}
                    name={`${key}.${keyTitle}.price`}
                    initialValue={_.get(item, 'price')}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber disabled={type === 'show'} placeholder="单价" min={0} />
                  </Form.Item>
                  <span>元</span>
                </Space>
              </Col>
              <Col span={4}>
                <Button
                  disabled={type === 'show'}
                  icon={<MinusOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => delect(key)}
                />
              </Col>
            </Row>
          </div>
        ))}
        <Button
          disabled={type === 'show'}
          icon={<PlusCircleOutlined />}
          type="dashed"
          onClick={add}
        >
          新增
        </Button>
      </Form.Item>
    </div>
  );
};

export default forwardRef(PeakTime);
