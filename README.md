AngularLogExtender
==================
[![Build Status](https://travis-ci.org/lwhiteley/AngularLogExtender.svg?branch=master)](https://travis-ci.org/lwhiteley/AngularLogExtender)
[![Coverage Status](https://coveralls.io/repos/ferronrsmith/AngularLogExtender/badge.png)](https://coveralls.io/r/ferronrsmith/AngularLogExtender)

[![Stories in Ready](https://badge.waffle.io/lwhiteley/AngularLogExtender.png?label=ready&title=Ready)](https://waffle.io/lwhiteley/AngularLogExtender)


This is an extension of the Angular $log functionality.
It uses the native $decorator to push the $log pass its capabilities and provide new
functionality such as configuring the $log for different environments such as
production and development.

## How to Use

Please view our [wiki](https://github.com/lwhiteley/AngularLogExtender/wiki) for detailed documentation.


### Notes

You can include the module in your AngularJS Application and it does all the work immediately.
Methods native to the log extender are not publicly available in your AngularJs
Application so this extension can be used as a standalone plugin.
Advanced configurations can be done to make the $log service fit
your personal development style. Log methods are now colour coded by default.


### Install with bower

Now offers bower support.

`bower install --save angular-logex `

Add the script to your index.html:
```javascript
<script src="/bower_components/angular-logex/dist/log-ex-unobtrusive.js"></script>
```

## Credits
To view the blog this module was extended from and inspired by, go to
http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/

## Development

If you wish to contribute, Please read the `Develop.md` file.

Feel Free to make your own contributions to this module so we can make it better :)

====================
License: MIT |   Made with :green_heart:
