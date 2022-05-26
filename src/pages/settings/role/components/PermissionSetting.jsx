import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { message, Card, Tree } from 'antd';
import { roleUpdate } from '../service';
import _ from 'lodash';

// 设置组件
const PermissionSetting = (props, ref) => {
  if (!props) return false;
  useEffect(() => {
    setCheckedKeys(props.filterRoleInfo);
    setExpandedKeys(props.filterRoleInfo);
  }, [props.filterRoleInfo]);
  // 默认展开
  const [expandedKeys, setExpandedKeys] = useState(props.filterRoleInfo);
  // 默认选中
  const [checkedKeys, setCheckedKeys] = useState(props.filterRoleInfo);

  // 选中合集
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [checkedKeysTemp, setCheckedKeysTemp] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 展开/收起
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // 点击选择
  const onCheck = (checkedKeys) => {
    setCheckedKeysTemp(checkedKeys.filter((item) => item.indexOf('no-') === -1));
    setCheckedKeys(checkedKeys);
  };
  // 点击框文本
  const onSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      const roleInfo = props.roleInfo;
      const allAuthIdMap = props.allAuthIdMap;
      const allAuthKeyMap = props.allAuthKeyMap;
      // 如果什么都没有更新那么 取消
      if (checkedKeysTemp.length == 0) {
        return props.onCancel();
      }
      let pageAuthArr = {};
      checkedKeysTemp.map((item) => {
        if ((allAuthKeyMap[item].type === 'api') && allAuthKeyMap[item].sup_id != 0) {
          let pageItem = allAuthIdMap[allAuthKeyMap[item].sup_id];
          if (checkedKeysTemp.indexOf(`${pageItem.module}.${pageItem.uri}`) === -1) {
            pageAuthArr[`${pageItem.module}.${pageItem.uri}`] = true;
          }
        }
      });
      for (let key in pageAuthArr) {
        checkedKeysTemp.push(key);
      }

      let permissionsObj = {};
      // 合并去重
      console.log(checkedKeysTemp, 'checkedKeysTemp')
      let differenceABSet = checkedKeysTemp
        .filter(function (v) {
          return !(roleInfo.indexOf(v) > -1);
        })
        .concat(
          roleInfo.filter(function (v) {
            return !(checkedKeysTemp.indexOf(v) > -1);
          }),
        );
      let differenceABSetFiter = differenceABSet.filter((item) => item.indexOf('no-') === -1);

      // 该项在权限列表中找出相同的 被取消的权限
      let removeAuth = roleInfo.filter(function (v) {
        return differenceABSetFiter.indexOf(v) > -1;
      });
      let addAuth = differenceABSetFiter.filter(function (v) {
        return roleInfo.indexOf(v) === -1;
      });
      removeAuth.map((item) => {
        permissionsObj[item] = -1;
      });
      addAuth.map((item) => {
        permissionsObj[item] = true;
      });
      console.log(removeAuth, '被取消的权限');
      console.log(addAuth, '增加的权限');

      const { id, name, description } = props.roleDetail;
      const params = {
        role_id: id,
        name,
        description,
        permissions: JSON.stringify(permissionsObj),
      };
      roleUpdatePermissions(params);
    },
    onReset: () => {
      form.resetFields();
      setDetail(null);
    },
  }));

  // 跟新角色权限
  const roleUpdatePermissions = async (params) => {
    const res = await roleUpdate(params);
    if (res) {
      message.success('更新权限成功！');
      props.onCancel();
      setExpandedKeys([]);
      setCheckedKeys([]);
      setCheckedKeysTemp([]);
    }
  };

  if (!props.roleInfo) return;
  return (
    <Card>
      <Tree
        autoExpandParent={autoExpandParent}
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys} // 默认展开项
        onCheck={onCheck}
        checkedKeys={checkedKeys} // 默认选中项
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={props.modalData}
      />
    </Card>
  );
};

export default forwardRef(PermissionSetting);
