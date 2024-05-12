import React, { useEffect, useRef, useState, useMemo } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, Link } from "react-router-dom";
import { cards } from "../../data";
import { useGigContext } from "../../gigContext";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  // const minRef = useRef();
  // const maxRef = useRef();
  const { selectedGigId, setSelectedGigId } = useGigContext();
  const location = useLocation();

  const { search } = useLocation();

  const urlSearchParams = new URLSearchParams(search);
  const category = urlSearchParams.get("cat");

  const matchingCard = cards.find((card) => card.title === category);

  const matchingGigs = useMemo(() => {
    const gigInfoArray = JSON.parse(localStorage.getItem("gigInfoArray")) || [];

    // Ensure that category is defined
    if (!category) {
      return [];
    }

    return gigInfoArray.filter(
      (gig) => gig.category.toLowerCase() === category.toLowerCase()
      // gig.price >= minPrice &&
      // gig.price <= maxPrice
    );
  }, [category, location.state]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(`/gigs?cat=${encodeURIComponent(category)}`)
        .then((res) => {
          return res.data;
        }),
  });

  // console.log(selectedGigId)
  // console.log(matchingGigs)
  // console.log(data);

  // const gigId = data?.prototype;
  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };
  function capitalizeFirstLetter(str) {
    // Check if the input is a valid string
    if (typeof str !== "string" || str.length === 0) {
      return str;
    }

    // Capitalize the first letter and concatenate the rest of the string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/" className="link">
            Fiverr
          </Link>{" "}
          {">"} {category} {">"}
        </span>
        <h1>
          {matchingCard ? matchingCard.title : capitalizeFirstLetter(category)}
        </h1>
        <p>{matchingCard?.desc}</p>
        <div className="menu">
          {/* <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div> */}
          {/* <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div> */}
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : // :matchingGigs.map((gig) => <GigCard key={gig._id} item={gig} itemID={selectedGigId}/>)}
            matchingGigs.length > 0
            ? matchingGigs.map((gig) => (
                <GigCard key={gig._id} item={gig} itemID={gig._id} />
              ))
            : `No Gigs related to ${capitalizeFirstLetter(category)}`}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
