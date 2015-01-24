
var React = require('react/addons');
var mui = require('material-ui');

var Create = React.createClass({
  render: function() {
    return (
      <div className="create">
        <mui.Paper zDepth={1}>
          <h2>Create a bar</h2>
          <mui.Input inputStyle="floating" type="text" name="bar_name" placeholder="Name" />
          <mui.RaisedButton label="Primary" primary={true} />
        </mui.Paper>
      </div>
    );
  }
});

module.exports = Create;
