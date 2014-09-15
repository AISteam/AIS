/**
 * @description 原生class增删改查模块
 * @param  {object} ais ais对象
 */
(function(ais){
	
	var hasClass,addClass,removeClass,toggleClass;

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

	ais.hasClass = hasClass;
	ais.addClass = addClass;
	ais.removeClass = removeClass;
	ais.toggleClass = toggleClass;

	window.ais = ais;

})(window.ais||{});