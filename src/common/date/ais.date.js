/**
 * @description 时间对象的格式化;
 * @author qinmudi
 * @param  {string} format 格式化表达式 如：'yyyy-MM-dd hh:mm:ss'
 * @return {string}   日期格式化结果
 * @example var now = new Date().format("yyyy-MM-dd hh:mm:ss");
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "h+": this.getHours(), // hour  
        "m+": this.getMinutes(), // minute  
        "s+": this.getSeconds(), // second  
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 * @description 简单格式化
 * @param  {number} timeStamp 时间戳
 * @return {string}  经过格式化的字符串
 */
Date.prototype.simpleTimeFormat = function(timeStamp) {
    var messageTime = new Date(parseInt(timeStamp));
    var formatStr = "";
    if (serverDate-messageTime.getDate()==0){
        formatStr = "今天  ";
    }else if(serverDate-messageTime.getDate()==1){
        formatStr = "昨天 ";
    }else{
        formatStr = messageTime.format('yyyy-MM-dd');
    }
    return formatStr;
};

/**
 * @description 全日期格式化
 * @param  {number} timeStamp 时间戳
 * @return {string}  经过格式化的字符串
 */
Date.prototype.fullTimeFormat = function(timeStamp){
    var messageTime = new Date(parseInt(timeStamp));
    var formatStr = "";
    if (serverDate-messageTime.getDate()==0){
        formatStr = "今天  "+messageTime.format('hh:mm');
    }else if(serverDate-messageTime.getDate()==1){
        formatStr = "昨天 "+messageTime.format('hh:mm');
    }else{
        formatStr = messageTime.format('yyyy-MM-dd hh:mm');
    }
    return formatStr;
};