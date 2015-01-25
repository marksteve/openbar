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
        OpenBar
      </button>
    );
  }
});

function init(barId) {
  var container = document.createElement('div');
  container.classList.add('openbar-container');
  document.body.appendChild(container);
  var bar = React.render(
    <Bar id={barId} />,
    container
  );
  React.render(
    <WidgetButton bar={bar} />,
    document.querySelector('.openbar-button')
  );
}

if (OpenBar) {
  // Insert CSS
  var css = document.createElement('link');
  css.href = (
    window.__env && __env.__release ? 'http://development.ss15-incorgito.divshot.io' : ''
  ) + '/dist/widget.css';
  css.type = 'text/css';
  css.rel = 'stylesheet';
  // Only call init when CSS has been loaded to avoid FOUC
  css.onload = init.bind(null, OpenBar);
  var h = document.getElementsByTagName('head')[0];
  h.insertBefore(css, h.firstChild);
  // Insert button
  var button = document.createElement('div');
  button.className = 'openbar-button';
  var b = document.getElementsByTagName('body')[0];
  b.appendChild(button);
} else {
  console.warn("`OpenBar` is not defined!");
}
