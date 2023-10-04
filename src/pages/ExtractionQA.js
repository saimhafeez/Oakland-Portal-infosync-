import React, { useState } from "react";
import "./extraction.css";
import extractImages from "../res/Extraction.json";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import HeaderSignOut from "../components/header/HeaderSignOut";

const ExtractionQA = (props) => {
  const [allImages, setAllImages] = useState(extractImages.images);
  const [selectedRadio, setSelectedRadio] = useState("");

  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const [selectedDimentional, setSelectedDimentional] = useState([]);
  const [selectedOrdinary, setSelectedOrdinary] = useState([]);
  const [selectedDiscard, setSelectedDiscard] = useState([]);
  // const [submitButton, setSubmutButton] = useState([]);
  const [imageSelectedIds, setImageSelectedIds] = useState([]);
  // const [jsonFormData, setJsonFormData] = useState = ([])

  // select images function

  const selectMyItem = (item) => {
    if (selectedRadio === "Thumbnail") {
      setImageSelectedIds([item]);

      const images = document.querySelectorAll(".card img");
      images.forEach((img) => img.classList.remove("selected-image"));

      const clickedImage = document.querySelector(`#img-${item.id}`);
      if (clickedImage) {
        clickedImage.classList.add("selected-image");
      }
    } else {
      if (imageSelectedIds.includes(item)) {
        setImageSelectedIds(imageSelectedIds.filter((id) => id !== item.id));
      } else {
        setImageSelectedIds([...imageSelectedIds, item]);
      }
    }
  };

  // logic of submit button for show and delete images

  const submitData = () => {
    if (selectedRadio === "") {
      return;
    }

    if (selectedRadio === "Thumbnail" && selectedThumbnail.length == 0) {
      setImageSelectedIds(imageSelectedIds.filter((id) => id == id));
      setSelectedThumbnail(imageSelectedIds);
    } else if (selectedRadio === "Dimensional") {
      setSelectedDimentional([...selectedDimentional, ...imageSelectedIds]);
    } else if (selectedRadio === "Ordinary") {
      setSelectedOrdinary([...selectedOrdinary, ...imageSelectedIds]);
    } else if (selectedRadio === "Discard") {
      setSelectedDiscard([...selectedDiscard, ...imageSelectedIds]);
    }

    setAllImages(allImages.filter((itm) => !imageSelectedIds.includes(itm)));

    setImageSelectedIds([]);
  };

  // convert sorted data into json form

  const jsonData = () => {
    if (selectedThumbnail.length > 0) {
      const json = JSON.stringify(selectedThumbnail);
      console.log("Thumbnail Images:", json + "\n");
    }

    if (selectedDimentional.length > 0) {
      const json = JSON.stringify(selectedDimentional);
      console.log("Selected Dimensional:", json + "\n");
    }

    if (selectedDiscard.length > 0) {
      const json = JSON.stringify(selectedDiscard);
      console.log("Selected Discard:", json + "\n");
    }

    if (selectedOrdinary.length > 0) {
      const json = JSON.stringify(selectedOrdinary);
      console.log("Selected Ordinary:", json + "\n");
    }
  };

  return (
    <>
      <HeaderSignOut
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
      />

      <div className="set-right-container">
        {/* header section  */}
        <div className="header">
          <div className="container">
            <div className="row d-flex align-items-center justify-content-between">
              <div className="col-lg-2 col-md-4">
                <h3>Extract</h3>
              </div>
              <div className="col-lg-6 col-md-4 offset-1 offset-md-0">
                <div className="search-box d-flex align-items-center justify-content-between">
                  <i className="fa fa-search"></i>
                  <input type="text" placeholder="Search url..." />
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <button className="btn">Fetch API</button>
              </div>
            </div>
          </div>
        </div>

        {/* radio selector  */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-3">
              <input
                type="radio"
                name="radioGroup"
                id="radio1"
                onClick={() => setSelectedRadio("Thumbnail")}
              />
              <span className="ps-2">Thumbnail</span>
            </div>
            <div className="col-lg-3">
              <input
                type="radio"
                name="radioGroup"
                id="radio2"
                onClick={() => setSelectedRadio("Dimensional")}
              />
              <span className="ps-2">Dimensional</span>
            </div>
            <div className="col-lg-3">
              <input
                type="radio"
                name="radioGroup"
                id="radio3"
                onClick={() => setSelectedRadio("Ordinary")}
              />
              <span className="ps-2">Ordinary</span>
            </div>
            <div className="col-lg-3">
              <input
                type="radio"
                name="radioGroup"
                id="radio4"
                onClick={() => setSelectedRadio("Discard")}
              />
              <span className="ps-2">Discard</span>
            </div>
          </div>
        </div>

        {/* all images map in ui  */}

        <div className="container mt-4 ">
          <div className="row">
            {allImages.map((item) => (
              <div className="col-md-3 mb-4 " key={item.id}>
                <div
                  className={` card p-2 card-img-top img-fluid  ${
                    imageSelectedIds.includes(item) ? "selected-image" : ""
                  }`}
                  onClick={() => selectMyItem(item)}
                >
                  <img src={item.url} alt={item.alt} id={`img-${item.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* submit button  */}
        <div className="col-lg-10 col-md-4 text-end">
          <button onClick={submitData} className="btn btn-primary">
            Submit
          </button>
        </div>

        <h2 className="text-center mb-5">Sorted Data</h2>

        {/* thumbnail images section   */}
        <div className="container-fluid thumbnail-bg py-3">
          <div className="container ">
            <div className="row">
              <h2 className="mb-3">Thumbnail</h2>
              {selectedThumbnail.map((item) => (
                <div className="col-md-3 mb-4 " key={item.id}>
                  <div
                    className="card p-2 thumbnail-card"
                    onClick={() => selectMyItem(item)}
                  >
                    <img
                      className="card-img-top img-fluid"
                      src={item.url}
                      alt={item.alt}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* dimentional images section  */}
        <div className="container-fluid py-3 dimensnal-bg">
          <div className="container">
            <div className="row">
              <h2 className="mb-3">Dimensional</h2>
              {selectedDimentional.map((item) => (
                <div className="col-md-3 mb-4" key={item.id}>
                  <div className="card p-2" onClick={() => selectMyItem(item)}>
                    <img
                      className="card-img-top img-fluid"
                      src={item.url}
                      alt={item.alt}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ordinary images section  */}
        <div className="container-fluid  py-3 ordinary-bg">
          <div className="container ">
            <div className="row">
              <h2 className="mb-3">Ordinary</h2>
              {selectedOrdinary.map((item) => (
                <div className="col-md-3 mb-4" key={item.id}>
                  <div className="card p-2" onClick={() => selectMyItem(item)}>
                    <img
                      className="card-img-top img-fluid"
                      src={item.url}
                      alt={item.alt}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* discard images section  */}

        <div className="container-fluid  py-3 discard-bg">
          <div className="container">
            <div className="row">
              <h2 className="mb-3">Discard</h2>
              {selectedDiscard.map((item) => (
                <div className="col-md-3 mb-4" key={item.id}>
                  <div className="card p-2" onClick={() => selectMyItem(item)}>
                    <img
                      className="card-img-top img-fluid"
                      src={item.url}
                      alt={item.alt}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* sorted data into json form  */}

        <div className="col-lg-10 col-md-4 text-end mt-4 mb-5">
          <button onClick={jsonData} className=" btn-danger">
            Sorted Data in Json
          </button>
        </div>

        <footer>
          <div className="col-lg-12">
            <div className="footer-left">
              <p>@InfoSync LTD 2015 All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ExtractionQA;
