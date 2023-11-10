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
    ButtonGroup,
    Card,
    CircularProgress,
    Grid,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TableFooter,
    TextField,
    Typography,
    colors,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function SuperAdmin(props) {

    const [open, setOpen] = useState(false);

    const [tableFilter, setTableFilter] = useState('Extractor')
    const [tableData, setTableData] = useState(null)
    const [dataLoading, setDataLoading] = useState(true)

    const fetchSuperTable = async () => {
        setDataLoading(true)
        if (props.user) {
            // Get the authentication token
            props.user
                .getIdToken()
                .then((token) => {
                    // Define the API endpoint URL
                    const apiUrl = `http://139.144.30.86:8000/api/super_table?job=${tableFilter}`;
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
                            setTableData(data)
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
    }

    useEffect(() => {

        fetchSuperTable()

    }, [tableFilter])

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <Wrapper>
                {dataLoading ? <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' justifyContent='center' alignItems='center' height='calc(100vh - 8px)'>
                    <CircularProgress size={56} color="info" />
                </Stack> :
                    <Stack>
                        <Stack direction='row' justifyContent='end' alignItems='center' m={2}>
                            <Stack direction="column">
                                <Typography>Filter By Job</Typography>
                                <Select
                                    size="medium"
                                    value={tableFilter}
                                    onChange={(e) => {
                                        setTableFilter(e.target.value);
                                    }}
                                    name="tableFilterList"
                                >
                                    <MenuItem value="Extractor">Extractor</MenuItem>
                                    <MenuItem value="QA-Extractor">QA-Extractor</MenuItem>
                                    <MenuItem value="DimAna">DimAna</MenuItem>
                                    <MenuItem value="QA-DimAna">QA-DimAna</MenuItem>
                                </Select>
                            </Stack>
                        </Stack>


                        <TableContainer className="cost-table" component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow className="cell-head">
                                        {tableFilter === 'Extractor' || tableFilter === 'QA-Extractor' && <TableCell>Thumbnail</TableCell>}
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Worker</TableCell>
                                        <TableCell>QA-Worker</TableCell>
                                        <TableCell>Penalty</TableCell>
                                        <TableCell>last Modified</TableCell>
                                        {tableFilter !== 'QA-Extractor' && <TableCell>tableID</TableCell>}
                                        {tableFilter === 'Extractor' || tableFilter === 'QA-Extractor' && <TableCell>variantID</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData && tableData.data.map((row, index) => {
                                        return (
                                            <TableRow>
                                                {
                                                    tableFilter === 'Extractor' || tableFilter === 'QA-Extractor' && <TableCell className="cell-entry">
                                                        {row.thumbnail ? <img src={row.thumbnail} style={{ maxWidth: '100px' }} /> : <p>image</p>}
                                                    </TableCell>
                                                }
                                                <TableCell className="cell-entry">
                                                    {row.productID}
                                                </TableCell>
                                                <TableCell className="cell-entry">
                                                    {row.status}
                                                </TableCell>
                                                <TableCell className="cell-entry">
                                                    {row.Worker}
                                                </TableCell>
                                                <TableCell className="cell-entry">
                                                    {row['QA-Worker']}
                                                </TableCell>
                                                <TableCell className="cell-entry">
                                                    {row.penalty}
                                                </TableCell>
                                                <TableCell className="cell-entry">
                                                    {row.lastModified}
                                                </TableCell>
                                                {tableFilter !== 'QA-Extractor' && <TableCell className="cell-entry">
                                                    {row.tableID}
                                                </TableCell>}
                                                {tableFilter === 'Extractor' || tableFilter === 'QA-Extractor' && <TableCell className="cell-entry">
                                                    {row.variantID}
                                                </TableCell>}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Stack direction='row' justifyContent='end' m={2}>
                            <Pagination page={tableData.curr_page + 1} count={tableData.total_pages + 2} variant="outlined" shape="rounded" onChange={(e, value) => {
                                setTableData(pre => ({
                                    ...pre,
                                    curr_page: value - 1
                                }))
                            }} />
                        </Stack>

                    </Stack>
                }
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
    border: 1px solid black;
  }

  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
    border: 1px solid black;
    font-size: medium;
  }

  .costProduct-cell-head {
    background-color: black;
    white-space: nowrap;
    border: 1px solid black;
}

.costProduct-cell-head > th {
    border: 1px solid white;
    color: white;
    font-weight: bold;
    font-size: medium;
  }

  .productCost-cell-disabled {
    background-color: #e4c1f9;
  }

  .productCost-cell-disabled > div {
    font-weight: bold;
  }

  .cell-entry {
    background-color: #c6efce;
    font-size: large;
    text-align: center;
    border: 1px solid black;
    padding: 10px;
}

.cell-entry > div {
    font-weight: bold;
  }

  .cost-table td div {
    font-size: medium;
  }

  .costProduct-cell-head .cell-disabled {
    background-color: black;
  }
`;

export default SuperAdmin