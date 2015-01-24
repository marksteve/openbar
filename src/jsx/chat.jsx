var React = require('react/addons');
var mui = require('material-ui');
var moment = require('moment');

function id() {
  return (Math.random() * Math.pow(2, 64)).toString(36);
}

var Message = React.createClass({
  render: function() {
    var message = this.props;
    return (
      <li>
        <div className="avatar">
          <img src={message.avatarUrl} />
        </div>
        <span className="name">{message.name}</span>
        <span className="timestamp">{message.timestamp.calendar()}</span>
        <div className="text">{message.text}</div>
      </li>
    );
  }
});

var ChatTextarea = React.createClass({
  _onKeyDown: function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      this.props.onSubmit(this.refs.textarea.getDOMNode().value);
    }
  },
  render: function() {
    return (
      <textarea ref="textarea" rows="1" onKeyDown={this._onKeyDown} />
    );
  }
});

var Chat = React.createClass({
  getInitialState: function() {
    return {
      messages: []
    };
  },
  componentDidMount: function() {
    this.setState({
      messages: [
        {
          key: id(),
          name: "Fancy Franklin",
          timestamp: moment(),
          avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
          text: "Hello, world",
        },
        {
          key: id(),
          name: "Fancy Franklin",
          timestamp: moment(),
          avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
          text: "Hello, world",
        },
        {
          key: id(),
          name: "Fancy Franklin",
          timestamp: moment(),
          avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
          text: "Hello, world",
        },
        {
          key: id(),
          name: "Fancy Franklin",
          timestamp: moment(),
          avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
          text: "Hello, world",
        },
      ]
    });
  },
  _renderMessages: function() {
    return this.state.messages.map(React.createFactory(Message));
  },
  _submitMessage: function(text) {
    var message = {
      key: id(),
      name: "Fancy Franklin",
      timestamp: moment(),
      avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
      text: text,
    };
    this.setState(React.addons.update(
      this.state,
      {messages: {$push: [message]}}
    ));
  },
  render: function() {
    return (
      <div className="chat">
        <div className="messages">
          <ul>
            {this._renderMessages()}
          </ul>
        </div>
        <div className="chatbox">
          <ChatTextarea
            onSubmit={this._submitMessage}
          />
        </div>
      </div>
    );
  }
});

module.exports = Chat;
