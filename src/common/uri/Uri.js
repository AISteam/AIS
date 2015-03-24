(function(window, undefined){
    var URI = {};
    URI.query = function(search){
        var s = search || location.search,
            reg = /([?&])?([^=]+?)(?=(=|&|$))(([^&$]*))?/g,
            r = {},
            match = null,
            total = 0;
        var _remove = function(key) {
            // r[key] = undefined;
            delete r[key];
            total--;
        };
        while(match = reg.exec(s)){
            var val = decodeURIComponent(match[4]).replace(/^=/, "");
            if (match[2].indexOf('[]') !== -1) {
                var k = match[2].replace('[]', '');
                if (typeof r[k] === 'undefined') {
                    r[k] = [val];
                    total++;
                } else {
                    r[k].push(val);
                }
            } else {
                r[match[2]] = val;
                total++;
            }
        }
        return {
            get: function(key) {
                return r[key];
            },
            keys: function() {
                var keys = [];
                if ('keys' in Object) {
                    keys = Object.keys(r);
                } else {
                    for (var key in r) {
                        keys.push(key);
                    }
                }
                return keys;
            },
            remove: _remove,
            count: function() {
                return total;
            }
        };
    };
    window.Uri = window.Uri || URI;
})(window);