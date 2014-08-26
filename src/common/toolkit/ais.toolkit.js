/**
 * AIS工具类
 * @author qinmudi
 * @param  {window} exports window对象
 * @param  {AIS} AIS     AIS对象
 */
;(function(exports,AIS){
    var toolkit = function(){
        return{
            /**
            * 用于html模板替换
            * @return {String} 返回替换后的html字符串
            * @param {String} str 目标字符串，替换规则为 /(%(.+?)%)/
            * @param {Object} cfg 用于替换的映射表
            * @example 
                $.toolkit.tpl('<h3 class="%className%">%text%</h3>', {
                    className: 'title', 
                    text: '标题'
                });
            */
            tpl: function(str, cfg) {
                var re = /(%(.+?)%)/g;
                
                return str.replace(re, function() {
                    var val = cfg[arguments[2]]+'';
                    /**
                     * 截取姓名超过5个显示省略号的问题
                     */
                    if(arguments[2]=="name"&&val.length>5){
                        val = val.substring(0,5)+'…';
                    }
                    if(typeof val == 'undefined') {
                        val = '';
                    }
                    return val;
                });
            },
            /**
            * 用于获取输入框剩余可输入汉字
            * @return {Number} 返回剩余字数
            * @param {HTML Object | jQuery Object} input 目标输入框
            * @param {Number} limit 字数限制
            */
            textRemain: function(input, limit) {
                var limit = limit || 30;
                var remain = limit;
                var text = '', cLen=0;
                text = $.trim($(input).val());
                try{
                    var matcher = text.match(/[^\x00-\xff]/g);
                    cLen  = (matcher && matcher.length || 0);
                }catch(err){}
                remain = Math.floor((limit*2 - text.length - cLen)/2); 
                return remain;
            },
            /**
            * 得到url上的参数的值
            * @param 要得到的参数的名称(name)
            * @example getUrlParam('keyWord');
            */
            getUrlParam: function(name){
                var name = name + '=';
                var regStr = '(?:'+name+')([^\?&#]+)';
                var reg = new RegExp(regStr);
                var str = window.location.search;
                var match = str.match(reg);
                if (match != null){
                    try{
                        return decodeURIComponent(match[1]);
                    }catch(e){
                        return match[1];
                    }
                }else{
                    return null;
                }
            },
            /**
            * 得到一个随机数值
            * @param 可以在随机数添加一个前缀（name）
            * @example getRandomNum('random');
            */
            getRandomNum: function(name){
                var date = new Date();
                var times = date.getTime();
                var timeStr = date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();
                var random = times*timeStr;
                if (arguments.length == 1){
                    return arguments[0] + '' + random;
                }else {
                    return random;
                }
            },
            /**
            * 数组去重
            * @param 数组
            * @example delRepeat(arry);
            */  
            delRepeat:function(arry){
                if (!arry) return [];
                var tmpArry = [];
                var tmpObj = {};
                for (var i=0,item; (item=arry[i])!=null; i++){
                    if (!tmpObj[item]){
                        tmpArry.push(item);
                        tmpObj[item] = true;
                    }
                }
                return tmpArry;
            }
        }
    }

    AIS.toolkit = new toolkit;
    exports.AIS = AIS;
})(window,window.AIS||{});