/**
 * AIS正则通用库
 * @author qinmudi
 * @param  {window} exports window对象
 * @param  {AIS} AIS     AIS对象
 */
;(function(exports,AIS){
	var checkRule = {
		name: {
			reg: /^$|^(\w|[\u4E00-\u9FA5])+$/,
			error:'姓名含有非法字符'
		},
		mobile:{
			reg:  /^0?\d{9,11}$/,
			error: '手机号码格式不正确'
		},
		pager:{
			reg:  /^$|^[0-9]+$/,
			error: '电报格式不正确'
		},
		email:{
			reg: /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/,
			error:'电子邮箱格式不对'
		},
		website:{
			reg: /^$|^(((https?)|(ftp))\:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}.*$/,
			error:'请输入正确的网站格式'
		},
		fax:{
			reg: /^$|^[0-9]+$/,
			error:'传真格式不正确，请输入数字'
		},
		fetion:{
			reg:/^$|^[0-9]+$/,
			error: '飞信格式不正确，请输入数字'
		},
		qq:{
			reg: /^$|^[0-9]{5,}$/,
			error:'qq格式不正确'
		},
		msn:{
			reg: /^$|^([0-9a-zA-Z]([-.]*[0-9a-zA-Z_+])*@([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
			error:'请输入正确的MSN'
		},
		num:{
			reg:/^([+-]?)\d*\.?\d+$/,
			error:'必须是数字'
		},
		date:{
			reg:/^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/,
			error:'错误的日期格式'
		}
	}

	var regular = function(){
		return{
	        /**
	         * 自定义正则表达式
	         * @param  {object} value 要检验的值
	         * @param  {string} attr  正则表达式
	         * @return {boolean}       是否匹配
	         */
	        pattern: function(value, attr) {
	            if (value == "") return false;
	            return new RegExp(attr).test(value);
	        },
	        /**
	         * 检验两个值是否相同
	         * @param  {object} value 值1
	         * @param  {object} attr  值2
	         * @return {boolean}      值1和值2是否相等
	         */
	        equal: function(value, attr) {
	            if (value == "") return false;
	            return attr === value;
	        },
	        /**
	         * 不带错误信息的通用正则校验
	         * @param  {object} type  要进行校验的值
	         * @param  {string} value 选择校验类型
	         * @return {boolean}       是否匹配
	         */
	        validate:function(type,value){
	        	if (value == "") return false;
	            return checkRule[type]['reg'].test(value);
	        },
	        /**
	         * 带错误信息的通用正则校验
	         * @param  {object} type  要进行校验的值
	         * @param  {String} value 选择校验类型
	         * @return {json}       result,boolean 是否匹配、message,string 错误信息
	         */
	        validateMsg:function(type,value){
	        	if (value == "") return false;
	            return{
	            	result:checkRule[type]['reg'].test(value),
	            	message:checkRule[type]['error']
	            };
	        }
		}
	}

	AIS.regular = new regular;
	exports.AIS = AIS;
})(window,window.AIS||{});