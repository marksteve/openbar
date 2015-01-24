var React = require('react/addons');

var Create = React.createClass({
  _onSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.barTitle.getDOMNode().value;
    if (title.length < 1) {
      return;
    }
    this.props.onCreateBar(title);
  },
  render: function() {
    return (
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
