import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Row, Col, Space } from 'antd';
import _ from 'lodash';
import { addRandomKey, getRandomString } from '@/utils/utils';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';

// 设置组件

const SubSection = (props, ref) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     list: this.convertValue2List(props.initialValue),
  //   };
  //   this.bodyRefs = {};
  // }
  const { type, keyTitle = '' } = props;

  const [list, setList] = useState();

  useEffect(() => {
    convertValue2List(props.initialValue);
  }, []);

  // componentWillReceiveProps(nextProps) {
  //   const { initialValue } = nextProps;
  //   const { initialValue: oldValue } = this.props;
  //   if (JSON.stringify(initialValue) !== JSON.stringify(oldValue)) {
  //     this.setState({
  //       list: this.convertValue2List(initialValue),
  //     });
  //   }
  // }

  const convertValue2List = (value) => {
    setList(_.mapKeys(addRandomKey(value), (item) => item.key));
  };
  const delect = (key) => {
    const newList = _.omit(list, [key]);
    setList(newList);
  };

  // getData = async () => {
  //   const { form } = this.props;
  //   const data = await new Promise((resolve) => {
  //     form.validateFieldsAndScroll((err, values) => {
  //       if (!err) {
  //         resolve(values);
  //       } else {
  //         resolve(false);
  //       }
  //     });
  //   });

  //   if (data !== false) {
  //     return _.map(data, (item) => ({
  //       ...item,
  //     }));
  //   }
  //   return false;
  // };

  // 添加选项
  const add = () => {
    // const { list } = this.state;
    const newList = _.cloneDeep(list);
    const key = getRandomString();
    newList[key] = {};
    setList(newList);

    // this.setState({ list: newList });
  };

  // render() {
  //   const { list } = this.state;
  //   const { type } = this.props;
  return (
    <div>
      <Form.Item layout="inline" hiderequiredmark="true">
        {_.map(list, (item, key) => (
          <Row key={key}>
            <Col style={{ marginBottom: 5 }} span={11}>
              <Space align="center">
                <span>大于</span>
                <Form.Item
                  style={{ margin: 0 }}
                  name={`${key}.${keyTitle}.begin`}
                  initialValue={_.get(item, 'begin')}
                >
                  <InputNumber disabled={type === 'show'} placeholder="距离" min={0} />
                </Form.Item>
                <span className="directs">km</span>
              </Space>
            </Col>
            <Col style={{ marginBottom: 5 }} span={11}>
              <Space>
                <Form.Item
                  style={{ margin: 0 }}
                  name={`${key}.${keyTitle}.price`}
                  initialValue={_.get(item, 'price')}
                >
                  <InputNumber disabled={type === 'show'} placeholder="单价" min={0} />
                </Form.Item>
                <span className="directs">元/km</span>
              </Space>
            </Col>
            <Col span={2}>
              <Button
                disabled={type === 'show'}
                icon={<MinusOutlined />}
                shape="circle"
                size="small"
                onClick={() => delect(key)}
              />
            </Col>
          </Row>
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
// }

export default SubSection;
