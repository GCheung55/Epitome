if (typeof require === 'function') {
	var Epitome = require('../../src/epitome'),
		buster = require('buster');
}

buster.testRunner.timeout = 1000;

buster.testCase('Epitome model sync >', {
	setUp: function() {
		this.dataInitial = {
			foo: 'bar',
			id: '1234-5123/response.json',
			urlRoot: 'example/data/'
		};

		this.dataAfter = {
			bar: 'foo'
		};

		this.dataMany = {
			foo: 'one',
			bar: 'two',
			charlie: 'winning'
		};

		this.options = {
			onSync: function(responseObj, method, data) {

			},
			defaults: {
				foo: 'not bar',
				name: 'dimitar'
			}
		};

		this.model = new Epitome.Model.Sync(this.dataInitial, this.options);
	},

	tearDown: function() {
		this.model.removeEvents('change');
		this.model.removeEvents('sync');
		this.model.removeEvents('update');
		this.model.removeEvents('create');

		this.model.isNewModel = true;
		// this.model._attributes = {};
	},

	'Expect the model to have a request >': function() {
		buster.assert.isTrue(instanceOf(this.model.request, Request));
	},

	'Expect the urlRoot to return correctly >': function() {
		buster.assert.equals(this.model.get('urlRoot'), this.dataInitial.urlRoot);
	},

	'Expect a fetch to return our model >': function(done) {

		this.model.addEvent('sync', function(response, method, data) {
			buster.refute.isNull(response);
			done();
		});
		this.model.fetch();
	},

	'Expect a save to `create` our model >': function(done) {
		this.model.addEvent('create', function() {
			buster.assert(true);
			done();
		});
		this.model.save();
	},

	'Expect a second save to `update` our model >': function(done) {
		var model = this.model;

		model.addEvents({
			'update': function() {
				buster.assert(true);
				done();
			},
			'create': function() {
				this.save.delay(500, this);
			}
		});

		model.save();
	},

	'Expect a fetch to return our model id as per static response.json >': function(done) {
		var id = this.model.get('id');

		this.model.addEvent('sync', function(response, method, data) {
			buster.assert.equals(response.id, id);
			done();
		});
		this.model.fetch();
	},

	'Expect a fetch update our model properties to as per static response.json and fire change events >': function(done) {
		var oldFoo = this.model.get('foo');

		this.model.addEvent('change:foo', function(newValue) {
			buster.refute.equals(newValue, oldFoo);
			done();
		});

		// a change event will occur if foo differs after fetch
		this.model.fetch();
	},

	'Expect the pre-processing parser to get the object before the model does after a sync >': function(done) {

		var protoModel = new Class({

			Extends: Epitome.Model.Sync,

			parse: function(obj) {
				buster.assert(true);
				done();
			}
		});

		var protoInstance = new protoModel(this.dataInitial, this.options);
		protoInstance.fetch();
	},

	'Expect the pre-processing parser to precede model sets/changes >': function(done) {

		var spy = this.spy(),
			protoModel = new Class({

				Extends: Epitome.Model.Sync,

				parse: function(obj) {
					delete obj.foo;
					return obj
				}
			});

		var protoInstance = new protoModel(this.dataInitial, {
			onFetch: function() {
				buster.refute.called(spy);
				done();
			}
		});

		// it should change but for the processor disallowing it. mocker sends
		protoInstance.set('foo', 'changeme');

		// add the spy which should not work.
		protoInstance.addEvent('change:foo', spy);

		// this will get an object with id and foo properties. if it works, should NOT change foo as pre-processor removes it
		protoInstance.fetch();
	}
});