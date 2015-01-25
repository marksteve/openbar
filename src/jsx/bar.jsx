var React = require('react/addons');
var Router = require('react-router');

var Backend = require('./backend.js');
var Chat = require('./chat.jsx');

var Base = {
  getInitialState: function() {
    return {
      user: null,
      bar: null,
      messages: [],
      toggled: false,
      widget: true
    };
  },
  componentDidMount: function() {
    var barId = this.props.id || this.getParams().barId;
    Backend.Bar.get(barId, this._loadBar);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.bar && !prevState.bar) {
      this.state.bar.onMessage(this._loadMessage);
    }
    if (this.state.bar && this.state.toggled) {
      this.refs.chat.scrollToBottom();
    }
  },
  toggle: function() {
    this.setState({
      toggled: !this.state.toggled
    });
  },
  _loadBar: function(bar) {
    this.setState({bar: bar});
    bar.checkAuth(this._loadUser, this._loadUserError);
  },
  _loadUser: function(user) {
    this.setState({user: user});
  },
  _loadUserError: function(error) {
    console.log(error);
  },
  _loadMessage: function(message) {
    this.setState(React.addons.update(
      this.state,
      {messages: {$push: [message]}}
    ));
    if (this.state.toggled) {
      this.refs.chat.scrollToBottom();
    }
  },
  _submitMessage: function(text) {
    if (!this.state.user) {
      return;
    }
    var message = {
      name: this.state.user.name,
      color: this.state.user.color,
      timestamp: new Date().getTime(),
      text: text,
    };
    this.state.bar.newMessage(message);
  },
  _close: function() {
    this.setState({toggled: false});
  },
  _renderClose: function() {
    return this.state.widget ? (
      <button className="close" onClick={this._close}>
        &times;
      </button>
    ) : null;
  },
  render: function() {
    var bar = this.state.bar;
    var className = React.addons.classSet({
      'openbar': true,
      'widget': this.state.widget
    });
    return this.state.toggled ? (
      bar ? (
        <div className={className}>
          <div className="bar-header">
            <h2 className="bar-title">{bar.title}</h2>
            {this._renderClose()}
          </div>
          <Chat
            ref="chat"
            messages={this.state.messages}
            onSubmitMessage={this._submitMessage}
          />
        </div>
      ) : (
        <div className="openbar">
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
        messages: [],
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
