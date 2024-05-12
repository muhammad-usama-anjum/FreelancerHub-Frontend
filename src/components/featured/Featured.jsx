import React, { useState } from "react";
import "./Featured.scss";
import { Link, useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?cat=${encodeURIComponent(input)}`);
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue);

    // // Check if the input matches any category
    // const matchingCategory = getCategoryMatch(inputValue);
    // if (matchingCategory) {
    //   navigate(`/gigs?cat=${encodeURIComponent(matchingCategory)}`);
    // }
  };
  const handleSearch = () => {
    // Check if the input matches any category
    const matchingCategory = getCategoryMatch(input);
    if (matchingCategory) {
      navigate(`/gigs?cat=${encodeURIComponent(matchingCategory)}`);
    } else {
      alert(`No gigs related to "${input}"`);
    }
  };
  const getCategoryMatch = (input) => {
    const categories = [
      "Graphics and Design",
      "Digital Marketing",
      "Writing and Translation",
      "Video and Animation",
      "Music and Audio",
      "Programming and Tech",
      "Data",
      "Business",
      "Lifestyle",
      "Photography",
    ];

    const matchingCategory = categories.find((category) =>
      new RegExp(input, "i").test(category)
    );

    return matchingCategory;
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder='Try "digital marketing"'
                value={input}
                onChange={handleInputChange}
              />
            </div>
            {input ? <button onClick={handleSearch}>Search</button> : <button>Search</button>}
          </div>
          <div className="popular">
            <span>Popular:</span>
            <Link className="link menuLink" to="/gigs?cat=Digital%20Marketing"><button>Digital Marketing</button></Link>
            <Link className="link menuLink" to="/gigs?cat=Business"><button>Business</button></Link>
            <Link className="link menuLink" to="/gigs?cat=Lifestyle"><button>Lifestyle</button></Link>
            <Link className="link menuLink" to="/gigs?cat=Programming%20and%20Tech"><button>Programming And Tech</button></Link>
          </div>
        </div>
        <div className="right">
          <img src="./img/hero.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;