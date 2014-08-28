/**
 * @namespace AIS数组通用函数库
 * @author qinmudi
 */

/**
 * @description 深度复制数组
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

/**
 * @description 删除指定位置的元素
 * @param  {number} dx 指定要删除的位置
 */
Array.prototype.remove=function(dx){
  if(isNaN(dx)||dx>this.length){return false;}
  for(var i=0,n=0;i<this.length;i++)
  {
      if(this[i]!=this[dx])
      {
          this[n++]=this[i];
      }
  }
  this.length-=1;
}