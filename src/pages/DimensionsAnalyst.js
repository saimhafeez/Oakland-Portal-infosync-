import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
  Modal,
  Select,
  Stack,
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
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function DimensionsAnalyst(props) {
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataSubmitting, setDataSubmitting] = useState(false);
  const [displayProductDataType, setDisplayProductDataType] = useState('images');

  const [productID, setProductID] = useState("");
  const [images, setImages] = useState([]);
  const [weightAndDimentions, setWeightAndDimentions] = useState({});

  const [displayHeader, setDisplayHeader] = useState(false)
  const [openModal, setOpenModal] = useState(0);


  const executePythonScript = async () => {
    setDataLoading(true)
    console.log("props.user", props.user);
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://139.144.30.86:8000/api/get_job";
          console.log(token);
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
            .then((data) => {
              // Handle the API response data
              console.log("API Response:", data);
              setImages(data.images);
              setWeightAndDimentions(data["weight and dimensions"]);
              setPreviewImage(data.images[0]);
              // setPreviewImage(images.dimen[0]);
              setProductID(data.id);
              setDataLoaded(true);
              setDataLoading(false)
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

  const executePythonScriptSubmit = async () => {
    console.log("props.user", props.user);
    setDataSubmitting(true);

    const payload = exportData();
    payload.change = ''
    console.log("body", payload);
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://139.144.30.86:8000/api/submit";
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
              setPreviewImage("")
              setDataLoading(false);
              setDataLoaded(false);
              SetFilters((pre) => ({
                ...pre,
                buildMaterial: "IRON PIPE / MDF"
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
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                ],
                miscTableRows: PropsModel["miscTableRows"],
              })

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
    setDataSubmitting(true);

    const payload = exportData();
    payload.change = 'not_understandable'

    console.log("body", payload);
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://139.144.30.86:8000/api/submit";
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
              setPreviewImage("")
              setDataLoading(false);
              setDataLoaded(false);
              SetFilters((pre) => ({
                ...pre,
                buildMaterial: "IRON PIPE / MDF"
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
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                  PropsModel["woodTapeRows"],
                ],
                miscTableRows: PropsModel["miscTableRows"],
              })

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

  const [previewImage, setPreviewImage] = useState('');
  const [filters, SetFilters] = useState({
    unitSelector: "Inch",
    buildMaterial: "IRON PIPE / MDF",
    reportIssue: false,
  });

  const [productProperties, setProductProperties] = useState({
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
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
      PropsModel["woodTapeRows"],
    ],
    miscTableRows: PropsModel["miscTableRows"],
  });

  const addNewRow = (propType) => {
    setProductProperties((pre) => ({
      ...pre,
      [propType]: [...pre[propType], PropsModel[propType]],
    }));
  };

  const handleEdit = (e, key, propType) => {
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
      productProperties: {
        ironPipeRows: exportedIronPipeRows,
        woodenSheetRows: exportedWoodenSheetRows,
        woodTapeRows: exportedWoodTapeRows,
        miscTableRows: exportedMiscTableRows,
      },
    };

  };

  const [pasteBin, setPasteBin] = useState('');

  const fillDataFromPasteBin = () => {

    const data = pasteBin.split("\n");

    if (openModal === 1) {
      const ironPipeRows = []
      data.map((item) => {
        const chunks = item.split("\t");
        console.log('chunk[2] -->', chunks[2]);
        ironPipeRows.push({
          pipeTypeNSize: `${chunks[1]}  ${chunks[2].replaceAll('"', "''")}`,
          length: chunks[3],
          qty: chunks[4]
        })
      })

      setProductProperties(pre => ({
        ...pre,
        ironPipeRows: ironPipeRows
      }))

      console.log('-->', ironPipeRows);

      setOpenModal(0)
      setPasteBin("")
    } else if (openModal === 2) {
      const woodenSheetRows = []
      data.map((item) => {
        const chunks = item.split("\t");
        woodenSheetRows.push({
          type: chunks[0],
          length: chunks[1],
          width: chunks[2],
          qty: chunks[3]
        })
      })

      setProductProperties(pre => ({
        ...pre,
        woodenSheetRows: woodenSheetRows
      }))

      console.log('-->', woodenSheetRows[0]);

      setOpenModal(0)
      setPasteBin("")
    } else if (openModal === 3) {
      const woodTapeRows = []
      data.map((item) => {
        const chunks = item.split("\t");
        woodTapeRows.push({
          size: chunks[0],
          length: chunks[1],
          qty: chunks[2]
        })
      })

      setProductProperties(pre => ({
        ...pre,
        woodTapeRows: woodTapeRows
      }))

      console.log('-->', woodTapeRows[0]);

      setOpenModal(0)
      setPasteBin("")
    } else if (openModal === 4) {
      const miscTableRows = PropsModel["miscTableRows"]
      data.map((item) => {
        const chunks = item.split("\t");

        for (var i = 0; i < miscTableRows.length; i++) {
          if (chunks[0] === miscTableRows[i].item && chunks[2] !== "") {
            miscTableRows[i].size = chunks[1]
            miscTableRows[i].qty = chunks[2]
          }
        }
      })

      setProductProperties(pre => ({
        ...pre,
        miscTableRows: miscTableRows
      }))

      console.log('-->', miscTableRows[0]);

      setOpenModal(0)
      setPasteBin("")
    }
  }

  return (
    <>
      {
        displayHeader && <HeaderSignOut
          userEmail={props.userEmail}
          userRole={props.userRole}
          userJdesc={props.userJdesc}
        />
      }

      <Wrapper>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(0)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 1200,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Stack gap={2}>
              <TextField
                label="Table Data"
                variant="outlined"
                type="text"
                multiline
                value={pasteBin}
                onChange={(e) => setPasteBin(e.target.value)}
              />
              <Button
                onClick={fillDataFromPasteBin}
                variant="contained"
                style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' height='calc(100vh - 8px)'>

          <Stack width='50%' justifyContent='space-between' alignItems='center'>

            <Stack direction='column' width='100%' spacing={0.5} p={1}>

              {displayProductDataType === 'images' && <Stack>
                <img src={previewImage} width="80%" height='auto' style={{ alignSelf: 'center' }} />
              </Stack>}

              {dataLoaded && displayProductDataType === 'images' ?
                <Stack paddingTop={2} direction='row' overflow='auto' width='100%' spacing={1}>
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

            </Stack>

            <Stack marginBottom={2}>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
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

          </Stack>

          <Stack direction='column' gap={3} width='35%' overflow='auto'>

            <Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={6}>
                        <Stack direction='row' justifyContent='space-between'>
                          <div></div>
                          <Typography fontWeight='bold'>Iron Pipe</Typography>
                          <Box style={{ cursor: "pointer" }} onClick={() => setOpenModal(1)}>
                            <ContentPasteIcon />
                          </Box>
                        </Stack>
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
                          editable={dataLoaded}
                          hideDetails={true}
                        />
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <Button
                      onClick={() => {
                        addNewRow("ironPipeRows");
                      }}
                    >
                      <AddCircleIcon htmlColor="#1976d2" />
                    </Button>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Stack>

            <Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={8}>
                        <Stack direction='row' justifyContent='space-between'>
                          <div></div>
                          <Typography fontWeight='bold'>Wooden Sheet</Typography>
                          <Box style={{ cursor: "pointer" }} onClick={() => setOpenModal(2)}>
                            <ContentPasteIcon />
                          </Box>
                        </Stack>
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
                          editable={dataLoaded}
                          hideDetails={true}
                        />
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <Button
                      onClick={() => {
                        addNewRow("woodenSheetRows");
                      }}
                    >
                      <AddCircleIcon htmlColor="#1976d2" />
                    </Button>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Stack>

            {/* <Grid container spacing={1} direction="row">
    <Grid item xs={12} md={5}>
      
    </Grid>
  </Grid> */}

            <Stack>
              {filters.buildMaterial !== "SOLID WOOD" && (
                <TableContainer component={Paper} variant="outlined">
                  <Table padding={0} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className="table-head" colSpan={8}>
                          <Stack direction='row' justifyContent='space-between'>
                            <div></div>
                            <Typography fontWeight='bold'>Wood Tape</Typography>
                            <Box style={{ cursor: "pointer" }} onClick={() => setOpenModal(3)}>
                              <ContentPasteIcon />
                            </Box>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow className="cell-head">
                        <TableCell>Size</TableCell>
                        <TableCell>L&nbsp;&nbsp;</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Total</TableCell>
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
                            editable={dataLoaded}
                          />
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <Button
                        onClick={() => {
                          addNewRow("woodTapeRows");
                        }}
                      >
                        <AddCircleIcon htmlColor="#1976d2" />
                      </Button>
                    </TableFooter>
                  </Table>
                </TableContainer>
              )}
            </Stack>

            {/* <Grid container spacing={1} direction="row">
    <Grid item xs={12} md={5}>

    </Grid>
  </Grid> */}


            <Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table padding={0} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-head" colSpan={8}>
                        <Stack direction='row' justifyContent='space-between'>
                          <div></div>
                          <Typography fontWeight='bold'>Misc</Typography>
                          <Box style={{ cursor: "pointer" }} onClick={() => setOpenModal(4)}>
                            <ContentPasteIcon />
                          </Box>
                        </Stack>
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
                </Table>
              </TableContainer>
            </Stack>

          </Stack>

          <Stack direction="column" width='15%' gap={4} p={1} justifyContent='space-between'>

            <Stack direction="column" gap={1}>

              <Button variant="contained"
                onClick={() => setDisplayHeader(!displayHeader)}
                style={{ backgroundColor: '#ffeb9c', color: 'black', width: 'fit-content', alignSelf: 'end' }}
              >
                {displayHeader ? <CloseIcon /> : <MenuIcon />}
              </Button>

              <Stack direction='row' justifyContent='end'>
                <TextField placeholder="Search by URL" variant="filled" style={{ borderRadius: 0 }} />
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
              </Button>


              <Stack direction="column">
                <Typography>Report Issue</Typography>

                <Button variant="outlined"
                  onClick={executePythonScriptSubmit_not_understandable}
                  disabled={!dataLoaded}

                  color="error"
                >
                  <Stack direction='row' gap={2} alignItems='center'>
                    <Typography fontWeight='bold'>Not Understandable</Typography>
                    {dataSubmitting && <CircularProgress size={26} color="info" />}
                  </Stack>
                </Button>
              </Stack>


              <Stack direction="column">
                <Typography>Build Material</Typography>
                <Select
                  size="small"
                  value={filters.buildMaterial}
                  onChange={(e) => {
                    SetFilters((pre) => ({
                      ...pre,
                      buildMaterial: e.target.value,
                    }));
                  }}
                  name="buildMaterial"
                  disabled={!dataLoaded}
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
                    SetFilters((pre) => ({
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

            </Stack>

            <Stack direction="column">
              <Button variant="outlined"
                onClick={executePythonScriptSubmit}
                disabled={!dataLoaded}
                color="error"
              >
                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography fontWeight='bold'>Submit</Typography>
                  {dataSubmitting && <CircularProgress size={26} color="info" />}
                </Stack>
              </Button>
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
    border: 2px solid black;
  }

  .cell-head {
    background-color: #ffeb9c;
    white-space: nowrap;
  }
  
  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
    text-align: center;
    border: 2px solid black;
    font-size: medium;
  }

  .cell-disabled {
    background-color: #c6efce;
  }

  .cell-disabled > div {
    font-weight: bold;
  }
`;

export default DimensionsAnalyst;

// FOR NEW IMAGES FORMAT
// UPCOMING NEW IMAGE FORMAT
// {
//   thumbnail: 'https://assets.wfcdn.com/im/44077389/resize-h755-w755%5Ecompr-r85/1574/157448955/Ossabaw+3+Piece+Bedroom+Set.jpg',
//   dimen: [
//     'https://assets.wfcdn.com/im/92000998/resize-h755-w755%5Ecompr-r85/2173/217355837/Ossabaw+3+Piece+Bedroom+Set.jpg',
//     'https://assets.wfcdn.com/im/39043468/resize-h755-w755%5Ecompr-r85/2464/246410978/Ossabaw+3+Piece+Bedroom+Set.jpg',
//     'https://assets.wfcdn.com/im/47924497/resize-h755-w755%5Ecompr-r85/1574/157448937/Ossabaw+3+Piece+Bedroom+Set.jpg'
//   ],
//   supporting: [
//     'https://assets.wfcdn.com/im/70782765/resize-h755-w755%5Ecompr-r85/1574/157448944/Ossabaw+3+Piece+Bedroom+Set.jpg',
//     'https://assets.wfcdn.com/im/42118335/resize-h755-w755%5Ecompr-r85/1714/171434297/Ossabaw+3+Piece+Bedroom+Set.jpg',
//     'https://assets.wfcdn.com/im/40131680/resize-h755-w755%5Ecompr-r85/1714/171428743/Ossabaw+3+Piece+Bedroom+Set.jpg'
//   ]
// }

{/* <Stack direction='row' overflow='auto' width='100%' spacing={1}>
  {images.dimen.map((source, index) => {
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
  <img
    onClick={() => setPreviewImage(images.thumbnail)}
    width="90px"
    src={images.thumbnail}
    style={{
      border: `2px solid ${images.thumbnail === previewImage ? 'red' : 'black'}`
    }}
  />
  {images.supporting.map((source, index) => {
    return (
      <img
        onClick={() => {
          console.log('source', source);
          setPreviewImage(source)
        }}
        width="90px"
        src={source}
        key={index}
        style={{
          border: `2px solid ${source === previewImage ? 'red' : 'black'}`
        }}
      />
    );
  })}
</Stack> */}