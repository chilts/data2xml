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

var test = require('tape');
var data2xml = require('../data2xml');

// --------------------------------------------------------------------------------------------------------------------

var tests = [
    {
        name : 'document natured XML',
		declaration : '<?xml version="1.0" encoding="utf-8"?>\n',
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
        exp : '<?xml version="1.0" encoding="utf-8"?>\n<name>My app name<text xml:lang="de-DE">The german name</text></name>'
    },
	{
        name : 'XML declared standalone',
		declaration : '<?xml version="1.0" standalone="yes" ?>\n',
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
        exp : '<?xml version="1.0" standalone="yes" ?>\n<name>My app name<text xml:lang="de-DE">The german name</text></name>'
    },
];

test('some simple xml', function (t) {
    tests.forEach(function(test) {
		var convert = data2xml({xmlHeader: test.declaration});
        var xml = convert(test.element, test.data);
        t.equal(xml, test.exp, test.name);
    });

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
