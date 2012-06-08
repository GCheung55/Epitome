require.config({
    paths: {
        'mootools': 'lib/mootools-core',
        'epitome': '../src/epitome',
        'epitome-model': '../src/epitome-model',
        'epitome-model-sync': '../src/epitome-model-sync'
    },
    shim: {
        'mootools': {
            exports: 'MooTools'
        }
    }
});

require(['mootools', 'epitome-model'], function() {
    console.log(arguments);
});
