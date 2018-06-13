import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import Header from '../components/Header';

import RequireAuthentication from './RequireAuthentication';
import { LogsContainer } from './';

class App extends Component {
  render() {
    return (
      <div>
        <Header tenant={window.config.AUTH0_DOMAIN} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 content-header">
                    <ol className="breadcrumb">
                      <li>
                        <a href={window.config.AUTH0_MANAGE_URL}>Auth0 Dashboard</a>
                      </li>
                      <li>
                        <a href={`${window.config.AUTH0_MANAGE_URL}/#/extensions`}>Extensions</a>
                      </li>
                    </ol>
                    <h1 className="pull-left" style={{ paddingTop: '10px' }}>Logs Export</h1></div>
                </div>
                <LogsContainer />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.auth.get('user'),
    issuer: state.auth.get('issuer')
  };
}

export default RequireAuthentication(connect(select, { logout })(App));
