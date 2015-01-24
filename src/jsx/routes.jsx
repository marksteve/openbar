var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

var App = require('./app.jsx');

var Create = require('./create.jsx');

module.exports = (
  <Route name="app" path="/bar" handler={App}>
    <Route name="create" handler={Create} />
    <DefaultRoute handler={Create} />
  </Route>
);
