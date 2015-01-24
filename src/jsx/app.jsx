var React = require('react/addons');
var Router = require('react-router');

var Backend = require('./backend');

var App = React.createClass({
  mixins: [Router.Navigation],
  _onCreateBar: function(title) {
    var bar = Backend.Bar.create(title);
    this.transitionTo('bar', {barId: bar.ref.key()});
  },
  render: function() {
    return (
      <Router.RouteHandler
        onCreateBar={this._onCreateBar}
      />
    );
  }
});

module.exports = App;
