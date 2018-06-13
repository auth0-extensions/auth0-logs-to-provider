import './Header.css';
import React, { Component } from 'react';

export default class Header extends Component {
  static propTypes = {
    tenant: React.PropTypes.string,
    onLogout: React.PropTypes.func.isRequired
  }

  getPicture(tenant) {
    return `https://cdn.auth0.com/avatars/${tenant.slice(0, 2).toLowerCase()}.png`;
  }

  render() {
    const { tenant, onLogout } = this.props;

    return (
      <header className="dashboard-header">
        <nav role="navigation" className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <h1 className="navbar-brand" style={{ paddingTop: 0 }}>
                <a href={window.config.AUTH0_MANAGE_URL}>
                  <span>Auth0</span>
                </a>
              </h1>
            </div>
            <div id="navbar-collapse" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a target="_blank" href="https://auth0.com/support">Help &amp; Support</a>
                </li>
                <li>
                  <a target="_blank" href="https://auth0.com/docs">Documentation</a>
                </li>
                <li className="dropdown">
                  <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                    <img src={this.getPicture(tenant)} className="picture avatar" />
                    <span className="username-text">{tenant}</span>
                    <i className="icon-budicon-460"></i>
                  </span>
                  <ul role="menu" aria-labelledby="dLabel" className="dropdown-menu animated">
                    <li role="presentation">
                      <a role="menuitem" tabIndex="-1" onClick={onLogout}>Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
