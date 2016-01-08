# babel-react-translate-maker

This is a [Babel](https://babeljs.io/) plugin for automatic extraction of translations from modules that use [react-translate-maker](https://github.com/CherrySoftware/react-translate-maker).

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/babel-plugin-react-translate-maker.svg?style=flat-square
[npm-url]: https://www.npmjs.com/babel-plugin-react-translate-maker
[travis-image]: https://img.shields.io/travis/CherrySoftware/babel-plugin-react-translate-maker/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/CherrySoftware/babel-plugin-react-translate-maker

> Note: Now requires babel 6

# What?

# Installation

```sh
$ npm install babel-plugin-react-translate-maker
```

# Support us

Star this project on [GitHub][github-url].

# Usage

### `.babelrc`

```json
{
  "plugins": [
    ["react-translate-maker", {
      "filename": "./locales.json"
    }]
  ]
}
```

# Options

 - disableTFunction (Boolean = false): disable to process t function
 - moduleName (String = 'react-translate-maker'): custom module name in node_modules
 - path (String = './'): Path where do you want to save extracted locales.
 - filename (String): Name of the file whitch will contain all extracted data. Only one file will be generated for all modules. Filename is working with path.
 - suffix (String = '_locales.json'): Suffix of the generated files. This suffix is used only if option filename is undefined.


# Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

```sh
npm install
```

Then run the tests:

```sh
npm test
```
