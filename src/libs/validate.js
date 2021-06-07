/**
 * 密码格式验证
 * @param rule 验证规则（不少于6位）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不得小于6位'));
  } else {
    callback();
  }
};

/**
 * 手机号码格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateMobile = (rule, value, callback) => {
  var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!reg.test(value)) {
    callback(new Error('手机号格式错误'));
  } else {
    callback();
  }
};
/**
 * 手机号码格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const valiPhoneNumber = (rule, value, callback) => {
  var reg = /^([0-9]{6,11})$/;
  if (!reg.test(value)) {
    callback(new Error('手机号格式错误'));
  } else {
    callback();
  }
};
/**
 * 手机号码和座机号同时验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateMobileTel= (rule, value, callback) => {
  //座机
  var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
   //移动号段
   var reg1 = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
    //电信号段
   var reg2 = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
    //联通号段
   var reg3 = /^((13[0-2])|(145)|(15[5-6])|(176)|(18[5-6]))[\d]{8}$/;
  if (!reg1.test(value)&&!reg2.test(value)&&!reg3.test(value)&&!isPhone.test(value)) {
    callback(new Error('电话号码格式错误'));
  } else {
    callback();
  }
};
/**
 * 统一社会信用证代码格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */ 
export const validatetaxNum = (rule, value, callback) => {
  var reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
  if (!reg.test(value)) {
    callback(new Error('统一社会信用证代码格式错误'));
  } else {
    callback();
  }
};
/**  
 * 电子邮箱格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */  
 export const validateMail = (rule, value, callback) => {
  // reg=/^[\s　]|[ ]$/gi;
  var reg = /^([a-zA-Z0-9_\.\-]||\s)+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!reg.test(value)) {
    callback(new Error('电子邮箱格式错误'));
  } else {
    callback();
  }
};
/**   reg = '/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/';
 * 邮箱编码格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */  
export const validateMailCode = (rule, value, callback) => {
  var reg = /^[1-9][0-9]{5}$/;
  if (!reg.test(value)) {
    callback(new Error('邮箱编码格式错误'));
  } else {
    callback();
  }
};
/**   
 * 工商登记号格式验证
 * @param rule 验证规则
 * @param value 需要验证的值
 * @param callback 回调函数
 */  
export const validateMerchant = (rule, value, callback) => {
  var reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
  if (!reg.test(value)) {
    callback(new Error('工商登记号格式错误'));
  } else {
    callback();
  }
};
/**
 * 身份证号码格式验证
 * @param rule 验证规则（是否满足18位）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateIDCard = (rule, value, callback) => {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!reg.test(value)) {
    callback(new Error('身份证号码格式错误'));
  } else {
    callback();
  }
};
/**
 * 银行账户格式验证
 * @param rule 验证规则（16位或17位,18位，19位）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const valiBankNum = (rule, value, callback) => {
  const reg = /^([1-9]{1})(\d{11}|\d{15,18})$/; 
  if (!reg.test(value)) {
    callback(new Error('银行账户格式错误'));
  } else {
    callback();
  }
};

/**
 * 驾驶证格式验证
 * @param rule 验证规则（数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateDriverCard = (rule, value, callback) => {
  const reg = /^[0-9a-zA-Z]+$/;
  if (!reg.test(value)) {
    callback(new Error('驾驶证格式错误'));
  } else {
    callback();
  }
};

/**
 * 行驶证格式验证
 * @param rule 验证规则（数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateVehicleCard = (rule, value, callback) => {
  const reg = /^[0-9a-zA-Z]+$/;
  if (!reg.test(value)) {
    callback(new Error('行驶证格式错误'));
  } else {
    callback();
  }
};


/**
 * 身份证号码格式验证
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateIDCardP = (value) => {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return new Promise((res, rej) => {
    if (!reg.test(value)) {
      rej('身份证格式不正确');
    } else {
      res(false);
    }
  })
};

/**
 * 驾驶证格式验证
 * @param rule 验证规则（数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateDriverCardP = (value) => {
  const reg = /^[0-9a-zA-Z]+$/;
  return new Promise((res, rej) => {
    if (!reg.test(value)) {
      rej('驾驶证格式不正确');
    } else {
      res(false);
    }
  })
};

/**
 * 行驶证格式验证
 * @param rule 验证规则（数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateVehicleCardP = (value) => {
  const reg = /^[0-9a-zA-Z]+$/;
  return new Promise((res, rej) => {
    if (!reg.test(value)) {
      rej('行驶证格式不正确');
    } else {
      res(false);
    }
  })
};
/**
 * 名称格式验证
 * @param rule 验证规则（中文，数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateName = (rule, value, callback) => {
    const reg = /^[0-9a-zA-Z\u4E00-\u9FA5]+$/
    if (!reg.test(value)) {
        callback(new Error(rule.message))
    } else {
        callback()
    }
}
/**
 * 数字、字母格式验证
 * @param rule 验证规则（数字和字母）
 * @param value 需要验证的值
 * @param callback 回调函数
 */
export const validateNumEn = (rule, value, callback) => {
  const reg = /^[0-9a-zA-Z]+$/
  if (!reg.test(value)) {
      callback(new Error(rule.message))
  } else {
      callback()
  }
}
/**
 * 空值验证
 */
export const validateEmpty = (rule, value, callback) => {
  const reg = /^\s*$/g;;
  if (reg.test(value)) {
    callback(new Error('不能为空'));
  } else {   
    callback();
  }
};