// --------------------------------------------------------------------------------------------------------------------
//
// data2xml.js - A data to XML converter with a nice interface (for NodeJS).
//
// Copyright (c) 2011 Andrew Chilton - http://chilts.org/
// Written by Andrew Chilton <andychilton@gmail.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var valid = {
    'omit'   : true, // no element is output       : ''
    'empty'  : true, // an empty element is output : '<element></element>'
    'closed' : true  // a closed element is output : '<element/>'
};

var defaults = {
    'attrProp'  : '_attr',
    'valProp'   : '_value',
    'undefined' : 'omit',
    'null'      : 'omit',
    'xmlDecl'   : true,
    'cdataProp' : '_cdata'
};

var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n';

module.exports = function(opts) {
    opts = opts || {};

    opts.attrProp = opts.attrProp || defaults.attrProp;
    opts.valProp  = opts.valProp  || defaults.valProp;
    opts.cdataProp = opts.cdataProp || defaults.cdataProp;
    opts.xmlHeader = opts.xmlHeader || xmlHeader;

    if (typeof opts.xmlDecl === 'undefined') {
        opts.xmlDecl = defaults.xmlDecl;
    }

    if ( opts['undefined'] && valid[opts['undefined']] ) {
        // nothing, this is fine
    }
    else {
        opts['undefined'] = defaults['undefined'];
    }
    if ( opts['null'] && valid[opts['null']] ) {
        // nothing, this is fine
    }
    else {
        opts['null'] = defaults['null'];
    }

    return function(name, data) {
        var xml = opts.xmlDecl ? opts.xmlHeader : '';
        xml += makeElement(name, data, opts);
        return xml;
    };
};

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

function makeElementAttrs(attr) {
    var attributes = '';
    for(var a in attr) {
        attributes += ' ' + a + '="' + entitify(attr[a]) + '"';
    }
    return attributes;
}

function makeStartTag(name, attr) {
    attr = attr || {};
    var tag = '<' + name;
    tag += makeElementAttrs(attr);
    tag += '>';
    return tag;
}

function makeClosedElement(name, attr) {
    attr = attr || {};
    var tag = '<' + name;
    tag += makeElementAttrs(attr);
    tag += '/>';
    return tag;
}

function undefinedElement(name, attr, opts) {
    if ( opts['undefined'] === 'omit' ) {
        return '';
    }
    if ( opts['undefined'] === 'empty' ) {
        return makeStartTag(name, attr) + makeEndTag(name);
    }
    else if ( opts['undefined'] === 'closed' ) {
        return makeClosedElement(name, attr);
    }

}

function nullElement(name, attr, opts) {
    if ( opts['null'] === 'omit' ) {
        return '';
    }
    if ( opts['null'] === 'empty' ) {
        return makeStartTag(name, attr) + makeEndTag(name);
    }
    else if ( opts['null'] === 'closed' ) {
        return makeClosedElement(name, attr);
    }
}

function makeEndTag(name) {
    return '</' + name + '>';
}

function makeElement(name, data, opts) {
    var cdataRegExp = /]]\>/g;

    var element = '';
    if ( Array.isArray(data) ) {
        data.forEach(function(v) {
            element += makeElement(name, v, opts);
        });
        return element;
    }
    else if ( typeof data === 'undefined' ) {
        return undefinedElement(name, null, opts);
    }
    else if ( data === null ) {
        return nullElement(name, null, opts);
    }
    else if ( typeof data === 'object' ) {
        var valElement;
        if (data.hasOwnProperty(opts.valProp)) {
            valElement = data[opts.valProp];

            if (typeof valElement === 'undefined') {
                return undefinedElement(name, data[opts.attrProp], opts);
            }

            if (valElement === null) {
                return nullElement(name, data[opts.attrProp], opts);
            }
        }
        element += makeStartTag(name, data[opts.attrProp]);

        if (valElement) {
            element += entitify(valElement);
        }
        else if ( data[opts.cdataProp] ) {
            element += '<![CDATA[' + data[opts.cdataProp].replace(cdataRegExp, ']]]]><![CDATA[>') + ']]>';
        }

        for (var el in data) {
            if ( el === opts.attrProp || el === opts.valProp || el === opts.cdataProp) {
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
    throw 'Unknown data ' + data;
}

// --------------------------------------------------------------------------------------------------------------------

module.exports.makeStartTag = makeStartTag;
module.exports.makeEndTag   = makeEndTag;
module.exports.makeElement  = makeElement;
module.exports.entitify     = entitify;

// --------------------------------------------------------------------------------------------------------------------

