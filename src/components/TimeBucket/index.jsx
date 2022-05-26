import React, { useState } from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';

const TimeBucket = (props) => {
  const { onChange, startDate = '', endDate = '' } = props;
  console.log(startDate,endDate, 'PP')
  const [startTime, setStartTime] = useState(startDate);
  const [endTime, setEndTime] = useState(endDate);

  const handleChange = (timeString, itemKey) => {
    if (itemKey == 'start_time') {
      setStartTime(timeString);
      triggerChange({ start_time: timeString });
    }
    if (itemKey == 'end_time') {
      setEndTime(timeString);
      triggerChange({ end_time: timeString });
    }
  };

  // 数据变化,需要数据是数组
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({ ...{ start_time: startTime, end_time: endTime }, ...changedValue });
    }
  };

  const format = 'HH:mm:ss';
  return (
    <div style={{ width: 500 }}>
      <TimePicker
        style={{ width: 180 }}
        className="timeBucketStart"
        getPopupContainer={() => document.querySelector('.timeBucketStart')}
        value={startTime ? moment(startTime, format) : null}
        format={format}
        onChange={(time, timeString) => handleChange(timeString, 'start_time')}
      />
      <span style={{ marginRight: 5, marginLeft: 5 }}>-</span>
      <TimePicker
        style={{ width: 180 }}
        className="timeBucketEnd"
        getPopupContainer={() => document.querySelector('.timeBucketEnd')}
        value={endTime ? moment(endTime, format) : null}
        format={format}
        onChange={(time, timeString) => handleChange(timeString, 'end_time')}
      />
    </div>
  );
};

export default TimeBucket;
