/**
 * @description 是否包含某个字符串
 * @param  {string} text 要检验的字符串
 * @return {boolean} true包含，false不包含、注意：如果空字符串也返回true
 */
String.prototype.contains = function(text) {
    if (text == '') 
        return true;
    else if (text == null) 
        return false;
    else 
        return this.indexOf(text) !== -1;
}

/**
 * @description 返回字符串的长度
 * @param  {string} text 要检测的字符串
 * @return {number}      字符串的长度
 */
String.prototype.count = function(text) {
    if (this.contains(text))
        return this.split(text).length - 1;
    else
        return 0;
}


/**
 * @description 去掉字符串内的空格
 * @return {string} 去掉空格后的字符串
 */
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
}

/**
 * @description 去掉字符串左边的空格
 * @return {string} 去掉左空格的字符串
 */
String.prototype.leftTrim = function() {
    return this.replace(/^\s+/, '');
}

/**
 * @description 去掉字符串右边的空格
 * @return {string} 去掉右空格的字符串
 */
String.prototype.rightTrim = function() {
    return this.replace(/\s+$/, '');
}

/**
 * 去掉全部的空格
 * @return {string} 去掉空格的字符串
 */
String.prototype.clear = function() {
    return this.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

/**
 * @description 是否以某个字符串开头
 * @param  {string} start 开头的字符串内容
 * @return {boolean}  true是，false否
 */
String.prototype.startsWith = function(start) {
    if (start == '') 
        return true;
    else if (start == null || start.length > this.length) 
        return false;
    else 
        return this.substring(0, start.length) == start;
}

/**
 * @description 是否以某个字符串结尾
 * @param  {string} start 结尾的字符串内容
 * @return {boolean}  true是，false否
 */
String.prototype.endsWith = function(end) {
    if (end == '') return true;
    else if (end == null || end.length > this.length) return false;
    else return this.indexOf(end, this.length - end.length) !== -1;
}

/**
 * @description 在指定的位置插入字符串
 * @param  {string} text 要插入的字符串
 * @param  {number} at   要插入的位置
 * @return {string}      插入以后的字符串
 */
String.prototype.insert = function(text, at) {
    if (at == null || at > this.length)
        at = this.length;
    else if (at < 0)
        at = 0;
    return this.substring(0, at) + text + this.substring(at);
}

/**
 * @description StringBuilder，高效字符串拼接方法
 * @author qinmudi
 */
function StringBuilder() {
    this._string_ = new Array();

    /**
     * @description 追加字符串
     * @param  {string} str 要追加的字符串
     */
    this.append = function(str) {
        this._string_.push(str);
    }

    /**
     * @description StringBuilder转换为字符串
     * @return {string} 转换后的字符串
     */
    this.toString = function() {
        return this._string_.join('');
    }
}