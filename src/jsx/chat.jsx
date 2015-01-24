var React = require('react/addons');
var moment = require('moment');
var marked = require('marked');

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
        <span className="timestamp">{message.timestamp}</span>
        <div
          className="text"
          dangerouslySetInnerHTML={{__html: marked(message.text)}}
        />
      </li>
    );
  }
});

var ChatTextarea = React.createClass({
  _onKeyDown: function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      var textarea = this.refs.textarea.getDOMNode();
      e.preventDefault();
      this.props.onSubmit(textarea.value);
      textarea.value = '';
    }
  },
  componentDidMount: function() {
    this.refs.textarea.getDOMNode().focus();
  },
  render: function() {
    return (
      <textarea
        ref="textarea"
        rows="1"
        onKeyDown={this._onKeyDown}
        placeholder="Type in Markdown&hellip;"
      />
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
    this.props.bar.onMessage(this._loadMessage);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
      var messagesDiv = this.refs.messages.getDOMNode();
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  },
  _loadMessage: function(message) {
    this.setState(React.addons.update(
      this.state,
      {messages: {$push: [message]}}
    ));
  },
  _renderMessages: function() {
    return this.state.messages.map(React.createFactory(Message));
  },
  _submitMessage: function(text) {
    if (text.length < 1) {
      return;
    }
    var message = {
      name: "Fancy Franklin",
      timestamp: moment().calendar(),
      avatarUrl: "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
      text: text,
    };
    this.props.bar.newMessage(message);
  },
  render: function() {
    return (
      <div className="chat">
        <div ref="messages" className="messages">
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
