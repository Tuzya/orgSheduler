import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from './elb-logo.svg';
import './Header.css';

function Header({ isAuth, logout }) {
  return (
    <header>
      <nav>
        <div className="nav-wrapper">
          <Link to="/">
            <img className="logo" src={logo} alt="" />
            <div className="brand-logo">
              Groups Scheduler
            </div>
          </Link>
          <div data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></div>
          <div id="nav-mobile" className="right hide-on-med-and-down">
            <Link to="/">Groups(Home)</Link>
            {
              isAuth ? (
                <>
                  <Link to="/groups/new">New Group</Link>
                  <Link to="/groups/schema">Schema</Link>
                  <Link to="/" onClick={logout}>Logout</Link>
                </>
              ) : <Link to="/login">Login</Link>
            }
          </div>
        </div>
      </nav>
    </header>
  );
}

Header.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
