// 开城配置
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'dva';
import {
  Button,
  Table,
  PageHeader,
  Card,
  Row,
  Divider,
  Pagination,
  Modal,
  Space,
  message,
  Popconfirm,
  Tag,
  Image,
  Spin,
  Skeleton,
} from 'antd';

import _ from 'lodash';
import moment from 'moment';

import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';
import { signList, underTaking } from './service';
import { API_EPIDEMIC_LIST, API_UNDER_TAKING } from './constant';

import SearchForm from './components/SearchForm';
import './index.less';

const EpidemicRecord = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const childrenRefSearch = useRef(null);

  const [showOperationLogModal, setShowOperationLogModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState({});
  const [showMaskImg, setShowMaskImg] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectData, setSelectData] = useState();
  // console.log(userApiAuth, 'userApiAuth');

  useEffect(() => {
    if (userApiAuth && userApiAuth[API_EPIDEMIC_LIST]) {
      getSignList();
    }
  }, [userApiAuth]);
  // 获取配置列表
  const getSignList = async (
    params = { start_time: moment().format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') },
  ) => {
    setTableLoading(true);
    const res = await signList(params);
    if (res) {
      setTableData(res.data);
    }
    setTableLoading(false);
  };

  /**
   * @description: 获取承诺书
   * @param {*}
   * @return {*}
   */
  const getUnderTaking = async (record) => {
    const params = {
      sign_id: record.id,
    };
    const res = await underTaking(params);
    if (res) {
      const { data } = res;
      return Modal.info({
        // title: '承诺书',
        content: (
          <div className="commit-container">
            <div className="commit-rule">
              <p style={{ textAlign: 'center' }} className="commit-title">
                《防疫承诺书》
              </p>
              <div className="commit-header">
                <p>本人：{data.name}</p>
                <p>身份证号码：{data.id_no}</p>
                <p>车牌：{data.plate_no}</p>
              </div>
              <div className="commit-content">
                <p className="commit-content-title">
                  应政府防疫要求，为进一步做好新冠肺炎疫情防控工作，本人将履行以下承诺：
                </p>
                <p>
                  1、熟知国家、省、市及同港平台关于出租汽车驾驶员新冠肺炎疫情防控有关要求和工作指引，并严格按要求和指引做好各项疫情防控工作。
                </p>
                <p>
                  2、严格做好个人健康监测，坚决不带病上岗，出现发热、乏力、干咳等可疑症状，主动向公司上报，并到定点医院发热门诊就诊。
                </p>
                <p>
                  3、本人知悉并确认：如为了证明自身健康而伪造相关检测报告的，甚至最终发现确属新冠肺炎患者的，本人自愿承担因此而面临平台依据平台规则进行的处理，甚至治安管理处罚及/或刑事责任。
                </p>
              </div>
              <div style={{ textAlign: 'right' }} className="commit-footer">
                <p>承诺人 :{data.name}</p>
                <p>车牌：{data.plate_no}</p>
                <p>签署日期：{data.sign_date}</p>
              </div>
            </div>
          </div>
        ),
        onOk() {},
      });
    }
  };

  // 显示承诺书
  const showRule = (record) => {
    getUnderTaking(record);
  };
  // 分页
  const changePage = async (current) => {
    const values = await childrenRefSearch.current.validateFields();
    values.page_index = current;
    getSignList(values);
  };

  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${tableData.totalCount}条`,
    total: tableData.totalCount,
    pageSize: 10,
    current: tableData.pageIndex,
    onChange: (current) => changePage(current),
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'sign_time',
      key: 'sign_time',
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
      align: 'left',
      ellipsis: true,
      render: (area) => {
        let city_name = null;
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == area);
          if (city_name) {
            city_name = cityCountyList.find((x) => x.city == area).city_name;
          } else {
            city_name = '无该城市ID';
          }
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '司机',
      dataIndex: 'driver_name',
      key: 'driver_name',
    },
    {
      title: '手机号',
      dataIndex: 'cell',
      key: 'cell',
    },
    {
      title: '体温（℃）',
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: '体温状态',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (text) => {
        return (
          <>
            {text * 1 > 37.2 && <Tag color="#f50">异常</Tag>}
            {text * 1 <= 37.2 && <Tag color="#87d068">正常</Tag>}
          </>
        );
      },
    },
    {
      title: '健康码状态',
      dataIndex: 'health_code_status',
      key: 'health_code_status',
      render: (text) => {
        return (
          <>
            {text * 1 == 1 && <Tag color="#4dbb5d">未见异常-绿码</Tag>}
            {text * 1 == 2 && <Tag color="#fecd00">居家观察-橙码</Tag>}
            {text * 1 == 3 && <Tag color="#ff0000">集中隔离-红码</Tag>}
          </>
        );
      },
    },
    {
      title: '打卡状态',
      dataIndex: 'sign_status',
      key: 'sign_status',
      render: (text) => {
        return (
          <>
            {text * 1 == 1 && <Tag color="#4dbb5d">已打卡</Tag>}
            {text * 1 == 0 && <Tag color="#ff0000">未打卡</Tag>}
          </>
        );
      },
    },
    {
      title: '操作',
      // width: 300,
      render: (record) => (
        <Space>
          {userApiAuth && userApiAuth[API_EPIDEMIC_LIST] && (
            <Button
              className="padding-zero"
              onClick={() => {
                setTimeout(() => {
                  setSelectData(record);
                }, 500);
                setShowCode(true);
              }}
              type="link"
            >
              查看健康码
            </Button>
          )}
          {userApiAuth && userApiAuth[API_EPIDEMIC_LIST] && (
            <Button
              onClick={() => {
                setTimeout(() => {
                  setSelectData(record);
                }, 500);
                setShowMaskImg(true);
              }}
              type="link"
              className="padding-zero"
            >
              查看戴口罩图片
            </Button>
          )}
          {userApiAuth && userApiAuth[API_UNDER_TAKING] && (
            <Button className="padding-zero" onClick={() => showRule(record)} type="link">
              防疫承诺书
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <PageContainer title="疫情打卡记录">
      <Card title={<SearchForm getSignList={getSignList} ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.id}
          scroll={{ x: 'max-content' }}
          bordered
          loading={tableLoading}
          pagination={paginationProps}
          columns={columns}
          dataSource={tableData.info}
          size="small"
        />
      </Card>
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="teamModal"
        bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.id}
          type={7}
          addColumns={[
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
          ]}
        />
      </Modal>
      <Modal
        title={'健康码'}
        footer={null}
        onCancel={() => {
          setSelectData();
          setShowCode(false);
        }}
        visible={showCode}
      >
        {!selectData && <Spin />}
        {selectData && selectData.health_code_pic && (
          <Image
            width={'100%'}
            src={`${window.location.origin}/saasbench/v1/file/show/index?key=${selectData.health_code_pic}`}
          />
        )}
      </Modal>
      <Modal
        title={'点击图片可放大'}
        footer={null}
        onCancel={() => {
          setSelectData();
          setShowMaskImg(false);
        }}
        visible={showMaskImg}
      >
        {!selectData && <Spin />}
        {selectData && selectData.mask_pic && (
          <Image
            width={'100%'}
            src={`${window.location.origin}/saasbench/v1/file/show/index?key=${selectData.mask_pic}`}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default EpidemicRecord;
