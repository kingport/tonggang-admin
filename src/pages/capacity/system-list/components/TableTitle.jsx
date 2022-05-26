import React from 'react';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'dva';
import { API_ADD_SYSTEM } from '../constant';

const TableTitle = (props) => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>
        <UnorderedListOutlined />
        数据列表
      </span>
      {userApiAuth && userApiAuth[API_ADD_SYSTEM] && userInfo.agent_type != 3 && (
        <Button
          onClick={() => props.showModal()}
          size="large"
          icon={<PlusOutlined />}
          type="primary"
        >
          发补偿券
        </Button>
      )}
    </div>
  );
};
export default TableTitle;
