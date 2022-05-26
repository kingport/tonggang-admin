import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Steps } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

import { detailCompany } from './service';
// 基本信息
import BasicForm from './components/BasicForm';
// 资质信息
import QualificationForm from './components/QualificationForm';
// 银行卡信息
import BankCardForm from './components/BankCardForm';
// 签约信息
import SignForm from './components/SignForm';

import './index.less';

const { Step } = Steps;

const New = (props) => {
  const { type, companyId, status } = props.location.query;
  // console.log(type);
  const [current, setCurrent] = useState(0);
  const [editDetail, setEditDetail] = useState();
  const childrenRef = useRef(null);

  const TITLE = {
    edit: '编辑公司',
    check: '查看公司',
  };
  useEffect(() => {
    const abortController = new AbortController();
    if (companyId) {
      getDetail(companyId);
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [companyId]);

  // 获取公司详情
  const getDetail = async (companyId) => {
    const params = {
      company_id: companyId,
      status: status,
    };
    const res = await detailCompany(params);
    if (res) {
      setEditDetail(res.data);
    }
  };

  // 填写单完毕后下一步
  const nextStepOk = () => {
    setCurrent(current + 1);
  };
  // 点击下一步
  const nextStep = () => {
    childrenRef.current.onFinish();
  };

  // 上一步
  const lastStep = () => {
    setCurrent(current - 1);
  };

  // 提交表单新建公司
  const createCompany = () => {
    childrenRef.current.onFinish();
  };

  const steps = [
    {
      title: '基本信息',
      content: (
        <BasicForm
          editDetail={editDetail}
          type={type}
          basicData={props.basicData}
          nextStepOk={nextStepOk}
          ref={childrenRef}
        />
      ),
    },
    {
      title: '资质信息',
      content: (
        <QualificationForm
          editDetail={editDetail}
          type={type}
          qualificationData={props.qualificationData}
          nextStepOk={nextStepOk}
          ref={childrenRef}
        />
      ),
    },
    {
      title: '银行卡信息',
      content: (
        <BankCardForm
          editDetail={editDetail}
          type={type}
          basicData={props.basicData}
          bankCardData={props.bankCardData}
          nextStepOk={nextStepOk}
          ref={childrenRef}
        />
      ),
    },
    {
      title: '签约信息',
      content: (
        <SignForm
          editDetail={editDetail}
          companyId={companyId}
          type={type}
          basicData={props.basicData}
          qualificationData={props.qualificationData}
          bankCardData={props.bankCardData}
          signData={props.signData}
          nextStepOk={nextStepOk}
          ref={childrenRef}
        />
      ),
    },
  ];
  return (
    <PageContainer onBack={() => window.history.back()} title={TITLE[type] || '新建公司'}>
      <Card>
        <Steps labelPlacement="vertical" current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Card className="steps-content">{steps[current].content}</Card>
        <div className="steps-action">
          {current > 0 && (
            <Button onClick={lastStep} style={{ margin: '0 8px' }}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button onClick={nextStep} type="primary">
              下一步
            </Button>
          )}
          {current === steps.length - 1 && type !== 'check' && (
            <Button onClick={createCompany} type="primary">
              确认无误，{type === 'edit' ? '更新' : '新建'}
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default connect(({ companyNew }) => ({
  // 基本信息
  basicData: companyNew.basicData,
  // 资质信息
  qualificationData: companyNew.qualificationData,
  // 银行卡信息
  bankCardData: companyNew.bankCardData,
  // 签约信息
  signData: companyNew.signData,
}))(New);
