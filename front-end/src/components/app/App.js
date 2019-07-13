import { Route, Switch, HashRouter } from "react-router-dom";
import React from "react";
import Movies from "../movies/Movies.jsx";

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Movies} />
      </Switch>
    </HashRouter>
  );
}

export default App;
