data2xml is a data to XML converter with a nice interface (for NodeJS).

[![Build Status](https://secure.travis-ci.org/chilts/data2xml.png?branch=master)](http://travis-ci.org/chilts/data2xml)

[![NPM](https://nodei.co/npm/data2xml.png?downloads=true)](https://nodei.co/npm/data2xml/)

Installation
------------

The easiest way to get it is via npm:

    npm install --save data2xml

Info and Links:

* npm info data2xml
* https://npmjs.org/package/data2xml
* https://github.com/chilts/data2xml/

Stable
------

This package hasn't been significantly changed for a while. It is considered stable (it is not stagnant). Please use
with all your might and enjoy it.

Note: this package doesn't depend on any others (except testing in development). This is on purpose so that it doesn't
have it's foundation move under it's feet.

Synopsis
--------

```
var data2xml = require('data2xml');

var convert = data2xml();

var xml1 = convert('Message', 'Hello, World!');
console.log(xml1);
// ->
// <?xml version="1.0" encoding="utf-8"?>
// <Message>Hello, World!</Message>

var xml2 = convert('Message', {
  Text: 'Hello, World!'
});
console.log(xml2);
// ->
// <?xml version="1.0" encoding="utf-8"?>
// <Message><Text>Hello, World!</Text></Message>
```

Examples
--------

When loading up data2xml, you can't use it immediately. Firstly you need to call the data2xml() function which will
return a function you can use. The reason for this is so that you can encapsulate any configuration options into one
call and not have to pass that in every time.

e.g.

```
var data2xml = require('data2xml');
var convert  = data2xml(); // or data2xml({})
```

Note: in each example, I am leaving out the XML declaration (controlled by the `xmlDecl` option). I
am also pretty printing the output - the package doesn't do this for you!

```js
var convert = require('data2xml')({ xmlDecl : false });

convert(
    'TopLevelElement',
    {
        _attr : { xmlns : 'http://chilts.org/xml/namespace' }
        SimpleElement : 'A simple element',
        ComplexElement : {
            A : 'Value A',
            B : 'Value B',
        },
    }
);
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <SimpleElement>A simple element</SimpleElement>
    <ComplexElement>
        <A>Value A</A>
        <B>Value B</B>
    </ComplexElement>
</TopLevelLement>
```

If you want an element containing data you can do it one of two ways. A simple piece of data will work, but if you want
attributes you need to specify the value in the element object. You can also specify a CDATA element too.

```js
convert(
    'TopLevelElement',
    {
        _attr : { xmlns : 'http://chilts.org/xml/namespace' }
        SimpleData : 'Simple Value',
        ComplexData : {
            _attr : { type : 'colour' },
            _value : 'White',
        },
        CData : {
            _cdata : 'This is<bold>bold</bold>.',
        },
    }
);
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <SimpleData>Simple Value</SimpleData>
    <ComplexData type="color">White</ComplexData>
    <CData><![CDATA[This is<bold>bold</bold>.]]></CData>
</TopLevelLement>
```

You can also specify which properties your attributes and values are in (using the same example as above):

```js
var convert = require('data2xml')({ attrProp : '@', valProp  : '#', cdataProp : '%' });
convert(
    'TopLevelElement',
    {
        _attr : { xmlns : 'http://chilts.org/xml/namespace' }
        SimpleData : 'Simple Value',
        ComplexData : {
            '@' : { type : 'colour' },
            '#' : 'White',
        },
        CData : {
            '%' : 'This is <bold>bold</bold>.',
        },
    });
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <SimpleData>Simple Value</SimpleData>
    <ComplexData type="color">White</ComplexData>
    <CData><![CDATA[This is<bold>bold</bold>.]]></CData>
</TopLevelLement>
```

You can also specify what you want to do with undefined or null values. Choose between 'omit' (the default), 'empty' or
'closed'.

```js
var convert = require('data2xml')({ 'undefined' : 'empty', 'null'  : 'closed', });
convert(
    'TopLevelElement',
    {
        SimpleData : 'Simple Value',
        ComplexData : {
            '_attr' : { type : 'colour' },
            '_value' : 'White',
        },
        Undefined : undefined,
        Null      : null,
    });
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <SimpleData>Simple Value</SimpleData>
    <ComplexData type="color">White</ComplexData>
    <Undefined></Undefined>
    <Null/>
</TopLevelLement>
```

If you want an array, just put one in there:

```js
convert('TopLevelElement', {
    MyArray : [
        'Simple Value',
        {
            _attr : { type : 'colour' },
            _value : 'White',
        }
    ],
});
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <MyArray>Simple Value</MyArray>
    <MyArray type="color">White</MyArray>
</TopLevelLement>
```

You can also enclose values in CDATA, by using `_cdata` in place of `_value`:

```js
convert(
    'TopLevelElement',
    {
        SimpleData : 'Simple Value',
        ComplexData : {
            _attr : { type : 'colour' },
            _cdata : '<em>White</em>',
        }
    }
);
```

Will produce:

```xml
<TopLevelLement xmlns="http://chilts.org/xml/namespace">
    <SimpleData>Simple Value</SimpleData>
    <ComplexData type="color"><![CDATA[<em>White</em>]]></ComplexData>
</TopLevelLement>
```

You can change the doctype declaration at initialization:

```
var data2xml = require('data2xml');
var convert = data2xml({xmlheader: '<?xml version="1.0" standalone="yes" ?>\n'});

convert(…);
```


Why data2xml
------------

Looking at the XML modules out there I found that the data structure I had to create to get some XML out of the other
end was not very nice, nor very easy to create. This module is designed so that you can take any plain old data
structure in one end and get an XML representation out of the other.

In some cases you need to do something a little special (rather than a lot special) but these are for slightly more
tricky XML representations.

Also, I wanted a really simple way to convert data structures in NodeJS into an XML representation for the Amazon Web
Services within node-awssum. This seemed to be the nicest way to do it (after trying the other js to xml modules).

What data2xml does
------------------

data2xml converts data structures into XML. It's that simple. No need to worry!

What data2xml doesn't do
------------------------

Data2Xml is designed to be an easy way to get from a data structure to XML. Various other JavaScript to XML modules try
and do everything which means that the interface is pretty dire. If you just want an easy way to get XML using a sane
data structure, then this module is for you.

To decide this, you need to know what this module doesn't do. It doesn't deal with:

* mixed type elements (such as `<markup>Hello <strongly>World</strongly></markup>`)
* pretty formatting - after all, you're probably sending this XML to another machine
* data objects which are (or have) functions
* ordered elements - if you pass me an object, it's members will be output in an order defined by 'for m in object'
* comments
* processing instructions
* entity references
* all the other stuff you don't care about when dealing with data

## AUTHOR ##

Written by [Andrew Chilton](http://chilts.org/):

* [Blog](http://chilts.org/)
* [GitHub](https://github.com/chilts)
* [Twitter](https://twitter.com/andychilton)
* [Instagram](http://instagram.com/thechilts)

# License #

MIT - http://chilts.mit-license.org/2012/

(Ends)
