var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

var App = require('./app.jsx');

var Create = require('./create.jsx');
var Bar = require('./bar.jsx');

module.exports = (
  <Route name="root" path="/bar" handler={App}>
    <Route name="create" handler={Create} />
    <Route name="bar" path=":barId" handler={Bar} />
    <DefaultRoute handler={Create} />
  </Route>
);
