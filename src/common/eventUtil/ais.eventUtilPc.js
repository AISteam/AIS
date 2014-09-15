/**
 * @namespace AIS.eventUtilPc PC端通用事件类
 * @author chixiang
 * @param  {window} exports window对象
 * @param  {AIS} AIS     AIS对象
 */
;(function(exports,AIS){
    var eventUtilPc = function(){
    	return {
			/**
	         * @description 事件绑定
	         * @param  {object} element 绑定事件的dom对象
	         * @param  {string} type 绑定的事件名称，不用加on
	         * @param {function} handle 绑定的事件函数     	         
	         */
		    addHandle: function(element, type, handle) {
		        //dom2级的事件添加
		        if (element.addEventListener) {
		            element.addEventListener(type, handle, false);
		        } else {
		            //IE 的事件添加
		            if (element.attachEvent) {
		                element.attachEvent('on' + type, handle);
		            } else {
		                //给元素特性赋值
		                element['on' + type] = handle;
		            }
		        }

		    },
    		/**
	         * @description 移除事件绑定
	         * @param  {object} element 移除事件的dom对象
	         * @param  {string} type 移除的事件名称，不用加on
	         * @param {function} handle 移除的事件函数     	         
	         */
		    removeHandle: function(element, type, handle) {
		        //dom2级的事件移除
		        if (element.removeEventListener) {
		            element.removeEventListener(type, handle, false);
		        } else {
		            //IE的事件移除
		            if (element.detachEvent) {
		                element.detachEvent('on' + type, handle);
		            } else {
		                //给元素特性赋值为空对象以移除事件
		                element['on' + type] = null;
		            }
		        }
		    },
		    /**
	         * @description 获得event对象
	         * @param  {object} event 事件event对象
	         * @return {object} 返回事件event对象         
	         */
		    getEvent: function(event) {
		    	//IE中以参数event对象传入 Dom中通过window.event来访问
		        return event ? event: window.event;
		    },
		    /**
	         * @description 获得事件的目标
	         * @param  {object} event 事件event对象
	         * @return {object} 返回获得事件的目标对象         
	         */
		    getTarget: function(event) {
		    	// dom中通过event.target获得 IE中通过event.srcElement
		        return event.target || event.srcElement;
		    },
		    /**
	         * @description 取消事件的默认行为
	         * @param  {object} event 事件event对象
	         */
		    preventDefault: function(event) {
		        if (event.preventDefault) {
		            //Dom 方法
		            event.preventDefault();
		        } else {
		            //设置IE event.returnValue = false
		            event.returnValue = false;
		        }
		    },
		    /**
	         * @description 停止事件冒泡
	         * @param  {object} event 事件event对象
	         */
		    stopPropagation: function(event) {
		        //Dom 方法
		        if (event.stopPropagation) {
		            event.stopPropagation();
		        } else {
		            event.cancelBubble = true;
		        }
		    },
		    /**
	         * @description 获得相关目标对象,relatedTarget只对mouseover和mouseout事件才包含值 否则 这个值为null
	         * @param  {object} event 事件event对象
	         */
		    getRelatedTarget: function(event) {
		        //Dom 方法 relatedTarget只对mouseover和mouseout事件才包含值 否则 这个值为null
		        if (event.relatedTarget) {
		            return event.relatedTarget;
		        } else {
		            //IE
		            if (event.toElement) {
		                return event.toElement;
		            } else {
		                if (event.fromElement) {
		                    return event.fromElement;
		                } else {
		                    return null;
		                }
		            }
		        }
		    },
		    /**
	         * @description 获得鼠标按键 
	         * @param  {object} event 事件event对象
	         * @return {number} 0表示左键 1表示中间轮 2表示右键
	         */
		    getButton: function(event) {
		        //是否支持Dom鼠标事件
		        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
		            return event.button;
		        } else {
		            switch (event.button) {
		            case 0:
		            case 1:
		            case 3:
		            case 5:
		            case 7:
		                return 0;
		            case 2:
		            case 6:
		                return 2;
		            case 4:
		                return 1;
		            }
		        }
		    },
		    /**
	         * @description 获得字符编码
	         * @param  {object} event 事件event对象
	         * @return {number} 0表示左键 1表示中间轮 2表示右键
	         */
		    getCharCode: function(event) {
		        if (typeof event.charCode == 'number') {
		            return event.charCode;
		        } else {
		            return event.keyCode;
		        }
		    }
		};
    }
    AIS.eventUtilPc  = new eventUtilPc;
    exports.AIS = AIS;
})(window,window.AIS||{});