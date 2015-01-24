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
    var embedCode = "";
    if (this.state.bar) {
      embedCode += "&lt;script src=&quot;http://development.ss15-incorgito.divshot.io&quot;&gt;&lt;/script&gt;";
      embedCode += "\n&lt;script&gt;Space_bar(&#39;" + this.state.bar.ref.key() + "}&#39;)&lt;/script&gt;";
    }
    return this.state.bar ? (
      <div className="create">
        <h3>Embed code</h3>
        <pre><code dangerouslySetInnerHTML={{__html: embedCode}} /></pre>
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
