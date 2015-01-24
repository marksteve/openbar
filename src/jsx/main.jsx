var React = require('react/addons');
var Router = require('react-router');

require("react-tap-event-plugin")();
window.React = React;

var Backend = require('./backend.js');
window.Backend = Backend;

var Routes = require('./routes.jsx');

Router
  .create({
    routes: Routes,
    location: Router.HistoryLocation
  })
  .run(function(Handler) {
    React.render(<Handler />, document.body);
  });
