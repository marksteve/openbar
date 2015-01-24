var React = require('react/addons');
var Router = require('react-router');
var mui = require('material-ui');

var Chat = require('./chat.jsx');
var backend = require('./backend.js');

var Bar = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {
      bar: null
    };
  },
  componentDidMount: function() {
    backend.Bar.get(this.getParams().barId, this._loadBar);
  },
  _loadBar: function(bar) {
    this.setState({bar: bar});
  },
  render: function() {
    var bar = this.state.bar;
    return bar ? (
      <div className="bar">
        <header>
          <h2>{bar.title}</h2>
        </header>
        <Chat bar={bar} />
      </div>
    ) : (
      <div className="loading">Loading&hellip;</div>
    );
  }
});

module.exports = Bar;
