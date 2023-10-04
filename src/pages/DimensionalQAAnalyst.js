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
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  TableFooter,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropsModel from "../res/PropsModel";
import WoodenSheetTableRow from "../components/dimensionsAnalyst/WoodenSheetTableRow";
import WoodTapeTableRow from "../components/dimensionsAnalyst/WoodTapeTableRow";
import MiscTableRow from "../components/dimensionsAnalyst/MiscTableRow";
import { useNavigate } from "react-router";
import axios from "axios";

const productObject = {
  productProps: {
    ironPipeRows: [
      {
        pipeTypeNSize: "Square  01'' x 01''",
        length: 2.3,
        qty: 2,
      },
      {
        pipeTypeNSize: "Square  01'' x 02''",
        length: 2.5,
        qty: 1,
      },
    ],
    woodenSheetRows: [
      {
        type: "Horizontal",
        length: 2,
        width: 5.6,
        qty: 5,
      },
      {
        type: "Vertical",
        length: 1.2,
        width: 5.5,
        qty: 1,
      },
    ],
    woodTapeRows: [
      {
        size: "Big",
        length: 4,
        qty: 7,
      },
      {
        size: "small",
        length: 9,
        qty: 1,
      },
      {
        size: "small",
        length: 10,
        qty: 8,
      },
    ],
    miscTableRows: [
      {
        item: "Wheels",
        size: "Small",
        qty: 8,
      },
      {
        item: "Cross Rods",
        size: "Big",
        qty: 9,
      },
      {
        item: "Realing",
        size: "Small",
        qty: 10,
      },
    ],
  },
  buildMaterial: "IRON PIPE / MDF",
  images: [
    "https://assets.wfcdn.com/im/00332598/resize-h755-w755%5Ecompr-r85/1596/159631341/Ossabaw+3+Piece+Bedroom+Set.jpg",
    "https://assets.wfcdn.com/im/92000998/resize-h755-w755%5Ecompr-r85/2173/217355837/Ossabaw+3+Piece+Bedroom+Set.jpg",
    "https://assets.wfcdn.com/im/47924497/resize-h755-w755%5Ecompr-r85/1574/157448937/Ossabaw+3+Piece+Bedroom+Set.jpg",
  ],
  version: 1,
};

function DimensionalQAAnalyst(props) {
  const [pageLoading, setPageLoading] = useState(false);

  const navigate = useNavigate();

  //   useEffect(() => {
  //     new Promise(async (resolve, reject) => {
  //       try {
  //         const { data } = await axios.get(
  //           "/api/v1/pages/dimensional-qa-analyst"
  //         );
  //         resolve(data);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     })
  //       .then((data) => {
  //         setPageLoading(false);
  //       })
  //       .catch((error) => {
  //         navigate("/not-allowed");
  //       });
  //   }, []);

  const [suggestEdit, setSuggestEdit] = useState(false);
  const [hideStaticTable, setHideStaticTable] = useState(false);
  const [previewImage, setPreviewImage] = useState(productObject.images[0]);
  const [filters, SetFilters] = useState({
    unitSelector: "Inch",
    buildMaterial: productObject.buildMaterial,
    qaScorecard: "QA Scorecard",
  });

  const getFilledRows = (propType) => {
    const filledData = Array.from(productObject.productProps[propType]);
    for (var i = filledData.length; i < 9; i++) {
      filledData.push(PropsModel[propType]);
    }
    return filledData;
  };

  const getMiscTableRows = () => {
    const rows = PropsModel["miscTableRows"];
    rows.map((row) => {
      productObject.productProps.miscTableRows.map((misc) => {
        if (misc.item === row.item) {
          row.qty = misc.qty;
          row.size = misc.size;
        }
      });
    });
    return rows;
  };

  const [productProps, setProductProps] = useState({
    ironPipeRows: getFilledRows("ironPipeRows"),
    woodenSheetRows: getFilledRows("woodenSheetRows"),
    woodTapeRows: getFilledRows("woodTapeRows"),
    miscTableRows: getMiscTableRows(),
  });

  const addNewRow = (propType) => {
    setProductProps((pre) => ({
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

    console.log("version: 1", {
      productProps: productObject.productProps,
    });
    console.log("version: 2", {
      productProps: {
        ironPipeRows: exportedIronPipeRows,
        woodenSheetRows: exportedWoodenSheetRows,
        woodTapeRows: exportedWoodTapeRows,
        miscTableRows: exportedMiscTableRows,
      },
    });
  };

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
          <Stack spacing={2}>
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
                        {productObject.images.map((source, index) => {
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
              <Stack
                direction="row"
                gap={4}
                justifyContent="center"
                alignItems="center"
              >
                <Stack>
                  <Typography>Hide Table</Typography>
                  <Switch
                    onChange={(e) => setHideStaticTable(!hideStaticTable)}
                  />
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

                <Stack direction="column" alignItems="center">
                  <Typography>Suggest Edit</Typography>
                  <Switch onChange={(e) => setSuggestEdit(!suggestEdit)} />
                </Stack>
              </Stack>
            </Paper>

            {/* Static Tabel -- non-changeable */}
            {!hideStaticTable && (
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
                        {productObject.productProps.ironPipeRows.map(
                          (row, index) => {
                            return (
                              <IronPipeTableRow
                                key={index}
                                _key={index}
                                data={row}
                                handleEdit={handleEdit}
                                unitSelector={filters.unitSelector}
                                editable={false}
                              />
                            );
                          }
                        )}
                      </TableBody>
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
                        {productObject.productProps.woodenSheetRows.map(
                          (row, index) => {
                            return (
                              <WoodenSheetTableRow
                                key={index}
                                _key={index}
                                data={row}
                                handleEdit={handleEdit}
                                unitSelector={filters.unitSelector}
                                editable={false}
                              />
                            );
                          }
                        )}
                      </TableBody>
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
                          {productObject.productProps.woodTapeRows.map(
                            (row, index) => {
                              return (
                                <WoodTapeTableRow
                                  key={index}
                                  _key={index}
                                  data={row}
                                  handleEdit={handleEdit}
                                  unitSelector={filters.unitSelector}
                                  editable={false}
                                />
                              );
                            }
                          )}
                        </TableBody>
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
                        {productObject.productProps.miscTableRows.map(
                          (row, index) => {
                            return (
                              <MiscTableRow
                                key={index}
                                _key={index}
                                data={row}
                                handleEdit={handleEdit}
                                editable={false}
                              />
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Update (changeable) Table */}
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
                            editable={suggestEdit}
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
                            editable={suggestEdit}
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
                              editable={suggestEdit}
                            />
                          );
                        })}
                      </TableBody>
                      {suggestEdit && (
                        <TableFooter>
                          <Button
                            onClick={() => {
                              addNewRow("woodTapeRows");
                            }}
                          >
                            <AddCircleIcon htmlColor="#1976d2" />
                          </Button>
                        </TableFooter>
                      )}
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
                            editable={suggestEdit}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Stack direction="column" alignSelf="end">
              <Stack direction="row" gap={1}>
                <Select
                  size="small"
                  value={filters.qaScorecard}
                  onChange={(e) => {
                    SetFilters((pre) => ({
                      ...pre,
                      qaScorecard: e.target.value,
                    }));
                  }}
                  name="buildMaterial"
                >
                  <MenuItem value="QA Scorecard">QA Scorecard</MenuItem>
                  <MenuItem value="Minor Changes">Minor Changes</MenuItem>
                  <MenuItem value="Major Changes">Major Changes</MenuItem>
                  <MenuItem value="QA Passed">QA Passed</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  disabled={filters.qaScorecard === "QA Scorecard"}
                  onClick={() => {
                    exportData();
                  }}
                >
                  submit
                </Button>
              </Stack>
            </Stack>
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

export default DimensionalQAAnalyst;
