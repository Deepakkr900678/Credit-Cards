import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Signup-Login/Login";
import Signup from "./Components/Signup-Login/Signup";
import Property from "./Components/property/Property";
import Protected from "./Components/Protected/protected";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/" element={<Protected><Property /></Protected>}></Route>
      </Routes>
    </>
  );
}

export default App;
