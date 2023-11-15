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
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import SuperAdminSidebar from "../components/sidebar/SuperAdminSidebar";
import { formatDate } from "../utils/formatDate";

function SuperAdmin(props) {

    const [open, setOpen] = useState(false);

    const [tableFilter, setTableFilter] = useState('Extractor')
    const [tableData, setTableData] = useState({
        isLoading: false,
        data: [
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Ali',
                qaExtractor: 'Ismail',
                dimAna: 'Farrukh',
                qaDimAna: 'Uzair',
                productID: "1213242",
                varientID: "4253254",
                extractionTimeStamp: "2023-09-12T15:25:16+00:00",
                qaExtractionQAStatus: "passed",
                qaDimAnaQAStatus: "minor",
                Earning: 8
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Ali',
                qaExtractor: 'Ismail',
                dimAna: 'Farrukh',
                qaDimAna: 'Uzair',
                productID: "1213243",
                varientID: "4253255",
                extractionTimeStamp: "2023-11-12T15:25:16+00:00",
                qaExtractionQAStatus: "major",
                qaDimAnaQAStatus: "minor",
                Earning: 10
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Ali',
                qaExtractor: 'Ismail',
                dimAna: 'Farrukh',
                qaDimAna: 'Uzair',
                productID: "1213244",
                varientID: "4253256",
                extractionTimeStamp: "2023-10-12T15:25:16+00:00",
                qaExtractionQAStatus: "minor",
                qaDimAnaQAStatus: "under_qa",
                Earning: 'N/A'
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Haider',
                qaExtractor: 'Farooq',
                dimAna: 'Ayesha',
                qaDimAna: 'Arslan',
                productID: "4327889",
                varientID: "4253257",
                extractionTimeStamp: "2023-09-12T15:25:16+00:00",
                qaExtractionQAStatus: "major",
                qaDimAnaQAStatus: "passed",
                Earning: 12
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Haider',
                qaExtractor: 'Farooq',
                dimAna: 'Ayesha',
                qaDimAna: 'Arslan',
                productID: "4327890",
                varientID: "4253258",
                extractionTimeStamp: "2023-11-12T15:25:16+00:00",
                qaExtractionQAStatus: "passed",
                qaDimAnaQAStatus: "passed",
                Earning: 8
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'Haider',
                qaExtractor: 'Farooq',
                dimAna: 'Ayesha',
                qaDimAna: 'Arslan',
                productID: "4327891",
                varientID: "4253259",
                extractionTimeStamp: "2023-10-12T15:25:16+00:00",
                qaExtractionQAStatus: "passed",
                qaDimAnaQAStatus: "not_understandable",
                Earning: 0
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'usman',
                qaExtractor: 'Umar',
                dimAna: 'Umair',
                qaDimAna: 'Afzal',
                productID: "0987666",
                varientID: "4253261",
                extractionTimeStamp: "2023-09-12T15:25:16+00:00",
                qaExtractionQAStatus: "major",
                qaDimAnaQAStatus: "major",
                Earning: 8
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'usman',
                qaExtractor: 'Umar',
                dimAna: 'Umair',
                qaDimAna: 'Afzal',
                productID: "0987667",
                varientID: "4253262",
                extractionTimeStamp: "2023-11-12T15:25:16+00:00",
                qaExtractionQAStatus: "passed",
                qaDimAnaQAStatus: "passed",
                Earning: 8
            },
            {
                thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
                extractor: 'usman',
                qaExtractor: 'Umar',
                dimAna: 'Umair',
                qaDimAna: 'Afzal',
                productID: "0987668",
                varientID: "4253263",
                extractionTimeStamp: "2023-10-12T15:25:16+00:00",
                qaExtractionQAStatus: "under_qa",
                qaDimAnaQAStatus: "",
                Earning: 'N/A'
            }
        ]
    })
    const fetchSuperTable = async () => {
        // setDataLoading(true)
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
                            // setDataLoading(false)
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

        // fetchSuperTable()

    }, [tableFilter])

    const [searchByID, setSearchByID] = useState("");
    const [filterByExtQAStatus, setFilterByExtQAStatus] = useState("qa-status");
    const [filterByDimQAStatus, setFilterByDimQAStatus] = useState("qa-status");

    const getAllProductsByFilter = () => {

        var products = tableData.data;

        if (searchByID !== '') {
            products = products.filter((item) => item.productID.includes(searchByID))
        }

        if (filterByExtQAStatus !== 'qa-status') {
            products = products.filter((item) => item.qaExtractionQAStatus === filterByExtQAStatus)
        }

        if (filterByDimQAStatus !== 'qa-status') {
            products = products.filter((item) => item.qaDimAnaQAStatus === filterByDimQAStatus)
        }

        return products
    }

    return (
        <>
            <Header
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <SuperAdminSidebar />

            <Wrapper>
                <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>
                    {tableData.isLoading ? <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' justifyContent='center' alignItems='center' height='calc(100vh - 8px)'>
                        <CircularProgress size={56} color="info" />
                    </Stack> :
                        <Stack>
                            {/* <Stack direction='row' justifyContent='end' alignItems='center' m={2}>
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
                            </Stack> */}


                            <table className="table mt-4 table-bordered table-striped align-middle text-center">
                                <thead className="table-dark">
                                    <tr className="border-0 bg-white">
                                        <th colSpan={2} className="bg-white text-dark border-0">
                                            {getAllProductsByFilter().length} Results Found
                                        </th>
                                        <th className="bg-white" style={{ maxWidth: 200 }}>
                                            <div className="d-flex flex-row">
                                                <input
                                                    className="p-2 w-100"
                                                    type="text"
                                                    placeholder="Search by P.ID"
                                                    style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                                                    onChange={(e) => setSearchByID(e.target.value)}
                                                    value={searchByID}
                                                />
                                                <button className="btn btn-go-fetch" onClick={() => setSearchByID("")}>Clear</button>
                                            </div>
                                        </th>
                                        <th className="bg-white"></th>
                                        <th className="bg-white"></th>
                                        <th className="bg-white"></th>
                                        <th className="bg-white"></th>
                                        <th className="bg-white"></th>
                                        <th className="bg-white" style={{ maxWidth: 200 }}>

                                            <select
                                                className="p-2 w-100"
                                                name="qa-status"
                                                id="qa-status"
                                                onChange={(e) => setFilterByExtQAStatus(e.target.value)}
                                                value={filterByExtQAStatus}
                                            >
                                                <option value="qa-status">Filter by Ext.QA Status</option>
                                                <option value="rejected_nad">Rejected NAD</option>
                                                <option value="passed">100% [QA Passed]</option>
                                                <option value="minor">MINOR [QA Passed]</option>
                                                <option value="major">MAJOR [QA Passed]</option>
                                            </select>

                                        </th>
                                        <th className="bg-white" style={{ maxWidth: 200 }}>

                                            <select
                                                className="p-2 w-100"
                                                name="qa-status"
                                                id="qa-status"
                                                onChange={(e) => setFilterByDimQAStatus(e.target.value)}
                                                value={filterByDimQAStatus}
                                            >
                                                <option value="qa-status">Filter by Dim.QA Status</option>
                                                <option value="not_understandable">Not Understandable</option>
                                                <option value="passed">100% [QA Passed]</option>
                                                <option value="minor">MINOR [QA Passed]</option>
                                                <option value="major">MAJOR [QA Passed]</option>
                                            </select>

                                        </th>
                                    </tr>
                                    <tr>
                                        <th># SR</th>
                                        <th>Thumbnail</th>
                                        <th>Product ID</th>
                                        <th>Varient ID</th>
                                        <th>Extractor - Date</th>
                                        <th>QA-Extractor - Date</th>
                                        <th>DimAna - Date</th>
                                        <th>QA-DimAna - Date</th>
                                        <th>Extraction QA Status</th>
                                        <th>DimAna QA Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getAllProductsByFilter().length === 0 && <tr>
                                        <td colSpan={6}>
                                            <h4 className="text-center p-2 w-100">0 Results</h4>
                                        </td>
                                    </tr>}
                                    {getAllProductsByFilter().map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={item.thumbnail} alt="" height="52px" />
                                            </td>
                                            <td>{item.productID}</td>
                                            <td>{item.varientID}</td>
                                            <td>
                                                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                                                    <p className="fw-bold">{item.extractor}</p>
                                                    <p className="text-secondary ">
                                                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                                                    <p className="fw-bold">{item.qaExtractor}</p>
                                                    <p className="text-secondary ">
                                                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                                                    <p className="fw-bold">{item.dimAna}</p>
                                                    <p className="text-secondary">
                                                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                                                    <p className="fw-bold">{item.qaDimAna}</p>
                                                    <p className="text-secondary">
                                                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                                                </div>
                                            </td>
                                            <td>{item.qaExtractionQAStatus === 'under_qa' ? 'Under QA' : item.qaExtractionQAStatus === 'not_understandable' ? 'Not Understandable' : item.qaExtractionQAStatus === 'minor' ? 'MINOR [QA Passed]' : item.qaExtractionQAStatus === 'major' ? 'MAJOR [QA Passed]' : item.qaExtractionQAStatus === 'passed' ? '100% [QA Passed]' : item.qaExtractionQAStatus === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</td>
                                            <td>{item.qaDimAnaQAStatus === 'under_qa' ? 'Under QA' : item.qaDimAnaQAStatus === 'not_understandable' ? 'Not Understandable' : item.qaDimAnaQAStatus === 'minor' ? 'MINOR [QA Passed]' : item.qaDimAnaQAStatus === 'major' ? 'MAJOR [QA Passed]' : item.qaDimAnaQAStatus === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

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
                </div>

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