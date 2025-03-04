import { useState } from 'react'
import './App.css'
import Env from "./environments.js"
import Parse from "parse";
import Components from "./Components/Components.jsx"

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return <Components />;
}

export default App
