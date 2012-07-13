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

var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n';

var data2xml = function(name, data) {
    var xml = xmlHeader;
    xml += data2xml.makeElement(name, data);
    return xml;
};

data2xml.conf = {
  // name of json property that stores XML attributes
  attrProp: '_attr',
  // name of json property that stores XML element text value
  valProp: '_value'
}

data2xml.entitify = function(str) {
    str = '' + str;
    str = str
        .replace(/&/g, '&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
    return str;
}

data2xml.makeStartTag = function(name, attr) {
    attr = attr || {};
    var tag = '<' + name;
    for(var a in attr) {
        tag += ' ' + a + '="' + data2xml.entitify(attr[a]) + '"';
    }
    tag += '>';
    return tag;
}

data2xml.makeEndTag = function(name) {
    return '</' + name + '>';
}

data2xml.makeElement = function(name, data) {
    var element = '';
    if ( Array.isArray(data) ) {
        data.forEach(function(v) {
            element += data2xml.makeElement(name, v);
        });
        return element;
    }
    else if ( typeof data === 'object' ) {
        element += data2xml.makeStartTag(name, data[data2xml.conf.attrProp]);
        if ( data[data2xml.conf.valProp] ) {
            element += data2xml.entitify(data[data2xml.conf.valProp]);
        }
        else {
            for (var el in data) {
                if ( el === data2xml.conf.attrProp ) {
                    continue;
                }
                element += data2xml.makeElement(el, data[el]);
            }
        }
        element += data2xml.makeEndTag(name);
        return element;
    }
    else {
        // a piece of data on it's own can't have attributes
        return data2xml.makeStartTag(name) + data2xml.entitify(data) + data2xml.makeEndTag(name);
    }
    throw "Unknown data " + data;
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = data2xml;

// --------------------------------------------------------------------------------------------------------------------
