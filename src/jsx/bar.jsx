var React = require('react/addons');
var Router = require('react-router');

var Backend = require('./backend.js');
var Chat = require('./chat.jsx');

var Passphrase = React.createClass({
  componentDidMount: function() {
    this.refs.passphrase.getDOMNode().focus();
  },
  _submit: function(e) {
    e.preventDefault();
    var passphrase = this.refs.passphrase.getDOMNode().value;
    this.props.onSubmitPassphrase(passphrase);
  },
  render: function() {
    return (
      <div className="passphrase">
        <h3>This bar does not exist or has a passphrase.</h3>
        <p>Would you happen to know what it is?</p>
        <form onSubmit={this._submit}>
          <input ref="passphrase" type="password" placeholder="Passphrase" />
        </form>
      </div>
    );
  }
});

var Base = {
  getInitialState: function() {
    return {
      user: null,
      bar: null,
      messages: [],
      loading: true,
      toggled: false,
      widget: true,
      askPassphrase: false
    };
  },
  componentDidMount: function() {
    if (!this.state.widget) {
      this._getBar();
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    // First toggle
    if (prevState.toggled !== this.state.toggled
      && this.state.toggled
      && !this.state.bar) {
      this._getBar();
    }
    // Newly opened bar
    if (!prevState.bar && this.state.bar) {
      this.state.bar.onMessage(this._loadMessage);
    }
    // Scroll to bottom on toggle
    if (this.state.bar && this.state.toggled) {
      this.refs.chat.scrollToBottom();
    }
  },
  toggle: function() {
    this.setState({
      toggled: !this.state.toggled
    });
  },
  _getBar: function(passphrase) {
    var barId = this.props.id || this.getParams().barId;
    Backend.Bar.get(barId, passphrase, this._loadBar, this._loadBarError);
  },
  _loadBar: function(bar) {
    this.setState({
      bar: bar,
      loading: false,
      askPassphrase: false
    });
    bar.checkAuth(this._loadUser, this._loadUserError);
  },
  _loadBarError: function() {
    this.setState({
      loading: false,
      toggled: true,
      askPassphrase: true
    });
  },
  _submitPassphrase: function(passphrase) {
    this.setState({
      loading: true
    });
    this._getBar(passphrase);
  },
  _loadUser: function(user) {
    this.setState({
      loading: false,
      user: user
    });
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
  _submitMessage: function(text, type) {
    if (!this.state.user) {
      return;
    }
    var message = {
      name: this.state.user.name,
      color: this.state.user.color,
      timestamp: new Date().getTime(),
      text: text,
      type: type || "markdown"
    };
    this.state.bar.newMessage(message);
  },
  _close: function() {
    this.setState({toggled: false});
  },
  render: function() {
    var bar = this.state.bar;
    var className = React.addons.classSet({
      'openbar': true,
      'widget': this.state.widget
    });
    return this.state.toggled ? (
      <div className={className}>
      {(this.state.loading ? (
        <div className="loading" />
      ) : (
        this.state.bar ? (
          <div className="app">
            <div className="bar-header">
              <h2 className="bar-title">{bar.title}</h2>
              {(this.state.widget ? (
              <button className="close" onClick={this._close}>
                &times;
              </button>
              ) : null)}
            </div>
            <Chat
              ref="chat"
              messages={this.state.messages}
              onSubmitMessage={this._submitMessage}
            />
          </div>
        ) : (
          this.state.askPassphrase ? (
            <Passphrase onSubmitPassphrase={this._submitPassphrase} />
          ) : null
        )
      ))}
      </div>
    ) : null;
  }
};

var Widget = React.createClass(Base);
var Route = React.createClass(
  React.addons.update(Base, {$merge: {
    getInitialState: function() {
      return {
        user: null,
        bar: null,
        messages: [],
        loading: false,
        toggled: true,
        widget: false,
        askPassphrase: false
      };
    },
    mixins: [Router.State]
  }})
);

module.exports = {
  Widget: Widget,
  Route: Route
};
