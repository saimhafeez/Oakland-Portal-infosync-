import React, { useState } from "react";
import "./extraction.css";
import extractImages from "../res/Extraction.json";

import CancelIcon from "@mui/icons-material/Cancel";

const Demo = () => {
  const [allImages, setAllImages] = useState(extractImages.images);
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const [selectedDimentional, setSelectedDimentional] = useState([]);
  const [selectedOrdinary, setSelectedOrdinary] = useState([]);

  const [selectedDiscard, setSelectedDiscard] = useState([]);
  const [imageSelectedIds, setImageSelectedIds] = useState([]);
  // const [jsonFormData, setJsonFormData] = useState("")

  // state for disable button
  const [isThumbnailButtonDisabled, setIsThumbnailButtonDisabled] =
    useState(false);
  const [isDimensionalButtonDisabled, setIsDimensionalButtonDisabled] =
    useState(false);

  const [isOrdinaryButtonDisabled, setIsOrdinaryButtonDisabled] =
    useState(false);
  const [isDiscardButtonDisabled, setIsDiscardButtonDisabled] = useState(false);
  // state for again not selectoed any images once map
  const [hasThumbnailImagesMapped, setHasThumbnailImagesMapped] =
    useState(false);
  const [hasDimensionalImagesMapped, setHasDimensionalImagesMapped] =
    useState(false);
  const [hasOrdinaryImagesMapped, setHasOrdinaryImagesMapped] = useState(false);
  const [hasDiscardImagesMapped, setHasDiscardImagesMapped] = useState(false);

  // for show button
  const [selectedImage, setSelectedImage] = useState(null);

  // again edit or save images
  const [isThumbnailEditMode, setIsThumbnailEditMode] = useState(false);
  const [isDimensionalEditMode, setIsDimensionalEditMode] = useState(false);
  const [isOrdinarylEditMode, setIsOrdinarylEditMode] = useState(false);
  const [isDiscardlEditMode, setIsDiscardlEditMode] = useState(false);
  // for drag
  const [draggedImage, setDraggedImage] = useState(null);
  const [targetCategory, setTargetCategory] = useState("");

  // Function to handle the drag start event
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("imageId", item.id);
    setDraggedImage(item);
  };

  // Function to handle the drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle the drop event
  const handleDrop = (e, category) => {
    e.preventDefault();
    const imageId = e.dataTransfer.getData("imageId");

    // Update the target category and move the image
    setTargetCategory(category);

    // Depending on the target category, update the state accordingly
    if (category === "Thumbnail") {
      setSelectedThumbnail([...selectedThumbnail, imageId]);
    } else if (category === "Dimensional") {
      setSelectedDimentional([...selectedDimentional, imageId]);
    } else if (category === "Ordinary") {
      setSelectedOrdinary([...selectedOrdinary, imageId]);
    } else if (category === "Discard") {
      setSelectedDiscard([...selectedDiscard, imageId]);
    }
  };

  // Function to handle the drag end event
  const handleDragEnd = () => {
    setDraggedImage(null);
    setTargetCategory("");
  };

  const editImages = (section) => {
    switch (section) {
      case "Thumbnail":
        setIsThumbnailEditMode(!isThumbnailEditMode);

        break;
      case "Dimensional":
        setIsDimensionalEditMode(!isDimensionalEditMode);
        break;
      case "Ordinary":
        setIsOrdinarylEditMode(!isOrdinarylEditMode);
        break;
      case "Discard":
        setIsDiscardlEditMode(!isDiscardlEditMode);
        break;
      default:
        // Handle the default case or any other sections if needed
        break;
    }
  };

  // Enable/disable buttons based on the selected button
  const handleButtonClick = (buttonName) => {
    if (buttonName === "Thumbnail") {
      setIsThumbnailButtonDisabled(hasThumbnailImagesMapped);
    } else if (buttonName === "Dimensional") {
      setIsDimensionalButtonDisabled(hasDimensionalImagesMapped);
    } else if (buttonName === "Ordinary") {
      setIsOrdinaryButtonDisabled(hasOrdinaryImagesMapped);
    } else if (buttonName === "Discard") {
      setIsDiscardButtonDisabled(hasDiscardImagesMapped);
    }

    setSelectedButton(buttonName);
    setIsThumbnailButtonDisabled(
      buttonName === "Thumbnail" || selectedThumbnail.length > 0
    );
    setIsDimensionalButtonDisabled(
      buttonName === "Dimensional" || selectedDimentional.length > 0
    );
    setIsOrdinaryButtonDisabled(
      buttonName === "Ordinary" || selectedOrdinary.length > 0
    );
    setIsDiscardButtonDisabled(
      buttonName === "Discard" || selectedDiscard.length > 0
    );
  };

  // reset function for thumbnail
  const resetThumbnailImage = (item) => {
    // Reset selected thumbnail images
    setSelectedThumbnail([]);
    setAllImages((prevImages) => [...prevImages, item]);
    setIsThumbnailButtonDisabled(hasThumbnailImagesMapped);

    // Disable the edit mode for thumbnail images
    // setIsThumbnailEditMode(false);

    // Clear the selected image IDs
    setImageSelectedIds([]);

    // Reset the flag indicating that thumbnail images have been mapped
    setHasThumbnailImagesMapped(false);
  };
  // reset function for dimensional
  const resetDimensionalImage = (item) => {
    // Reset selected dimensional images
    setSelectedDimentional(
      selectedDimentional.filter((img) => img.id !== item.id)
    );
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDimensionalEditMode(false);
    setImageSelectedIds([]);
    setHasDimensionalImagesMapped(false);
  };

  // reset function of ordinary
  const resetOrdinaryImages = (item) => {
    setSelectedOrdinary(selectedOrdinary.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsOrdinarylEditMode(false);
    setImageSelectedIds([]);
    setHasOrdinaryImagesMapped(false);
  };

  const resetDiscardImage = (item) => {
    setSelectedDiscard(selectedDiscard.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDiscardlEditMode(false);
    setImageSelectedIds([]);
    setHasDiscardImagesMapped(false);
  };

  // Save images fucntion
  const saveImages = () => {
    setIsThumbnailEditMode(false);

    setIsDimensionalEditMode(false);
    setIsOrdinarylEditMode(false);

    setIsDiscardlEditMode(false);
  };

  const selectMyItem = (item) => {
    setSelectedImage(item);
    if (selectedButton === "Thumbnail") {
      if (!hasThumbnailImagesMapped) {
        // Allow selection of thumbnail images only if they haven't been mapped
        if (imageSelectedIds.includes(item)) {
          setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
        } else {
          setImageSelectedIds([item]);
        }
      }
    } else if (selectedButton === "Dimensional") {
      if (!hasDimensionalImagesMapped) {
        // Allow selection of dimensional images only if they haven't been mapped
        if (imageSelectedIds.includes(item)) {
          setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
        } else {
          // setImageSelectedIds([item]);
          setImageSelectedIds([...imageSelectedIds, item]);
        }
      }
    } else if (selectedButton === "Ordinary") {
      if (!hasOrdinaryImagesMapped) {
        // Allow selection of ordinary images only if they haven't been mapped
        if (imageSelectedIds.includes(item)) {
          setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
        } else {
          // setImageSelectedIds([item]);
          setImageSelectedIds([...imageSelectedIds, item]);
        }
      }
    } else if (selectedButton === "Discard") {
      if (!hasDiscardImagesMapped) {
        // Allow selection of discard images only if they haven't been mapped
        if (imageSelectedIds.includes(item)) {
          setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
        } else {
          setImageSelectedIds([...imageSelectedIds, item]);
        }
      }
    }
  };

  // logic of submit button for show and delete images

  const submitData = () => {
    if (selectedButton === "Thumbnail") {
      setHasThumbnailImagesMapped(true);
      setImageSelectedIds([]);
    } else if (selectedButton === "Dimensional") {
      setHasDimensionalImagesMapped(true);
      setImageSelectedIds([]);
    } else if (selectedButton === "Ordinary") {
      setHasOrdinaryImagesMapped(true);
      setImageSelectedIds([]);
    } else if (selectedButton === "Discard") {
      setHasDiscardImagesMapped(true);
      setImageSelectedIds([]);
    }
    if (selectedButton === "") {
      return;
    }

    if (selectedButton === "Thumbnail" && selectedThumbnail.length == 0) {
      setImageSelectedIds(imageSelectedIds.filter((id) => id == id));
      setSelectedThumbnail(imageSelectedIds);
    } else if (selectedButton === "Dimensional") {
      setSelectedDimentional([...selectedDimentional, ...imageSelectedIds]);
    } else if (selectedButton === "Ordinary") {
      setSelectedOrdinary([...selectedOrdinary, ...imageSelectedIds]);
    } else if (selectedButton === "Discard") {
      setSelectedDiscard([...selectedDiscard, ...imageSelectedIds]);
    }

    setAllImages(allImages.filter((itm) => !imageSelectedIds.includes(itm)));

    setImageSelectedIds([]);
  };

  // convert sorted data into json form

  const jsonData = () => {
    if (selectedThumbnail.length > 0) {
      const json = JSON.stringify(selectedThumbnail);
      console.log("Selected Thumbnail=:", json + "\n");
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
    <div>
      {/* header section  */}
      <div className="header">
        <div className="container">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-lg-2 col-md-4">
              <h3>Extract</h3>
            </div>
            <div className="col-lg-8 col-md-4 offset-1 offset-md-0">
              <div className="search-box d-flex align-items-center justify-content-between">
                <i className="fa fa-search"></i>
                <input type="text" placeholder="Search url..." />
              </div>
            </div>
            <div className="col-lg-2 col-md-4 text-end">
              <button className="btn">Fetch API</button>
            </div>
          </div>
        </div>
      </div>

      {/* radio selector  */}
      <div className="container mt-5">
        <button
          onClick={() => handleButtonClick("Thumbnail")}
          className={`select-btn btn ${
            selectedButton === "Thumbnail" ? "active-button" : ""
          }`}
          disabled={isThumbnailButtonDisabled}
        >
          Thumbnail
        </button>

        <button
          onClick={() => handleButtonClick("Dimensional")}
          className={`select-btn btn ${
            selectedButton === "Dimensional" ? "active-button" : ""
          }`}
          disabled={isDimensionalButtonDisabled}
        >
          Dimensional
        </button>

        <button
          onClick={() => handleButtonClick("Ordinary")}
          className={`select-btn btn btn-equ ${
            selectedButton === "Ordinary" ? "active-button" : ""
          }`}
          disabled={isOrdinaryButtonDisabled}
        >
          Ordinary
        </button>

        <button
          onClick={() => handleButtonClick("Discard")}
          className={`select-btn btn btn-equ ${
            selectedButton === "Discard" ? "active-button" : ""
          }`}
          disabled={isDiscardButtonDisabled}
        >
          Discard
        </button>
      </div>

      {/* all images map in ui  */}

      <div className="container mt-4 ">
        <div className="row">
          {allImages.map((item) => (
            <div className="col-md-3 mb-4 " key={item.id}>
              <div
                className={`card img-fluid ${
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
        <button onClick={submitData} className="btn btn-primary submit">
          Submit
        </button>
      </div>

      <h2 className="text-center mb-5">Sorted Data</h2>

      <div className="container-fluid py-3 thumbnail-bg">
        <div className="container">
          <div className="row">
            <div className="main-div d-flex align-items-center ">
              <div className="col-lg-1">
                <h2 className="mb-3">Thumbnail</h2>
              </div>

              <div className="col-lg-2 all-btns">
                {selectedThumbnail.length > 0 && selectedImage && (
                  <div className="row">
                    <div className="col-lg-9 mb btn-click all-btn ">
                      <button onClick={saveImages} className="btn me-3 edit">
                        Save
                      </button>
                      <button
                        onClick={() => editImages("Thumbnail")}
                        className="btn save"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedThumbnail.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div
                  className={`card ${isThumbnailEditMode ? "edit-mode" : ""}`}
                  onClick={() => selectMyItem(item)}
                >
                  {isThumbnailEditMode && (
                    <div
                      className="cross"
                      onClick={() => resetThumbnailImage(item)}
                    >
                      <CancelIcon></CancelIcon>
                    </div>
                  )}
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
            {selectedDimentional.length > 0 && selectedImage && (
              <div className="row">
                <div className="col-lg-9 mb btn-click all-btn ">
                  <button onClick={saveImages} className="btn me-3 edit">
                    Save
                  </button>
                  <button
                    onClick={() => editImages("Dimensional")}
                    className="btn save"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            <h2 className="mb-3">Dimensional</h2>
            {selectedDimentional.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div
                  className={`card ${isDimensionalEditMode ? "edit-mode" : ""}`}
                  onClick={() => selectMyItem(item)}
                >
                  {isDimensionalEditMode && (
                    <div
                      className="cross"
                      onClick={() => resetDimensionalImage(item)}
                    >
                      <CancelIcon />
                    </div>
                  )}
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
      <div className="container-fluid py-3 ordinary-b">
        <div className="container">
          <div className="row">
            {selectedOrdinary.length > 0 && selectedImage && (
              <div className="row">
                <div className="col-lg-9 mb btn-click all-btn ">
                  <button onClick={saveImages} className="btn me-3 edit">
                    Save
                  </button>
                  <button
                    onClick={() => editImages("Ordinary")}
                    className="btn save"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            <h2 className="mb-3">Ordinary</h2>
            {selectedOrdinary.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div
                  className={`card ${isOrdinarylEditMode ? "edit-mode" : ""}`}
                  onClick={() => selectMyItem(item)}
                >
                  {isOrdinarylEditMode && (
                    <div
                      className="cross"
                      onClick={() => resetOrdinaryImages(item)}
                    >
                      <CancelIcon />
                    </div>
                  )}
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

      <div className="container-fluid py-3 discard-bg">
        <div className="container">
          <div className="row">
            {selectedDiscard.length > 0 && selectedImage && (
              <div className="row">
                <div className="col-lg-9 mb btn-click all-btn ">
                  <button onClick={saveImages} className="btn me-3 edit">
                    Save
                  </button>
                  <button
                    onClick={() => editImages("Discard")}
                    className="btn save"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            <h2 className="mb-3">Discard</h2>
            {selectedDiscard.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div
                  className={`card ${isDiscardlEditMode ? "edit-mode" : ""}`}
                  onClick={() => selectMyItem(item)}
                >
                  {isDiscardlEditMode && (
                    <div
                      className="cross"
                      onClick={() => resetDiscardImage(item)}
                    >
                      <CancelIcon />
                    </div>
                  )}
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
  );
};

export default Demo;
