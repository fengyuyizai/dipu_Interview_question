const crypto = require("crypto");
const axios = require("axios");

const url = "http://127.0.0.1:3000/api/test";

const configRequired = {
    "common": ["accessKeyID", "accessKeySecret", "accountName"],
    "single": ["toAddress"],
    "batch": ["templateName", "receiversName"]
};
const paddingField = {
    "single": ["fromAlias", "subject", "htmlBody", "textBody"],
    "batch": ["tagName"]
};

/**
 * 将config中存在的字段加入param
 * @param {Object:String} totalParam 目标param
 * @param {Object:String} config 当前配置
 * @param {Array} paddingList 总填充项
 */
function paddingFieldFun (totalParam, config, paddingList) {
    paddingList.forEach((item) => {
        if (config.item) {
            let key = item.toString();
            totalParam[key] = config[key];
        }
    });
    let c = 1;
    let d = 2;
}

/**
 * 必填的config未填，push入errorMsg
 * @param {Array} totalErrorMsg 目标错误数组
 * @param {Object:String} config 当前配置
 * @param {Array} requiredList 必要项
 */
function configRequiredFun (totalErrorMsg, config, requiredList) {
    requiredList.forEach((item) => {
        let key = item.toString();
        if (!config[key]) {
            totalErrorMsg.push(`${item} required`);
        }
    });
}

module.exports = function (config = {}, cb) {
    const nonce = Date.now();
    const date = new Date();
    const errorMsg = [];
    const action = config.action;
    
    // 如果缺少action， 直接回退
    if (!action) {
        cb("error action", null);
        return;
    }

    configRequiredFun(errorMsg, config, configRequired.common);
    
    // 定义基础结构
    let param = {
        AccessKeyId: config.accessKeyID,
        Action: action,
        Format: "JSON",
        AccountName: config.accountName,
        ReplyToAddress: !!config.replyToAddress,
        AddressType: typeof config.addressType === "undefined" ? 0 : config.addressType,
        SignatureMethod: "HMAC-SHA1",
        SignatureNonce: nonce,
        SignatureVersion: "1.0",
        TemplateCode: config.templateCode,
        Timestamp: date.toISOString(),
        Version: "2015-11-23"
    };

    configRequiredFun(errorMsg, config, configRequired[action]);
    if (action === "single") {
        Object.assign(param, {
            ToAddress: config.toAddress,
        });
    } else if (action === "batch") {
        Object.assign(param, {
            TemplateName: config.templateName,
            ReceiversName: config.receiversName,
        });
    }
    paddingFieldFun(param, config, paddingField[action]);
    if (errorMsg.length) {
        return cb(errorMsg.join(","));
    }

    // 签名生成
    let signArr = [];

    for (let i in param) {
        if ({}.hasOwnProperty.call(param, i)) {
            signArr.push(i + "=" + param[i]);
        }
    }
    signArr.sort();
    let signStr = signArr.join("&");
    signStr = "POST&%2F&" + signStr;
    const sign = crypto.createHmac("sha1", config.accessKeySecret + "&")
        .update(signStr)
        .digest("base64");
    const signature = encodeURIComponent(sign);
    let reqBody = ["Signature=" + signature];
    reqBody.concat(signArr);
    reqBody = reqBody.join("&");

    axios({
        method: "POST",
        url,
        data: reqBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((res) => {
        cb("success", res);
    }).catch((err) => {
        cb(err, {"isErr": false});
    });
};