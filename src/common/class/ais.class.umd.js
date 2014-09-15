(function(root,factory){
	if(typeof define === 'function'&&define.amd){
		define(factory);
	}else if(typeof exports === 'object'){
		module.exports = factory;
	}else{
		root.ais = factory();
	}
})(this,function(){
	var ais = {};

	var hasClass,addClass,removeClass,toggleClass;

	var forEach = function(items,fn){
		if(Object.prototype.toString.call(items)!=='[object Array]'){
			items = items.split(' ');
		}
		for (var i = 0; i <items.length; i++) {
			fn(items[i]);
		}
	}

	if('classList' in document.documentElement){
		hasClass = function(elem,className){
			return elem.classList.contains(className);
		}

		addClass = function(elem,className){
			return elem.classList.add(className);
		}

		removeClass = function(elem,className){
			return elem.classList.remove(className);
		}

		toggleClass = function(elem,className){
			return elem.classList.toggle(className);
		}
	}else{
		hasClass = function(elem,className){
			return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
		}

		addClass = function(elem,className){
			if (!hasClass(elem, className)) {
                elem.className += (elem.className ? ' ' : '') + className;
            }
		}

		removeClass = function(elem,className){
			if (hasClass(elem, className)) {
                elem.className = elem.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
            }
		}

		toggleClass = function(elem,className){
			(hasClass(elem, className) ? removeClass : addClass)(elem, className);
		}
	}

	ais.hasClass = function(elem,className){
		return hasClass(elem,className);
	};

	ais.addClass = function(elem,classNames){
		forEach(classNames,function(className){
			addClass(elem,className);
		});
	};

	ais.removeClass = function(elem,classNames){
		forEach(classNames,function(className){
			removeClass(elem,className);
		});
	};

	ais.toggleClass = function(elem,classNames){
		forEach(classNames,function(className){
			toggleClass(elem,className)
		});
	};

	return ais;
});