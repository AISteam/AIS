/**
 * @namespace AIS数组通用函数库
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