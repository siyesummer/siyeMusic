function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' &&
      key !== 'prototype' &&
      key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
//实现多个类的继承
export function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

//时间函数
export function getTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let munite = date.getMinutes();
  let second = date.getSeconds();
  if (arguments.length == 0) {
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (munite < 10) {
      munite = '0' + munite;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + munite + ':' + second;
  } else if (arguments.length == 1) {
    if (arguments[0] == 'year' || arguments[0] == '年') {
      return year;
    } else if (arguments[0] == 'month' || arguments[0] == '月') {
      return month;
    } else if (arguments[0] == 'day' || arguments[0] == '日') {
      return day;
    } else if (arguments[0] == 'hour' || arguments[0] == '时') {
      return hour;
    } else if (arguments[0] == 'munite' || arguments[0] == '分') {
      return munite;
    } else if (arguments[0] == 'second' || arguments[0] == '秒') {
      return second;
    } else if (arguments[0] == 'clock' || arguments[0] == '时钟') {
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (munite < 10) {
        munite = '0' + munite;
      }
      if (second < 10) {
        second = '0' + second;
      }
      return hour + ':' + munite + ':' + second;
    } else if (arguments[0] == 'week' || arguments[0] == '星期') {
      let days = ['日', '一', '二', '三', '四', '五', '六'];
      return '星期' + days[date.getDay()];
    }
  } else {
    return '参数过多';
  }
}
