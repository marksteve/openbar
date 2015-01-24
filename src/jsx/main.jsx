var React = require('react/addons');
var Router = require('react-router');
require("react-tap-event-plugin")();

var Backend = require('./backend.js');

Router
  .create({
    routes: require('./routes.jsx'),
    location: Router.HistoryLocation
  })
  .run(function(Handler) {
    React.render(<Handler />, document.body);
  });

window.React = React;
window.Backend = Backend;
