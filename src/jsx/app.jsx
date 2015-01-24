var React = require('react/addons');
var Router = require('react-router');

var Backend = require('./backend');

var App = React.createClass({
  render: function() {
    return (
      <Router.RouteHandler
        onCreateBar={this._onCreateBar}
      />
    );
  }
});

module.exports = App;
