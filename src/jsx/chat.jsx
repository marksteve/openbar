var React = require('react/addons');
var moment = require('moment');
var marked = require('marked');
var superagent = require('superagent');

marked.setOptions({
  gfm: true,
  sanitize: true
});

var Backend = require('./backend');

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
  getInitialState: function() {
    return {
      recordToggled: false,
      vr: null
    };
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.recordToggled !== this.state.recordToggled) {
      if (this.state.recordToggled) {
        var vr = new Backend.VideoRecorder(
          this.refs.video.getDOMNode(),
          this._onUploadRecord,
          this._onUploadRecordError,
          this._onStopRecord
        );
        this.setState({vr: vr});
      }
    }
  },
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
  _toggleRecord: function() {
    this.setState({
      recordToggled: !this.state.recordToggled
    });
  },
  _renderRecord: function() {
    return this.state.recordToggled ? (
      <div className="record-overlay">
        <video ref="video" muted autoPlay />
        <div className="actions">
          <button onClick={this._startRecord}>
            Start
          </button>
          <button onClick={this._stopRecord}>
            Stop
          </button>
        </div>
      </div>
    ) : null;
  },
  _startRecord: function() {
    this.state.vr.start();
  },
  _stopRecord: function() {
    this.state.vr.stop();
  },
  _onUploadRecord: function(url) {
    this._submitMessage(url);
  },
  _onUploadRecordError: function() {
  },
  _onStopRecord: function() {
    this._toggleRecord();
  },
  render: function() {
    return (
      <div className="chat">
        {this._renderRecord()}
        <div ref="messages" className="messages">
          <ul>
            {this._renderMessages()}
          </ul>
        </div>
        <div className="chatbox">
          <ChatTextarea
            onSubmit={this._submitMessage}
          />
          <button
            className="record"
            onClick={this._toggleRecord}
          >
            Record
          </button>
        </div>
      </div>
    );
  }
});

module.exports = Chat;
