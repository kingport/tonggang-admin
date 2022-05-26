import React from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';

const TableTitle = (props) => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <span>
        <UnorderedListOutlined />
        数据列表
      </span>
    </div>
  );
};
export default (TableTitle);
