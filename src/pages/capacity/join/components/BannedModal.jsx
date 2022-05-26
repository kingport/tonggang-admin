import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Checkbox, message, Form, Row, Col, Input, DatePicker } from 'antd';
import moment from 'moment';
import { driverSetBan } from '../service';

const { Item: FormItem } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const BannedModal = (props, ref) => {
  const [ever, setEver] = useState(false);
  const [form] = Form.useForm();

  // 设置选择时间区域
  function disabledDate(current) {
    return (
      (current && current < moment().add(-1, 'days')) || current > moment(new Date('2037/12/31'))
    );
  }

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      form
        .validateFields()
        .then((values) => {
          const { selectDriver } = props;
          if (ever == false && !values.time) {
            return message.error('请选择封禁时间');
          }
          // 日期格式化
          if (values.time) {
            values.ban_time = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
            values.ban_end_time = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
          }
          // 0未封禁 1封禁 2永久封禁
          if (ever) {
            values.ban_code = 2;
          } else {
            values.ban_code = 1;
          }
          // 司机id
          values.driver_id = selectDriver.driver_id;
          delete values.time;
          driverBanned(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    },
    onReset: () => {},
  }));

  /**
   * @description: 选择永久封禁
   * @param {blood} e 是否选择永久封禁
   * @return {*}
   */
  const onchange = (e) => {
    setEver(e.target.checked);
  };

  /**
   * @description: 封禁
   * @param {object} params 封禁参数
   * @return {*}
   */
  const driverBanned = async (params) => {
    const res = await driverSetBan(params);
    if (res) {
      const { getDriverList, onCancel } = props;
      message.success('操作成功!');
      onCancel();
      getDriverList();
    }
  };

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={24}>
        <Col span={16}>
          <FormItem
            rules={[
              {
                required: false,
                message: '请选择封禁时间',
              },
            ]}
            label="封禁时间"
            name="time"
          >
            <RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabled={ever}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label=" ">
            <Checkbox onChange={onchange}>永久封禁</Checkbox>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            rules={[
              {
                required: true,
                message: '请填写封禁原因',
              },
            ]}
            label="封禁原因"
            name="reason"
          >
            <TextArea rows={4} />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
export default forwardRef(BannedModal);
