/**
 * @description AIS通用定时器
 * @param {number} duration 定时器结束时间
 * @example
 * 例子1：
 * 启动定时器,轮询方式，如果为一次任务，在action方法中return false即可
 * Poll.start({
	    name: "update_users",
	    interval: 1500,
	    action: function(){
	        alert("Updated!");
	    }
	});
	根据名称暂停这个任务
	Poll.stop("update_users");
	例子2:
	Poll.start({
	    name: "check_print_job",
	    action: function(){
	        //do some code here
	    },
	    start: 5000, // 开始于5秒以后
	    interval: 500, // 每500毫秒执行一次action方法
	    increment: 200, // 每次轮训以后增加200ms
	    attempts: 5, //执行5次以后停止,执行fallback方法
	    fallback: function(){
	        alert("Fallback");
	    }
	});
 */
var Poll = {
    "version": "0.3",
    "start": function(config){
        action = config.action;
        config.internal_action = config.action;
        config.action = function(){
            Poll.util.attempts(config.name, config.internal_action);
        };
        if(config.start){
            if(config.interval){
                if(config.increment){
                    Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(function(){
                        Poll.util.timeout(config.name, config.action, config.interval);
                    }, config.start)};
                } else {
                    Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(function(){
                        config.action();
                        Poll.timers[config.name]["value"] = setInterval(config.action, config.interval);
                        Poll.timers[config.name]["type"] = "interval";
                    }, config.start)};
                }
            } else {
                Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(config.action, config.start)};	
            }				
        } else if(config.interval){
            if(config.increment){
                Poll.timers[config.name] = {"type": "interval", "config": config, "attempts": 0, "value": setTimeout(function(){
                    Poll.util.timeout(config.name, config.action, (config.interval + config.increment));
                }, config.interval)};
            } else {
                Poll.timers[config.name] = {"type": "interval", "config": config, "attempts": 0, "value": setInterval(config.action, config.interval)};
            }
        } else {
            throw "PollJS: You need to define a start, an interval, or both.";
        }
    },
    "util": {
        "attempts": function(name, fn){
            var ret, instance = Poll.timers[name];
            Poll.timers[name].attempts += 1;
            ret = fn();

            if(ret === false){
                Poll.stop(name);
            }

            if(instance.config.attempts){
                if(instance.attempts == instance.config.attempts){
                    Poll.stop(name);
                    instance.config.fallback();				
                }
            }
        },
        "timeout": function(name, fn, start){
            var time, config = Poll.timers[name].config;
            time = (start + (config.increment || 0));
            Poll.timers[name].value = setTimeout(function(){
                Poll.util.timeout(config.name, fn, time);
            }, time);
            Poll.timers[name].type = "timeout";
            fn();
        }
    },
    "stop": function(name){
        var instance = Poll.timers[name];
        if(instance.type == "interval"){
            clearInterval(instance.value);
        } else {
            clearTimeout(instance.value);
        }
    },
    "timers":{}
};