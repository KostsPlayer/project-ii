import React, { useEffect, useState, useMemo } from "react";
import Cursor from "../../component/Helper/Cursor";
import image from "../../assets/image/2.jpg";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  allMessage,
  validationLogin,
} from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function Login() {
  axios.defaults.withCredentials = true;
  const goBack = () => {
    window.history.back();
  };

  useMemo(() => image);
  const { toastMessage, message } = allMessage();

  const redirect = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const roleMessagge = localStorage.getItem("roleMessagge");

    if (roleMessagge) {
      toastMessage("success", roleMessagge);
      localStorage.removeItem("roleMessagge");
    }
  }, [location.state]);

  useEffect(() => {
    const dashboardAccess = localStorage.getItem("dashboardAccess");

    if (dashboardAccess) {
      toastMessage("error", dashboardAccess, "top-center");
      localStorage.removeItem("dashboardAccess");
    }
  }, []);

  useEffect(() => {
    const logoutMessage = localStorage.getItem("logoutMessage");
    if (logoutMessage) {
      toastMessage("success", logoutMessage);
      localStorage.removeItem("logoutMessage");
    }
  }, []);

  const [values, setValues] = useState({
    usernameEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    validationLogin
      .validate(values, { abortEarly: false })
      .then(() => {
        axios
          .post("https://project-ii-server.vercel.app/login", values)
          .then((res) => {
            console.log(res.data);
            if (res.data.loggedIn === true && res.data.role === 2) {
              localStorage.setItem("loginMessage", res.data.message);
              redirect("/dashboard");
            } else if (res.data.loggedIn === true && res.data.role === 3) {
              localStorage.setItem("loginMessage", res.data.message);
              redirect("/");
            }

            localStorage.setItem("session", res.data.isValid);
            localStorage.setItem(
              "dataUser",
              JSON.stringify({ dataUser: res.data.dataUser })
            );

            const test = JSON.parse(localStorage.getItem("dataUser"));
            console.log(test.dataUser.email);
            if (res.data.loggedIn === false) {
              toastMessage("error", res.data.message);
            }
          })
          .catch((err) => {
            console.error("error", err);
          });
      })
      .catch((errors) => {
        const errorMessages = errors.inner.map((error) => (
          <li key={error.path}>{error.message}</li>
        ));
        toastMessage(
          "error",
          <ul className="error-message">{errorMessages}</ul>,
          "top-center"
        );
      });
  };

  return (
    <>
      <Cursor />
      <div className="login">
        <div className="login-image">
          <img className="image" src={image} alt="image" />
        </div>
        <div className="login-container">
          <div className="login-container-box">
            <div className="login-top">
              <span className="material-symbols-outlined back" onClick={goBack}>
                keyboard_backspace
              </span>
              <div className="login-title">Login</div>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-form-row">
                <input
                  type="text"
                  name="usernameEmail"
                  id="usernameEmail"
                  placeholder="Email or Username"
                  autoComplete="off"
                  onChange={handleChange}
                />
                <label htmlFor="usernameEmail">Email or Username</label>
              </div>
              <div className="login-form-row">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="login-form-button">
                <button type="submit">login</button>
              </div>
              <span className="have-account">
                Don't have an account?
                <Link className="to-login" to="/registration">
                  Sign Up
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
