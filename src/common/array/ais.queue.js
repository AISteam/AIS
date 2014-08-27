/**
 * @namespace AIS队列对象
 * @author qinmudi
 * @example
 * var oQueue = new Queue();
	oQueue.EnQueue("bbs", "fans", "bruce");
	console.log(oQueue.toString());
	oQueue.EnQueue(23423);
	console.log(oQueue.toString());
	console.log(oQueue.DeQueue());
	console.log(oQueue.GetSize());
	console.log(oQueue.GetHead());
	console.log(oQueue.GetEnd());
	oQueue.MakeEmpty();
	console.log(oQueue.IsEmpty());
	console.log(oQueue.toString());
	delete oQueue;
 */
function Queue(){
	var aElement = new Array();

	/**
	 * @description 元素入队
	 * @param {array} vElement 元素列表,add方法参数可以多个
	 * @return {number} 返回当前队列元素个数,参数为空时返回-1
	 */
	this.add = function(vElement){
		if (vElement.length == 0)
			return -1;
		//元素入队  
		for (var i = 0; i < vElement.length; i++) {
			aElement.push(vElement[i]);
		}
		return aElement.length;
	}

	/**
	 * @description 元素出队
	 * @return {object} 当队列元素为空时,返回null
	 */
	this.remove = function(){
		if (aElement.length == 0)
			return null;
		else
			return aElement.shift();
	}

	/**
	 * @description 获取队列元素个数
	 * @return {number} 元素个数
	 */
	this.getSize = function(){
		return aElement.length;
	}

	/**
	 * @description 返回队头素值
	 * @return {object} 若队列为空则返回null
	 */
	this.getHead = function(){
		if (aElement.length == 0)
			return null;
		else
			return aElement[0];
	}

	/**
	 * @description 返回队尾素值
	 * @return {object} 若队列为空则返回null
	 */
	this.getEnd = function(){
		if (aElement.length == 0)
			return null;
		else
			return aElement[aElement.length - 1];
	}

	/**
	 * @description 将队列置空
	 */
	this.makeEmpty = function(){
		aElement.length = 0;
	}

	/**
	 * @description 判断队列是否为空
	 * @return {boolean} 队列为空返回true,否则返回false
	 */
	this.isEmpty = function(){
		if (aElement.length == 0)
			return true;
		else
			return false;
	}

	/**
	 * @description 将队列元素转化为字符串
	 * @return {string} 队列元素字符串
	 */
	this.toString = function(){
		var sResult = (aElement.reverse()).toString();
		aElement.reverse()
		return sResult;
	}
}