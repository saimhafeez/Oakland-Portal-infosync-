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
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  TableFooter,
  Typography,
  colors,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropsModel from "../res/PropsModel";
import WoodenSheetTableRow from "../components/dimensionsAnalyst/WoodenSheetTableRow";
import WoodTapeTableRow from "../components/dimensionsAnalyst/WoodTapeTableRow";
import MiscTableRow from "../components/dimensionsAnalyst/MiscTableRow";

function DimensionsAnalyst(props) {
  const [pageLoading, setPageLoading] = useState(true);

  const [productID, setProductID] = useState("");
  const [images, setImages] = useState([]);
  const [weightAndDimentions, setWeightAndDimentions] = useState({});

  const executePythonScript = async () => {
    console.log("props.user", props.user);
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://161.97.167.225:5001/api/get_job";
          console.log(token);
          // Make an authenticated API request
          fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
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
              setImages(data.images);
              setWeightAndDimentions(data["weight and dimensions"]);
              setPageLoading(false);
              setPreviewImage(data.images[0]);
              setProductID(data.id);
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

    const payload = exportData();
    console.log("body", payload);

    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://161.97.167.225:5001/api/submit";
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
              setImages(data.images);
              setWeightAndDimentions(data["weight and dimensions"]);
              setPageLoading(false);
              setPreviewImage(data.images[0]);
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

  useEffect(() => {
    executePythonScript();
  }, []);

  const [previewImage, setPreviewImage] = useState(images[0]);
  const [filters, SetFilters] = useState({
    unitSelector: "Inch",
    buildMaterial: "IRON PIPE / MDF",
    reportIssue: "Have an Issue ?",
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

  const [pipEnabled, setPipEnabled] = useState(false);

  return (
    <>
      <HeaderSignOut
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
      />

      <Wrapper>
        {pageLoading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={1}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={"55%"} className="table-head">
                      Images
                    </TableCell>
                    <TableCell width={"1%"}></TableCell>
                    <TableCell width={"44%"} className="table-head">
                      Specifications
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <img width="100%" src={previewImage} />
                      <Stack justifyContent="center" direction="row">
                        {images.map((source, index) => {
                          return (
                            <img
                              onClick={() => setPreviewImage(source)}
                              width="120px"
                              src={source}
                              key={index}
                            />
                          );
                        })}
                      </Stack>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell style={{ background: "#cbdcf7", padding: 10 }}>
                      {Object.keys(weightAndDimentions).map(
                        (category, index) => {
                          return (
                            <Stack direction="column">
                              <Typography fontWeight="bold">
                                {category}
                              </Typography>

                              <Paper
                                variant="outlined"
                                direction="column"
                                style={{ padding: 5 }}
                              >
                                {Object.keys(weightAndDimentions[category]).map(
                                  (item, _index) => {
                                    return (
                                      <Stack
                                        direction="row"
                                        gap={1}
                                        style={{
                                          backgroundColor:
                                            _index % 2 == 0
                                              ? "transparent"
                                              : colors.grey[200],
                                        }}
                                      >
                                        <Typography>{item}: </Typography>
                                        <Typography>
                                          {weightAndDimentions[category][item]}
                                        </Typography>
                                      </Stack>
                                    );
                                  }
                                )}
                              </Paper>
                            </Stack>
                          );
                        }
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Paper variant="outlined" style={{ padding: "1rem" }}>
              <Stack direction="row" gap={4} justifyContent="center">
                <Stack direction="column">
                  <Typography>Report Issue</Typography>
                  <Select
                    size="small"
                    value={filters.reportIssue}
                    onChange={(e) => {
                      SetFilters((pre) => ({
                        ...pre,
                        reportIssue: e.target.value,
                      }));
                    }}
                    name="reportIssue"
                  >
                    <MenuItem value="Have an Issue ?">Have an Issue ?</MenuItem>
                    <MenuItem value="Not Understandable">
                      Not Understandable
                    </MenuItem>
                    <MenuItem value="Product / URL Missing">
                      Product / URL Missing
                    </MenuItem>
                  </Select>
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
            </Paper>

            <Grid container spacing={1} direction="row">
              <Grid item xs={12} md={3.5}>
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
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
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
              </Grid>

              <Grid item xs={12} md={4.5}>
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
                        <TableCell>L (ft.)</TableCell>
                        <TableCell>W (ft.)</TableCell>
                        <TableCell>L*W (Sq ft.)</TableCell>
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
              </Grid>

              {filters.buildMaterial !== "SOLID WOOD" && (
                <Grid item xs={12} md={2}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table padding={0} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className="table-head" colSpan={8}>
                            Wood Tape
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
                </Grid>
              )}

              <Grid item xs={12} md={2}>
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
                          />
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      {/* <Button onClick={() => {
                                        addNewRow('woodTapeRows')
                                    }}>
                                        <AddCircleIcon htmlColor='#1976d2' />
                                    </Button> */}
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Button variant="contained" onClick={executePythonScriptSubmit}>
              submit
            </Button>
          </Stack>
        )}
      </Wrapper>
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
    font-size: small;
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

export default DimensionsAnalyst;
