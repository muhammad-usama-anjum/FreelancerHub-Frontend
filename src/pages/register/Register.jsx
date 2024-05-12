import React, { useEffect, useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "../../data";

function Register() {
  const [file, setFile] = useState(null);
  const [focus, setFocus] = useState(false);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [pwdMatchFocus, setPwdMatchFocus] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name === "country") {
    //   // Update the country state with the selected country
    //   setCountry(value);

    //   // Get the dial code of the selected country
    //   const selectedCountry = countries.find((item) => item.name === value);
    //   if (selectedCountry) {
    //     setCountryCode(selectedCountry.dial_code);
    //   }
    // } else {
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    } else if (name === "confirmPassword") {
      validateConfirmPassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    setPasswordValid(passwordRegex.test(password));
  };

  const validateConfirmPassword = (confirmPassword) => {
    setConfirmPasswordValid(confirmPassword === user.password);
  };

  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      toast.success("User registered successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="username">Username</label>
          <input
            required
            name="username"
            type="text"
            placeholder="Adnan"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            required
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <label htmlFor="password">Password</label>
            {focus &&
              (passwordValid ? (
                <span>&#10003; Password is valid</span>
              ) : (
                <div>
                  &#10006; Password should be at least 8 characters, must
                  include 1 capital letter and 1 number
                </div>
              ))}
            <input
              required
              name="password"
              type="password"
              onChange={handleChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          {pwdMatchFocus &&
            (confirmPasswordValid ? (
              <span>&#10003; Passwords match</span>
            ) : (
              <div>&#10006; Passwords do not match</div>
            ))}
          <input
            required
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            onFocus={() => setPwdMatchFocus(true)}
            onBlur={() => setPwdMatchFocus(false)}
          />
          <label htmlFor="file">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          {/* <label htmlFor="country">Country</label>

          <select
            name="country"
            id="country"
            onChange={handleChange}
            style={{ padding: "13px", fontSize: "20px" }}
            required
          >
            <option value="">Choose Your Country</option>
            {countries.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))}
          </select> */}
          <label htmlFor="">Country</label>
          <input
            required
            name="country"
            type="text"
            placeholder="Pakistan"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="seller">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>

          <label htmlFor="phone">Phone Number</label>
          <input
            required
            name="phone"
            type="number"
            placeholder={`${countryCode} 1234 567 890`}
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            required
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Register;
