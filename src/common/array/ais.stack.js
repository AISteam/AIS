/**
 * @namespace AIS栈对象
 * @author qinmudi
 * @example
 * var oStack = new Stack();
	oStack.Push("abc", "123", 890);
	console.log(oStack.toString());
	oStack.Push("qq");
	console.log(oStack.toString());
	console.log(oStack.GetSize());
	console.log(oStack.Pop());
	console.log(oStack.GetTop());
	oStack.MakeEmpty();
	console.log(oStack.GetSize());
	console.log(oStack.toString());
	delete oStack;
 */
function Stack(){
	var aElement = new Array();

	/**
	 * @description 元素入栈
	 * @param  {array} vElement 入栈元素列表,方法参数可以多个
	 * @return {number}  返回长度，参数为空时返回-1
	 */
	this.push = function(vElement){
		if (vElement.length == 0)
			return -1;
		//元素入栈  
		for (var i = 0; i < vElement.length; i++) {
			aElement.push(vElement[i]);
		}
		return aElement.length;
	}
	/**
	 * @description 元素出栈
	 * @return {object} 返回栈顶元素，当堆栈元素为空时,返回null
	 */
	this.pop = function(){
		if (aElement.length == 0)
			return null;
		else
			return aElement.pop();
	}
	/**
	 * @description 获取堆栈元素个数
	 * @return {number} 元素个数
	 */
	this.getSize = function(){
		return aElement.length;
	}
	/**
	 * @description 返回栈顶元素值
	 * @return {object} 返回元素列表，若堆栈为空返回null
	 */
	this.getTop = function(){
		if (aElement.length == 0)
			return null;
		else
			return aElement[aElement.length - 1];
	}
	/**
	 * @description 将堆栈置空
	 */
	this.markEmpty = function(){
		aElement.length = 0;
	}
	/**
	 * @description 判断堆栈是否为空
	 * @return {boolean} true、为空，false为非空。
	 */
	this.isEmpty = function(){
		if (aElement.length == 0)
			return true;
		else
			return false;
	}
	/**
	 * @description 将堆栈元素转化为字符串
	 * @return {string} 堆栈元素字符串
	 */
	this.toString = function(){
		var sResult = (aElement.reverse()).toString();
		aElement.reverse()
		return sResult;
	}
}