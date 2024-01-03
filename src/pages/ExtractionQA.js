import React, { useEffect, useState } from "react";
import "./extraction.css";
import CancelIcon from "@mui/icons-material/Cancel";
import HeaderSignOut from "../components/header/HeaderSignOut";
import { triggerToast } from "../utils/triggerToast";

const ExtractionQA = (props) => {
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('')
  // =========================================================================

  const [allImages, setAllImages] = useState([]);
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const [selectedDimentional, setSelectedDimentional] = useState([]);
  const [selectedWhiteBg, setSelectedWhiteBg] = useState([]);
  const [selectedOrdinary, setSelectedOrdinary] = useState([]);

  const [selectedDiscard, setSelectedDiscard] = useState([]);
  const [imageSelectedIds, setImageSelectedIds] = useState([]);

  const [defaultThumbnail, setDefaultThumbnail] = useState([]);
  // / for default thumbnail state
  const [isDefaultThumbnailEditMode, setIsDefaultThumbnailEditMode] =
    useState(false);

  // for default Dimesniuon  state
  const [defaultDimension, setDefaultDimension] = useState([]);

  const [isDefaultDimensionEditMode, setIsDefaultDimensionEditMode] =
    useState(false);

  // =========================================================================
  // default WhiteBG section
  const [defaultWhiteBg, setDefaultWhiteBg] = useState([]);
  const [isDefaultWhiteBgEditMode, setIsDefaultWhiteBgEditMode] =
    useState(false);
  // =========================================================================

  // =========================================================================
  // default ORDINARY section
  const [defaulOrdinary, setDefaultOrdinary] = useState([]);

  const [isDefaultOrdinaryEditMode, setIsDefaultOrdinaryEditMode] =
    useState(false);
  // =========================================================================

  // =========================================================================
  // default DISCARD section
  const [defaultDiscard, setDefaultDiscard] = useState([]);

  const [isDefaultDiscardEditMode, setIsDefaultDiscardEditMode] =
    useState(false);
  // =========================================================================

  const [sku, setSku] = useState({});
  const [videos, setVideos] = useState([]);
  const [token, setToken] = useState("");
  // const [jsonFormData, setJsonFormData] = useState("")
  const [showId, setShowId] = useState("");

  // ****************************************************
  // merge arrays
  //*****************************************************
  // SET DO ABLE TRUE OR FALSE
  const [notDoable, setNotDoable] = useState();

  // MERGE SELECTED DIMENSION AND DEFAULT DIMENSION
  const mergeSelectedDefaultThumbnail = [
    ...(selectedThumbnail || []),
    ...(defaultThumbnail || []),
  ];
  const mergeSelectedDefaultDimension = [
    ...(selectedDimentional || []),
    ...(defaultDimension || []),
  ];
  const mergeSelectedDefaultWhitebg = [
    ...(selectedWhiteBg || []), // Add selectedWhiteBg (if defined), or an empty array if it's not
    ...(defaultWhiteBg || []), // Add defaultWhiteBg (if defined), or an empty array if it's not
  ];

  // [...selectedWhiteBg, ...defaultWhiteBg];
  const mergeSelectedDefaultOrdinary = [
    ...(selectedOrdinary || []), // Add selectedWhiteBg (if defined), or an empty array if it's not
    ...(defaulOrdinary || []), // Add defaultWhiteBg (if defined), or an empty array if it's not
  ];
  // [...selectedOrdinary, ...defaulOrdinary];
  const mergeSelectedDefaultDiscard = [
    ...(selectedDiscard || []), // Add selectedWhiteBg (if defined), or an empty array if it's not
    ...(defaultDiscard || []), // Add defaultWhiteBg (if defined), or an empty array if it's not
  ];
  // [...selectedDiscard, ...defaultDiscard];

  console.log(mergeSelectedDefaultWhitebg);

  // state for disable button
  const [isThumbnailButtonDisabled, setIsThumbnailButtonDisabled] =
    useState(false);
  const [isDimensionalButtonDisabled, setIsDimensionalButtonDisabled] =
    useState(false);
  const [isWhiteBgButtonDisabled, setIsWhiteBgButtonDisabled] = useState(false);
  const [isOrdinaryButtonDisabled, setIsOrdinaryButtonDisabled] =
    useState(false);
  const [isDiscardButtonDisabled, setIsDiscardButtonDisabled] = useState(false);
  // state for again not selectoed any images once map
  const [hasThumbnailImagesMapped, setHasThumbnailImagesMapped] =
    useState(false);
  const [hasDimensionalImagesMapped, setHasDimensionalImagesMapped] =
    useState(false);
  const [hasWhiteBgImagesMapped, setHasWhiteBgImagesMapped] = useState(false);
  const [hasOrdinaryImagesMapped, setHasOrdinaryImagesMapped] = useState(false);
  const [hasDiscardImagesMapped, setHasDiscardImagesMapped] = useState(false);

  const [isFetchButtonDisabled, setIsFetchButtonDisabled] = useState(false);
  // for show button
  const [selectedImage, setSelectedImage] = useState(null);

  // again edit or save images
  const [isThumbnailEditMode, setIsThumbnailEditMode] = useState(false);
  const [isDimensionalEditMode, setIsDimensionalEditMode] = useState(false);
  const [isWhiteBgEditMode, setIsWhiteBgEditMode] = useState(false);
  const [isOrdinarylEditMode, setIsOrdinarylEditMode] = useState(false);
  const [isDiscardlEditMode, setIsDiscardlEditMode] = useState(false);

  const [visibilityNotDoable, setVisibilityNotDoable] = useState(false);

  // SET SELECT OPTION
  const [selectedOption, setSelectedOption] = useState("passed"); // Default value

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const executePythonScript = async (e) => {
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          console.log(token);
          // Define the API endpoint URL
          var apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/get_job`
          if (e.target.id === 'btn-go' && searchQuery !== '') {
            apiUrl = apiUrl + `?url=${encodeURIComponent(searchQuery)}`
          }
          setToken(token);
          // Make an authenticated API request
          fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          })
            .then((response) => response.json()) // Assuming server responds with json
            .then((data) => {
              console.log("API Response:", data);
              if (data.detail && data.detail !== "") {
                triggerToast(data.detail, "error", "50px", "top-left")
                resetAllValues()
                return
              }
              setIsFetchButtonDisabled(true);
              setAllImages(data.unsorted || []);
              setDefaultThumbnail(data.thumbnails);
              setDefaultDimension(data.dimensional);
              setDefaultWhiteBg(data.whitebg);
              setDefaultOrdinary(data.ordinary);
              setDefaultDiscard(data.discard);
              setSku(data.id);
              setVideos(data.videos);
              setShowId(data.sku);
              setNotDoable(data.not_doable);
              // NOT DO ABLE BUTTON VISIBILITY
              setVisibilityNotDoable(true);
              setSelectedOption(data.not_doable ? 'major' : 'passed')
            })
            .catch((error) => {
              resetAllValues()
              triggerToast(error.toString(), "error", "50px", "top-left")
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          // Handle any errors while getting the token
          resetAllValues()
          triggerToast(error.toString(), "error", "50px", "top-left")
          console.error("Token Error:", error);
        });
    }
  };


  const resetAllValues = () => {
    setDefaultThumbnail([]);
    setSelectedThumbnail([]);
    setDefaultDimension([]);
    setSelectedDimentional([]);
    setSelectedWhiteBg([]);
    setDefaultWhiteBg([]);
    setSelectedOrdinary([]);
    setDefaultOrdinary([]);
    setSelectedDiscard([]);
    setDefaultDiscard([]);
    setVideos([]);
    setAllImages([]);

    setHasThumbnailImagesMapped(false);
    setHasDimensionalImagesMapped(false);
    setHasWhiteBgImagesMapped(false);
    setHasOrdinaryImagesMapped(false);
    setHasDiscardImagesMapped(false);
    // Enable the other buttons
    setIsThumbnailButtonDisabled(false);
    setIsDimensionalButtonDisabled(false);
    setIsWhiteBgButtonDisabled(false);
    setIsOrdinaryButtonDisabled(false);
    setIsDiscardButtonDisabled(false);
    // ENABLE DISABLE BUTTON ON SUBMIT SORTED DATA
    setIsFetchButtonDisabled(false);
    setVisibilityNotDoable(false);
    setSearchQuery('')
  }

  // DEFAULT SECTION METHOD

  // DEFAULT THUMBNAIL SECTION
  const handleDefaultThumbnailEdit = (value) => {
    setIsDefaultThumbnailEditMode(value);
  };

  // RESET DEFAULT FUNCTIOON
  const resetDefaultThumbnail = (item) => {
    // Find the index of the selected item in the defaultThumbnail array
    const itemIndex = defaultThumbnail.findIndex(
      (image) => image.id === item.id
    );

    if (itemIndex !== -1) {
      // Create a copy of the defaultThumbnail array
      const updatedDefaultThumbnail = [...defaultThumbnail];

      // Remove the selected item from the copy
      updatedDefaultThumbnail.splice(itemIndex, 1);

      // Update the defaultThumbnail state with the updated array
      setDefaultThumbnail(updatedDefaultThumbnail);

      // Optionally, you can add the selected item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // DEFAULT DIMESNIO  IMAGES
  // DIMSINAL FUNTION
  const handleDefaultDimensionEdit = (editMode) => {
    setIsDefaultDimensionEditMode(editMode);
  };

  const resetDefaultDimension = (item) => {
    // Clone the current defaultDimension state
    const updatedDefaultDimension = [...defaultDimension];

    // Find the index of the item to remove from the defaultDimension array
    const itemIndex = updatedDefaultDimension.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      updatedDefaultDimension.splice(itemIndex, 1);

      // Set the updated state for defaultDimension
      setDefaultDimension(updatedDefaultDimension);

      // Add the removed item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // DEFAULT White backgournd IMAGES
  // DIMSINAL FUNTION
  const handleDefaulWhiteBgtEdit = (editMode) => {
    setIsDefaultWhiteBgEditMode(editMode);
  };

  const resetDefaultWhiteBg = (item) => {
    // Clone the current defaultDimension state
    const updatedWhiteBg = [...defaultWhiteBg];

    // Find the index of the item to remove from the defaultDimension array
    const itemIndex = updatedWhiteBg.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      updatedWhiteBg.splice(itemIndex, 1);

      // Set the updated state for defaultDimension
      setDefaultWhiteBg(updatedWhiteBg);

      // Add the removed item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // DEFAULT  Ordinary  backgournd IMAGES
  // DIMSINAL FUNTION
  const handleDefaulOrdinaryEdit = (editMode) => {
    setIsDefaultOrdinaryEditMode(editMode);
  };

  const resetDefaultOrdinary = (item) => {
    // Clone the current defaultDimension state
    const updatedOrdinary = [...defaulOrdinary];

    // Find the index of the item to remove from the defaultDimension array
    const itemIndex = updatedOrdinary.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      updatedOrdinary.splice(itemIndex, 1);

      // Set the updated state for defaultDimension
      setDefaultOrdinary(updatedOrdinary);

      // Add the removed item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // DEFAULT  DISCARD  backgournd IMAGES
  // DIMSINAL FUNTION
  const handleDefaulDiscardEdit = (editMode) => {
    setIsDefaultDiscardEditMode(editMode);
  };

  const resetDefaultDiscard = (item) => {
    // Clone the current defaultDimension state
    const updatedDiscard = [...defaultDiscard];

    // Find the index of the item to remove from the defaultDimension array
    const itemIndex = updatedDiscard.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      updatedDiscard.splice(itemIndex, 1);

      // Set the updated state for defaultDimension
      setDefaultDiscard(updatedDiscard);

      // Add the removed item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  const editImages = (section) => {
    switch (section) {
      case "Thumbnail":
        setIsThumbnailEditMode(!isThumbnailEditMode);
        break;
      case "Dimensional":
        setIsDimensionalEditMode(!isDimensionalEditMode);
        break;
      case "WhiteBg":
        setIsWhiteBgEditMode(!isWhiteBgEditMode);
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
    setSelectedButton(buttonName);
  };

  // reset all state in edit button logic

  const resetThumbnailImage = (item) => {
    // Reset selected thumbnail images
    setSelectedThumbnail([]);
    setAllImages((prevImages) => [...prevImages, item]);
    setIsThumbnailButtonDisabled(hasThumbnailImagesMapped);
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
  // reset function for whiteBg
  const resetWhiteBg = (item) => {
    // Reset selected whiteBg images
    setSelectedWhiteBg(selectedWhiteBg.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDimensionalEditMode(false);
    setImageSelectedIds([]);
    setHasWhiteBgImagesMapped(false);
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
    setIsWhiteBgEditMode(false);
    setIsOrdinarylEditMode(false);
    setIsDiscardlEditMode(false);
  };
  const selectMyItem = (item) => {
    setSelectedImage(item);
    if (imageSelectedIds.includes(item)) {
      setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    } else {
      // setImageSelectedIds([item]);
      setImageSelectedIds([...imageSelectedIds, item]);
    }


    // if (selectedButton === "Thumbnail") {
    //   if (!hasThumbnailImagesMapped) {
    //     // Allow selection of thumbnail images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       setImageSelectedIds([item]);
    //     }
    //   }
    // } else if (selectedButton === "Dimensional") {
    //   if (!hasDimensionalImagesMapped) {
    //     // Allow selection of dimensional images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "WhiteBg") {
    //   if (!hasWhiteBgImagesMapped) {
    //     // Allow selection of dimensional images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "Ordinary") {
    //   if (!hasOrdinaryImagesMapped) {
    //     // Allow selection of ordinary images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "Discard") {
    //   if (!hasDiscardImagesMapped) {
    //     // Allow selection of discard images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // }
  };

  // logic of submit button for show and delete images

  const submitData = () => {
    // if (selectedButton === "Thumbnail") {
    //   setHasThumbnailImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Dimensional") {
    //   setHasDimensionalImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "WhiteBg") {
    //   setHasWhiteBgImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Ordinary") {
    //   setHasOrdinaryImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Discard") {
    //   setHasDiscardImagesMapped(true);
    //   setImageSelectedIds([]);
    // }

    if (imageSelectedIds.length === 0) {
      return
    }

    if (selectedButton === "") {
      return;
    }

    if (selectedButton === "Thumbnail") {
      setHasThumbnailImagesMapped(true);
    } else if (selectedButton === "Dimensional") {
      setHasDimensionalImagesMapped(true);
    } else if (selectedButton === "WhiteBg") {
      setHasWhiteBgImagesMapped(true);
    } else if (selectedButton === "Ordinary") {
      setHasOrdinaryImagesMapped(true);
    } else if (selectedButton === "Discard") {
      setHasDiscardImagesMapped(true);
    }

    if (selectedButton === "Thumbnail" && selectedThumbnail.length == 0) {
      // setImageSelectedIds(imageSelectedIds.filter((id) => id == id));
      // setSelectedThumbnail(imageSelectedIds);
      setSelectedThumbnail([imageSelectedIds[0]]);
    } else if (selectedButton === "Dimensional") {
      setSelectedDimentional([...selectedDimentional, ...imageSelectedIds]);
    } else if (selectedButton === "WhiteBg") {
      setSelectedWhiteBg([...selectedWhiteBg, ...imageSelectedIds]);
    } else if (selectedButton === "Ordinary") {
      setSelectedOrdinary([...selectedOrdinary, ...imageSelectedIds]);
    } else if (selectedButton === "Discard") {
      setSelectedDiscard([...selectedDiscard, ...imageSelectedIds]);
    }

    if (selectedButton === "Thumbnail") {
      if (selectedThumbnail.length > 0) {
        console.log('saim', allImages, selectedThumbnail);
        const newOne = allImages.filter((itm) => imageSelectedIds[0].id !== itm.id)
        setAllImages([...newOne, ...selectedThumbnail])
      } else {
        setAllImages(allImages.filter((itm) => imageSelectedIds[0].id !== itm.id));
      }
    } else {
      setAllImages(allImages.filter((itm) => !imageSelectedIds.includes(itm)));
    }
    setImageSelectedIds([]);
    if (selectedButton === "Thumbnail") {
      setIsThumbnailButtonDisabled(true);
    } else if (selectedButton === "Dimensional") {
      setIsDimensionalButtonDisabled(true);
    } else if (selectedButton === "WhiteBg") {
      setIsWhiteBgButtonDisabled(true);
    } else if (selectedButton === "Ordinary") {
      setIsOrdinaryButtonDisabled(true);
    } else if (selectedButton === "Discard") {
      setIsDiscardButtonDisabled(true);
    }
    setSelectedButton("")

  };

  // convert sorted data into json form

  const areAllImagesSorted = () => {
    // Check if all categories (Thumbnail, Dimensional, Ordinary, Discard) have been mapped
    const areCategoriesMapped =
      hasThumbnailImagesMapped ||
      hasDimensionalImagesMapped ||
      hasWhiteBgImagesMapped ||
      hasOrdinaryImagesMapped ||
      hasDiscardImagesMapped;

    // Check if all image arrays are empty
    const areImageArraysEmpty =
      selectedThumbnail.length === 0 &&
      selectedDimentional.length === 0 &&
      selectedWhiteBg.length === 0 &&
      selectedOrdinary.length === 0 &&
      selectedDiscard.length === 0;

    return areCategoriesMapped || areImageArraysEmpty;
  };

  const jsonData = () => {
    // initialize an empty object to hold the structured data
    const structuredData = {
      id: {},
      dimensional: [],
      thumbnails: [],
      whitebg: [],
      ordinary: [],
      discard: [],
      videos: [],
      change: "",
      not_doable: false,
    };
    structuredData.id = sku;
    // if (mergeSelectedDefaultThumbnail.length > 0) {
    structuredData.thumbnails = mergeSelectedDefaultThumbnail;
    // }
    // if (mergeSelectedDefaultDimension.length > 0) {
    structuredData.dimensional = mergeSelectedDefaultDimension;
    // }
    // if (mergeSelectedDefaultWhitebg.length > 0) {
    structuredData.whitebg = mergeSelectedDefaultWhitebg;
    // }
    // if (mergeSelectedDefaultOrdinary.length > 0) {
    structuredData.ordinary = mergeSelectedDefaultOrdinary;
    // }
    // if (mergeSelectedDefaultDiscard.length > 0) {
    structuredData.discard = mergeSelectedDefaultDiscard;
    // }
    // if (videos.length > 0) {
    structuredData.videos = videos;
    // }
    structuredData.change = selectedOption;

    // Log the structured data as a JSON object.
    // console.log(JSON.stringify(structuredData, null, 2));

    // Define the API endpoint and data payload
    const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;
    // Send the POST request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(structuredData),
    })
      .then((response) => response.json()) // Assuming server responds with json
      .then((structuredData) => {
        console.log("Success:", structuredData);
        setDefaultThumbnail([]);
        setSelectedThumbnail([]);
        setDefaultDimension([]);
        setSelectedDimentional([]);
        setSelectedWhiteBg([]);
        setDefaultWhiteBg([]);
        setSelectedOrdinary([]);
        setDefaultOrdinary([]);
        setSelectedDiscard([]);
        setDefaultDiscard([]);
        setVideos([]);
        setAllImages([]);

        setHasThumbnailImagesMapped(false);
        setHasDimensionalImagesMapped(false);
        setHasWhiteBgImagesMapped(false);
        setHasOrdinaryImagesMapped(false);
        setHasDiscardImagesMapped(false);

        // Enable the other buttons
        setIsThumbnailButtonDisabled(false);
        setIsDimensionalButtonDisabled(false);
        setIsWhiteBgButtonDisabled(false);
        setIsOrdinaryButtonDisabled(false);
        setIsDiscardButtonDisabled(false);

        // ENABLE DISABLE BUTTON ON SUBMIT SORTED DATA
        setIsFetchButtonDisabled(false);

        triggerToast("Data submited Successfully!", "success", "50px", "top-left")

        setSearchQuery("")

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const executeNoDoAbleScript = () => {
    // initialize an empty object to hold the structured data
    const structuredData = {
      id: {},
      dimensional: [],
      thumbnails: [],
      whitebg: [],
      ordinary: [],
      discard: [],
      videos: [],
      change: "rejected_nad",
      not_doable: true,
    };
    structuredData.id = sku;
    // if (mergeSelectedDefaultThumbnail.length > 0) {
    structuredData.thumbnails = mergeSelectedDefaultThumbnail;
    // }
    // if (mergeSelectedDefaultDimension.length > 0) {
    structuredData.dimensional = mergeSelectedDefaultDimension;
    // }
    // if (mergeSelectedDefaultWhitebg.length > 0) {
    structuredData.whitebg = mergeSelectedDefaultWhitebg;
    // }
    // if (mergeSelectedDefaultOrdinary.length > 0) {
    structuredData.ordinary = mergeSelectedDefaultOrdinary;
    // }
    // if (mergeSelectedDefaultDiscard.length > 0) {
    structuredData.discard = mergeSelectedDefaultDiscard;
    // }
    // if (videos.length > 0) {
    structuredData.videos = videos;
    // }
    // structuredData.change = selectedOption;

    // Log the structured data as a JSON object.
    // console.log(JSON.stringify(structuredData, null, 2));

    // Define the API endpoint and data payload
    const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;
    // Send the POST request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(structuredData),
    })
      .then((response) => response.json()) // Assuming server responds with json
      .then((structuredData) => {
        console.log("Success:", structuredData);
        setDefaultThumbnail([]);
        setSelectedThumbnail([]);
        setDefaultDimension([]);
        setSelectedDimentional([]);
        setSelectedWhiteBg([]);
        setDefaultWhiteBg([]);
        setSelectedOrdinary([]);
        setDefaultOrdinary([]);
        setSelectedDiscard([]);
        setDefaultDiscard([]);
        setVideos([]);
        setAllImages([]);

        setHasThumbnailImagesMapped(false);
        setHasDimensionalImagesMapped(false);
        setHasWhiteBgImagesMapped(false);
        setHasOrdinaryImagesMapped(false);
        setHasDiscardImagesMapped(false);

        // Enable the other buttons
        setIsThumbnailButtonDisabled(false);
        setIsDimensionalButtonDisabled(false);
        setIsWhiteBgButtonDisabled(false);
        setIsOrdinaryButtonDisabled(false);
        setIsDiscardButtonDisabled(false);

        // ENABLE DISABLE BUTTON ON SUBMIT SORTED DATA
        setIsFetchButtonDisabled(false);

        setVisibilityNotDoable(false);

        triggerToast("Data submited Successfully!", "success", "50px", "top-left")

        setSearchQuery('')

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (selectedThumbnail.length === 0) {
      setIsThumbnailButtonDisabled(false)
    }
  }, [selectedThumbnail])

  useEffect(() => {
    if (selectedDimentional.length === 0) {
      setIsDimensionalButtonDisabled(false)
    }
  }, [selectedDimentional])

  useEffect(() => {
    if (selectedWhiteBg.length === 0) {
      setIsWhiteBgButtonDisabled(false)
    }
  }, [selectedWhiteBg])

  useEffect(() => {
    if (selectedOrdinary.length === 0) {
      setIsOrdinaryButtonDisabled(false)
    }
  }, [selectedOrdinary])

  useEffect(() => {
    if (selectedDiscard.length === 0) {
      setIsDiscardButtonDisabled(false)
    }
  }, [selectedDiscard])

  return (
    <>
      {/* {console.log("updated data", );} */}
      <HeaderSignOut
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
      />
      {/* <Sidebar /> */}
      <div className="set-right-container">
        {/* header section  */}
        <div className="header">
          <div className="set-container d-flex align-items-center justify-content-center w-100">
            <div className="d-flex flex-row align-items-center justify-content-between w-100 gap-2" style={{ maxWidth: '1100px' }}>
              <div>
                <h6 className="m-0">
                  Product ID: <strong>{showId}</strong>
                </h6>
              </div>
              <div className="">
                {notDoable === true ? (
                  <button className="set-btn-red d-block w-100">
                    Sorter declare as a Not A Doable Product!!!
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div className="d-flex flex-row align-items-center gap-1 flex-fill">
                <div className="d-flex flex-fill">
                  <input className="w-100 px-3 flex-fill" placeholder="Search By URL" style={{ backgroundColor: "#e8e8e8" }} value={searchQuery} disabled={isFetchButtonDisabled} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button
                    id="btn-go"
                    className="btn p-2 px-3  btn-go-fetch"

                    onClick={executePythonScript}
                    disabled={isFetchButtonDisabled}
                  >
                    GO
                  </button>
                </div>
                <h5 className="m-0" style={{ textAlign: 'center' }}>or</h5>
                <button
                  id="btn-fetch"
                  className="btn d-block btn-fetch"
                  onClick={executePythonScript}
                  disabled={isFetchButtonDisabled}
                >
                  Fetch Data
                </button>
              </div>
              {/* <div className="col-lg-1 col-md-4 text-end">
              <button onClick={handleSignOut}>SignOut</button>
            </div> */}
            </div>
          </div>
        </div>

        {/* radio selector  */}
        <div className="mt-5 set-fixed-bar">
          <div className="inside-div">
            {/* <div>
            <h2>JSON Result:</h2>
            <pre>{jsonResult}</pre>
          </div> */}
            <button
              onClick={() => handleButtonClick("Thumbnail")}
              className={`fw-bold select-btn btn ${selectedButton === "Thumbnail" ? "active-button" : ""
                }${isThumbnailButtonDisabled ? " button-disable" : ""}`}
              disabled={isThumbnailButtonDisabled}
            >
              Colored Thumbnail
            </button>

            <button
              onClick={() => handleButtonClick("Dimensional")}
              className={`fw-bold select-btn btn ${selectedButton === "Dimensional" ? "active-button" : ""
                }${isDimensionalButtonDisabled ? " button-disable" : ""}`}
              disabled={isDimensionalButtonDisabled}
            >
              Dimensional
            </button>
            <button
              onClick={() => handleButtonClick("WhiteBg")}
              className={`fw-bold select-btn btn ${selectedButton === "WhiteBg" ? "active-button" : ""
                }${isWhiteBgButtonDisabled ? " button-disable" : ""}`}
              disabled={isWhiteBgButtonDisabled}
            >
              White Thumbnails
            </button>
            <button
              onClick={() => handleButtonClick("Ordinary")}
              className={`fw-bold select-btn btn btn-equ ${selectedButton === "Ordinary" ? "active-button" : ""
                }${isOrdinaryButtonDisabled ? " button-disable" : ""}`}
              disabled={isOrdinaryButtonDisabled}
            >
              Supportive
            </button>

            <button
              onClick={() => handleButtonClick("Discard")}
              className={`fw-bold select-btn btn btn-equ ${selectedButton === "Discard" ? "active-button" : ""
                }${isDiscardButtonDisabled ? " button-disable" : ""}`}
              disabled={isDiscardButtonDisabled}
            >
              Discard
            </button>
            <button
              onClick={submitData}
              className="submit mt-3"
              id="set-btn-submit"
            >
              Submit
            </button>
          </div>

          <div className="d-flex flex-column justify-content-center align-items-center mt-4 mb-5">
            <div className="set-select-all me-3">
              <select value={selectedOption} className="bg-primary-subtle p-1" onChange={handleSelectChange}>
                {(!notDoable || notDoable === false) && <option value="passed">100% [QA passed]</option>}
                {(!notDoable || notDoable === false) && <option value="minor">Minor Fixes</option>}
                <option value="major">Major Fixes</option>
              </select>
            </div>
            {visibilityNotDoable ?
              <button className="w-100 btn-danger disabled" onClick={executeNoDoAbleScript}>
                NOT A DOABLE
              </button>
              :
              <button className="w-100 btn-danger">
                NOT A DOABLE
              </button>
            }
            {mergeSelectedDefaultThumbnail.length > 0 ||
              mergeSelectedDefaultDimension.length > 0 ||
              selectedWhiteBg.length > 0 ||
              selectedOrdinary.length > 0 ||
              selectedDiscard.length > 0 ? (
              <button
                onClick={jsonData}
                className={`w-100 btn-danger ${areAllImagesSorted() ? "disabled" : ""}`}
                disabled={!areAllImagesSorted()}
              >
                COMPLETED
              </button>
            ) : (
              <button className={`w-100 btn-danger disabled}`} disabled>
                COMPLETED
              </button>
            )}
          </div>
        </div>

        {/* all images map in ui  */}

        <div>
          <div className="row">
            {allImages.map((item) => (
              <div className="mt-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                <div
                  className={`card img-fluid ${imageSelectedIds.includes(item) ? "selected-image" : ""
                    }`}
                  onClick={() => selectMyItem(item)}
                >
                  <img src={item.src} id={`img-${item.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <h2 className="text-center mb-5">Sorted Data</h2> */}
        {/* THUMBNAIL UPDATED CODE  */}
        <div className="container-fluid py-3 thumbnail-bg mt-4">
          <div style={{ marginRight: "152px" }}>
            <div>
              <h2 className="mb-3">Colored Thumbnail</h2>
            </div>
            <div className="main-div d-flex align-items-start flex-wrap">
              <div>
                <div className="all-btns">
                  {selectedThumbnail
                    ? selectedThumbnail.length > 0 &&
                    selectedImage && (
                      <div className="d-flex">
                        <div className="">
                          <h4 className="set-f4">My Update</h4>
                        </div>
                        <div className="mb btn-click all-btn ms-3">
                          {isThumbnailEditMode ? (
                            <>
                              <button
                                onClick={saveImages}
                                className="btn me-3 save"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => editImages("Thumbnail")}
                                className="btn edit"
                              >
                                Edit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => editImages("Thumbnail")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    )
                    : ""}
                </div>
                <div>
                  <div className="row">
                    {selectedThumbnail.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isThumbnailEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isThumbnailEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetThumbnailImage(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="d-flex">
                    <div>
                      <h4 className="set-f4">Default</h4>
                    </div>
                    <div className="ms-3">
                      {!isDefaultThumbnailEditMode && (
                        <button
                          onClick={() => handleDefaultThumbnailEdit(true)}
                          className="btn edit d btn-width-auto"
                        >
                          Edit
                        </button>
                      )}
                      {isDefaultThumbnailEditMode && (
                        <>
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save btn-width-auto"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDefaultThumbnailEdit(false)}
                              className="btn edit btn-width-auto"
                            >
                              Edit
                            </button>
                          </>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="row">
                    {!defaultThumbnail
                      ? triggerToast("Sorted Data Ended!", "error", "50px", "top-left")
                      : defaultThumbnail.map((item) => (
                        <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isDefaultThumbnailEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isDefaultThumbnailEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetDefaultThumbnail(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                              alt=""
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* updated code of dimensional images */}

        <div className="container-fluid py-3 dimensnal-bg">
          <div style={{ marginRight: "152px" }}>
            <div>
              <h2 className="mb-3">Dimensional Images</h2>
            </div>
            <div className="main-div d-flex align-items-start flex-wrap">
              <div>
                <div className="all-btns">
                  {selectedDimentional.length > 0 && selectedImage && (
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">My Update</h4>
                      </div>
                      <div className="mb btn-click all-btn ms-3">
                        {isDimensionalEditMode ? (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => editImages("Dimensional")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editImages("Dimensional")}
                            className="btn edit"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex">
                  {selectedDimentional.map((item) => (
                    <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                      <div
                        className={`card ${isDimensionalEditMode ? "edit-mode" : ""
                          }`}
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
                          src={item.src}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="d-flex">
                  <div>
                    <h4 className="set-f4">Default</h4>
                  </div>
                  <div className="ms-3">
                    {!isDefaultDimensionEditMode ? (
                      <button
                        onClick={() => handleDefaultDimensionEdit(true)}
                        className="btn btn-block edit btn-width-auto"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={saveImages}
                          className="btn btn-block me-3 save btn-width-auto"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDefaultDimensionEdit(false)}
                          className="btn btn-block edit btn-width-auto"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ! DIMESNIONAL DEFAULT IMAGES METHOD START   */}

                <div className="d-flex">
                  {defaultDimension
                    ? defaultDimension.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isDefaultDimensionEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isDefaultDimensionEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDefaultDimension(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))
                    : ""}
                </div>

                {/* ! DIMESNIONAL DEFAULT IMAGES METHOD END  */}

              </div>

            </div>
          </div>
        </div>

        {/* WHITE BG UPDATED CODE  */}
        <div className="container-fluid py-3 white-bg">
          <div style={{ marginRight: "152px" }}>
            <div className="col-lg-12">
              <h2 className="mb-3">White Thumbnails</h2>
            </div>
            <div className="main-div d-flex flex-wrap">
              <div>
                <div className="all-btns">
                  <div className="">
                    <div>
                      {selectedWhiteBg.length > 0 && selectedImage && (
                        <div className="d-flex">
                          <div>
                            <h4 className="set-f4">My Update</h4>
                          </div>
                          <div className="mb btn-click all-btn ms-3">
                            {isWhiteBgEditMode ? (
                              <>
                                <button
                                  onClick={saveImages}
                                  className="btn me-3 save"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => editImages("WhiteBg")}
                                  className="btn edit"
                                >
                                  Edit
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => editImages("WhiteBg")}
                                className="btn edit"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    {selectedWhiteBg.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isWhiteBgEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isWhiteBgEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDefaultWhiteBg(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div className="d-flex">
                    <div>
                      <h4 className="set-f4">Default</h4>
                    </div>
                    <div className="ms-3">
                      {!isDefaultWhiteBgEditMode ? (
                        <button
                          onClick={() => handleDefaulWhiteBgtEdit(true)}
                          className="btn btn-block edit btn-width-auto"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={saveImages}
                            className="btn btn-block me-3 save btn-width-auto"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleDefaulWhiteBgtEdit(false)}
                            className="btn btn-block edit btn-width-auto"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    {defaultWhiteBg
                      ? defaultWhiteBg.map((item) => (
                        <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isDefaultWhiteBgEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isDefaultWhiteBgEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetDefaultWhiteBg(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                              alt=""
                            />
                          </div>
                        </div>
                      ))
                      : ""}
                  </div>
                </div>
              </div>

              {/* ! WhiteBF DEFAULT IMAGES METHOD END  */}
            </div>
          </div>
        </div>

        {/* ordinary images section  */}
        <div className="container-fluid py-3 ordinary-b ">
          <div style={{ marginRight: "152px" }}>
            <div className="col-lg-12">
              <h2 className="mb-3 ">Supportive</h2>
            </div>
            <div className="main-div d-flex flex-wrap">
              <div>
                <div className="all-btns">
                  {selectedOrdinary.length > 0 && selectedImage && (
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">My Update</h4>
                      </div>
                      <div className="mb btn-click all-btn ms-3">
                        {isOrdinarylEditMode ? (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => editImages("Ordinary")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editImages("Ordinary")}
                            className="btn edit"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="row">
                    {selectedOrdinary.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isOrdinarylEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isOrdinarylEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDefaultOrdinary(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                {/* ! Ordinary DEFAULT IMAGES METHOD END  */}

                <div className="d-flex">
                  <div>
                    <h4 className="set-f4">Default</h4>
                  </div>
                  <div className="ms-3">
                    {/* ! DIMESNIONAL DEFAULT IMAGES METHOD START   */}
                    {!isDefaultOrdinaryEditMode ? (
                      <button
                        onClick={() => handleDefaulOrdinaryEdit(true)}
                        className="btn btn-block edit btn-width-auto"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={saveImages}
                          className="btn btn-block me-3 save btn-width-auto"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDefaulOrdinaryEdit(false)}
                          className="btn btn-block edit btn-width-auto"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="row">
                  {defaulOrdinary
                    ? defaulOrdinary.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isDefaultOrdinaryEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isDefaultOrdinaryEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDefaultOrdinary(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                            alt=""
                          />
                        </div>
                      </div>
                    ))
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DISCARD DEFAULT IMAGES METHOD  */}
        <div className="container-fluid py-3 discard-bg">
          <div style={{ marginRight: "152px" }}>
            <div className="col-lg-12">
              <h2 className="mb-3 ">Discard</h2>
            </div>
            <div className="main-div d-flex align-items-start flex-wrap">
              <div>
                <div className="all-btns">
                  {selectedDiscard.length > 0 && selectedImage && (
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">My Update</h4>
                      </div>
                      <div className="mb btn-click all-btn ms-3">
                        {isDiscardlEditMode ? (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => editImages("Discard")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editImages("Discard")}
                            className="btn edit"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="row">
                    {selectedDiscard.map((item) => (
                      <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isDiscardlEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isDiscardlEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDefaultDiscard(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="d-flex">
                  <div>
                    <h4 className="set-f4">Default</h4>
                  </div>
                  <div className="ms-3">
                    {/* ! DIMESNIONAL DEFAULT IMAGES METHOD START   */}
                    {!isDefaultDiscardEditMode ? (
                      <button
                        onClick={() => handleDefaulDiscardEdit(true)}
                        className="btn btn-block edit btn-width-auto"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={saveImages}
                          className="btn btn-block me-3 save btn-width-auto"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDefaulDiscardEdit(false)}
                          className="btn btn-block edit btn-width-auto"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="row">
                    {defaultDiscard
                      ? defaultDiscard.map((item) => (
                        <div className="mb-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isDefaultDiscardEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isDefaultDiscardEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetDefaultDiscard(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                              alt=""
                            />
                          </div>
                        </div>
                      ))
                      : ""}
                  </div>
                </div>
              </div>

              {/* ! Discard DEFAULT IMAGES METHOD END  */}
            </div>
          </div>
        </div>
        {/* sorted data into json form  */}
        {/* VIDEO CONTAINER */}
        {/* <div className="container-fluid py-3 video-bg">
          <div className="container">
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h2 className="mb-3">Videos</h2>
                </div>
                <div className="col-lg-12">
                  <div>
                    <h4 className="set-f4">Default</h4>
                  </div>
                  <div className="row">
                    {videos.map((item) => (
                      <div className="col-md-3 mb-4" key={item.id}>
                        <div
                          className={`card ${
                            isDiscardlEditMode ? "edit-mode" : ""
                          }`}
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
                            src={item.poster}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="d-flex justify-content-center align-items-center text-end mt-4 mb-5">
          <div className="set-select-all me-3">
            <select value={selectedOption} onChange={handleSelectChange}>
              {(!notDoable || notDoable === false) && <option value="passed">100% [QA passed]</option>}
              {(!notDoable || notDoable === false) && <option value="minor">Minor Fixes</option>}
              <option value="major">Major Fixes</option>
            </select>
          </div>
          {visibilityNotDoable === true && notDoable === true ? (
            <>
              <button className="set-btn-red" onClick={executeNoDoAbleScript}>
                Not Doable
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </>
          ) : (
            ""
          )}
          {mergeSelectedDefaultThumbnail.length > 0 ||
            mergeSelectedDefaultDimension.length > 0 ||
            selectedWhiteBg.length > 0 ||
            selectedOrdinary.length > 0 ||
            selectedDiscard.length > 0 ? (
            <button
              onClick={jsonData}
              className={`btn-danger ${areAllImagesSorted() ? "disabled" : ""}`}
              disabled={!areAllImagesSorted()}
            >
              Sorted Data in Json
            </button>
          ) : (
            <button className={`btn-danger disabled}`} disabled>
              Sorted Data in Json
            </button>
          )}
        </div> */}
        <footer>
          <div className="col-lg-12">
            <div className="footer-left">
              <p className="mb-0">@InfoSync LTD 2015 All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div >
    </>
  );
};

export default ExtractionQA;
