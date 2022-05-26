import React, { useState, useEffect } from 'react';
import { Button, Card, message, Descriptions } from 'antd';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import { detailCompany } from './service';

const CompanyInformation = (props) => {
  const userInfo = useSelector(({ global }) => global.userInfo);

  const [detail, setDetail] = useState();
  const [qrcode, setQrcode] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    if (userInfo) {
      getCompanyDetail();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo]);

  // 获取公司详情
  const getCompanyDetail = async () => {
    setLoading(true);
    const params = {
      company_id: userInfo && userInfo.company_id,
    };
    const res = await detailCompany(params);
    if (res) {
      setDetail(res.data);
      setQrcode(res.data.inviter_url);
      setLoading(false);
    }
  };

  // 复制
  const onCopy = () => {
    message.success('复制链接成功');
  };
  return (
    <PageContainer>
      <Card loading={loading}>
        <Descriptions bordered>
          <Descriptions.Item span={3} label="公司名称">
            {detail && detail.company_name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="公司办公地址">
            {detail && detail.company_business_address}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="公司推荐司机链接">
            <>
              <span>{detail && detail.inviter_url}</span>
              {detail && (
                <CopyToClipboard onCopy={onCopy} text={detail.inviter_url}>
                  <Button type="link">复制</Button>
                </CopyToClipboard>
              )}
            </>
          </Descriptions.Item>
          <Descriptions.Item span={3} label="公司推荐司机二维码">
            {detail && (
              <QRCode
                value={detail && detail.inviter_url} //value参数为生成二维码的链接
                size={100} //二维码的宽高尺寸
                fgColor="#000000" //二维码的颜色
              />
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default CompanyInformation;
