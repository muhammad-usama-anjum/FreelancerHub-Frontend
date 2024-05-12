import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { gigs } from "../../data";
import { useGigContext } from "../../gigContext";

function MyGigs() {
  const { setSelectedGigId } = useGigContext();

  const currentUser = getCurrentUser();

  const [deletedGigId, setDeletedGigId] = useState(null);

  useEffect(() => {
    if (deletedGigId) {
      // Remove the deleted gig from the local storage array
      const updatedGigInfoArray = (
        JSON.parse(localStorage.getItem("gigInfoArray")) || []
      ).filter((gig) => gig._id !== deletedGigId);
      localStorage.setItem("gigInfoArray", JSON.stringify(updatedGigInfoArray));

      // Reset the deletedGigId to null
      setDeletedGigId(null);
    }
  }, [deletedGigId]);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  // console.log(data);
  const gigInfoArray = JSON.parse(localStorage.getItem("gigInfoArray")) || [];

  // useEffect(()=>{
  //   localStorage.setItem("gigInfoArray", null);
  //   console.log(localStorage)
  //   console.log(gigInfoArray)
  // })

  const mutation = useMutation({
    // mutationFn: (id) => {
    //   return newRequest.delete(`/gigs/${id}`);
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["myGigs"]);
    // },
    mutationFn: async (id) => {
      // Delete the gig on the server
      await newRequest.delete(`/gigs/${id}`);

      // Remove the deleted gig from the local storage array
      // const updatedGigInfoArray = (JSON.parse(localStorage.getItem("gigInfoArray")) || []).filter(gig => gig._id !== id);
      const updatedGigInfoArray = gigInfoArray.filter((gig) => gig._id !== id);
      // console.log(gigs)
      localStorage.setItem("gigInfoArray", JSON.stringify(updatedGigInfoArray));

      // Return the id to be used by onSuccess
      return id;
    },
    onSuccess: (id) => {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries(["myGigs"]);
      setDeletedGigId(id);
      // toast.success("Gig deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting gig:", error);
      toast.error("Error deleting gig. Please try again.");
    },
  });

  // console.log(gigInfoArray);

  const handleDelete = (id) => {
    mutation.mutate(id);
    toast.success("Gig deleted successfuly!");
  };

  const handleImageClick = (gigId) => {
    // Navigate to the Gig page when the image is clicked
    setSelectedGigId(gigId);
    navigate(`/gig/${gigId}`);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img
                    className="image"
                    src={gig.cover}
                    alt=""
                    onClick={() => handleImageClick(gig._id)}
                  />
                </td>
                <td>{gig.title}</td>
                <td>{gig.price}</td>
                <td>{gig.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default MyGigs;
