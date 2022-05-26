import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Row, Space } from 'antd';
import { useSelector } from 'dva';
import styles from './Welcome.less';
import OpenCityMap from '@/components/OpenCityMap';

const ExtraContent = () => <div className={styles.extraContent}></div>;

const PageHeaderContent = () => {
  const userInfo = useSelector(({ global }) => global.userInfo);
  const loading = userInfo;

  return (
    <div>
      {/* <Card bordered={false} loading={!loading}> */}
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            alt="user-icon"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            hello,
            {userInfo && userInfo.name},祝你开心每一天！
          </div>
          <Space>
          <div>手机号: {userInfo && userInfo.phone}</div>
          <div>邮箱: {userInfo && userInfo.email}</div>
          <div>最后登录时间: {userInfo && userInfo.last_login}</div>
          </Space>
        </div>
      </div>
      {/* </Card> */}
    </div>
  );
};
export default () => (
  <PageHeaderWrapper content={<PageHeaderContent />} extraContent={<ExtraContent />}>
    {/* <OpenCityMap /> */}
  </PageHeaderWrapper>
);
