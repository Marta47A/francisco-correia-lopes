import React, { useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
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
      <Router>
        <Header />
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
        <Footer />
      </Router>
    </div>
  );
}

export default App;
