var React = require('react/addons');
var Router = require('react-router');

var Create = React.createClass({
  getInitialState: function() {
    return {
      bar: null
    };
  },
  _onSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.barTitle.getDOMNode().value;
    if (title.length < 1) {
      return;
    }
    var bar = Backend.Bar.create(title);
    this.setState({
      bar: bar
    });
  },
  render: function() {
    if (this.state.bar) {
      var embed = "&lt;script&gt;";
      embed += "\n" + "var OpenBar = &quot;" + this.state.bar.ref.key() + "&quot;";
      embed += "\n" + "(function(){var sb=document.createElement(&quot;script&quot;);";
      embed += "sb.src=&quot;" + location.origin + "/dist/widget.min.js&quot;;";
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
            params={{barId: this.state.bar.ref.key()}}
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
            <button type="submit">Create</button>
          </p>
        </form>
      </div>
    );
  }
});

module.exports = Create;
