// --------------------------------------------------------------------------------------------------------------------
//
// xml-generation.js - tests for node-data2xml
//
// Copyright (c) 2011 Andrew Chilton - http://chilts.org/
// Written by Andrew Chilton <andychilton@gmail.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var tap = require('tap'),
    test = tap.test,
    plan = tap.plan;
var data2xml = require('../data2xml')();

var declaration = '<?xml version="1.0" encoding="utf-8"?>\n';

// --------------------------------------------------------------------------------------------------------------------

var tests = [
    {
        name : 'document natured XML',
        element : 'name',
        data : {
            text: [
                {
                    _attr: {
                        'xml:lang': 'de-DE'
                    },
                    _value: 'The german name'
                },
            ],
            _value: 'My app name',
        },
        exp : declaration + '<name>My app name<text xml:lang="de-DE">The german name</text></name>'
    },
];

test('some simple xml', function (t) {
    tests.forEach(function(test) {
        var xml = data2xml(test.element, test.data);
        t.equal(xml, test.exp, test.name);
    });

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
