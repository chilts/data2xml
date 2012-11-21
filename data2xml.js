// --------------------------------------------------------------------------------------------------------------------
//
// data2xml.js - A data to XML converter with a nice interface (for NodeJS).
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var defaults = {
    attrProp : '_attr',
    valProp  : '_value',
};

var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n';

module.exports = function(opts) {
    opts = opts || {};

    opts.attrProp = opts.attrProp || defaults.attrProp;
    opts.valProp  = opts.valProp  || defaults.valProp;

    return function(name, data) {
        var xml = xmlHeader;
        xml += makeElement(name, data, opts);
        return xml;
    };
}

function entitify(str) {
    str = '' + str;
    str = str
        .replace(/&/g, '&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
    return str;
}

function makeStartTag(name, attr) {
    attr = attr || {};
    var tag = '<' + name;
    for(var a in attr) {
        tag += ' ' + a + '="' + entitify(attr[a]) + '"';
    }
    tag += '>';
    return tag;
}

function makeEndTag(name) {
    return '</' + name + '>';
}

function makeElement(name, data, opts) {
    var element = '';
    if ( Array.isArray(data) ) {
        data.forEach(function(v) {
            element += makeElement(name, v, opts);
        });
        return element;
    }
    else if ( typeof data === 'undefined' || data === null ) {
        return '';
    }
    else if ( typeof data === 'object' ) {
        element += makeStartTag(name, data[opts.attrProp]);
        if ( data[opts.valProp] ) {
            element += entitify(data[opts.valProp]);
        }
        for (var el in data) {
            if ( el === opts.attrProp || el === opts.valProp ) {
                continue;
            }
            element += makeElement(el, data[el], opts);
        }
        element += makeEndTag(name);
        return element;
    }
    else {
        // a piece of data on it's own can't have attributes
        return makeStartTag(name) + entitify(data) + makeEndTag(name);
    }
    throw "Unknown data " + data;
}

// --------------------------------------------------------------------------------------------------------------------

module.exports.makeStartTag = makeStartTag;
module.exports.makeEndTag   = makeEndTag;
module.exports.makeElement  = makeElement;
module.exports.entitify     = entitify;

// --------------------------------------------------------------------------------------------------------------------
