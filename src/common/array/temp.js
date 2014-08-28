
//List高级应用
//用于类的设计使用
/* 
    Base.js, version 1.1a 
    Copyright 2006-2010, Dean Edwards 
    License: http://www.opensource.org/licenses/mit-license.php 
*/  
  
var Base = function() {  
    // dummy  
};  
  
Base.extend = function(_instance, _static) { // subclass  
    var extend = Base.prototype.extend;  
      
    // build the prototype  
    Base._prototyping = true;  
    var proto = new this;  
    extend.call(proto, _instance);  
  proto.base = function() {  
    // call this method from any other method to invoke that method's ancestor  
  };  
    delete Base._prototyping;  
      
    // create the wrapper for the constructor function  
    //var constructor = proto.constructor.valueOf(); //-dean  
    var constructor = proto.constructor;  
    var klass = proto.constructor = function() {  
        if (!Base._prototyping) {  
            if (this._constructing || this.constructor == klass) { // instantiation  
                this._constructing = true;  
                constructor.apply(this, arguments);  
                delete this._constructing;  
            } else if (arguments[0] != null) { // casting  
                return (arguments[0].extend || extend).call(arguments[0], proto);  
            }  
        }  
    };  
      
    // build the class interface  
    klass.ancestor = this;  
    klass.extend = this.extend;  
    klass.forEach = this.forEach;  
    klass.implement = this.implement;  
    klass.prototype = proto;  
    klass.toString = this.toString;  
    klass.valueOf = function(type) {  
        //return (type == "object") ? klass : constructor; //-dean  
        return (type == "object") ? klass : constructor.valueOf();  
    };  
    extend.call(klass, _static);  
    // class initialisation  
    if (typeof klass.init == "function") klass.init();  
    return klass;  
};
  
Base.prototype = {    
    extend: function(source, value) {  
        if (arguments.length > 1) { // extending with a name/value pair  
            var ancestor = this[source];  
            if (ancestor && (typeof value == "function") && // overriding a method?  
                // the valueOf() comparison is to avoid circular references  
                (!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&  
                /\bbase\b/.test(value)) {  
                // get the underlying method  
                var method = value.valueOf();  
                // override  
                value = function() {  
                    var previous = this.base || Base.prototype.base;  
                    this.base = ancestor;  
                    var returnValue = method.apply(this, arguments);  
                    this.base = previous;  
                    return returnValue;  
                };  
                // point to the underlying method  
                value.valueOf = function(type) {  
                    return (type == "object") ? value : method;  
                };  
                value.toString = Base.toString;  
            }  
            this[source] = value;  
        } else if (source) { // extending with an object literal  
            var extend = Base.prototype.extend;  
            // if this object has a customised extend method then use it  
            if (!Base._prototyping && typeof this != "function") {  
                extend = this.extend || extend;  
            }  
            var proto = {toSource: null};  
            // do the "toString" and other methods manually  
            var hidden = ["constructor", "toString", "valueOf"];  
            // if we are prototyping then include the constructor  
            var i = Base._prototyping ? 0 : 1;  
            while (key = hidden[i++]) {  
                if (source[key] != proto[key]) {  
                    extend.call(this, key, source[key]);  
  
                }  
            }  
            // copy each of the source object's properties to this object  
            for (var key in source) {  
                if (!proto[key]) extend.call(this, key, source[key]);  
            }  
        }  
        return this;  
    }  
};  
  
// initialise  
Base = Base.extend({  
    constructor: function() {  
        this.extend(arguments[0]);  
    }  
}, {  
    ancestor: Object,  
    version: "1.1",  
      
    forEach: function(object, block, context) {  
        for (var key in object) {  
            if (this.prototype[key] === undefined) {  
                block.call(context, object[key], key, object);  
            }  
        }  
    },  
          
    implement: function() {  
        for (var i = 0; i < arguments.length; i++) {  
            if (typeof arguments[i] == "function") {  
                // if it's a function, call it  
                arguments[i](this.prototype);  
            } else {  
                // add the interface using the extend method  
                this.prototype.extend(arguments[i]);  
            }  
        }  
        return this;  
    },  
      
    toString: function() {  
        return String(this.valueOf());  
    }  
});


// JavaScript Document  
org.forever.util.DLNode =  Base.extend({  
    constructor : function(element, next, previous){  
         this.element = element;  
         this.next = next;  
         this.previous = previous;  
    }  
});  
  
org.forever.util.IndexOutOfBoundsException = Base.extend({  
    constructor : function(s){  
        this.message = s;  
    },  
    getMessage : function(){  
        return this.message;  
    }  
});  
  
org.forever.util.NoSuchElementException = Base.extend({  
    constructor : function(s){  
        this.message = s;  
    },  
    getMessage : function(){  
        return this.message;  
    }  
});  
  
org.forever.util.LinkedList = Base.extend({  
    constructor : function(){  
        this.size = 0;  
        this.header = new org.forever.util.DLNode(null, null, null);  
        this.header.next = this.header.previous = this.header;  
    },  
    getSize : function(){  
        return this.size;  
    },  
    add : function(e){  
        this.addBefore(e, this.header);  
        return true;  
    },  
    addFirst : function(e){  
        this.addBefore(e, this.header.next);  
    },  
    addLast : function(e){  
        this.addBefore(e, this.header);  
    },  
    addBefore:function(e, entry){  
        var newEntry = new org.forever.util.DLNode(e, entry, entry.previous);  
        newEntry.previous.next = newEntry;  
        newEntry.next.previous = newEntry;  
        this.size++;  
        return newEntry;  
    },  
    get : function(index){  
        return this.entry(index).element;  
    },  
    indexOf : function(o){  
        var index = 0;  
        if (o==null) {  
            for (var e = this.header.next; e != this.header; e = e.next) {  
                if (e.element==null)  
                    return index;  
                index++;  
            }  
        } else {  
            for (var e = this.header.next; e != this.header; e = e.next) {  
                if (o == e.element)  
                    return index;  
                index++;  
            }  
        }  
        return -1;  
    },  
    removeFirst : function(){  
        return this.remove(this.header.next);  
    },  
    removeLast : function(){  
        return remove(header.previous);  
    },  
    removeAt : function(index){  
        return this.remove(this.entry(index));  
    },  
    remove : function(e){  
        if (e == this.header)  
        throw new org.forever.util.NoSuchElementException('没有元素');  
        var result = e.element;  
        e.previous.next = e.next;  
        e.next.previous = e.previous;  
        e.next = e.previous = null;  
        e.element = null;  
        this.size--;  
        return result;  
    },  
    lastIndexOf : function(o){  
        var index = size;  
        if (o==null) {  
            for (var e = this.header.previous; e != this.header; e = e.previous) {  
                index--;  
                if (e.element==null)  
                    return index;  
            }  
        } else {  
            for (var e = this.header.previous; e != this.header; e = e.previous) {  
                index--;  
                if (o == e.element)  
                    return index;  
            }  
        }  
        return -1;  
    },  
    contains : function(o){  
        return this.indexOf(o) != -1;  
    },  
    clear : function(){  
        var e = this.header.next;  
        while (e != this.header) {  
            var next = e.next;  
            e.next = e.previous = null;  
            e.element = null;  
            e = next;  
        }  
        this.header.next = this.header.previous = this.header;  
        size = 0;  
    },  
    insert : function(index,element){  
        this.addBefore(element, (index==this.size ? this.header : this.entry(index)));  
    },  
    entry : function(index){  
        if (index < 0 || index >= this.size)  
            throw new org.forever.util.IndexOutOfBoundsException("Index: "+index+  
                                                ", Size: "+size);  
        var e = this.header;  
        if (index < (this.size >> 1)) {  
            for (var i = 0; i <= index; i++)  
                e = e.next;  
        } else {  
            for (var i = this.size; i > index; i--)  
                e = e.previous;  
        }  
        return e;  
    },  
    toArray : function(){  
        var result =[this.size];  
        var i = 0;  
        for (var e = this.header.next; e != this.header; e = e.next)  
            result[i++] = e.element;  
        return result;  
    },  
    set : function(index,e){  
        var e = this.entry(index);  
        var oldVal = e.element;  
        e.element = element;  
        return oldVal;  
    }  
});  


//demo
var list = new org.forever.util.LinkedList();  
list.add(1);  
list.add(2);  
list.add(3);  
list.add(2);  
list.add(4);  
var size = list.getSize();  
var elem = list.get(3);  
var index = list.lastIndexOf(2);  
var array = list.toArray();  