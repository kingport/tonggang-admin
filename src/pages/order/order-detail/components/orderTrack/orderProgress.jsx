/* 订单详情头部组件 */
import React from 'react';
import { Descriptions, Steps, Spin, Tag } from 'antd';

const { Step } = Steps;

const OrderProgress = (props) => {
  const { stepData = [], destName = '', startingName = '' } = props;
  const getStep = (data) => {
    return data.map((item) => {
      const { title, time, params } = item;
      return (
        <Step
          key={title}
          title={
            <span
              style={{
                fontSize: 14,
                color: '#000000',
                fontWeight: 600,
                fontFamily: 'PingFangSC-Medium',
              }}
            >
              {title}
            </span>
          }
          description={
            <div>
              {time && <Tag color="magenta">{time}</Tag>}
              <Descriptions className="descriptions" size="small" column={1}>
                {paramList(params)}
              </Descriptions>
            </div>
          }
        />
      );
    });
  };

  const paramList = (params) => {
    return params.map((item) => {
      const { key, value } = item;
      return (
        <Descriptions.Item key={key} label={key}>
          {value}
        </Descriptions.Item>
      );
    });
  };

  return (
    <>
      <Spin tip="努力加载中..." spinning={false}>
        <div className="topHeader">
          <Descriptions className="descriptions" size="small" title="订单流程进度" column={1}>
            <Descriptions.Item label="">
              <Tag color={'#2db7f5'}>起始点</Tag>
            </Descriptions.Item>
            <Descriptions.Item>
              <span style={{ color: '#2db7f5' }}>{startingName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="">
              <Tag color={'#87d068'}>目的地</Tag>
            </Descriptions.Item>
            <Descriptions.Item>
              <span style={{ color: '#87d068' }}>{destName}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="contentStep">
          <Steps progressDot current={100} direction="vertical">
            {getStep(stepData)}
          </Steps>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(OrderProgress);
