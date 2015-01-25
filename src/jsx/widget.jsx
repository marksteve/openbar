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

function init(barId) {
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
}

if (Space_bar) {
  var css = document.createElement('link');
  css.href = 'http://development.ss15-incorgito.divshot.io/dist/widget.css';
  css.type = 'text/css';
  css.rel = 'stylesheet';
  css.onload = init.bind(null, Space_bar);
  var h = document.getElementsByTagName('head')[0];
  h.insertBefore(css, h.firstChild);
} else {
  console.warn("`Space_bar` not defined!");
}
