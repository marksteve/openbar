var React = require('react/addons');
var moment = require('moment');
var marked = require('marked');
var superagent = require('superagent');

marked.setOptions({
  gfm: true,
  sanitize: true
});

var URLRegex = /(http(?:s?):[^ <\n]+)/;
var TagRegex = /<.+?>/g;

var Message = React.createClass({
  getInitialState: function() {
    return {
      oembed: null
    };
  },
  componentDidMount: function() {
    var urls = this.props.text.match(URLRegex);
    if (urls) {
      superagent
        .get("http://iframe.ly/api/oembed")
        .query({
          url: urls[0],
          api_key: "90359a4cb5007d8ac4481a"
        })
        .end(this._loadOembed);
    }
  },
  _loadOembed: function(resp) {
    this.setState({
      oembed: resp.body.html
    });
    this.props.scrollChatToBottom();
  },
  _renderOembed: function() {
    return this.state.oembed ? (
      <div
        className="oembed"
        dangerouslySetInnerHTML={{__html: this.state.oembed}}
      ></div>
    ) : null;
  },
  render: function() {
    var message = this.props;
    var html = marked(message.text);
    return (
      <li>
        <span className="name">{message.name}</span>
        <span className="timestamp">{message.timestamp}</span>
        <div
          className="text"
          dangerouslySetInnerHTML={{__html: html}}
        />
        {this._renderOembed()}
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
  scrollToBottom: function() {
    var messagesDiv = this.refs.messages.getDOMNode();
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },
  _renderMessage: function(message) {
    return (
      <Message
        scrollChatToBottom={this.scrollToBottom}
        {...message}
      />
    );
  },
  _renderMessages: function() {
    return this.props.messages.map(this._renderMessage);
  },
  _submitMessage: function(text) {
    if (text.length < 1) {
      return;
    }
    var message = {
      name: "Fancy Franklin",
      timestamp: moment().calendar(),
      text: text,
    };
    this.props.onSubmitMessage(message);
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
