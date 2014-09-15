/**
 * @namespace AIS.animation 动画类
 * @author chixiang
 * @param  {window} exports window对象
 * @param  {AIS} AIS     AIS对象
 * @example AIS.animation.move(dom,{x:500,y:500},100)
 * @example AIS.animation.resize(dom,{x:50,y:50},100)
 * @example AIS.animation.fade(dom,50,100)
 */
;(function(exports,AIS){
    var animation = function(){
    	 return {
            timer: 10,
            SetOpacity: function(obj, n) {
                if (document.all) {
                    obj.filters.alpha.opacity = n;
                }
                else {
                    obj.style.opacity = n / 100;
                }
            },
            /**
             * @description 渐隐渐显
             * @param  {object} obj dom对象
             * @param  {number} target 滤镜目标值0-100
             * @param {number} count 改变的步长，值越大改变越快                  
             * @param {function} Func 调用tween对象，默认匀速改变                  
             */
            fade: function(obj, target, count, Func) {
               
                var currentCount = 0;
                count = Math.abs(count) || 1;
                target = target < 0 ? 0 : (target > 100) ? 100 : target;
                var init = document.all ? obj.filters.alpha.opacity : window.getComputedStyle(obj, null).opacity * 100;
                Func = Func || Tween.Linear;
                var opr = this;
                var flag = setInterval(function() {
                    if (currentCount > count) {
                        clearInterval(flag);
                    }
                    else {
                        currentCount++;
                        var tmp = Func(init, target, currentCount, count);
                        opr.SetOpacity(obj, tmp);
                        //清除小数点的误差
                        if (Math.abs(tmp - target) < 1) {
                            opr.SetOpacity(obj, target);
                        }
                    }
                }
                , this.timer);
            },
            /**
             * @description 改变宽高
             * @param  {object} obj dom对象
             * @param  {object} targetPos 改变量目标值(x为宽，y为高)
             * @param {number} count 改变的步长，值越大改变越快                  
             * @param {function} Func 调用tween对象，默认匀速改变                  
             */
            resize: function(obj, targetPos, count, Func) {
                var currentCount = 0;
                count = Math.abs(count) || 1;
                var initPos = { x: obj.offsetWidth, y: obj.offsetHeight }
                Func = Func || Tween.Linear;
                targetPos = { x: targetPos.x < 0 ? 0 : targetPos.x, y: targetPos.y < 0 ? 0 : targetPos.y }
                var flag = setInterval(function() {
                    if (currentCount > count) {
                        clearInterval(flag);
                    }
                    else {
                        currentCount++;
                        var tmpX = Func(initPos.x, targetPos.x, currentCount, count);
                        var tmpY = Func(initPos.y, targetPos.y, currentCount, count);
                        //width值不能小于0，但是算法返回值有可能出现负值
                        try {
                            obj.style.width = tmpX + "px";
                            obj.style.height = tmpY + "px";
                        }
                        catch (e) {
                        }
                        //清除小数点的误差
                        if (Math.abs(tmpX - targetPos.x) < 1) {
                            obj.style.width = targetPos.x + "px";
                        }
                        if (Math.abs(tmpY - targetPos.y) < 1) {
                            obj.style.height = targetPos.y + "px";
                        }
                    }
                }
                , this.timer);
            },
            /**
             * @description 位置改变
             * @param  {object} obj dom对象
             * @param  {object} targetPos 改变量目标值(x为left,y为top)
             * @param {number} count 改变的步长，值越大改变越快                  
             * @param {function} Func 调用tween对象，默认匀速改变                  
             */
            move: function(obj, targetPos, count, Func) {
                var currentCount = 0;
                count = Math.abs(count) || 1;
                var elPos = this.getElementPos(obj);
                var initPos = { x: elPos.x, y: elPos.y }
                Func = Func || Tween.Linear;
                var flag = setInterval(function() {
                    if (currentCount > count) {
                        clearInterval(flag);
                    }
                    else {
                        currentCount++;
                        var tmpX = Func(initPos.x, targetPos.x, currentCount, count);
                        var tmpY = Func(initPos.y, targetPos.y, currentCount, count);
                        obj.style.left = tmpX + "px";
                        obj.style.top = tmpY + "px";
                        //清除小数点的误差
                        if (Math.abs(tmpX - targetPos.x) < 1) {
                            obj.style.left = targetPos.x + "px";
                        }
                        if (Math.abs(tmpY - targetPos.y) < 1) {
                            obj.style.top = targetPos.y + "px";
                        }
                    }
                }
                , this.timer);
            },
            getElementPos: function(el) {
                var _x = 0, _y = 0;
                do {
                    _x += el.offsetLeft;
                    _y += el.offsetTop;
                } while (el = el.offsetParent);
                return { x: _x, y: _y };
            }
        };
    };
    AIS.animation  = new animation;
    exports.AIS = AIS;
})(window,window.AIS||{});