var React = require('react/addons');
var Router = require('react-router');

var conf = require('../../conf');

var Create = React.createClass({
  getInitialState: function() {
    return {
      bar: null,
      private: false
    };
  },
  _onSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.barTitle.getDOMNode().value;
    var passphrase = null;
    if (this.state.private) {
      passphrase = this.refs.passphrase.getDOMNode().value;
      if (passphrase.length < 1) {
        alert("Passphrase is required");
        return;
      }
    }
    if (title.length < 1) {
      alert("Title is required");
      return;
    }
    var bar = Backend.Bar.create(title, passphrase);
    this.setState({bar: bar});
  },
  _togglePrivate: function() {
    this.setState({
      private: !this.state.private
    });
  },
  render: function() {
    if (this.state.bar) {
      var embed = "&lt;script&gt;";
      embed += "var OpenBar = &quot;" + this.state.bar.barId + "&quot;;";
      embed += "\n" + "(function(){var sb=document.createElement(&quot;script&quot;);";
      embed += "sb.src=&quot;" + conf.BASE_URL + "/dist/widget.min.js&quot;;";
      embed += "sb.type=&quot;text/javascript&quot;;";
      embed += "var s=document.getElementsByTagName(&quot;script&quot;)[0];";
      embed += "s.parentNode.insertBefore(sb,s)})();";
      embed += "\n" + "&lt;/script&gt;";
    }
    return this.state.bar ? (
      <div className="create">
        <h3>Embed code</h3>
        <pre><code dangerouslySetInnerHTML={{__html: embed}} /></pre>
        <p>
          <Router.Link
            to="bar"
            className="button"
            params={{barId: this.state.bar.barId}}
          >
            Open bar
          </Router.Link>
        </p>
      </div>
    ): (
      <div className="create">
        <form onSubmit={this._onSubmit}>
          <h2>Create a bar</h2>
          <p>
            <label>
              Name it! Make it your own.
              <input ref="barTitle" type="text" placeholder="Name" />
            </label>
          </p>
          <p>
            <input type="checkbox" id="private" onChange={this._togglePrivate} />
            <label htmlFor="private">Create a speakeasy bar</label>
          </p>
          {this.state.private ? (
          <p>
            <label>
              Shhh! We're keeping this a secret!
              <input ref="passphrase" type="password" placeholder="Passphrase" />
            </label>
          </p>
          ) : null}
          <p>
            <button type="submit">Create</button>
          </p>
        </form>
      </div>
    );
  }
});

module.exports = Create;
