# Slot-bro: small framework for building browser extensions 

[![Built with gulp](http://img.shields.io/badge/built%20with-gulp-orange.svg)](http://gulpjs.com)

Slot-bro is a small high-level extension framework built with simplicity and modularity in mind. 
Currently we use Kango Framework as an abstraction layer, so we can produce extensions for all major browsers, except IE and Opera <=12.

### Used technologies
* Webpack
* ES6 transpiler (BabelJS)
* Gulp as a build system
* Lodash, Mocha, ESLint, etc...
* Inspired by [2gis slot framework](https://github.com/2gis/slot/)

### Quick start
* `npm install`
* `gulp build`
* You're done! Start edit your application code in the app folder.

Note: generally, it's highly recommended to store the app folder as a separate private repo. Make sure to add app/certs folder to your .gitingore to prevent your certificates from being published!

### Global ideas
* The browser extension has several entry points (background scripts, content scripts, also some custom scripts for popups and settings pages).
* Each of these entry points has each own Application instance. Generally, these instances do not know a thing about each other.
* Each application instantiates one root __module__. Any module can instantiate one or more other modules, forming the modular tree.
* Inside of the modular tree modules can interact using messaging system. Each module can __notify__ parent modules about what happened, and it 
also can __broadcast__ a message to all descendant modules. Modules laying on the different branches of the modular tree can interact only through 
their common parent.
* Each root module of each application (in exception of background app) is a __proxy module__.
* Background root module also instantiates some __proxy modules__ - special type of modules to interact with injected scripts.
* Proxy modules are basic abstractions over Kango framework messaging system. The goal of proxy modules is to make homogeneous
messaging system across all extension. That means, the proxy module translates __notifies__ and __broadcasts__ to kango.invokeAsync or 
kango.tab.dispatchMessage and backwards, so the delevoper may not know about the latter ones at all.
* Other Kango goodies (such as kango.storage, kango.xhr and others) are wrapped into __components__ and also are augmented with some more useful goodies.

### TODO List
* Extended i18n support (.po, gettext, etc)
* Detailed documentation

### Project status
Currently the framework is actively developed. No initial release has been done, use it at your own risk.

### Automated packaging abilities:
* Command: `gulp build --pack` or `gulp build --release`
* Works fine on Mac and Linux operating systems
* Chrome and Firefox packaging should work on any *nix system (but not tested). Safari packager will __not__ work.
* Windows users should pack their extensions manually, or use the virtual OS. Sorry, people :(
