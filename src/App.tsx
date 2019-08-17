import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Home, Imprint } from './pages';

import './styles/global.less';

function App() {
  return (
    <Router>
      <Route exact={true} path="/" component={Home} />
      <Route path="/imprint" component={Imprint} />
    </Router>
  );
}

export default App;