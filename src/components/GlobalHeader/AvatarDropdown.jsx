import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Tag, Space, Button, Row, Col } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = (key) => {
    // const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
      userInfo,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} >
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          {/* <LogoutOutlined />
          退出登录 */}
          <Space style={{width: '100%'}} direction="vertical">
            <Tag color="#87d068">{userInfo && userInfo.company_name}</Tag>
            <Tag color="#87d068">{userInfo && userInfo.phone}</Tag>
            <Tag color="#87d068">{userInfo && userInfo.role_name}</Tag>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button onClick={() => this.onMenuClick('logout')} type="link">退出</Button>
              </Col>
            </Row>
          </Space>
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span style={{ marginRight: '8px' }} className={`${styles.name} anticon`}>
            hi，{currentUser.name}
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user, global }) => ({
  currentUser: user.currentUser,
  userInfo: global.userInfo,
}))(AvatarDropdown);
