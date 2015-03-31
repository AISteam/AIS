/**
 * 获取 URL 中的请求参数
 * @example 
 * var para = new GetRequest();
 * param['key']
 */
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
   var params = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         params[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return params;
}