# babel-plugin-react-translate-maker

This is a [Babel](https://babeljs.io/) plugin for automatic extraction of translations from modules that use [react-translate-maker](https://github.com/CherrySoftware/react-translate-maker).

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/babel-plugin-react-translate-maker.svg?style=flat-square
[npm-url]: https://www.npmjs.com/babel-plugin-react-translate-maker
[travis-image]: https://img.shields.io/travis/CherrySoftware/babel-plugin-react-translate-maker/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/CherrySoftware/babel-plugin-react-translate-maker
[github-url]: https://github.com/CherrySoftware/babel-plugin-react-translate-maker

> Note: Now requires babel 6

# What?

It will create:

```json
[
  {
    "path": "user.hello",
    "defaultValue": "Hi {$user.name}"
  },
  {
    "path": "header.navigation2.quizzes",
    "defaultValue": "Quizzes",
    "description": "Menu item"
  },
  {
    "path": "header.navigation.minies",
    "defaultValue": "Minies"
  }
]
```

from:

```js
import React, { Component } from 'react';
import Translate, { Namespace, LocaleProvider } from 'react-translate-maker';

export default class Test extends Component {
  static contextTypes = {
    ...LocaleProvider.childContextTypes,
  };

  render() {
    const { t } = this.context;

    t('user.hello', 'Hi {$user.name}');

    return (
      <header>
        <Namespace path="header.navigation">
          <ul className="nav navbar-nav">
            <li>
              <Namespace path="header.navigation2">
                <Translate path="quizzes" defaultValue="Quizzes" description="Menu item"/>
              </Namespace>
            </li>
            <li>
              <Translate path="minies" defaultValue="Minies"/>
            </li>
          </ul>
        </Namespace>
      </header>
    );
  }
}
```


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
      "filename": "locales.json"
    }]
  ]
}
```

# Options

 - disableTFunction (Boolean = false): Disable to process t function
 - moduleName (String = 'react-translate-maker'): Custom module name in node_modules
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
