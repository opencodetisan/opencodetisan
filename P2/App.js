import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage"; 
import InternalPage from "./InternalPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/" exact component={InternalPage} />
      </Switch>
    </Router>
  );
}

export default App;
