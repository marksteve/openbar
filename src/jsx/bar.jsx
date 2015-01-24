var React = require('react/addons');
var Router = require('react-router');

var Backend = require('./backend.js');
var Chat = require('./chat.jsx');

var Base = {
  getInitialState: function() {
    return {
      bar: null,
      toggled: false,
      showClose: true
    };
  },
  componentDidMount: function() {
    var barId = this.props.id || this.getParams().barId;
    Backend.Bar.get(barId, this._loadBar);
  },
  toggle: function() {
    this.setState({
      toggled: !this.state.toggled
    });
  },
  _loadBar: function(bar) {
    this.setState({bar: bar});
  },
  _close: function() {
    this.setState({toggled: false});
  },
  _renderClose: function() {
    return this.state.showClose ? (
      <button className="close" onClick={this._close}>
        &times;
      </button>
    ) : null;
  },
  render: function() {
    var bar = this.state.bar;
    return this.state.toggled ? (
      bar ? (
        <div className="space_bar">
          <header>
            <h2>{bar.title}</h2>
            {this._renderClose()}
          </header>
          <Chat bar={bar} />
        </div>
      ) : (
        <div className="space_bar">
          <div className="loading" />
        </div>
      )
    ) : null;
  }
};

var Widget = React.createClass(Base);
var Route = React.createClass(
  React.addons.update(Base, {$merge: {
    getInitialState: function() {
      return {
        bar: null,
        toggled: true,
        showClose: false
      };
    },
    mixins: [Router.State]
  }})
);

module.exports = {
  Widget: Widget,
  Route: Route
};
