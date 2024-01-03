import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ResizablePIP } from "resizable-pip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IronPipeTableRow from "../components/dimensionsAnalyst/IronPipeTableRow";
import HeaderSignOut from "../components/header/HeaderSignOut";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  TableFooter,
  TextField,
  Typography,
  colors,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropsModel from "../res/PropsModel";
import WoodenSheetTableRow from "../components/dimensionsAnalyst/WoodenSheetTableRow";
import WoodTapeTableRow from "../components/dimensionsAnalyst/WoodTapeTableRow";
import MiscTableRow from "../components/dimensionsAnalyst/MiscTableRow";
import MiscItemSize from '../res/MiscItemSize.json'
import { triggerToast } from "../utils/triggerToast";


const defualt_state = {
  ironPipeRows: [
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
    PropsModel["ironPipeRows"],
  ],
  woodenSheetRows: [
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
    PropsModel["woodenSheetRows"],
  ],
  woodTapeRows: [
    PropsModel["woodTapeRows"]
  ],
  miscTableRows: PropsModel["miscTableRows"],
}



function DimensionalQAAnalyst(props) {
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataSubmitting, setDataSubmitting] = useState(false);
  const [displayProductDataType, setDisplayProductDataType] = useState('images');

  const [productID, setProductID] = useState("");
  const [productNotUnderstandable, setProductNotUnderstandable] = useState(false);
  const [productSKU, setProductSKU] = useState("");
  const [productPropertiesOld, setProductPropertiesOld] = useState({
    ironPipeRows: [],
    woodenSheetRows: [],
    woodTapeRows: [],
    miscTableRows: [],
  });
  const [images, setImages] = useState([]);
  const [weightAndDimentions, setWeightAndDimentions] = useState({});

  const [url, setURL] = useState("")

  const [miscItems, setMiscItems] = useState(['Select Another Misc Item'])
  const [selectedMiscItemSelectionValue, setSelectedMiscItemSelectionValue] = useState("Select Another Misc Item")


  const executePythonScript = async () => {
    setDataLoading(true)
    console.log("props.user", props.user);
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          var apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/get_job`;
          if (url != '') {
            apiUrl = apiUrl + `?url=${encodeURIComponent(url)}`
          }
          console.log(token);
          // Make an authenticated API request

          // fetch(apiUrl, {
          //   method: "GET",
          //   headers: {
          //     Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          //   },
          // })
          fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log("network response was ok");
            return response.json();
          })
            .then(async (data) => {
              // Handle the API response data
              console.log("API Response:", data);

              fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/images/all/${data.sku}`).then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                console.log("network response was ok");
                return response.json();
              }).then(async (images) => {
                const { dimensional, ordinary, thumbnails, whitebg } = images[0].data.final;
                setImages([...dimensional, ...thumbnails, ...ordinary, ...whitebg]);

                // const mergedArray = PropsModel["miscTableRows"].map(existingItem => {
                //   const newDataItem = data.productProperties.miscTableRows.find(newItem => newItem.item === existingItem.item);

                //   return newDataItem ? newDataItem : existingItem;
                // });
                // setImages(data.images);
                setWeightAndDimentions(data["weight and dimensions"]);
                setPreviewImage(data.images[0]);
                // setPreviewImage(images.dimen[0]);
                // console.log('mergedArray', mergedArray);
                setProductProperties({
                  ...data.productProperties,
                  // miscTableRows: mergedArray
                });
                setProductPropertiesOld(data.productProperties);
                setProductID(data.id);
                setProductSKU(data.sku);
                setProductNotUnderstandable(data.change === 'not_understandable' ? true : false)

                setFilters((pre) => ({
                  ...pre,
                  buildMaterial: data.buildMaterial,
                  qaScorecard: data.change === 'not_understandable' ? 'major' : 'QA Scorecard'
                }));

                const { data: _data } = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).catch((e) => console.log('error occured', e));

                console.log('ingredients', _data);
                // const micsRows = []
                console.log('Object.keys(_data.Misc) -->', Object.keys(_data.Misc));
                Object.keys(_data.Misc).map((item) => {
                  if (_data.Misc[item].status === 'active') {
                    setMiscItems(pre => ([
                      ...pre,
                      item
                    ]))
                  }
                  // console.log('_data.Misc[item]', _data.Misc[item]);
                })
                // setMiscItems(["Select Another Misc Item", ...Object.keys(_data.Misc)]);
                // Object.keys(_data.Misc).slice(0, 5).map((misc) => {
                //   micsRows.push({
                //     item: misc,
                //     size: MiscItemSize[0].Size,
                //     qty: ''
                //   })
                // })
                // setProductProperties(pre => ({
                //   ...pre,
                //   miscTableRows: micsRows
                // }))
                setDataLoaded(true);
                setDataLoading(false)
              }).catch((error) => {
                // Handle any errors
                console.error("Error:", error);
                setDataLoaded(false);
                setDataLoading(false)
                triggerToast(`No Job Found : ${error}`, 'error');
              });
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error:", error);
              setDataLoaded(false);
              setDataLoading(false)
              // window.alert('No Job Found');
              triggerToast(`No Job Found : ${error}`, 'error');
            });
        })
        .catch((error) => {
          // Handle any errors while getting the token
          console.error("Token Error:", error);
          triggerToast(`${error}`, 'error');
        });
    }
  };

  const executePythonScriptSubmit = async () => {
    console.log("props.user", props.user);

    const payload = exportData();
    console.log("body", payload);

    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;
          console.log(token);
          // Make an authenticated API request
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              console.log("network response was ok");
              return response.json();
            })
            .then((data) => {
              // Handle the API response data
              console.log("API Response:", data);
              setImages([])
              setWeightAndDimentions({})
              setProductID("")
              setProductSKU("")
              setPreviewImage("")
              setProductNotUnderstandable(false)
              setDataLoading(false);
              setDataLoaded(false);
              setFilters((pre) => ({
                ...pre,
                buildMaterial: "IRON PIPE / MDF",
                qaScorecard: 'QA Scorecard'
              }))
              setProductProperties({
                ironPipeRows: [
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                  PropsModel["ironPipeRows"],
                ],
                woodenSheetRows: [
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                  PropsModel["woodenSheetRows"],
                ],
                woodTapeRows: [
                  PropsModel["woodTapeRows"]
                ],
                miscTableRows: PropsModel["miscTableRows"],
              })
              setURL("");
              setDataSubmitting(false)
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          // Handle any errors while getting the token
          console.error("Token Error:", error);
        });
    }
  };

  const executePythonScriptSubmit_not_understandable = async () => {
    console.log("props.user", props.user);


    const payload = exportData();
    payload.change = 'not_understandable'
    console.log("body", payload);

    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;
          console.log(token);
          // Make an authenticated API request
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              console.log("network response was ok");
              return response.json();
            })
            .then((data) => {
              // Handle the API response data
              console.log("API Response:", data);
              setImages([])
              setWeightAndDimentions({})
              setProductID("")
              setProductSKU("")
              setPreviewImage("")
              setProductNotUnderstandable(false)
              setDataLoading(false);
              setDataLoaded(false);
              setFilters((pre) => ({
                ...pre,
                buildMaterial: "IRON PIPE / MDF",
                qaScorecard: 'QA Scorecard'
              }))
              setProductProperties(defualt_state)
              setURL("");
              setDataSubmitting(false)
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          // Handle any errors while getting the token
          console.error("Token Error:", error);
        });
    }
  };

  const [suggestEdit, setSuggestEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState();

  const [filters, setFilters] = useState({
    unitSelector: "Inch",
    buildMaterial: "IRON PIPE / MDF",
    qaScorecard: "QA Scorecard",
  });

  // const getFilledRows = (propType) => {
  //   const filledData = Array.from(productPropertiesOld[propType]);
  //   for (var i = filledData.length; i < 9; i++) {
  //     filledData.push(PropsModel[propType]);
  //   }
  //   return filledData;
  // };

  const getMiscTableRows = () => {
    const rows = PropsModel["miscTableRows"];
    // console.log('productPropertiesOld.miscTableRows', productPropertiesOld.miscTableRows);
    const newRows = [];
    rows.map((row) => {
      productPropertiesOld.miscTableRows.map((misc) => {
        if (misc.item.toLowerCase() === row.item.toLowerCase()) {
          console.log('matched -> ', {
            item: misc.item,
            qty: misc.qty,
            size: misc.size
          });
          newRows.push({
            item: misc.item,
            qty: misc.qty,
            size: misc.size
          })
          // rows[row].qty = misc.qty;
          // rows[row].size = misc.size;
        }
      });
    });
    return newRows;
  };

  const [productProperties, setProductProperties] = useState(defualt_state);

  const addNewRow = (propType) => {
    setProductProperties((pre) => ({
      ...pre,
      [propType]: [...pre[propType], PropsModel[propType]],
    }));
  };

  const handleEdit = (e, key, propType) => {
    if (
      e.target.name !== "pipeTypeNSize" &&
      e.target.name !== "type" &&
      e.target.name !== "size" &&
      e.target.name !== "item"
    ) {
      if (isNaN(e.target.value)) {
        return;
      }
    }

    setProductProperties((pre) => {
      const updatedRows = [...pre[propType]];
      updatedRows[key] = {
        ...updatedRows[key],
        [e.target.name]: e.target.value,
      };
      return { ...pre, [propType]: updatedRows };
    });

  };

  const exportData = () => {
    var exportedIronPipeRows = productProperties.ironPipeRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") && (row.qty != 0 || row.qty != "")
    );

    var exportedWoodenSheetRows = productProperties.woodenSheetRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") &&
        (row.qty != 0 || row.qty != "") &&
        (row.width != 0 || row.width != "")
    );

    var exportedWoodTapeRows = productProperties.woodTapeRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") && (row.qty != 0 || row.qty != "")
    );

    var exportedMiscTableRows = productProperties.miscTableRows.filter(
      (row) => row.qty != 0 || row.qty != ""
    );

    return {
      id: productID,
      images,
      "weight and dimensions": weightAndDimentions,
      buildMaterial: filters.buildMaterial,
      productPropertiesOld: suggestEdit ? productPropertiesOld : null,
      productProperties: {
        ironPipeRows: exportedIronPipeRows,
        woodenSheetRows: exportedWoodenSheetRows,
        woodTapeRows: exportedWoodTapeRows,
        miscTableRows: exportedMiscTableRows,
      },
      change: filters.qaScorecard,
    };
  };

  const getFreeMiscItems = () => {

    const miscItem = productProperties.miscTableRows.map(itm => itm.item)

    return miscItems.filter(item => !miscItem.includes(item));
  }


  const [displayHeader, setDisplayHeader] = useState(false)

  return (
    <>
      {
        displayHeader && <HeaderSignOut
          userEmail={props.userEmail}
          userRole={props.userRole}
          userJdesc={props.userJdesc}
        />

      }

      <div className="header">
        <div className="set-container d-flex align-items-center justify-content-center w-100">
          <div className="d-flex flex-row align-items-center justify-content-between w-100 gap-2" style={{ maxWidth: '1100px' }}>
            <div>
              <h6 className="m-0">
                Product ID: <strong>{productSKU}</strong>
              </h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-1 flex-fill">

              {/* <Stack direction='row' justifyContent='end' width={'100%'}>
                <TextField value={url} placeholder="Search by URL" variant="filled" onChange={(e) => setURL(e.target.value)} style={{ borderRadius: 0, width: '100%' }} />
                <Button variant="contained"
                  onClick={executePythonScript}
                  style={{ backgroundColor: "black", color: "white", borderRadius: 0 }}
                >

                  <Stack direction='row' gap={2} alignItems='center'>
                    <Typography fontWeight='bold'>GO</Typography>
                    {dataLoading && <CircularProgress size={26} color="warning" />}
                  </Stack>
                </Button>
              </Stack>

              <Typography textAlign='center' fontSize={16} fontWeight='bold'>or</Typography>
              <Button variant="contained"
                onClick={executePythonScript}
                style={{ backgroundColor: '#ffeb9c', color: 'black' }}
              >

                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography fontWeight='bold'>Fetch</Typography>
                  {dataLoading && <CircularProgress size={26} color="warning" />}
                </Stack>
              </Button> */}

              <div className="d-flex flex-fill">
                <input className="w-100 px-3 flex-fill" placeholder="Search By URL" style={{ backgroundColor: "#e8e8e8" }} onChange={(e) => setURL(e.target.value)} value={url} />
                <button
                  id="btn-go"
                  className="btn p-2 px-3  btn-go-fetch"

                  onClick={executePythonScript}
                >
                  GO
                </button>
              </div>
              <h5 className="m-0" style={{ textAlign: 'center' }}>or</h5>
              <button
                id="btn-fetch"
                className="btn d-block btn-fetch"
                onClick={executePythonScript}
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

      <Wrapper>

        <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' height='calc(100vh - 70px)'>

          <Stack width='50%' height='100%' justifyContent='space-between' alignItems='center'>

            <Stack direction='column' width='100%' spacing={0.5} p={1}>

              {displayProductDataType === 'images' && <img src={previewImage} width="auto" height='70%' style={{ alignSelf: 'center' }} />}

              {dataLoaded && displayProductDataType === 'images' ?
                <Stack direction='row' overflow='auto' width='100%' spacing={1}>
                  {images.map((source, index) => {
                    return (
                      <img
                        onClick={() => setPreviewImage(source)}
                        width="90px"
                        src={source}
                        key={index}
                        style={{
                          border: `2px solid ${source === previewImage ? 'red' : 'black'}`
                        }}
                      />
                    );
                  })}
                </Stack>
                :
                <Stack>
                  {
                    Object.keys(weightAndDimentions).map((category, index) => {

                      return <Stack direction='column'>
                        <Typography fontWeight='bold'>{category}</Typography>

                        <Paper variant="outlined" direction='column' style={{ padding: 5 }}>
                          {Object.keys(weightAndDimentions[category]).map((item, _index) => {

                            return <Stack direction='row' justifyContent='space-between' p={1} gap={1} style={{ backgroundColor: _index % 2 == 0 ? 'transparent' : colors.grey[200] }}>
                              <Typography>{item}: </Typography>
                              <Typography>{(weightAndDimentions[category])[item]}</Typography>
                            </Stack>
                          })}
                        </Paper>

                      </Stack>

                    })
                  }
                </Stack>
              }

              <ButtonGroup style={{ marginTop: 10, alignSelf: 'center' }} variant="contained" aria-label="outlined primary button group">
                <Button
                  style={{ width: '140px' }}
                  variant={displayProductDataType === 'images' ? 'contained' : 'outlined'}
                  onClick={() => setDisplayProductDataType('images')}>Images</Button>
                <Button
                  style={{ width: '140px' }}
                  variant={displayProductDataType === 'specification' ? 'contained' : 'outlined'}
                  onClick={() => setDisplayProductDataType('specification')}>Specification</Button>
              </ButtonGroup>

            </Stack>

            {/* <Stack marginBottom={2}>
              
            </Stack> */}
          </Stack>

          <Stack direction='column' gap={3} width='35%' overflow='auto'>

            <Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={6}>
                        Iron Pipe
                      </TableCell>
                    </TableRow>
                    <TableRow className="cell-head">
                      <TableCell>Pipe Type & Size</TableCell>
                      {/* <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell> */}
                      <TableCell>L&nbsp;&nbsp;</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Total (ft)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productProperties.ironPipeRows.map((row, index) => {
                      return (
                        <IronPipeTableRow
                          key={index}
                          _key={index}
                          data={row}
                          handleEdit={handleEdit}
                          unitSelector={filters.unitSelector}
                          editable={suggestEdit}
                          hideDetails={true}
                        />
                      );
                    })}
                  </TableBody>
                  {suggestEdit && (
                    <TableFooter>
                      <Button
                        onClick={() => {
                          addNewRow("ironPipeRows");
                        }}
                      >
                        <AddCircleIcon htmlColor="#1976d2" />
                      </Button>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>
            </Stack>

            <Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={8}>
                        Wooden Sheet
                      </TableCell>
                    </TableRow>
                    <TableRow className="cell-head">
                      <TableCell>Type</TableCell>
                      <TableCell>L&nbsp;&nbsp;</TableCell>
                      <TableCell>W&nbsp;&nbsp;</TableCell>
                      <TableCell>Qty</TableCell>
                      {/* <TableCell>L (ft.)</TableCell>
                      <TableCell>W (ft.)</TableCell>
                      <TableCell>L*W (Sq ft.)</TableCell> */}
                      <TableCell>Total S.ft</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productProperties.woodenSheetRows.map((row, index) => {
                      return (
                        <WoodenSheetTableRow
                          key={index}
                          _key={index}
                          data={row}
                          handleEdit={handleEdit}
                          unitSelector={filters.unitSelector}
                          editable={suggestEdit}
                          hideDetails={true}
                        />
                      );
                    })}
                  </TableBody>
                  {suggestEdit && (
                    <TableFooter>
                      <Button
                        onClick={() => {
                          addNewRow("woodenSheetRows");
                        }}
                      >
                        <AddCircleIcon htmlColor="#1976d2" />
                      </Button>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>
            </Stack>

            {filters.buildMaterial !== "SOLID WOOD" && (
              <Stack>
                <TableContainer component={Paper} variant="outlined">
                  <Table padding={0} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className="table-head" colSpan={8}>
                          Wood Tape Size
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productProperties.woodTapeRows.map((row, index) => {
                        return (
                          <WoodTapeTableRow
                            key={index}
                            _key={index}
                            data={row}
                            handleEdit={handleEdit}
                            unitSelector={filters.unitSelector}
                            editable={suggestEdit}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}

            <Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table padding={0} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={8}>
                        Misc
                      </TableCell>
                    </TableRow>
                    <TableRow className="cell-head">
                      <TableCell>Item</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productProperties.miscTableRows.map((row, index) => {
                      return (
                        <MiscTableRow
                          key={index}
                          _key={index}
                          data={row}
                          handleEdit={handleEdit}
                          editable={dataLoaded}
                        />
                      );
                    })}
                  </TableBody>
                  {suggestEdit && (<TableFooter>
                    <TableRow>
                      <TableCell style={{ display: 'flex' }}>
                        <Select
                          size="small"
                          value={selectedMiscItemSelectionValue}
                          onChange={(e) => setSelectedMiscItemSelectionValue(e.target.value)}
                          // defaultValue='Select Another Misc Item'
                          name="size"
                          style={{ width: "100%" }}
                        >
                          {getFreeMiscItems().map((item, index) => {
                            return (
                              <MenuItem key={index} value={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>

                        <Button
                          onClick={() => {

                            if (selectedMiscItemSelectionValue !== 'Select Another Misc Item') {
                              setProductProperties(pre => ({
                                ...pre,
                                miscTableRows: [...pre.miscTableRows, {
                                  item: selectedMiscItemSelectionValue,
                                  size: MiscItemSize[0].Size,
                                  qty: ''
                                }]
                              }))
                              setSelectedMiscItemSelectionValue("Select Another Misc Item")
                            }

                          }}
                        >
                          <AddCircleIcon htmlColor="#1976d2" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>)}
                </Table>
              </TableContainer>
            </Stack>

          </Stack>


          <Stack direction="column" width='15%' gap={4} p={1} justifyContent='space-between'>

            <Stack direction="column" gap={1}>

              {/* <Stack direction='column' justifyContent='center'>
                <Typography fontWeight='bold' fontSize='small' textAlign='center'>Product SKU</Typography>
                <Typography fontWeight='bold' fontSize='small' style={{ wordBreak: 'break-all' }} color='#d32f2f'>{productSKU}</Typography>
              </Stack> */}

              <Button variant="contained"
                onClick={() => setDisplayHeader(!displayHeader)}
                style={{ backgroundColor: '#ffeb9c', color: 'black', width: 'fit-content', alignSelf: 'end' }}
              >
                {displayHeader ? <CloseIcon /> : <MenuIcon />}
              </Button>

              {/* <Stack direction='row' justifyContent='end'>
                <TextField value={url} onChange={(e) => setURL(e.target.value)} placeholder="Search by URL" variant="filled" style={{ borderRadius: 0 }} />
                <Button variant="contained"
                  onClick={executePythonScript}
                  style={{ backgroundColor: "black", color: "white", borderRadius: 0 }}
                >

                  <Stack direction='row' gap={2} alignItems='center'>
                    <Typography fontWeight='bold'>GO</Typography>
                    {dataLoading && <CircularProgress size={26} color="warning" />}
                  </Stack>
                </Button>
              </Stack>
              <Typography textAlign='center' fontSize={16} fontWeight='bold'>or</Typography>
              <Button variant="contained"
                onClick={executePythonScript}
                style={{ backgroundColor: '#ffeb9c', color: 'black' }}
              >

                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography fontWeight='bold'>Fetch</Typography>
                  {dataLoading && <CircularProgress size={26} color="warning" />}
                </Stack>
              </Button> */}

              <Stack direction="column">
                <Typography>Build Material</Typography>
                <Select
                  size="small"
                  value={filters.buildMaterial}
                  onChange={(e) => {
                    setFilters((pre) => ({
                      ...pre,
                      buildMaterial: e.target.value,
                    }));
                  }}
                  name="buildMaterial"
                  disabled={!suggestEdit}
                >
                  <MenuItem value="IRON PIPE / MDF">IRON PIPE / MDF</MenuItem>
                  <MenuItem value="SOLID WOOD">SOLID WOOD</MenuItem>
                </Select>
              </Stack>

              <Stack direction="column">
                <Typography>Unit Selector</Typography>
                <Select
                  size="small"
                  value={filters.unitSelector}
                  onChange={(e) => {
                    setFilters((pre) => ({
                      ...pre,
                      unitSelector: e.target.value,
                    }));
                  }}
                  name="unitSelector"
                >
                  <MenuItem value="Inch">Inch</MenuItem>
                  <MenuItem value="Centimeter">Centimeter</MenuItem>
                  <MenuItem value="Meter">Meter</MenuItem>
                </Select>
              </Stack>

              <Stack direction="column" alignItems="center">
                <Typography>Suggest Edit</Typography>
                <Switch
                  disabled={!dataLoaded}
                  onChange={(e) => {
                    // if (suggestEdit) {
                    //   setProductProperties(productPropertiesOld);
                    // }
                    setSuggestEdit(!suggestEdit);
                  }}
                />
              </Stack>

            </Stack>


            <Stack direction='column' alignSelf='end' width='100%' gap={2}>


              <Stack direction="column">
                {productNotUnderstandable ? <Typography textAlign='center' fontWeight='bold' fontStyle='italic'>Product Decleared as NOT UNDERSTANDABLE</Typography> : <Typography >Report Issue</Typography>}

                <Button variant="outlined"
                  onClick={executePythonScriptSubmit_not_understandable}
                  disabled={!dataLoaded}

                  color="error"
                >
                  <Stack direction='row' gap={2} alignItems='center'>
                    <Typography fontSize='small' fontWeight='bold'>NOT UNDERSTANDABLE</Typography>
                    {dataSubmitting && <CircularProgress size={26} color="info" />}
                  </Stack>
                </Button>
              </Stack>

              <Typography textAlign='center'>or</Typography>
              <Stack direction='column' alignSelf='end' width='100%' gap={1}>
                <Select
                  size='small'
                  disabled={!dataLoaded}
                  value={filters.qaScorecard}
                  onChange={(e) => {
                    setFilters(pre => ({
                      ...pre,
                      qaScorecard: e.target.value
                    }))
                  }}
                  name='buildMaterial'
                >
                  {productNotUnderstandable === false && <MenuItem MenuItem value="QA Scorecard">QA Scorecard</MenuItem>}
                  {productNotUnderstandable === false && <MenuItem value="minor">MINOR Fixes</MenuItem>}
                  <MenuItem value="major">MAJOR Fixes</MenuItem>
                  {productNotUnderstandable === false && <MenuItem value="passed">100% [QA Passed]</MenuItem>}
                </Select>
                <Button variant='contained' color="success" disabled={filters.qaScorecard === 'QA Scorecard' || !dataLoaded} onClick={executePythonScriptSubmit}>
                  submit
                </Button>
              </Stack>

            </Stack>
          </Stack>

        </Stack>
      </Wrapper >
    </>
  );
}

const Wrapper = styled.main`
  input {
    padding: 8.5px 0px;
    text-align: center;
  }

  td {
    padding: 0;
    border-bottom: none;
  }
  td div {
    border-radius: 0px;
    font-size: medium;
  }
  .table-head {
    background-color: black;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  .cell-head {
    background-color: #ffeb9c;
    white-space: nowrap;
  }

  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
  }

  .cell-disabled {
    background-color: #c6efce;
  }

  .cell-disabled > div {
    font-weight: bold;
  }
`;

export default DimensionalQAAnalyst;
