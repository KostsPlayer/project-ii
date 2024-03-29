import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  axios.defaults.withCredentials = true;
  const [active, setActive] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const redirect = useNavigate();

  const handleItemClick = (index) => {
    setActive(index);
    console.log("Clicked index:", index);
  };

  const fetchDataMenu = () => {
    axios
      .get("https://project-ii-server.vercel.app/menu")
      .then((res) => {
        setDataMenu(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchDataMenu();
  }, [dataMenu]);

  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
  const getImageUrl = JSON.parse(localStorage.getItem("imageUrl"));

  useEffect(() => {
    setDataUser({
      name: getLocalStorage.dataUser.name,
      email: getLocalStorage.dataUser.email,
      images: getImageUrl.imageUrl.publicUrl,
    });
  }, [getLocalStorage, getImageUrl]);

  const logout = () => {
    localStorage.setItem("logoutMessage", "Logged out successfully!");
    localStorage.removeItem("dataUser");
    localStorage.removeItem("session");
    localStorage.removeItem("imageUrl");
    redirect("/login");
  };

  return (
    <>
      <div className="sidebar-header">
        <Link className="logo" to="/">
          Shopionz
        </Link>
      </div>
      <div className="sidebar-menu">
        {dataMenu.map((item, index) => (
          <div
            key={index}
            className={`container-menu ${active === index ? "active" : ""}`}
            onClick={() => handleItemClick(index)}
          >
            {item.is_active === true ? (
              <Link to={`/${item.url}`} className="menu">
                <span className={`material-symbols-outlined`}>{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="image">
          <img className="image-user" src={dataUser.images} alt="profile" />
        </div>
        <div className="user">
          <div className="user-name">{dataUser.name}</div>
          <div className="user-email">{dataUser.email}</div>
        </div>
        <div className="logout">
          <span className="material-symbols-outlined" onClick={logout}>
            logout
          </span>
        </div>
      </div>
    </>
  );
}
