import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; 

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 参数排序签名
 * @param
 */
// function objKeySort(obj) {
//   //排序的函数
//   let newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
//   // console.log(newkey, 'newkey');
//   let newObj = {}; //创建一个新的对象，用于存放排好序的键值对
//   for (let i = 0; i < newkey.length; i++) {
//     //遍历newkey数组
//     newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
//   }
//   return newObj; //返回排好序的新对象
// }

// export const getSigns = (datas) => {
//   let data = objKeySort(datas);
//   let url = '';
//   if (typeof data == 'undefined' || data == null || typeof data != 'object') {
//     return '';
//   }
//   for (var k in data) {
//     url += (url.indexOf('=') != -1 ? '' : '') + k + '' + data[k];
//   }
//   const key = '5bba6d7e00e316ea9f54979a0ffc93b7';
//   let signStr = md5(md5(url) + key);
//   return signStr;
// };

/**
 * @description: 增加随机字符串 随机key值
 * @param {*} data
 * @return {*}
 */
export const addRandomKey = (data) =>
  _.map(data, (i) => ({
    ...i,
    key: getRandomString(),
  }));

export const getRandomString = (strLength = 16) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < strLength; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
};

/**
 * @description: 驼峰转连字符
 * @param {string} str 需要转换的字符
 * @return {*}
 */
export function humpToHyphen(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}