import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";
import { formatDate } from "../../utils/formatDate";
import SuperAdminSidebar from "../../components/sidebar/SuperAdminSidebar";
import Header from "../../components/header/Header";
import { useAppContext } from "../../context/appContext";
import { InfoTwoTone } from "@mui/icons-material";
import ExtractionComparision from "./ExtractionComparision";
import DimAnaComparision from "./DimAnaComparision";



function ReadyToLive(props) {

    const colors = {
        major: '#f1c232',
        minor: '#ffe599',
        not_understandable: '#F8D465',
        resetAbove: '#6C22A6',
    }

    const [searchByID, setSearchByID] = useState("");
    const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");
    const [filterByUser, setFilterByUser] = useState("user");
    const [userList, setUserList] = useState([])

    const [tableFilter, setTableFilter] = useState('QA-DimAna')

    const lt = (new Date().getTime() / 1000).toFixed(0)

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

        var apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/better_table?job=${tableFilter === 'Filter by Role' ? 'Extractor' : tableFilter}&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${currentPage}&items_per_page=${tableData.totalProductsPerPage}`
        // var apiURL = filterByQAStatus !== 'qa-status' ? `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${tableFilter === 'Filter by Role' ? 'Extractor' : tableFilter}&lt=${lt}&gt=0&page=${currentPage}&status=${filterByQAStatus}&items_per_page=${tableData.totalProductsPerPage}`
        //     : `${process.env.REACT_APP_SERVER_ADDRESS}/api/better_table?job=${tableFilter === 'Filter by Role' ? 'Extractor' : tableFilter}&lt=${lt}&gt=0&page=${currentPage}&items_per_page=${tableData.totalProductsPerPage}`

        if (filterByQAStatus !== 'qa-status') {
            if (tableFilter.includes('Extractor') || tableFilter === 'Filter by Role') {
                apiURL = apiURL + `&extractor_status=${filterByQAStatus}`
            } else {
                apiURL = apiURL + `&dimana_status=${filterByQAStatus}`
            }
        } else {
            apiURL = apiURL + only_passed
        }

        if (pid !== '') {
            apiURL = apiURL + `&productID=${pid}`
        }
        if (filterByUser !== "user") {
            apiURL = apiURL + `&uid=${filterByUser.split("#")[1].trim()}`
        }

        fetch(apiURL).then((res) => res.json()).then((result) => {
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

    var [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchSuperAdminData()
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            fetchSuperAdminData(0)
        }
    }, [tableData.reset])

    useEffect(() => {
        if (isLoaded) {
            fetchSuperAdminData(0)
        }
    }, [tableFilter, tableData.totalProductsPerPage, filterByUser])

    useEffect(() => {
        if (isLoaded) {
            fetchSuperAdminData()
        }
    }, [tableData.currentPage])


    useEffect(() => {
        // setTableData(pre => ({
        //     ...pre,
        //     isLoading: true,
        //     currentPage: 0,
        //     totalPages: 1,
        // }))
        if (isLoaded) {
            fetchSuperAdminData(0)
        }
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

    const [openComparisionModal, setOpenComparisionModal] = useState({
        state: false,
        job: "",
        pid: "",
        vid: "",
        result: "",
        index: "",
        page: ""
    })

    const navigateToComparisionSheet = (product, productID, variantID, job) => {

        const props = {
            state: true,
            job: "",
            pid: productID,
            vid: variantID,
            result: ""
        }

        if (!product[`QA-${job}`].updatedAt && product[job].updatedAt) {
            props.job = job
        } else if (product[`QA-${job}`].updatedAt) {
            props.job = `QA-${job}`
        } else {
            props.state = false
            props.pid = ""
            props.result = ""
        }

        // if (_tableFilter === 'QA-Extractor') {
        //     window.open(`/extraction-comparision?job=${_tableFilter}&pid=${productID}&vid=${variantID}`, "_blank", "noreferrer");
        // } else if (_tableFilter === 'QA-DimAna') {
        //     window.open(`/dimana-comparision?job=${_tableFilter}&pid=${productID}&vid${variantID}`, "_blank", "noreferrer");
        // }
        console.log('props --> ', props);
        setOpenComparisionModal(props)

    }

    const resetComparisionModal = () => {
        setOpenComparisionModal({
            state: false,
            job: "",
            pid: "",
            vid: "",
            result: "",
            index: "",
            page: ""
        })
    }

    const resetProduct = (sku, selector) => {
        setTableData(pre => ({
            ...pre,
            isLoading: true
        }))
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/reset_${selector}/${sku}`).then((res) => res.json()).then((result) => {

            console.log('result', result);

            fetchSuperAdminData(0)

        }).catch((e) => console.log('error occured', e))
    }

    const { sidebarOpened } = useAppContext()

    return (
        <>
            <Header
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <SuperAdminSidebar />

            <Wrapper>
                <div className={`${sidebarOpened && "set-right-container-252"} p-3`} style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>
                    <h2 className="text-center">Ready To Live</h2>
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
                        <Stack>
                            {tableData.isLoading ? <Stack direction='row' justifyContent='center'>
                                <CircularProgress />
                            </Stack> :

                                <table className="table mt-4 table-bordered table-striped align-middle text-center">
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
                                            {/* <th className="bg-white"></th> */}
                                            {/* <th className="bg-white"></th> */}
                                            {/* <th className="bg-white"></th> */}
                                            <th className="bg-white"></th>
                                            <th className="bg-white"></th>
                                            <th className="bg-white"></th>
                                            <th className="bg-white"></th>
                                            <th className="bg-white" style={{ maxWidth: '110px' }}>

                                                <select
                                                    className="p-2 w-100"
                                                    name="qa-status"
                                                    id="qa-status"
                                                    onChange={(e) => setFilterByQAStatus(e.target.value)}
                                                    value={filterByQAStatus}
                                                    disabled={tableFilter === 'Filter by Role'}
                                                >
                                                    <option value="qa-status">Filter by Status</option>
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
                                            {/* <th style={{ maxWidth: '40px' }}>Variant ID</th> */}
                                            <th>Extractor</th>
                                            <th>QA-Extractor</th>
                                            <th className="fw-bold">Ext-Action</th>
                                            <th>DimAna</th>
                                            <th>QA-DimAna</th>
                                            <th>DimAna-Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {tableData.data.length === 0 && <tr>
                                                <td colSpan={9}>
                                                    <h4 className="text-center">0 Results</h4>
                                                </td>
                                            </tr>} */}
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

                                                <td>
                                                    <p className="m-0">{item['Extractor'].name || 'N/A'}</p>
                                                    <p
                                                        style={{ border: '2px solid black', margin: 4, backgroundColor: (item['Extractor Status'] !== 'passed' && item['Extractor Status'] !== 'under_qa') && colors[item['Extractor Status']] }}
                                                    >
                                                        {
                                                            (item['Extractor'].status !== null && item['Extractor'].status !== "") ? 'NOT A DOABLE' : ((item['Extractor Status'] === null || item['Extractor Status'] === 'under_qa') ? 'Under QA' : item['Extractor Status'] === 'not_understandable' ? 'Not Understandable' : item['Extractor Status'] === 'rejcted_nad' ? 'Rejected NAD' : item['Extractor Status'] === 'minor' ? 'MINOR [QA Passed]' : item['Extractor Status'] === 'major' ? 'MAJOR [QA Passed]' : item['Extractor Status'] === 'passed' ? '100% [QA Passed]' : item['Extractor Status'] === 'rejected_nad' ? 'Not a Doable' : 'N/A')
                                                        }
                                                    </p>
                                                    <p className="small">{item['Extractor'].updatedAt && formatDate(item['Extractor'].updatedAt) || 'N/A'}</p>
                                                </td>

                                                <td>
                                                    <p className="m-0">{item['QA-Extractor'].name || 'N/A'}</p>
                                                    <p
                                                        style={{ border: '2px solid black', margin: 4, backgroundColor: (item['Extractor Status'] !== 'passed' && item['Extractor Status'] !== 'under_qa') && colors[item['Extractor Status']] }}

                                                    >{(item['Extractor Status'] === null || item['Extractor Status'] === 'under_qa') ? 'Under QA' : item['Extractor Status'] === 'not_understandable' ? 'Not Understandable' : item['Extractor Status'] === 'rejcted_nad' ? 'Rejected NAD' : item['Extractor Status'] === 'minor' ? 'MINOR [QA Passed]' : item['Extractor Status'] === 'major' ? 'MAJOR [QA Passed]' : item['Extractor Status'] === 'passed' ? '100% [QA Passed]' : item['Extractor Status'] === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</p>
                                                    <p className="small">{item['QA-Extractor'].updatedAt && formatDate(item['QA-Extractor'].updatedAt) || 'N/A'}</p>
                                                </td>

                                                <td style={{ width: '100px' }}>
                                                    <div className="d-flex flex-column gap-2 justify-content-center px-1 align-items-center">

                                                        <button
                                                            style={{ width: '100px', maxHeight: '30px' }}
                                                            // disabled={!item['QA-Extractor'].updatedAt}
                                                            className="btn btn-warning p-0 m-0 px-2"
                                                            onClick={() => navigateToComparisionSheet(item, item.ProductID, item.VariantID, 'Extractor', index)}
                                                        >Compare</button>

                                                        <button
                                                            className="btn p-0 m-0 px-2"
                                                            style={{ backgroundColor: item.extractor_reset_info && item.extractor_reset_info.reset_count > 0 ? colors.resetAbove : 'red', color: 'white', width: '100px', maxHeight: '30px' }}
                                                            // style={{  }}
                                                            onClick={() => resetProduct(item.ProductID, 'extractor')}
                                                            // disabled={disableResetButton(item)}
                                                            disabled={!item['QA-Extractor'].updatedAt}
                                                        >
                                                            <Stack direction='row' gap={1} alignItems='center' justifyContent='center'>
                                                                <Tooltip title={
                                                                    <Stack direction='column' spacing={1}>
                                                                        <Typography m={0} p={0}>
                                                                            Resets: {item.extractor_reset_info ? item.extractor_reset_info.reset_count : 0}
                                                                        </Typography>
                                                                        <Typography m={0} p={0}>
                                                                            Last Reset: {item.extractor_reset_info ? formatDate(item.extractor_reset_info.last_reset) : 'N/A'}
                                                                        </Typography>
                                                                    </Stack>
                                                                }>
                                                                    <InfoTwoTone htmlColor="white" />
                                                                </Tooltip>
                                                                <Typography p={0} m={0}>Reset</Typography>
                                                            </Stack>
                                                        </button>
                                                    </div>
                                                </td>

                                                <td>
                                                    <p className="m-0">{item['DimAna'].name || 'N/A'}</p>
                                                    <p
                                                        style={{ border: '2px solid black', margin: 4, backgroundColor: (item['DimAna Status'] !== 'passed' && item['DimAna Status'] !== 'under_qa') && colors[item['DimAna Status']] }}
                                                    >
                                                        {
                                                            (item['DimAna'].name && item['DimAna'].status === null && (item['DimAna Status'] === null || item['DimAna Status'] === 'under_qa')) ? 'UNDER QA'
                                                                :
                                                                ((item['DimAna'].status !== null && item['DimAna'].status !== "") ? 'NOT UNDERSTANDABLE'
                                                                    : item['DimAna Status'] === 'not_understandable' ? 'Not Understandable' : item['DimAna Status'] === 'rejcted_nad' ? 'Rejected NAD' : item['DimAna Status'] === 'minor' ? 'MINOR [QA Passed]' : item['DimAna Status'] === 'major' ? 'MAJOR [QA Passed]' : item['DimAna Status'] === 'passed' ? '100% [QA Passed]' : item['DimAna Status'] === 'rejected_nad' ? 'Not a Doable' : 'N/A')
                                                        }
                                                    </p>
                                                    <p className="small">{item['DimAna'].updatedAt && formatDate(item['DimAna'].updatedAt) || 'N/A'}</p>
                                                </td>

                                                <td>
                                                    <p className="m-0">{item['QA-DimAna'].name || 'N/A'}</p>
                                                    <p
                                                        style={{ border: '2px solid black', margin: 4, backgroundColor: (item['DimAna Status'] !== 'passed' && item['DimAna Status'] !== 'under_qa') && colors[item['DimAna Status']] }}
                                                    >{item['DimAna Status'] === 'not_understandable' ? 'Not Understandable' : item['DimAna Status'] === 'rejcted_nad' ? 'Rejected NAD' : item['DimAna Status'] === 'minor' ? 'MINOR [QA Passed]' : item['DimAna Status'] === 'major' ? 'MAJOR [QA Passed]' : item['DimAna Status'] === 'passed' ? '100% [QA Passed]' : item['DimAna Status'] === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</p>
                                                    <p className="small">{item['QA-DimAna'].updatedAt && formatDate(item['QA-DimAna'].updatedAt) || 'N/A'}</p>
                                                </td>

                                                <td style={{ width: '120px' }}>
                                                    <div className="d-flex flex-column gap-2 justify-content-center px-1 align-items-center">
                                                        <button
                                                            style={{ width: '100px', maxHeight: '30px' }}
                                                            // disabled={!item['QA-DimAna'].updatedAt}
                                                            className="btn btn-warning p-0 m-0 px-2"
                                                            onClick={() => navigateToComparisionSheet(item, item.ProductID, item.VariantID, 'DimAna', index)}
                                                        >Compare</button>

                                                        <button
                                                            className="btn p-0 m-0 px-2"
                                                            style={{ backgroundColor: item.dimana_reset_info && item.dimana_reset_info.reset_count > 0 ? colors.resetAbove : 'red', color: 'white', width: '100px', maxHeight: '30px' }}
                                                            onClick={() => resetProduct(item.ProductID, 'dimana')}
                                                            // disabled={disableResetButton(item)}
                                                            disabled={!item['QA-DimAna'].updatedAt}
                                                        >
                                                            <Stack direction='row' gap={1} alignItems='center' justifyContent='center'>
                                                                <Tooltip title={
                                                                    <Stack direction='column' spacing={1}>
                                                                        <Typography m={0} p={0}>
                                                                            Resets: {item.dimana_reset_info ? item.dimana_reset_info.reset_count : 0}
                                                                        </Typography>
                                                                        <Typography m={0} p={0}>
                                                                            Last Reset: {item.dimana_reset_info ? formatDate(item.dimana_reset_info.last_reset) : 'N/A'}
                                                                        </Typography>
                                                                    </Stack>
                                                                }>
                                                                    <InfoTwoTone htmlColor="white" />
                                                                </Tooltip>
                                                                <Typography p={0} m={0}>Reset</Typography>
                                                            </Stack>
                                                        </button>
                                                    </div>
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

            <Dialog
                open={openComparisionModal.state}
                onClose={resetComparisionModal}
                fullScreen
            >
                <DialogContent>
                    {
                        openComparisionModal.job.includes('Extractor') ?
                            openComparisionModal.state && <ExtractionComparision
                                job={openComparisionModal.job}
                                pid={openComparisionModal.pid}
                                vid={openComparisionModal.vid}
                                result={openComparisionModal.result}
                                closeCallback={resetComparisionModal}
                            />
                            :
                            openComparisionModal.state && <DimAnaComparision
                                job={openComparisionModal.job}
                                pid={openComparisionModal.pid}
                                vid={openComparisionModal.vid}
                                result={openComparisionModal.result}
                                closeCallback={resetComparisionModal}
                            />
                    }
                </DialogContent>
            </Dialog>

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

export default ReadyToLive