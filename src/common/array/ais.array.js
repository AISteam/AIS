/**
 * AIS数组通用函数库
 * @author qinmudi
 */

/**
 * 深度复制数组
 * @author qinmudi
 * @param  {array} source 目标数组
 * @example
 * 	var arr1 = [[1,2,3],4,5];
 *  var arr2 = [];
 *  arr2.extend(arr1);
 *  arr1[0][0] = 0;
 *  alert([arr1[0][0],arr2[0][0]]);
 */
Array.prototype.extend = function(source) {
	for (var attr in source) {
		if (Object.prototype.toString.call(source[attr]).slice(8, -1).toLowerCase() === 'array') {
			this[attr] = [];
			this[attr].extend(source[attr]);
		} else {
			this[attr] = source[attr];
		}
	}
}

function Stack() {
	//存储元素数组  
	var aElement = new Array();
	/* 
	 * @brief: 元素入栈
	 * @param: 入栈元素列表
	 * @return: 堆栈元素个数
	 * @remark: 1.Push方法参数可以多个
	 *    2.参数为空时返回-1
	 */
	Stack.prototype.Push = function(vElement) {
		if (arguments.length == 0)
			return -1;
		//元素入栈  
		for (var i = 0; i < arguments.length; i++) {
			aElement.push(arguments[i]);
		}
		return aElement.length;
	}
	/* 
	 * @brief: 元素出栈
	 * @return: vElement
	 * @remark: 当堆栈元素为空时,返回null
	 */
	Stack.prototype.Pop = function() {
		if (aElement.length == 0)
			return null;
		else
			return aElement.pop();
	}
	/* 
	 * @brief: 获取堆栈元素个数
	 * @return: 元素个数
	 */
	Stack.prototype.GetSize = function() {
		return aElement.length;
	}
	/* 
	 * @brief: 返回栈顶元素值
	 * @return: vElement
	 * @remark: 若堆栈为空则返回null
	 */
	Stack.prototype.GetTop = function() {
		if (aElement.length == 0)
			return null;
		else
			return aElement[aElement.length - 1];
	}
	/* 
	 * @brief: 将堆栈置空
	 */
	Stack.prototype.MakeEmpty = function() {
		aElement.length = 0;
	}
	/* 
	 * @brief: 判断堆栈是否为空
	 * @return: 堆栈为空返回true,否则返回false
	 */
	Stack.prototype.IsEmpty = function() {
		if (aElement.length == 0)
			return true;
		else
			return false;
	}
	/* 
	 * @brief: 将堆栈元素转化为字符串
	 * @return: 堆栈元素字符串
	 */
	Stack.prototype.toString = function() {
		var sResult = (aElement.reverse()).toString();
		aElement.reverse()
		return sResult;
	}
}

function Queue() {
	//存储元素数组  
	var aElement = new Array();
	/* 
	 * @brief: 元素入队
	 * @param: vElement元素列表
	 * @return: 返回当前队列元素个数
	 * @remark: 1.EnQueue方法参数可以多个
	 *    2.参数为空时返回-1
	 */
	Queue.prototype.EnQueue = function(vElement) {
		if (arguments.length == 0)
			return -1;
		//元素入队  
		for (var i = 0; i < arguments.length; i++) {
			aElement.push(arguments[i]);
		}
		return aElement.length;
	}
	/* 
	 * @brief: 元素出队
	 * @return: vElement
	 * @remark: 当队列元素为空时,返回null
	 */
	Queue.prototype.DeQueue = function() {
		if (aElement.length == 0)
			return null;
		else
			return aElement.shift();

	}
	/* 
	 * @brief: 获取队列元素个数
	 * @return: 元素个数
	 */
	Queue.prototype.GetSize = function() {
		return aElement.length;
	}
	/* 
	 * @brief: 返回队头素值
	 * @return: vElement
	 * @remark: 若队列为空则返回null
	 */
	Queue.prototype.GetHead = function() {
		if (aElement.length == 0)
			return null;
		else
			return aElement[0];
	}
	/* 
	 * @brief: 返回队尾素值
	 * @return: vElement
	 * @remark: 若队列为空则返回null
	 */
	Queue.prototype.GetEnd = function() {
		if (aElement.length == 0)
			return null;
		else
			return aElement[aElement.length - 1];
	}
	/* 
	 * @brief: 将队列置空
	 */
	Queue.prototype.MakeEmpty = function() {
		aElement.length = 0;
	}
	/* 
	 * @brief: 判断队列是否为空
	 * @return: 队列为空返回true,否则返回false
	 */
	Queue.prototype.IsEmpty = function() {
		if (aElement.length == 0)
			return true;
		else
			return false;
	}
	/* 
	 * @brief: 将队列元素转化为字符串
	 * @return: 队列元素字符串
	 */
	Queue.prototype.toString = function() {
		var sResult = (aElement.reverse()).toString();
		aElement.reverse()
		return sResult;
	}
}


var oStack = new Stack();

oStack.Push("abc", "123", 890);
// console.log(oStack.toString());

oStack.Push("qq");
// console.log(oStack.toString());
//  alert(oStack.GetSize());
//  alert(oStack.Pop());
//  alert(oStack.GetTop());
//  oStack.MakeEmpty();
//  alert(oStack.GetSize());
//  alert(oStack.toString());

delete oStack;

var oQueue = new Queue();

oQueue.EnQueue("bbs", "fans", "bruce");
// console.log(oQueue.toString());
oQueue.EnQueue(23423);
// console.log(oQueue.toString());
//  alert(oQueue.DeQueue());
//  alert(oQueue.GetSize());
//  alert(oQueue.GetHead());
//  alert(oQueue.GetEnd());
//  oQueue.MakeEmpty();
//  alert(oQueue.IsEmpty());
//  alert(oQueue.toString());

delete oQueue;



function hashMap() {

	/**  
	 * Map大小
	 */
	var size = 0;
	/**  
	 * 容器默认最大长度
	 */
	var length = 256
	var loadfactor = 0.75;
	/**  
	 * 质数
	 */
	var prime = 1000000;
	/**  
	 * 对象
	 */
	var table = new Array(length);

	/**  
	 * 设置构建Hash质数
	 * @param {Object} p
	 */
	this.setPrime = function(p) {
		this.prime = p;
	}
	/**  
	 * 获取构建Hash质数
	 */
	this.getPrime = function() {
		return this.prime;
	}
	/**  
	 * 当期的Hash值计算方法
	 */
	this.hash = BKDRHash;

	/**  
	 * HashMap的put方法
	 * @param {Object} key
	 * @param {Object} value
	 */
	this.put = function(key, value) {
		/**  
		 * 如果装填因子大于0.75则重新Hash
		 */
		if (size / length > loadfactor) {
			rehash(this);
		}

		var counter = 0;
		var code = this.hash(key);
		//如果指定位置为空，则直接存放  
		if (typeof table[code] == 'undefined') {
			size = size + 1;
			table[code] = new Entry(key, value);
			//如果指定位置不为空并且Key值相等，则覆盖  
		} else
		if (table[code].key == key) {
			table[code].value == value;
		}
		//发生散列冲突  
		else {
			var entry = table[code];
			// 访问Hash链表  
			while (entry.next != undefined) {
				entry = entry.next;
				if (entry.key == key) {
					//覆盖  
					entry.value =
						value;
					break;
				} else if (entry.next == undefined) {
					//新增  
					entry.next = new Entry(key, value);
					entry.next.prev = entry;
					size = siez + 1;
					break;
				}
			}
		}

	}

	/**  
	 * 通过Key从HashMap中取值
	 * @param {Object} key  键值
	 */
	this.load = function(key) {
		var hashcode = this.hash(key);
		if (typeof table[hashcode] != 'undefined') {
			var entry = table[hashcode];
			if (entry.key == key) {
				return entry.value;
			} else {
				while (entry.next != undefined) {
					entry = entry.next;
					if (entry.key == key) {
						return entry.value;
					}
				}
			}
		}
		return null;

	}
	/**  
	 * 删除元素
	 * @param {Object} key
	 */
	this.remove = function(key) {
		var hashcode = this.hash(key);
		var counter = 0;
		var entry = table[hashcode];
		if (entry != undefined) {
			counter++;
			while (entry.next != undefined) {
				counter++;
				entry = entry.next;
			}
		}

		table[hashcode] = undefined;
		entry = undefined;
		size = size - counter;
	}

	/**  
	 * 是否包含Key
	 * @param {Object} key
	 */
	this.containsKey = function(key) {
		var hashcode = this.hash(key);
		if (typeof table[hashcode] != 'undefined') {
			var entry = table[hashcode];
			if (entry.key == key) {
				return true;
			} else {
				while (entry.next != undefined) {
					entry = entry.next;
					if (entry.key == key) {
						return true;
					}
				}
			}
		}
		return false;
	}
	/**  
	 * 测试是否包含有值
	 * @param {Object} value
	 */
	this.containsValue = function(value) {
		for (i = 0; i < table.length; i++) {
			if (typeof table[i] != 'undefined') {
				var entry = table[i];
				if (entry.value == value) {
					return true
				} else {
					while (entry.next != undefined) {
						entry = entry.next;
						if (entry.value == value) {
							return true
						}
					}
				}
			}
		}
		return false;
	}


	/**  
	 * 取得元素个数
	 */
	this.getSize = function() {
		return size;
	}

	/**  
	 * 重新Hash
	 * @param {Object} _this 当期hash表实例
	 */
	function rehash(_this) {
		var newTable = new Array();
		for (i = 0; i < length; i++) {
			if (typeof table[i] != 'undefined') {
				newTable.push(table[i]);
			}
		}
		length = length * 2
		table = new Array(length);
		size = 0;
		//重新hash  
		for (i = 0; i < newTable.length; i++) {

			var entry = newTable[i];
			_this.put(key, value);

		}
	}

	//Hash算法  
	//// BKDR Hash  
	function BKDRHash(key) {
		var seed = 131;
		var hashcode = 0;

		for (i = 0; i < key.length; ++i) {
			hashcode = hashcode * seed + key.charCodeAt(i);
		}
		return (hashcode % prime);
	}

	//// bernstein Hash  
	function bernsteinHash(key) {
		var seed = 33;
		var hashcode = 0;

		for (i = 0; i < key.length; ++i) {
			hashcode = hashcode * seed + key.charCodeAt(i);
		}
		return (hashcode % prime);
	}

	//Roatation Hash  
	function roatationHash(key) {
		var hash = key.length;
		for (i = 0; i < key.length; ++i) {
			hash = (hash << 5) ^ (hash >> 27) ^ key.charCodeAt(i);
		}
		return Math.abs(hash % prime);
	}

	/**  
	 * 存储单元，维护Key/Value关系
	 * @param {Object} key
	 * @param {Object} value
	 */
	var Entry = function(key, value) {
		this.key = key;
		this.value = value;
		this.next = undefined;
		this.prev = undefined;
	}

}