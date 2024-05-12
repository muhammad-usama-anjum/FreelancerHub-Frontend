import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // useEffect(()=>{
  //   const toggleOpen = ()=>{
  //     setOpen(false)
  //   }
  //   window.addEventListener("mousedown",toggleOpen);
  //   toggleOpen();

  //   return ()=>window.removeEventListener("mousedown",toggleOpen)
  // },[])
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Freelancing Website</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <span>Freelance Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Seller</span>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noAvatar.png"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link
              className="link menuLink"
              to="/gigs?cat=Graphics%20and%20Design"
            >
              Graphics & Design
            </Link>
            <Link
              className="link menuLink"
              to="/gigs?cat=Video%20and%20Animation"
            >
              Video & Animation
            </Link>
            <Link
              className="link menuLink"
              to="/gigs?cat=Writing%20and%20Translation"
            >
              Writing & Translation
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Data">
              Data
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Digital%20Marketing">
              Digital Marketing
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Music%20and%20Audio">
              Music & Audio
            </Link>
            <Link
              className="link menuLink"
              to="/gigs?cat=Programming%20and%20Tech"
            >
              Programming & Tech
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Business">
              Business
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Lifestyle">
              Lifestyle
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
