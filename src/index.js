/*
 options:
   disableTFunction: bool - disable to process t function
   moduleName: string - custom module name in node_modules
   path: string - path where to save files
   filename: string
   suffix: string || _locales.json
*/

import p from 'path';
import fs from 'fs';
import { sync as mkdirpSync } from 'mkdirp';

function getPropKey(path) {
  if (path.isIdentifier() || path.isJSXIdentifier()) {
    return path.node.name;
  }

  const evaluated = path.evaluate();
  if (evaluated.confident) {
    return evaluated.value;
  }
}

function getPropValue(path) {
  const path2 = path.isJSXExpressionContainer()
    ? path.get('expression')
    : path;

  const evaluated = path2.evaluate();
  if (evaluated.confident) {
    return evaluated.value;
  }
}

function getPropsFromPath(path) {
  const props = {};

  path
    .get('attributes')
    .forEach((attr) => {
      if (!attr.isJSXAttribute()) {
        return;
      }

      const key = getPropKey(attr.get('name'));
      const value = getPropValue(attr.get('value'));
      if (!key || typeof value === 'undefined') {
        return;
      }

      props[key] = value;
    });

  return props;
}

function getArgsFromPath(path) {
  return path.get('arguments').map((attr) => {
    const evaluated = attr.evaluate();
    return evaluated.value;
  });
}

function getNamespace(path, moduleName) {
  let parentPath = path.parentPath;
  const namespaces = [];
  while (parentPath) {
    if (parentPath.node.type !== 'JSXElement') {
      parentPath = parentPath.parentPath;
      continue;
    }

    const openingElement = parentPath.get('openingElement');
    const openingElementName = openingElement.get('name');
    parentPath = parentPath.parentPath;

    if (!openingElementName.referencesImport(moduleName, 'Namespace')) {
      continue;
    }

    const namespaceProps = getPropsFromPath(openingElement);
    if (namespaceProps.path) {
      namespaces.unshift(namespaceProps.path);
    }

    if (!namespaceProps.compose) {
      break;
    }
  }

  if (namespaces.length) {
    return namespaces.join('.');
  }
}

export default function() {
  return {
    visitor: {
      // save
      Program: {
        enter(path, state) {
          state.translations = [];
        },
        exit(path, state) {
          const { file, opts, translations } = state;
          const { basename, filename } = file.opts;

          if (!translations.length) {
            return;
          }

          if (opts.filename) {
            const filePath = p.join(process.cwd(), opts.path, opts.filename);

            try {
              const isFile = fs.statSync(filePath).isFile();
              if (!isFile) {
                throw new Error('File path is not a file');
              }
            } catch (e) {
              const content = JSON.stringify(translations, null, 2);
              fs.writeFileSync(filePath, content);
              return;
            }

            // append to current file TODO combine files together
            const json = fs.readFileSync(filePath);
            const currentTranslations = JSON.parse(json);
            const allTranslations = [...currentTranslations, ...translations];
            const content = JSON.stringify(allTranslations, null, 2);

            fs.writeFileSync(filePath, content);

            return;
          }

          const content = JSON.stringify(translations, null, 2);
          const suffix = opts.suffix || '_locales.json';
          const relativePath = p.dirname(p.relative(process.cwd(), filename));
          const filePath = p.join(opts.path || './', relativePath, basename + suffix);

          mkdirpSync(p.dirname(filePath));
          fs.writeFileSync(filePath, content);
        },
      },
      // JSX components
      JSXOpeningElement(path, state) {
        const { opts, translations } = state;
        const name = path.get('name');
        const moduleName = opts.moduleName || 'react-translate-maker';

        if (name.referencesImport(moduleName, 'default')) {
          const props = getPropsFromPath(path);
          const namespace = getNamespace(path, moduleName);

          const translatePath = namespace
            ? namespace + '.' + props.path
            : props.path;

          translations.push({
            path: translatePath,
            defaultValue: props.defaultValue,
            description: props.description,
          });
        }
      },
      // translate maker get function: t(path, args, defaultValue);
      CallExpression(path, state) {
        const { translations, opts } = state;
        if (opts.disableTFunction) {
          return;
        }

        const callee = path.get('callee');
        if (callee.node.name !== 't') {
          return;
        }

        const args = getArgsFromPath(path);
        if (!args || !args.length || !args.length > 3) {
          throw new Error('[babel-plugin-react-translate-maker]: t-function need to have max 3 arguments');
        }

        const [tPath, ...other] = args;
        if (!tPath) {
          throw new Error('[babel-plugin-react-translate-maker]: t-function path is missing');
        }

        translations.push({
          path: tPath,
          defaultValue: other.pop(),
        });
      },
    },
  };
}
