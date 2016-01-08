import fs from 'fs';
import { parse, transform, traverse } from 'babel-core';
import extractor from '../src';
import path from 'path';
import should from 'should';

const filePath = path.join(process.cwd(), '/tests/locales.json');

describe('Exctractor', () => {
  it('should be able to delete exists locales.json', (done) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        return done();
      }

      fs.unlinkSync(filePath);
      done();
    });
  });

  it('should be able to extract from jsx file', () => {
    const filename = `${__dirname}/fixtures/main.jsx`;
    const source = fs.readFileSync(filename, 'utf8');
    const transformed = transform(source, {
      filename,
      presets: [
        'es2015',
        'react',
        'stage-0',
      ],
      plugins: [
        'transform-decorators-legacy',
        [extractor, {
          path: '/tests',
          filename: 'locales.json',
        }],
      ]
    });

    const json = fs.readFileSync(filePath);
    const [ first, second, third ] = JSON.parse(json);

    first.path.should.equal('user.hello');
    first.defaultValue.should.equal('Hi {$user.name}');

    second.path.should.equal('header.navigation2.quizzes');
    second.defaultValue.should.equal('Quizzes');
    second.description.should.equal('Menu item');

    third.path.should.equal('header.navigation.minies');
    third.defaultValue.should.equal('Minies');
  });

  it('should be able to delete exists locales.json', () => {
    fs.unlinkSync(filePath);
  });
});
