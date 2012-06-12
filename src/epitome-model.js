;(function(exports) {

    var Epitome = exports.Epitome = exports.Epitome || {};

    Epitome.Model = new Class({

        // mixins.
        Implements: [Options, Events],

        _attributes: {},

        // initial `private` object
        options: {
            defaults: {}
        },

        initialize: function(obj, options) {
            // constructor function for Model class instances.

            // initial obj should pass on a setter (this will fail for now).
            obj && typeOf(obj) === 'object' && this.set(Object.merge(this.options.defaults, obj));

            // merge options overload, will now add the events.
            this.setOptions(options);
        },

        set: function() {

        },

        get: function() {

        },

        toJSON: function() {

        }
    });
}(this));