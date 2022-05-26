/*
 * @Author: your name
 * @Date: 2021-01-15 10:43:10
 * @LastEditTime: 2021-04-16 13:02:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\utils\index.js
 */
import moment from 'moment';

export const transFormPrice = (values, type, arr = [], filterArr = []) => {
  Object.keys(values).map((key) => {
    if (key.indexOf(type) > -1) {
      if (values[key]._isAMomentObject) {
        values[key] = moment(values[key]).format('HH:mm');
      }
      arr.push(values[key]);
    }
  });
  arr = _.chunk(arr, 3);
  arr.map((x) => {
    let obj = {
      begin: x[0],
      end: x[1],
      price: x[2],
    };
    filterArr.push(obj);
  });
  return filterArr;
};
