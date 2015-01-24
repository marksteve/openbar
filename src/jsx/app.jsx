var React = require('react/addons');
var Router = require('react-router');
var mui = require('material-ui');

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Router.RouteHandler />
      </div>
    );
  }
});

module.exports = App;
