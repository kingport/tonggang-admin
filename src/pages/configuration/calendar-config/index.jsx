// 开城配置
import React, { useState, useEffect } from 'react';
import {
  PageHeader,
  Card,
  Row,
  Col,
  Calendar,
  Modal,
  Alert,
  Spin,
  message,
  Badge,
  DatePicker,
  Select,
  Radio,
} from 'antd';
import moment from 'moment';
import { getCalendarData } from './service';
import './index.less';
// modal
import SetDateModal from './conponents/SetDateModal';

const CalendarConfig = () => {
  const [showSetDateModal, setShowSetDateModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentCalendarData, setCurrentCalendarData] = useState([]);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectMoment, setSelectMoment] = useState('');
  const [panelChange, setPanelChange] = useState(true);
  // const [changed, setChanged] = useState(false);

  useEffect(() => {
    const currentDate = moment();
    fetchData(currentDate);
  }, []);

  /**
   * @description: 查询当月日期
   * @param {*} date
   * @return {*}
   */
  const fetchData = async (date) => {
    const start = date.startOf('month').format('YYYY-MM-DD');
    const end = date.endOf('month').format('YYYY-MM-DD');
    // 参数
    const params = {
      start,
      end,
    };
    setPageLoading(true);
    const res = await getCalendarData(params);
    if (res) {
      const { days = [] } = res.data || {};
      setCurrentCalendarData(days);
    }
    setPageLoading(false);
  };

  // 合并数据
  const getListData = (value) => {
    const valueDate = value.format('YYYY-MM-DD');
    const calendarDetail = currentCalendarData.filter((item) => item.day === valueDate)[0];
    let listData = {};
    if (calendarDetail) {
      listData = calendarDetail;
    }
    return listData;
  };

  // 返回内容会被追加到单元格
  const dateCellRender = (value) => {
    
    const listData = getListData(value);
    const { description = '', day_type } = listData;
    // 单签日期
    const date = value.format('YYYY-MM-DD');
    return (
      <div key={`${date}_${listData.description}`}>
        {parseInt(day_type, 10) === 1 && <Badge status="warning" text="工作日" />}
        {parseInt(day_type, 10) === 2 && <Badge status="success" text="节假日" />}
        <div>{description && <Badge status="processing" text={description} />}</div>
      </div>
    );
  };

  

  const onChange = (date) => {
    console.log(selectDate, '点条子1');

    setSelectMoment(date);

    const selectDateNow = date ? date.format('YYYY-MM-DD') : '';
    setSelectDate(selectDateNow);

    console.log(selectDateNow, '点条子2');
    // let a = moment(selectDate).get('month');
    // let b = moment(date).get('month');
    // console.log(a, b, 'LLL');
    if (
      moment(selectDate).get('month') == moment(date).get('month') &&
      moment(selectDate).get('year') == moment(date).get('year')
    ) {
      setShowSetDateModal(true);
    } else {
      fetchData(date);
    }
  };

  // 关闭modal
  const onCancel = () => {
    setShowSetDateModal(false);
    // setSelectDate('');
    // setSelectMoment('');
  };

  return (
    <div>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          background: '#fff',
        }}
        title="计价日历配置"
      />
      <div className="calendarConfig">
        <Card bordered={false}>
          <>
            <Alert style={{ marginBottom: 10 }} message="需要配置具体日期的日期类型" />
            <Spin spinning={pageLoading} tip="努力加载中...">
              {/* <Calendar
                // onChange={(date) => onChange(date, 'change')}
                dateCellRender={dateCellRender}
                // onSelect={(date) => selectDateEvent(date, 'select')}
                
              /> */}
              <Calendar
                dateCellRender={dateCellRender}
                // monthCellRender={monthCellRender}
                // onSelect={(date) => selectDateEvent(date)}
                onChange={onChange}
              />
            </Spin>
          </>
        </Card>
        <Modal
          title={`日期设置 ${selectDate}`}
          visible={showSetDateModal}
          destroyOnClose
          onCancel={() => onCancel()}
          footer={null}
          width={544}
          className="orderModal"
          bodyStyle={{ padding: '0 24px 24px 32px' }}
        >
          <SetDateModal
            onCancel={() => onCancel()}
            selectDate={selectDate}
            selectMoment={selectMoment}
            fetchData={fetchData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CalendarConfig;
