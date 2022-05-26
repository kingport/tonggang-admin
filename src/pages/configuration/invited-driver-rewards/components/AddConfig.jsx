import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Col, DatePicker, message, InputNumber, Row, Select, Form, Collapse, Space } from 'antd';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { useSelector } from 'dva';

import {
  creatActiveConfig,
  activeConfigDetail,
  editActiveConfig,
  selectCityValidComapny,
} from '../service';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

const AddConfig = (props, ref) => {
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  const [selectCity, setSelectCity] = useState([]);
  const { type, recordDetail } = props;
  const [form] = Form.useForm();
  const [detail, setDetail] = useState();
  // 阶梯默认
  const [phaseList, setPhaseList] = useState({
    uuid: 1,
    keys: [0],
  });

  useEffect(() => {
    if (type != 'new') {
      const params = {
        config_id: recordDetail.id,
      };
      getConfigDetail(params);
    }
  }, [type]);

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          if (values.time) {
            values.start_time = moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            values.end_time = moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
          }
          delete values.time;

          let arr = [];
          // NP.times(values['one.threshold'], 1)
          Object.keys(values).map((key) => {
            let obj = {
              inviter_num: '',
              inviter_num_amount: '',
              invitee_amount: ''
            };
            if (key.indexOf('inviter_num') > -1) {
              obj.inviter_num = values[key];
              arr.push(obj);
            }
          });
          arr.map((_item, index) => {
            _item.inviter_num_amount = values[`inviter_amount_${index}`];
            _item.invitee_amount = values[`invitee_amount_${index}`];            
            if( _item.invitee_amount == 0 &&  _item.inviter_num_amount == 0) {
              throw message.error('邀请人或被邀请人至少一个大于0')
            }
          });
          
          values.active_params = JSON.stringify(arr);
          // values.company_id = values.company_id.join(',');
          values.company_id = 1;

          if (type == 'edit') {
            values.config_id = recordDetail.id;
            editConfig(values);
          } else {
            // 创建奖励活动
            addActiveConfig(values);
          }
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {
      form.resetFields();
    },
  }));

  // 获取配置详情
  const getConfigDetail = async (params) => {
    const res = await activeConfigDetail(params);
    if (res) {
      setDetail(res.data);
      // 找出城市码
      if (res.data.area) {
        const params = {
          area: res.data.area,
        };
        selectAllCity(params);
      }
      // 公司
      let company_arr = res.data.company_id;
      form.setFieldsValue({
        company_id: company_arr.split(',').map((x) => (x = x * 1)),
      });
      // 活动阶梯
      let active_params = res.data.active_params;
      const { keys, uuid } = phaseList;
      let nextKeys = [];
      active_params.map((item, index) => {
        nextKeys.push(index);
        let inviter_num_key = `inviter_num_${index}`;
        let inviter_amount_key = `inviter_amount_${index}`;
        let invitee_amount_key = `invitee_amount_${index}`;
        form.setFieldsValue({
          [inviter_num_key]: item.inviter_num,
          [inviter_amount_key]: item.inviter_num_amount,
          [invitee_amount_key]: item.invitee_amount,
        });
      });
      setPhaseList({
        keys: nextKeys,
        uuid: uuid + 1,
      });
    }
  };

  //创建奖励活动
  const addActiveConfig = async (params) => {
    const res = await creatActiveConfig(params);
    if (res) {
      const { onCancel, getActiveConfigList } = props;
      message.success('操作成功');
      onCancel();
      getActiveConfigList();
    }
  };
  // 编辑
  const editConfig = async (params) => {
    const res = await editActiveConfig(params);
    if (res) {
      const { onCancel, getActiveConfigList } = props;
      message.success('操作成功');
      onCancel();
      getActiveConfigList();
    }
  };
  // 过滤
  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  // 增加阶梯
  const add = () => {
    const { type } = props;
    const { keys, uuid } = phaseList;
    if (type === 'check') return;
    if (keys.length + 1 > 6) return message.error('阶梯最多设置6个');
    const nextKeys = keys.concat(uuid);
    setPhaseList({
      keys: nextKeys,
      uuid: uuid + 1,
    });
  };
  // 移除
  const remove = (k) => {
    const { keys, uuid } = phaseList;
    if (keys.length === 1) {
      return;
    }
    setPhaseList({
      keys: keys.filter((key) => key !== k),
      uuid: uuid,
    });
  };

  // 选择城市
  const changeCity = (e) => {
    form.setFieldsValue({
      company_id: [],
    });
    if (e) {
      const params = {
        area: e,
      };
      selectAllCity(params);
    } else {
      setSelectCity([]);
    }
  };

  // 获取可选择城市
  const selectAllCity = async (params) => {
    const res = await selectCityValidComapny(params);
    if (res) {
      setSelectCity(res.data.valid_company_list);
    }
  };

  if (!detail && type !== 'new') return false;
  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择城市',
              },
            ]}
            name="area"
            label="城市"
            initialValue={(detail && detail.area * 1) || null}
          >
            <Select
              disabled={type === 'check'}
              allowClear
              showSearch
              filterOption={filterOption}
              placeholder="请选择"
              onChange={changeCity}
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
          </Form.Item>
        </Col>
      </Row>
      {/* <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '选择租赁公司',
              },
            ]}
            name="company_id"
            label="租赁公司"
            initialValue={(detail && detail.company_id) || []}
          >
            <Select
              disabled={type === 'check'}
              allowClear
              showSearch
              filterOption={filterOption}
              placeholder="请选择"
              mode="multiple"
            >
              {selectCity &&
                selectCity.map((item) => {
                  return (
                    <Option key={item.company_id} value={item.company_id}>
                      {item.company_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
      </Row> */}
      <Row>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择日期',
              },
            ]}
            name="time"
            label="日期选择"
            initialValue={(detail && [moment(detail.start_time), moment(detail.end_time)]) || null}
          >
            <RangePicker style={{ width: 200 }} disabled={type === 'check'} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Collapse defaultActiveKey={[0, 1, 2, 3, 4, 5]}>
            {phaseList.keys.map((k, index) => {
              return (
                <Panel
                  disabled={type === 'check'}
                  showArrow={false}
                  header={
                    <span style={{ color: '#000', fontWeight: 500 }}>{`阶梯${index + 1}`}</span>
                  }
                  key={k}
                  extra={
                    index == 0 && (
                      <Space>
                        <MinusSquareOutlined
                          onClick={(e) => {
                            if (e.stopPropagation) e.stopPropagation();
                            else e.cancelBubble = true;
                            remove(k);
                          }}
                        />
                        <PlusSquareOutlined
                          onClick={(e) => {
                            if (e.stopPropagation) e.stopPropagation();
                            else e.cancelBubble = true;
                            add();
                          }}
                        />
                      </Space>
                    )
                  }
                >
                  <Space>
                    <Space>
                      <span>被邀请人完成</span>
                      <FormItem
                        style={{ marginBottom: 0 }}
                        initialValue={1}
                        name={`inviter_num_${index}`}
                      >
                        <InputNumber disabled={type === 'check'} min={1} max={50} />
                      </FormItem>
                      <span>单</span>
                    </Space>
                    <Space>
                      <span>奖励邀请人</span>
                      <FormItem
                        style={{ marginBottom: 0 }}
                        initialValue={1}
                        name={`inviter_amount_${index}`}
                      >
                        <InputNumber precision={2} disabled={type === 'check'} min={0} max={500} />
                      </FormItem>
                      <span>元</span>
                    </Space>
                    <Space>
                      <span>奖励被邀请人</span>
                      <FormItem
                        style={{ marginBottom: 0 }}
                        initialValue={1}
                        name={`invitee_amount_${index}`}
                      >
                        <InputNumber precision={2} disabled={type === 'check'} min={0} max={500} />
                      </FormItem>
                      <span>元</span>
                    </Space>
                  </Space>
                </Panel>
              );
            })}
          </Collapse>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(AddConfig);
