import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import {
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";
import { formatDate } from "../../utils/formatDate";
import SuperAdminSidebar from "../../components/sidebar/SuperAdminSidebar";
import Header from "../../components/header/Header";



function ActualCostProducts(props) {


    const [searchByID, setSearchByID] = useState("");
    const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");
    const [filterByUser, setFilterByUser] = useState("user");

    const [productHistoryTimeStamp, setProductHistoryTimeStamp] = useState("")

    const [tableFilter, setTableFilter] = useState('QA-DimAna')

    const lt = (new Date().getTime() / 1000).toFixed(0)

    const [productHistory, setProductHistory] = useState([])

    const [tableData, setTableData] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        totalItems: 0,
        totalProductsPerPage: 10,
        reset: 0,
        data: []
    })

    const fetchSuperAdminData = async (currentPage = tableData.currentPage, pid = searchByID) => {
        //http://139.144.30.86:8000/api/super_table?job=Extractor

        setTableData((pre) => ({
            ...pre,
            isLoading: true
            // isLoading: false
        }))

        const lt = (new Date().getTime() / 1000).toFixed(0)
        // const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${tableFilter}&lt=${lt}&gt=0&page=${currentPage}`

        const only_passed = '&dimana_status=passed&dimana_status=minor&dimana_status=major'

        var apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/better_table?job=${tableFilter === 'Filter by Role' ? 'Extractor' : tableFilter}&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${currentPage}&items_per_page=${tableData.totalProductsPerPage}${only_passed}`

        if (filterByQAStatus !== 'qa-status') {
            if (tableFilter.includes('Extractor') || tableFilter === 'Filter by Role') {
                apiURL = apiURL + `&extractor_status=${filterByQAStatus}`
            } else {
                apiURL = apiURL + `&dimana_status=${filterByQAStatus}`
            }
        }

        if (pid !== '') {
            apiURL = apiURL + `&productID=${pid}`
        }
        if (filterByUser !== "user") {
            apiURL = apiURL + `&uid=${filterByUser.split("#")[1].trim()}`
        }

        fetch(apiURL).then((res) => res.json()).then(async (result) => {
            setTableData((pre) => ({
                ...pre,
                isLoading: false,
                data: result.data,
                // data: non_nads,
                currentPage: result.curr_page,
                totalPages: result.total_pages,
                // totalPages: non_nads_totalpages,
                totalItems: result.total_items
            }))

        }).catch((e) => console.log('error occured', e))
    }

    useEffect(() => {
        fetchSuperAdminData(0)
    }, [tableData.reset])

    useEffect(() => {
        fetchSuperAdminData(0)
    }, [tableFilter, tableData.totalProductsPerPage, filterByUser])

    useEffect(() => {
        fetchSuperAdminData()
    }, [tableData.currentPage])

    const fetchHistory = async () => {

        const history = {};
        const fetchPromises = [];

        tableData.data.forEach((singleProductEntry, index) => {
            const promise = fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/cost_table/${singleProductEntry.ProductID}`)
                .then((res) => res.json())
                .then((costingSheet) => {
                    if (!costingSheet.detail) {
                        // console.log('-->', costingSheet);
                        // console.log('Yoo', {
                        //     [singleProductEntry.ProductID]: Object.keys(costingSheet.data.timebasedData).sort((a, b) => parseInt(b) - parseInt(a))
                        // });
                        history[singleProductEntry.ProductID] = Object.keys(costingSheet.data.timebasedData).sort((a, b) => parseInt(b) - parseInt(a));
                    }
                })
                .catch((e) => console.log('error occurred', e));

            fetchPromises.push(promise);
        });

        const h = await Promise.all(fetchPromises)
            .then(() => {
                // All promises have resolved
                console.log('All fetch operations completed', history);
                // setProductHistory(history)
                return history
            })
            .catch((error) => console.log('Error in Promise.all:', error));
        console.log('h ->', h);
        setProductHistory(h)
    }

    useEffect(() => {

        if (!tableData.isLoading) {
            fetchHistory()
        }

    }, [tableData.data])


    useEffect(() => {
        setTableData(pre => ({
            ...pre,
            isLoading: true,
            currentPage: 0,
            totalPages: 1,
        }))
        fetchSuperAdminData(0)
    }, [filterByQAStatus])

    const fetchByProductID = () => {
        setTableData(pre => ({
            ...pre,
            isLoading: true,
            currentPage: 0,
            totalPages: 1,
        }))
        fetchSuperAdminData(0)
    }

    const searchItemByID = (e) => {
        setSearchByID(e.target.value)
        if (e.target.value === '') {
            setTableData(pre => ({
                ...pre,
                isLoading: true,
                currentPage: 0,
                totalPages: 1,
            }))
            fetchSuperAdminData(0, "")
        }
    }

    const navigateToItem = (productID) => {
        if (tableFilter === 'QA-DimAna') {
            window.open(`/product-detail-info?job=${tableFilter}&pid=${productID}`, "_blank", "noreferrer");
        }
        // window.location.href = `/product-detail-info?job=${tableFilter}&pid=${productID}`
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
                    <h2 className="text-center">Actual Costs</h2>
                    <div className="d-flex flex-row justify-content-end gap-2">
                        <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                            <h5 className="m-0 py-1">Starting Date</h5>
                            <input className="px-3" type="date" id="myDate1"
                                onChange={(e) => {
                                    setTableData(pre => ({
                                        ...pre,
                                        greaterThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0),
                                    }))
                                }}
                                style={{ backgroundColor: "#e8e8e8" }} />
                        </div>
                        <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                            <h5 className="m-0 py-1">Ending Date</h5>
                            <input className="px-3" type="date" id="myDate2"
                                onChange={(e) => {
                                    setTableData(pre => ({
                                        ...pre,
                                        lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                                    }))
                                }}
                                style={{ backgroundColor: "#e8e8e8" }} />
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <button className="btn btn-fetch" onClick={() => fetchSuperAdminData(0)}>Submit</button>
                            <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
                                e.preventDefault()
                                document.getElementById("myDate1").value = "";
                                document.getElementById("myDate2").value = "";
                                setTableData(pre => ({
                                    ...pre,
                                    greaterThanDate: 0,
                                    lessThanDate: lt,
                                    reset: pre.reset + 1
                                }))
                            }}>Clear</button>
                        </div>
                    </div>

                    {tableData.isLoading ? <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' justifyContent='center' alignItems='center' height='calc(100vh - 8px)'>
                        <CircularProgress size={56} color="info" />
                    </Stack> :
                        <Stack justifyContent='center' direction='column' alignItems='center'>
                            {tableData.isLoading ? <Stack direction='row' justifyContent='center'>
                                <CircularProgress />
                            </Stack> :

                                <table className="table mt-4 table-bordered table-striped align-middle text-center" style={{ maxWidth: '1100px' }}>
                                    <thead className="table-dark">
                                        <tr className="border-0 bg-white">
                                            <th className="bg-white text-dark border-0" style={{ maxWidth: '110px' }}>
                                                <select
                                                    className="p-2 w-100"
                                                    name="qa-status"
                                                    id="qa-status"
                                                    onChange={(e) => setTableData(pre => ({
                                                        ...pre,
                                                        totalProductsPerPage: e.target.value
                                                    }))}
                                                    value={tableData.totalProductsPerPage}
                                                >
                                                    <option value="10">10 Per Page</option>
                                                    <option value="25">25 Per Page</option>
                                                    <option value="50">50 Per Page</option>
                                                    <option value="100">100 Per Page</option>
                                                </select>
                                            </th>
                                            <th className="bg-white text-dark border-0">
                                                {tableData.totalItems} Results Found
                                            </th>
                                            <th colSpan={1} className="bg-white" style={{ maxWidth: 200 }}>
                                                <div className="d-flex flex-row">
                                                    <input
                                                        className="p-2 w-100"
                                                        type="text"
                                                        placeholder="Search by P.ID"
                                                        style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                                                        onChange={searchItemByID}
                                                        value={searchByID}
                                                    />
                                                    <button className="btn btn-go-fetch" onClick={fetchByProductID}>GO</button>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th># SR</th>
                                            <th>Thumbnail</th>
                                            <th>Product ID</th>
                                            <th>Current Version</th>
                                            <th>All Versions</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.data.length === 0 && <tr>
                                            <td colSpan={6}>
                                                <h4 className="text-center p-2 w-100">0 Results</h4>
                                            </td>
                                        </tr>}
                                        {tableData.data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{(tableData.currentPage * tableData.totalProductsPerPage) + (index + 1)}</td>
                                                <td style={{ paddingTop: 2, paddingBottom: 2 }}>
                                                    <img
                                                        src={item.Thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'}
                                                        onClick={() => { navigateToItem(item.ProductID) }}
                                                        alt=""
                                                        height="70px"
                                                        style={{ cursor: tableFilter === 'QA-DimAna' ? "pointer" : "default" }}
                                                    />
                                                </td>
                                                <td>
                                                    {tableFilter === 'QA-DimAna' ? <a className="link-dark" href={`/product-detail-info?job=${tableFilter}&pid=${item.ProductID}`} underline="hover" target="_blank">
                                                        {item.ProductID}
                                                    </a>
                                                        : item.full_id
                                                    }
                                                </td>

                                                <td>{(productHistory && productHistory[item.ProductID] && formatDate(parseInt((productHistory[item.ProductID])[0]))) || 'N/A'}</td>

                                                <select
                                                    style={{
                                                        height: '70px'
                                                    }}
                                                    className="p-2 w-100"
                                                    value={productHistoryTimeStamp}
                                                    onChange={(e) => setProductHistoryTimeStamp(e.target.value)}
                                                >
                                                    <option value="">Select version</option>
                                                    {productHistory && productHistory[item.ProductID] && productHistory[item.ProductID].map((timeStamp, index) => {
                                                        return <option value={timeStamp}>{formatDate(parseInt(timeStamp))}</option>
                                                    })}
                                                </select>

                                                <td>
                                                    <a className="btn btn-dark link-light" href={`/product-actual-cost?pid=${item.ProductID}&version=${productHistoryTimeStamp}`} underline="hover" target="_blank">
                                                        Calculate Cost
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }

                            <nav>
                                <ul class="pagination">
                                    <li class={`page-item ${tableData.currentPage === 0 && "disabled"}`}>
                                        <a class="page-link" href="#" tabindex="-1" onClick={() => {
                                            setTableData(pre => ({
                                                ...pre,
                                                currentPage: pre.currentPage - 1
                                            }))
                                        }}>Previous</a>
                                    </li>

                                    {Array(...Array(tableData.totalPages)).map((_, index) => {
                                        // Display only a subset of pages with ellipsis
                                        const shouldDisplay =
                                            index === 0 ||                            // Always display the first page
                                            index === tableData.currentPage ||       // Always display the current page
                                            index === tableData.currentPage - 1 ||   // Display the page before the current page
                                            index === tableData.currentPage + 1 ||   // Display the page after the current page
                                            index === tableData.totalPages - 1;      // Always display the last page

                                        return (
                                            shouldDisplay ? (
                                                <li key={index} class={`page-item ${tableData.currentPage === index && 'active'}`}>
                                                    <a class="page-link" href="#" onClick={() => {
                                                        setTableData(pre => ({
                                                            ...pre,
                                                            currentPage: index
                                                        }))
                                                    }}>{index + 1}</a>
                                                </li>
                                            ) : (
                                                // Display ellipsis for skipped pages
                                                index === 1 || index === tableData.currentPage - 2 || index === tableData.currentPage + 2 ? (
                                                    <li key={`ellipsis-${index}`} class="page-item disabled">
                                                        <span class="page-link">...</span>
                                                    </li>
                                                ) : null
                                            )
                                        );
                                    })}

                                    <li class={`page-item ${tableData.currentPage === tableData.totalPages - 1 && "disabled"}`}>
                                        <a class="page-link" href="#" onClick={() => {
                                            setTableData(pre => ({
                                                ...pre,
                                                currentPage: pre.currentPage + 1
                                            }))
                                        }}>Next</a>
                                    </li>
                                </ul>
                            </nav>
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

export default ActualCostProducts