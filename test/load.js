// --------------------------------------------------------------------------------------------------------------------
//
// load.js - tests for node-data2xml
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
var data2xml;

// --------------------------------------------------------------------------------------------------------------------

test('load data2xml', function (t) {
    data2xml = require('../data2xml');
    t.ok(data2xml, 'package loaded');

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
