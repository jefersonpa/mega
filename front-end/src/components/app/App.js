import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import React from "react";
import "./App.css";

import Movies from "../movies/Movies.jsx";

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Movies} />
        {/* 
        
        <Route path={"/recover-password"} component={RecuperarSenha} />
      <LoggedRoute path={"/dashboard"} component={Dashboard} />
      <Route path={"*"} component={NotFound} /> */}
      </Switch>
    </HashRouter>
  );
}

export default App;
