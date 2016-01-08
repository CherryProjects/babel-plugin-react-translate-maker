import React, { PropTypes, Component } from 'react';
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
