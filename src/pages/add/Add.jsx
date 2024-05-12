import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const storeGigInfo = (gigInfo) => {
    // Retrieve the existing gig information array from local storage
    const gigInfoArray = JSON.parse(localStorage.getItem("gigInfoArray")) || [];

    gigInfoArray.push(gigInfo);

    localStorage.setItem("gigInfoArray", JSON.stringify(gigInfoArray));
  };
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      toast.success("Uploaded successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      // return newRequest.post("/gigs", gig);

      // console.log(gigInfo);
      // Continue with the rest of your mutation function

      return newRequest.post("/gigs", gig).then((res) => {
        storeGigInfo({ ...res.data, category: gig.cat.toLowerCase() });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    toast.success("Gig created successfully!");
    setTimeout(() => navigate("/mygigs"), 2000);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        {/* <form action="" onSubmit={handleSubmit}> */}
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              required
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select required name="cat" id="cat" onChange={handleChange}>
              <option value="graphics and design">Graphics and Design</option>
              <option value="digital marketing">Digital Marketing</option>
              <option value="writing and translation">
                Writing and Translation
              </option>
              <option value="video and animation">Video and Animation</option>
              <option value="music and audio">Music and Audio</option>
              <option value="programming and tech">Programming and Tech</option>
              <option value="data">Data</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="photography">Photography</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  required
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading..." : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              required
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button type="submit" onClick={handleSubmit}>
              Create
            </button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              required
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              required
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input
              required
              type="number"
              name="deliveryTime"
              onChange={handleChange}
            />
            <label htmlFor="">Revision Number</label>
            <input
              required
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>

            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" required />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              required
              type="number"
              onChange={handleChange}
              name="price"
            />
          </div>
        </div>
        {/* </form> */}
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Add;
