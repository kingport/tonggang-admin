import React, { useState, useEffect } from 'react';
import { useSelector } from 'dva';
import { message, Popconfirm, Avatar, List, Skeleton } from 'antd';

import { API_SET_ROLE } from '../constant';
import { setRole } from '../service';

const UserList = (props) => {
  const { userList, initLoading } = props;
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(userList);
  }, [userList]);

  // 确定删除
  const onConfirm = (item) => {
    const params = {
      user_id: item.id,
      role_id: item.role_id,
      method: 'delete',
    };
    delectUserRole(params);
  };

  // 删除
  const delectUserRole = async (params) => {
    const res = await setRole(params);
    if (res) {
      const { getRoleList, onCancel } = props;
      message.success('删除成功');
      const params = {
        page_size: 10,
        page_index: 1,
      }
      getRoleList(params);
      onCancel();
    }
  };
  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={
            userApiAuth &&
            userApiAuth[API_SET_ROLE] && userInfo && userInfo.id !== item.id &&[
              <Popconfirm
                onConfirm={() => onConfirm(item)}
                title="确定删除该用户吗？"
                okText="确定"
                cancelText="取消"
              >
                <a key="list-loadmore-edit">删除</a>
              </Popconfirm>,
            ]
          }
        >
          <Skeleton avatar title={false} loading={initLoading} active>
            <List.Item.Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
              }
              title={<a>{item.name}</a>}
              description={item.role_name}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default UserList;
