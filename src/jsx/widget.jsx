var React = require('react/addons');
require("react-tap-event-plugin")();

var Bar = require('./bar.jsx').Widget;

var WidgetButton = React.createClass({
  _toggleBar: function() {
    this.props.bar.toggle();
  },
  render: function() {
    return (
      <button onClick={this._toggleBar}>
        Space_bar
      </button>
    );
  }
});

window.Space_bar = function(barId) {
  var container = document.createElement('div');
  container.classList.add('space_bar-container');
  document.body.appendChild(container);
  var bar = React.render(
    <Bar id={barId} />,
    container
  );
  React.render(
    <WidgetButton bar={bar} />,
    document.querySelector('.space_bar-button')
  );
};
