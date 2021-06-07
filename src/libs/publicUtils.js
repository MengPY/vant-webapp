
// 全局公共方法
import {
  codeList,
  getFeeListData,
} from "@/api";
import $store from "@/store/index.js"
import {
  getCodeList,
  dicDetail

} from "@/api/maintenance";
export default {

  /**
  * @description 获取值集数据
  * @param { String } codeType 值集类型
  * @return { Object } 值集数据
  */
  async getCodeData (codeType) {
    if ((codeType).constructor != String || !codeType) {
      console.log("值集代码不能为空");
      return
    };

    const codeObj = $store.state.codeValue[codeType]
    if (codeObj) {
      if ((codeObj.data || []).length > 0) {
        return { [codeType]: $store.state.codeValue[codeType].data }
      }
    }
    let dataArr = [];
    await getCodeList({
      // pageNum: 1,
      // pageSize: 99999,
        setCodes: codeType
    }).then(res => {
      if (res.data && res.data.success === true) {
        const data = res.data.data
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const el = data[key]
            // $store.commit("setCodeValue", { key: key, data: el })
          }
        }
        dataArr = res.data.data;
      }
    });
    return dataArr;
  },

  /**
  * @description 获取值集数据(数组方式)
  * @param { Array } codeArr 值集类型数组
  * @return { Object } 值集数据
  */
  // async getCodeArr (codeArr) {
  //   if ((codeArr).constructor != Array || !codeArr.length) {
  //     console.log("值集数组不能为空");
  //     return
  //   };

  //   let result = {};
  //   let paramsArr = [];

  //   codeArr.map(item => {
  //     if (($store.state.codeValue[item] || []).length > 0) {
  //       result[item] = $store.state.codeValue[item];
  //     } else {
  //       paramsArr.push(item);
  //     }
  //   });

  //   if (paramsArr.length === 0) {
  //     return result;
  //   }

  //   // 获取数组值集，commit至store, 返回数据。
  //   await getDictDataByCodeSet(paramsArr).then(res => {
  //     if (res.data && res.data.success === true) {
  //       let dataObj = res.data.data;
  //       for (let key in dataObj) {
  //         result[key] = dataObj[key];
  //         $store.commit("setCodeValue", { key: key, data: dataObj[key] });
  //       }
  //     }
  //   });

  //   return result;
  // },



}
