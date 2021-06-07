

// 公共方法引入
import utils from "@/libs/util.js";

export default {
  // 值集过滤器
  codeFilter: function (code, data, key="itemName", value="itemCode") {
    if (code && data) {
      let res = data.find(item => {
        return item[value] == code;
      });
      return (res ? res[key] : code);
    };
  },

  // 时间过滤
  timeFilter: function (time) {
    return utils.formatDate(time)
  },
  //文件转换
  NameFilter: function (val) {

    return (val&&val.match(/(?<=-).*?(?=\.)/)||[]).join()
  },
  /**
   * 格式化小数位
   * @param val 传入的值
   * @param pos 保留的小数位
   * @returns {*}
   */
  numberFilter: function (number, len=2) {
    if(!number) return;
    return number.toFixed(len)
  },

  /**
   * 千分位格式化
   * @param {数字} val
   */
  toThousands: function (val) {
    let num = (val || 0).toString(), result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  },



}