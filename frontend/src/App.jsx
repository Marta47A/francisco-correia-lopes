import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

function App() {

  const lastPosts;

  return (
    <div>
      <Header />
      <Router>
      <Switch>
        <Route path="/" exact>
          <Home lastPosts={lastPosts}/>
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Redirect to="/" />
      </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
