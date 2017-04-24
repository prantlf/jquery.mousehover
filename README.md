# jquery.mousehover [![NPM version](https://badge.fury.io/js/jquery.mousehover.png)](http://badge.fury.io/js/jquery.mousehover) ![Bower version](https://img.shields.io/bower/v/jquery.mousehover.svg) [![Size](http://img.badgesize.io/prantlf/jquery.mousehover/master/jquery.mousehover.min.js?compression=gzip&color=blue)](https://raw2.github.com/prantlf/jquery.mousehover/master/jquery.mousehover.min.js) [![Build Status](https://travis-ci.org/prantlf/jquery.mousehover.png)](https://travis-ci.org/prantlf/jquery.mousehover) [![Dependency Status](https://david-dm.org/prantlf/jquery.mousehover.svg)](https://david-dm.org/prantlf/jquery.mousehover) [![devDependency Status](https://david-dm.org/prantlf/jquery.mousehover/dev-status.svg)](https://david-dm.org/prantlf/jquery.mousehover#info=devDependencies) [![Code Climate](https://codeclimate.com/github/prantlf/jquery.mousehover/badges/gpa.svg)](https://codeclimate.com/github/prantlf/jquery.mousehover) [![Codacy Badge](https://www.codacy.com/project/badge/f3896e8dfa5342b8add12d50390edfcd)](https://www.codacy.com/public/prantlf/jquery.mousehover)

[![NPM Downloads](https://nodei.co/npm/jquery.mousehover.png?downloads=true&stars=true)](https://www.npmjs.com/package/jquery.mousehover)

This event-subscribing jQuery plugin behaves like [`jQuery.hover`], as long
as the *real* mouse is used. If the `mouseenter` and `mouseleave` events are
emulated by other input device, `jQuery.mousehover` does not trigger the
event handlers.

* [Motivation](#motivation)
* [Synopsis](#synopsis)
  + [Parameters](#parameters)
* [Usage](#usage)
* [Example](#example)
* [Installation](#installation)
* [Build](#build)
* [Contributing](#contributing)
* [Release History](#release-history)
* [License](#license)

## Motivation

Although mobile devices do not support mouse as an input device, they trigger
mouse-specific events, when your finger touches the display. These emulated
events include `mouseenter` and `mouseleave`, which trigger event handlers
registered by `jQuery.hover`. It may not be a problem, if you follow the best
practice and do not use JavaScript hover handling at all, or perform visual
enhancements only inside the event handlers. Otherwise you will face:

* [Double-tap issue](https://css-tricks.com/annoying-mobile-double-tap-link-issue/)
  caused by having the first tap act as `hover` and the second one as `click`.
* Showing call-outs, context menus, toolbars or other interactive controls
  on touch and not being able to get rid of them easily. Not all devices fire
  `mouseleave` after `mouseenter` and end the chain of events with `click`.

If you write an interface for devices capable of using multiple input devices
like mouse, pen and touch, and you need to ensure, that part of that interface
will work only if the input device is a *real* mouse, the plain `jQuery.hover`
handler will not be enough. The `jQuery.mousehover` plugin allows you for safe
mouse event listening, without you coding the *real* mouse detection.

## Synopsis

```javascript
$(selector).mousehover(handlerIn, handlerOut, options);
$(selector).mousehover('off', options);
```

Binds one or two handlers to the selected elements, which will be executed,
when the *real* mouse pointer enters and leaves the elements. Ignores the
emulated hover effect caused by tapping on a touch display. It calls
[`jQuery.on`] for selected events needed for the reliable operation.

See the original documentation for [`jQuery.hover`] for more information.

### Parameters

| Name       | Type                    | Description                                                               |
| ---------- | ----------------------- | ------------------------------------------------------------------------- |
| handlerIn  | Function([Event] event) | A function to execute when the mouse pointer enters the selected element. |
| handlerOut | Function([Event] event) | A function to execute when the mouse pointer leaves the selected element. |
| options    | [Object]                | An object with extra parameters for the plugin or its method execution.   |

The parameter `handlerIn` has to be provided, if you are not unregistering the
event handlers by passing the methof name `off` instead of it. The parameter
`handlerOut` is optional; if not provided, the event handler `handlerIn` will
be used instead of it. The `options` parameter is optional.

Except for pasing the parameters as a list to the plugin function, you can
pass them to it as an object literal too.

```javascript
$(selector).mousehover({
  handlerIn: handlerIn,
  handlerOut: handlerOut,
  options: {
    namespace: 'menu'
  }
});
```

### Methods

#### noConflict() : jQuery.mousehover

Restores the earlier mousehover plugin, which had been registered in jQuery
before this one. This plugin is returned for explicit usage.

```javascript
var mousehover = $.fn.mousehover.noConflict();
mousehover.call($(selector), handlerIn, handlerOut, options);
```

#### off : jQuery

Unsubscribes event handlers registered by the previous call to `mousehover`.
It calls [`jQuery.off`] for the events used during the registration time.

```javascript
$(selector).mousehover('off', options);
```

### Options

#### namespace : string

Registers event handlers for `mousehover` using the specified namespace. If
other code registers `mouseenter`, `mouseleave`, `touchend`, `pointerenter`
and `pointerleave` events, namespacing allows for selective unregistration
of the particular event handlers. If you want to make sure, that you do not
affect other plugins, you should use a unique namespace for `mousehover`.
No namespace is used by default.

```javascript
$(selector).mousehover(handlerIn, handlerOut, {namespace: 'menu'});
$(selector).mousehover('off', {namespace: 'menu'});
```

## Usage

You have to ensure, that `jQuery` is included earlier, than
`jquery.mousehover.js`. The slim version of jQuery is enough.

```html
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
<script src="jquery.mousehover.js"></script>
```

If you use [RequireJS] or other [AMD] module loader, you have to ensure, that
the `jquery` module is mapped correctly. The `jquery.mousehover` module will
load the `jquery` module as its dependency automatically.

```html
<script>
require.config({
  paths: {
    jquery: 'https://code.jquery.com/jquery-3.2.1.slim.min.js'
  }
});
require('jquery', 'jquery.mousehover', function ($) {
});
</script>
```

If you use [CommonJS] and compile your project to be loadable in the web
browser or other [AMD] module loader, you can install `jquery` and
`jquery.mousehover` as `NPM` or `Bower` modules.

```javascript
var $ = require('jquery');
require('jquery.mousehover');
</script>
```

## Example

Insert the text ">>" before the list item, which the mouse pointer is
hovering above, and remove the text, as soon as the mouse pointer leaves
the list item:

```html
<ul>
  <li>Apple</li>
  <li>Orange</li>
</ul>
<script>
  $('li').mousehover(
    function () {
      $(this).prepend($('<span>&gt;&gt; </span>'));
    },
    function () {
      $(this).find('span:first').remove();
    }
  );
</script>
```

## Installation

Make sure that you have [NodeJS] >= 4 installed. You can use either `npm`
or `bower` to install this package and its dependencies.

With [NPM]:

```shell
npm install jquery.mousehover
```

With [Bower]:

```shell
bower install jquery.mousehover
```

## Build

Make sure that you have [NodeJS] >= 4 installed. Clone the Github
repository to a local directory, enter it and install the package
dependencies (including the development dependencies) by `npm`:

```shell
git clone https://github.com/prantlf/jquery.mousehover.git
cd jquery.mousehover
npm install
```

Examples and tests will be functional now.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality.

First fork this repository and clone your fork locally instead of cloning
the original. See the "Build" chapter above for more details about how to
clone it and install the build dependencies.

Before you commit, update minified files and source maps, re-generate
documentation and check if tests succeed:

```shell
npm run build
npm test
```

Commit your changes to a separtate branch, so that you can create a pull
request for it:

```shell
git checkout -b <branch name>
git commit -a
git push origin <branch name>
```

## Release History

 * 2014-04-24   v0.2.0   Add noConflict method, off method for unregistering
                         event handlers and optional event namespacing
 * 2014-04-24   v0.1.0   Initial release

## License

Copyright (c) 2017 Ferdinand Prantl

Licensed under the MIT license.

[Bower]: http://bower.io/
[NodeJS]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[`jQuery.hover`]: https://api.jquery.com/hover/
[`jQuery.off`]: http://api.jquery.com/off/
[`jQuery.on`]: http://api.jquery.com/on/
[Function]: http://api.jquery.com/Types/#Function
[Event]: http://api.jquery.com/Types/#Event
[Object]: http://api.jquery.com/Types/#Object
[RequireJS]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
[AMD]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
[CommonJS]: http://wiki.commonjs.org/wiki/CommonJS
