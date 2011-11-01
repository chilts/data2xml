


    var data = {
        _attr : {
            xmlns : 'https://route53.amazonaws.com/doc/2011-05-05/',
        },
        ChangeBatch : {
            Comment : 'This is a comment',
            Changes : {
                Change : [
                    {
                        Action : 'CREATE',
                        ResourceRecordSet : {
                            Name : 'www.example.com',
                            Type : 'A',
                            TTL : 300,
                            ResourceRecords : {
                                ResourceRecord : [
                                    {
                                        Value : '192.0.2.1'
                                    }
                                ]
                            }
                        },
                ],
            },
        },
    };

    var xml = data2xml('ChangeResourceRecordSetsRequest', data);

Examples
--------

    var data2xml = require('data2xml')';

    data2xml('TopLevelElement', {
        _attr : { xmlns : 'http://appsattic.com/xml/namespace' }
        SimpleElement : 'A simple element',
        ComplexElement : {
            
        }
    });

    => 


Why data2xml
------------

Just looking at the XML modules out there I found that the data structure I had to create to get some XML out of the
other end was just horrible.




What data2xml does
------------------

data2xml converts data structures into XML. It's that simple.




What data2xml doesn't do
------------------------

Data2Xml is designed to be an easy way to get from a data structure to XML. Various other JavaScript to XML modules try
and do everything which means that the interface is pretty dire. If you just want an easy way to get XML using a sane
data structure, then this module is for you.

To decide this, you need to know what this module doesn't do. It doesn't deal with:

* mixed type elements (such as <markup>Hello <strongly>World</strongly></markup>)
* pretty formatting - after all, you're probably sending this XML to another machine
* CDATA elements ... though I probably _should_ add this (somehow)
* data objects which are (or have) functions
* ordered elements - if you pass me an object, it's members will be output in an order defined by 'for m in object'
* comments
* processing instructions
* entity references
* all the other stuff you don't care about when dealing with data

(Ends)
