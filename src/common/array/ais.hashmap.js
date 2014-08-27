/**
 * @namespace AIS hashmap对象
 * @author qinmudi
 */
function hashMap() {
	/**  
	 * @description Map大小
	 */
	var size = 0;
	/**  
	 * @description 容器默认最大长度
	 */
	var length = 256
	var loadfactor = 0.75;
	/**  
	 * @description 质数
	 */
	var prime = 1000000;
	/**  
	 * @description 对象
	 */
	var table = new Array(length);

	/**  
	 * @description 设置构建Hash质数
	 * @param {Object} p 要传入的质数
	 */
	this.setPrime = function(p) {
		this.prime = p;
	}
	/**  
	 * @description 获取构建Hash质数
	 * @return {number} 返回质数值
	 */
	this.getPrime = function() {
		return this.prime;
	}
	/**  
	 * @description 当期的Hash值计算方法
	 */
	this.hash = BKDRHash;

	/**  
	 * @description HashMap的put方法
	 * @param {Object} key 存放的键
	 * @param {Object} value 存放的值
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
	 * @description 通过Key从HashMap中取值
	 * @param {Object} key  键值,如果没有返回null
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
	 * @description 删除元素
	 * @param {Object} key 键值
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
	 * @description 是否包含Key
	 * @param {Object} key 键值
	 * @return {boolean} true包含，false不包含
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
	 * @description 测试是否包含有值
	 * @param {Object} value 值
	 * @return {boolean} true包含，false不包含
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
	 * @description 取得元素个数
	 * @return {number} 个数
	 */
	this.getSize = function() {
		return size;
	}

	/**  
	 * @description 重新Hash
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
	//BKDR Hash  
	function BKDRHash(key) {
		var seed = 131;
		var hashcode = 0;

		for (i = 0; i < key.length; ++i) {
			hashcode = hashcode * seed + key.charCodeAt(i);
		}
		return (hashcode % prime);
	}

	//bernstein Hash  
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
	 * @description 存储单元，维护Key/Value关系
	 * @param {Object} key 存放的键
	 * @param {Object} value 存放的值
	 */
	var Entry = function(key, value) {
		this.key = key;
		this.value = value;
		this.next = undefined;
		this.prev = undefined;
	}

}