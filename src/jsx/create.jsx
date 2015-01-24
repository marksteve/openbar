
var React = require('react/addons');
var mui = require('material-ui');

var Create = React.createClass({
  _onSubmit: function(e) {
    e.preventDefault();
    var name = this.refs.barName.getValue();
    if (name.length < 1) {
      return;
    }
    this.props.onCreateBar({
      name: name
    });
  },
  render: function() {
    return (
      <div className="create">
        <mui.Paper zDepth={1}>
          <form onSubmit={this._onSubmit}>
            <h2>Create a bar</h2>
            <mui.Input
              ref="barName"
              name="barName"
              inputStyle="floating"
              type="text"
              placeholder="Name"
            />
            <mui.RaisedButton type="submit" label="Create" primary={true} />
          </form>
        </mui.Paper>
      </div>
    );
  }
});

module.exports = Create;
