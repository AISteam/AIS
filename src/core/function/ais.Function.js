/**
 * @description 通用函数绑定方法
 * @return {function} 执行的函数
 * @example
 * function o(){  
	    this.num = 1;  
	    var fn = function(arg){alert(this.num+arg)}.bind(this,2);  
	    fn();  
	}  
	new o()   
 */
Function.prototype.bind = function(){
	var _this = this;
	var _obj = arguments[0];
	var _params = Array.prototype.slice.call(arguments,1);
	return function(){
		return _this.apply(_obj,_params);
	}
}