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
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  TableFooter,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropsModel from "../res/PropsModel";
import WoodenSheetTableRow from "../components/dimensionsAnalyst/WoodenSheetTableRow";
import WoodTapeTableRow from "../components/dimensionsAnalyst/WoodTapeTableRow";
import MiscTableRow from "../components/dimensionsAnalyst/MiscTableRow";
import axios from "axios";
import { useNavigate } from "react-router";

function DimensionsAnalyst(props) {
  const [pageLoading, setPageLoading] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   new Promise(async (resolve, reject) => {
  //     try {
  //       const { data } = await axios.get("/api/v1/pages/dimensional-analyst");
  //       resolve(data);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   })
  //     .then((data) => {
  //       setPageLoading(false);
  //     })
  //     .catch((error) => {
  //       // navigate("/not-allowed");
  //     });
  // }, []);

  const images = [
    "https://assets.wfcdn.com/im/00332598/resize-h755-w755%5Ecompr-r85/1596/159631341/Ossabaw+3+Piece+Bedroom+Set.jpg",
    "https://assets.wfcdn.com/im/92000998/resize-h755-w755%5Ecompr-r85/2173/217355837/Ossabaw+3+Piece+Bedroom+Set.jpg",
    "https://assets.wfcdn.com/im/47924497/resize-h755-w755%5Ecompr-r85/1574/157448937/Ossabaw+3+Piece+Bedroom+Set.jpg",
  ];

  const [previewImage, setPreviewImage] = useState(images[0]);
  const [filters, SetFilters] = useState({
    unitSelector: "Inch",
    buildMaterial: "IRON PIPE / MDF",
    reportIssue: "Have an Issue ?",
  });

  const [productProps, setProductProps] = useState({
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
    setProductProps((pre) => ({
      ...pre,
      [propType]: [...pre[propType], PropsModel[propType]],
    }));
  };

  const handleEdit = (e, key, propType) => {
    setProductProps((pre) => {
      const updatedRows = [...pre[propType]];
      updatedRows[key] = {
        ...updatedRows[key],
        [e.target.name]: e.target.value,
      };
      return { ...pre, [propType]: updatedRows };
    });
  };

  const exportData = () => {
    var exportedIronPipeRows = productProps.ironPipeRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") && (row.qty != 0 || row.qty != "")
    );

    var exportedWoodenSheetRows = productProps.woodenSheetRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") &&
        (row.qty != 0 || row.qty != "") &&
        (row.width != 0 || row.width != "")
    );

    var exportedWoodTapeRows = productProps.woodTapeRows.filter(
      (row) =>
        (row.length != 0 || row.length != "") && (row.qty != 0 || row.qty != "")
    );

    var exportedMiscTableRows = productProps.miscTableRows.filter(
      (row) => row.qty != 0 || row.qty != ""
    );

    console.log("productProps", {
      productProps: {
        ironPipeRows: exportedIronPipeRows,
        woodenSheetRows: exportedWoodenSheetRows,
        woodTapeRows: exportedWoodTapeRows,
        miscTableRows: exportedMiscTableRows,
      },
    });
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
                      <Button onClick={() => setPipEnabled(true)}>
                        Open PiP
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell style={{ background: "#cbdcf7" }}>
                      <Typography textAlign="center">
                        Bed : 45.3'' H X 57.7'' W X 80.7'' L
                        <br />
                        <br />
                        Headboard Width - Side to Side : 57.7'' W
                        <br />
                        <br />
                        Footboard Width - Side to Side : 55.9'' W
                        <br />
                        <br />
                        Bed Weight : 106 lb.
                      </Typography>
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
                      {productProps.ironPipeRows.map((row, index) => {
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
                      {productProps.woodenSheetRows.map((row, index) => {
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
                        {productProps.woodTapeRows.map((row, index) => {
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
                      {productProps.miscTableRows.map((row, index) => {
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

            <Button
              variant="contained"
              onClick={() => {
                exportData();
              }}
            >
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
