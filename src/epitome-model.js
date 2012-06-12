;(function(exports) {

    var Epitome = typeof require == 'function' ? require('epitome') : exports.Epitome;

    Epitome.Model = new Class({

        Implements: [Options, Events],

        _attributes: {},

        options: {
            defaults: {}
        },

        initialize: function(obj, options) {
            // constructor for Model class.

            // initial obj should pass on a setter (this will fail for now).
            obj && typeOf(obj) === 'object' && this.set(obj);

            // merge options overload, will now add the events.
            this.setOptions(options);
        },

        // private, real setter functions, not on prototype, see note above
        set: function(key, value) {
            // needs to be bound the the instance.
            if (!key || typeof value === undefined) return this;

            this._attributes[key] = value;

            return this;
        },

        get: function(key) {
            return (key && typeof this._attributes[key] !== undefined)
                ? this._attributes[key]
                : null;
        },

        toJSON: function() {
            return Object.clone(this._attributes);
        }
    });

    if (typeof define === 'function' && define.amd) {
        define('epitome-model', function() {
            return Epitome;
        });
    }
    else if (typeof module === 'object') {
        module.exports = Epitome;
    }
    else {
        exports.Epitome = Epitome;
    }
}(this));