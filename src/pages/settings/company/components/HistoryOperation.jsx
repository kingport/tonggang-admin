import React, { useEffect, useState } from 'react';
import { Table, Descriptions, Card } from 'antd';
import moment from 'moment';
import { getOrderOperationLog } from '@/services/login';

const HistoryOperation = (props, ref) => {
  const { selectRecord } = props;
  // console.log(selectRecord);

  const [tableLogLoading, setTableLogLoading] = useState(false);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const params = {
      op_res_id: selectRecord.company_id || '',
      op_res_type: 12 || '',
    };
    setTableLogLoading(true);
    getOrderOperationLog(params).then((res) => {
      if (res) {
        setLogData(res.data);
        setTableLogLoading(false);
      }
    });
  }, []);
  const columns = [
    {
      title: '操作人',
      dataIndex: 'op_user_name',
      key: 'op_user_name',
    },
    {
      title: '操作时间',
      dataIndex: 'op_time',
      key: 'op_time',
      sorter: (a, b) => moment(a.op_time) - moment(b.op_time),
    },
    {
      title: '操作内容',
      dataIndex: 'op_reasons',
      align: 'center',
      key: 'op_reasons',
      render: (text, record) => {
        let before_content = '';
        let submit_content = '';
        let descriptionsListBefore = [];
        let descriptionsListSumbit = [];
        if (record.op_remarks === '编辑公司' && record.op_before && record.op_submit) {
          // 公司主营业务
          const BUSINESS_NAME = {
            1: '汽车租赁（不带操作人）',
            2: '汽车租赁（不含运营）',
            3: '汽车租赁及运营',
            4: '自有汽车租赁',
            5: '小型客车租赁经营',
            6: '小型客车租赁',
            7: '小型汽车租赁',
            8: '融资租赁',
            9: '车辆租赁',
            10: '网络预约出租汽车经营及咨询服务',
            11: '暂无以上范围',
          };
          const COMPANY_TYPE = {
            1: '融资性质租赁公司',
            2: '经营性质租赁公司',
            3: '其他',
          };
          const KEY_NAME = {
            company_name: '公司名称',
            agent_type: '代理商类型',
            area_id: '合作城市',
            cooperative_mode: '合作模式',
            transport_mode: '运力属性',
            company_registered_address: '公司注册地址',
            company_business_address: '公司办公地址',
            registered_capital: '注册资金（万元）',
            driver_num: '司机数量（人）',
            car_num: '车辆数量（辆）',
            company_type: '公司类型',
            company_business: '公司主营业务',
            identifier_code: '统一社会信用代码',
            legal_name: '企业法人姓名',
            legal_idno: '企业法人身份号',
            legal_photo: '企业法人手机号',
            email: '签约邮箱',
            business_license_valid_date: '营业执照失效时间',
            business_license_photo: '营业执照扫描件（正本）',
            legal_id_front_photo: '法人身份证正面照',
            legal_id_backend_photo: '法人身份证背面照',
            legal_area: '对公账户开设城市',
            bank_name: '开户银行',
            account_opening_branch: '开户支行',
            bank_code: '银行卡号',
            public_driver_order_profit: '订单分润设置(公海司机)',
            third_driver_order_profit: '订单分润设置(非公海司机)',
            agent_b_order_profit: '代理b订单抽成设置',
            broker_name: '对接人姓名',
            broker_phone: '对接人手机号',
            broker_idno: '对接人身份证号',
            broker_email: '对接人邮箱',
            max_acount_num: '系统开设用户上限',
            cooperate_date: '签约合作期限',
          };
          // 编辑前
          let op_before = record.op_before;
          // 编辑后
          let op_submit = record.op_submit;
          // 找出更改的
          var aProps = Object.getOwnPropertyNames(op_before);
          var bProps = Object.getOwnPropertyNames(op_submit);
          if (aProps.length != bProps.length) {
            return false;
          }
          for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (op_before[propName] !== op_submit[propName]) {
              // 公司主营业务
              if (propName === 'company_business' || propName === 'company_type') {
                if (propName === 'company_business') {
                  before_content = BUSINESS_NAME[op_before[propName]];
                  submit_content = BUSINESS_NAME[op_submit[propName]];
                }
                if (propName === 'company_type') {
                  before_content = COMPANY_TYPE[op_before[propName]];
                  submit_content = COMPANY_TYPE[op_submit[propName]];
                }
              } else {
                before_content = op_before[propName];
                submit_content = op_submit[propName];
              }
              let obj_before = {
                name: KEY_NAME[propName],
                value: before_content,
                key: i,
              };
              let obj_submit = {
                name: KEY_NAME[propName],
                value: submit_content,
                key: i,
              };
              descriptionsListBefore.push(obj_before);
              descriptionsListSumbit.push(obj_submit);
              // console.log(before_content, KEY_NAME[propName], 'a[propName]');
              // console.log(submit_content, KEY_NAME[propName], 'b[propName]');
              // console.log(before_content);
              // console.log(submit_content);
            }
          }
        }
        return (
          <>
            <div>{text || record.op_remarks}</div>
            {record.op_remarks === '编辑公司' && record.op_before && record.op_submit && (
              <Card>
                <Descriptions title="编辑前" column={1} bordered>
                  {descriptionsListBefore.map((item) => {
                    return (
                      <Descriptions.Item
                        key={item.key}
                        label={`${item.name}`}
                        style={{ color: 'red' }}
                      >{`${item.value}`}</Descriptions.Item>
                    );
                  })}
                </Descriptions>
                <Descriptions title="编辑后" column={1} bordered>
                  {descriptionsListSumbit.map((item) => {
                    return (
                      <Descriptions.Item
                        key={item.key}
                        label={`${item.name}`}
                        style={{ color: '#87d068' }}
                      >{`${item.value}`}</Descriptions.Item>
                    );
                  })}
                </Descriptions>
              </Card>
            )}
          </>
        );
      },
    },
    {
      title: '操作结果',
      dataIndex: 'op_status',
      key: 'op_status',
      width: 80,
      render: (text) => {
        return (
          <>
            <div>{text ? '成功' : '失败'}</div>
          </>
        );
      },
    },
  ];
  return (
    <Table
      loading={tableLogLoading}
      bordered
      size="middle"
      pagination={logData.length > 10}
      columns={columns}
      key={(record) => record.op_id}
      dataSource={logData}
    />
  );
};

export default HistoryOperation;
