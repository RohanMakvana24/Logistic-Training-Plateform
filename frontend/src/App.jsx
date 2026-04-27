import React from "react";
import MasterLayout from "./components/layouts/MasterLayout";
import { Routes, Route } from "react-router";
import LoginForm from "./pages/auth/LoginForm";
import AuthRoute from "./routes/AuthRoute";
import LanguageOverview from "./pages/admin/language/Languages";
import CreateProject from "./pages/admin/language/CreateProject";
import AuthInit from "./AuthInit";
import UserAdd from "./pages/admin/users/UserAdd";
import UsersOverview from "./pages/admin/users/UsersOverview";
import ViewUser from "./pages/admin/users/ViewUser";
import LoginFresher from "./pages/auth/FresherLogin";

const App = () => {
  return (
    <>
      <AuthInit />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<MasterLayout />}>
            <Route path="admin/users" element={<UsersOverview />}></Route>
            <Route path="admin/users/add" element={<UserAdd />}></Route>
            <Route path="admin/users/view" element={<ViewUser />}></Route>
          </Route>
        </Route>
        <Route path="auth">
          <Route path="login" element={<LoginForm />}></Route>
          <Route path="login-fresher" element={<LoginFresher />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
