var React = require('react/addons');
var Router = require('react-router');
var mui = require('material-ui');

var Chat = require('./chat.jsx');

var Bar = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {
      bar: null
    };
  },
  componentDidMount: function() {
    this.setState({
      bar: {
        id: this.getParams().barId,
        name: "Test"
      }
    });
  },
  render: function() {
    var bar = this.state.bar;
    return bar ? (
      <div className="bar">
        <header>
          <h2>{bar.name}</h2>
        </header>
        <Chat bar={bar} />
      </div>
    ) : (
      <div className="loading">Loading&hellip;</div>
    );
  }
});

module.exports = Bar;
