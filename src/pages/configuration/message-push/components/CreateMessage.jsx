/* 结束订单组件 */
import React, { useState } from 'react';
import { useSelector } from 'dva';
import moment from 'moment';
import { Form, Button, Row, message, Input, DatePicker, Select, Col, Radio, Card } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { toAddCity } from '../service';
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const CreateMessage = (props) => {
  const { onCancel, getCityListConfig } = props;
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userCityCountyList = useSelector(({ global }) => global.userCityCountyList);

  const [form] = Form.useForm();

  const [countyList, setCountyList] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isAssignDrivers, setIsAssignDrivers] = useState(false);
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));

  const controls = [
    // 'undo',
    // 'redo',
    // 'separator',
    {
      key: 'bold', // 使用key来指定控件类型
      title: '加粗选中文字哦', // 自定义控件title
      text: '点我加粗', // 使用自定义文案来代替默认图标(B)，此处也可传入jsx
    },
    // 'italic',
    // 'underline',
    // 'strike-through',
    'font-size',
    'line-height',
    'text-color',
    'headings',
  ];
  /**
   * @description: 新建开城配置
   * @param {*} params 参数
   * @return {*}
   */
  const onFinish = async (values) => {
    console.log(editorState.toHTML(), 'PPPPP');
    console.log(editorState.isEmpty(), '有没有内容');
    if (editorState.isEmpty()) {
      return message.error('请填写消息内容');
    }
    setButtonDisabled(true);
    if (values.time) {
      values.start_time = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
      values.end_time = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete values.time;
    }
    if (values.derect_driver) {
      values.derect_driver = values.derect_driver.replace('，', ',').replace(/\s+/g, '');
    }
    if (values.content) {
      values.content = editorState.toHTML();
    }
    console.log(values, 'LL');
    const params = {
      ...values,
    };
    // if (1) {
    //   message.success('操作成功');
    //   onCancel();
    // }
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

  /**
   * @description: 选择发送范围
   * @param {*}
   * @return {*}
   */
  const onChange = (event) => {
    const { value } = event.target;
    // 指定司机
    if (value == 1) {
      setIsAssignDrivers(true);
    } else {
      setIsAssignDrivers(false);
    }
  };

  const handleEditorChange = (editorState) => {
    // this.setState({ editorState })
    setEditorState(editorState);
  };
  const submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = editorState.toHTML();
    const result = await saveEditorContent(htmlContent);
    console.log(result, 'LLL');
  };

  // 过滤
  const filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <FormItem
        label="消息类别"
        name="type"
        rules={[
          {
            required: true,
            message: '请选择消息类别',
          },
        ]}
      >
        <Select placeholder="请选择消息类别">
          {[
            {
              value: '1',
              name: '安全消息',
            },
            {
              value: '2',
              name: '活动消息',
            },
          ].map((item) => {
            return (
              <Option value={item.value} key={item.value}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        label="选择城市"
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
      <FormItem
        rules={[
          {
            required: true,
          },
        ]}
        label="发送时间"
        name="time"
      >
        <RangePicker showTime format="YYYY-MM-DD H:mm:ss" placeholder={['开始', '结束']} />
      </FormItem>
      <FormItem label="发送范围" rules={[{ required: true }]} name="range_person">
        <Radio.Group onChange={onChange}>
          <Radio value={'0'}>全部司机</Radio>
          <Radio value={'1'}>指定司机</Radio>
          <Radio value={'2'}>IOS用户</Radio>
          <Radio value={'3'}>Android用户</Radio>
        </Radio.Group>
      </FormItem>
      {isAssignDrivers && (
        <FormItem name="derect_driver">
          <TextArea placeholder="输入手机号，若多个请以“,”隔开" rows={4} />
        </FormItem>
      )}
      <FormItem name="content" rules={[{ required: true }]} label="设置消息内容">
        <BraftEditor
          style={{ height: '200px', border: '1px solid #ccc' }}
          controls={controls}
          value={editorState}
          onChange={handleEditorChange}
          onSave={submitContent}
        />
      </FormItem>
      <FormItem label="设置消息简介" name="content_summary" rules={[{ required: true }]}>
        <Input maxLength={64} />
      </FormItem>
      <FormItem label="设置消息标题" name="content_title">
        <Input maxLength={128} />
      </FormItem>
      <FormItem label="消息链接" name="content_url">
        <TextArea placeholder="消息链接" />
      </FormItem>

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

export default CreateMessage;
