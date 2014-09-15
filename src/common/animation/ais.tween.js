/**
 * @namespace AIS.tween 缓动函数
 * @author chixiang
 * @requires AIS.animation
 * @param  {window} exports window对象
 * @param  {AIS} AIS     AIS对象
 * @example AIS.animation.move(dom,{x:500,y:500},100,Tween.Quart.easeInOut)
 * @example AIS.animation.resize(dom,{x:50,y:50},100,Tween.Cubic.easeIn)
 * @example AIS.animation.fade(dom,50,100,Tween.Quart.easeInOut)
 */
;(function(exports,AIS){
    var tween = function(){
    	 return {
            Linear: function(initPos, targetPos, currentCount, count) {
                var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                return c * t / d + b;
            },
            Quad: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * (t /= d) * t + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * (t /= d) * t * t + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                }
            },
            Quart: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * (t /= d) * t * t * t + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                }
            },
            Quint: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                }
            },
            Sine: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function(initPos, targetPos, currentCount, count, a, p) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count, a, p) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                },
                easeInOut: function(initPos, targetPos, currentCount, count, a, p) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                    if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                }
            },
            Back: {
                easeIn: function(initPos, targetPos, currentCount, count, s) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count, s) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOut: function(initPos, targetPos, currentCount, count, s) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
                },
                easeOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                easeInOut: function(initPos, targetPos, currentCount, count) {
                    var b = initPos, c = targetPos - initPos, t = currentCount, d = count;
                    if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        }
    };
    AIS.tween  = new tween;
    exports.AIS = AIS;
})(window,window.AIS||{});