// chain.js -- a base-class for jquery style method chaining with callbacks
// @author: Matthew Story <matthewstory@gmail.com>
var Chain = function() {
    this.__init__.apply(this, arguments);
    this.constructor = Chain;
};
Chain.prototype = {
    // list of non-chained methods 
    ignores: [ '__init__','returnThis','ignore','spawn','despawn' ],
    __init__: function(options, ref) {
        // load up chained methods
        for (var i in this) {
            if (this[i] && this[i].constructor == Function && !this.ignore(i)) {
                this[i] = this.returnThis(this[i], i);
            }
        }
        this.ref = ref;
        this.options = options || {};
    },
    // check to see if the function is non-chained
    ignore: function(name) {
        for (var i=0;i<this.ignores.length;i++) {
            if (this.ignores[i] == name) {
                return true;
            }
        }
        return false;
    },
    // always return 'this', unless a callback returns 'that'
    returnThis: function(meth, name) {
        var scope = this;
        return function() {
            return ((scope.options || {})[
                'on'+name.substring(0,1).toUpperCase()+name.substring(1)
            ] || (function() { return false; })).apply(
                scope, [meth.apply(scope, arguments)]
            ) || scope;
        }
    },
    // spawn a new instance
    spawn: function() {
        var argstring = '';
        for (var i=0; i<arguments.length;i++) {
            argstring += 'arguments[' + i + '],';
        }
        eval("var spawned = new (this.constructor)(" + argstring + "this);");
        return spawned;
    },
    // go to previous instance, if there is one
    despawn: function() {
        return this.ref || this;
    },
};
