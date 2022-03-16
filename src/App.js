import "regenerator-runtime/runtime";
import React from "react";
import "./global.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateNewPost from "./pages/CreateNewPost";

import Layout from "./components/HomeLayout";
import Error404Page from "./pages/Error404";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route
          path="/new-post"
          exact
          element={<CreateNewPost />}
        ></Route>
        <Route path="*" element={<Error404Page />}></Route>
      </Routes>
    </Layout>
  );
}