// 给对象添加一个过期时间属性
const setExpire = function(successResponseObj) {
    const curHour = new Date().getHours();
    const today_0_oclock = new Date(new Date().toLocaleDateString()).getTime();
    let expireTime;
    if(curHour < 5) { // 说明在当天，过期时间应设置在今天5点
        expireTime = today_0_oclock + 5 * 60 * 60 * 1000;
    } else { // 说明在昨天，过期时间应设置在明天5点
        expireTime = today_0_oclock + 29 * 60 * 60 * 1000;
    }

    successResponseObj.expire = expireTime;
    return successResponseObj;
}

// 把url的params以键值对的方式返回
const getParams = function(params, keyValuePair) {
    const ParamsArray = params.slice(1).split('&');
    for(let item of ParamsArray) {
        let key = item.split('=')[0];
        let value = item.split('=')[1];
        keyValuePair[key] = value;
    }
    return keyValuePair;
}

// eslint-disable-next-line import/no-anonymous-default-export
export {
    setExpire,
    getParams
}