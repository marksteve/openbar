var React = require('react/addons');
var Router = require('react-router');
var mui = require('material-ui');

var App = React.createClass({
  mixins: [Router.Navigation],
  _onCreateBar: function(bar) {
    var id = (Math.random() * Math.pow(2, 64)).toString(36);
    this.transitionTo('bar', {barId: id});
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
