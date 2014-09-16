/**
 * @description 模块加载器
 * @param  {object} exports window对象
 * @param  {object} AIS     AIS对象
 * @example
 * require(['util', 'math', 'num'], function (util, math, num) { 
     num = math.getRadom() + '_' + num;
     num = util.formatNum(num);
     console.log(num);
   });
 */
;(function(exports,AIS){
	//存储已加载的好的模块
	var moduleCache = {};

	var require = function(deps,callback){
		var params = [];
		var depCount = 0;
		var i,len,isEmpty = false,modName;

		modName = document.currentScript&&document.currentScript.id||'REQUIRE_MAIN';

		if(deps.length){
			for (i=0,len=deps.length;i<len;i++) {
				(function(i){
					depCount++;
					loadMod(deps[i],function(param){
						params[i] = params;
						depCount--;
						if(depCount==0){
							saveModule(modName,params,callback);
						}
					});
				})(i);
			};
		}else{
			isEmpty = true;
		}

		if(isEmpty){
			setTimeout(function(){
				saveModule(modName,null,callback);
			}, 0);
		}
	};

	var _getPathUrl = function(modName){
		var url = modName;
		if(url.indexOf('.js')==-1)
			url = url+'.js';
		return url;
	};

	var loadMod = function(modName,callback){
		var url = _getPathUrl(modName),fs,mod,_script;

		if(moduleCache[modName]){
			mod = moduleCache[modName];
			if(mod.status == 'loaded'){
				setTimeout(callback(this.params), 0);
			}else{
				mod.onload.push(callback);
			}
		}else{
			mod = moduleCache[modName] = {
				modName:modName,
				status:'loading',
				export:null,
				onload:[callback]
			}

			_script = document.createElement('script');
			_script.id = modName;
			_script.type = 'text/javascript';
			_script.charset = 'utf-8';
			_script.async = true;
			_script.src = url;

			fs = document.getElementsByTagName('script')[0];
			fs.parentNode.insertBefore(_script,fs);
		}
	};

	var saveModule = function(modName,params,callback){
		var mod,fn;

		if(moduleCache.hasOwnProperty(modName)){
			mod = moduleCache[modName];
			mod.status = 'loaded';

			mod.export = callback?callback(params):null;

			while(fn=mod.onload.shift()){
				fn(mod.export);
			}
		}else{
			callback&&callback.apply(window, params);
		}
	};


	AIS.require = require;
	AIS.define = require;
	exports.AIS = AIS;

})(window,window.AIS||{});