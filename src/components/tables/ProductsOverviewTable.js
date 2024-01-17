import React, { useEffect, useState } from 'react'
import { formatDate } from '../../utils/formatDate';

function ProductsOverviewTable({ user, job = null }) {

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

    const [searchByID, setSearchByID] = useState("");
    const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");

    const fetchTableData = (currentPage = tableData.currentPage, productID = searchByID) => {
        setTableData(pre => ({
            ...pre,
            isLoading: true
        }))
        var apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${job || user.jdesc}&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${currentPage}&uid=${user.uid}`

        if (filterByQAStatus !== 'qa-status') {
            apiURL += `&status=${filterByQAStatus}`
        }

        if (productID !== "") {
            apiURL += `&productID=${productID}`
        }

        fetch(apiURL).then(res => res.json()).then((result) => {
            setTableData(pre => ({
                ...pre,
                isLoading: false,
                data: result.data,
                currentPage: result.curr_page,
                totalPages: result.total_pages,
                totalItems: result.total_items
            }))
            console.log('result.data', result.data);
        }).catch((e) => console.log('error occured', e))
        // console.log(tableData.lessThanDate, tableData.greaterThanDate, tableData.currentPage);
    }

    useEffect(() => {
        fetchTableData()
    }, []);

    useEffect(() => {
        fetchTableData()
    }, [tableData.currentPage, tableData.reset])

    useEffect(() => {
        fetchTableData(0)
    }, [filterByQAStatus])

    const fetchByProductID = () => {
        fetchTableData(0)
    }

    const searchItemByID = (e) => {
        setSearchByID(e.target.value)
        if (e.target.value === '') {
            fetchTableData(0, "")
        }
    }

    return (
        <div className="mt-5 d-flex flex-column">
            <h2>All Products Overview</h2>
            <div className="d-flex flex-row justify-content-end gap-2">
                <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                    <h5 className="m-0 py-1">Starting Date</h5>
                    <input className="px-3" type="date" id="myDate3"
                        onChange={(e) => {
                            setTableData(pre => ({
                                ...pre,
                                greaterThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                            }))
                        }}
                        style={{ backgroundColor: "#e8e8e8" }} />
                </div>
                <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                    <h5 className="m-0 py-1">Ending Date</h5>
                    <input className="px-3" type="date" id="myDate4"
                        onChange={(e) => {
                            setTableData(pre => ({
                                ...pre,
                                lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                            }))
                        }}
                        style={{ backgroundColor: "#e8e8e8" }} />
                </div>
                <div className="d-flex flex-column gap-1">
                    <button className="btn btn-fetch" onClick={() => fetchTableData(0)}>Submit</button>
                    <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("myDate3").value = "";
                        document.getElementById("myDate4").value = "";
                        setTableData(pre => ({
                            ...pre,
                            greaterThanDate: 0,
                            lessThanDate: lt,
                            reset: pre.reset + 1
                        }))
                    }}>Clear</button>
                </div>
            </div>
            {tableData.isLoading ? <div className="d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center align-self-center" style={{ maxWidth: '1000px' }}>
                <thead className="table-dark">
                    <tr className="border-0 bg-white">
                        <th colSpan={2} className="bg-white text-dark border-0">
                            {tableData.totalItems} Results Found
                        </th>
                        <th colSpan={2} className="bg-white" style={{ maxWidth: 150 }}>
                            <div className="d-flex flex-row">
                                <input
                                    className="p-2 w-100"
                                    type="text"
                                    placeholder="Search by ProductID"
                                    style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                                    onChange={searchItemByID}
                                    value={searchByID}
                                />
                                <button className="btn btn-go-fetch" onClick={fetchByProductID}>GO</button>
                            </div>
                        </th>
                        <th className="bg-white"></th>
                        <th className="bg-white">

                            <select
                                className="p-2 w-100"
                                name="qa-status"
                                id="qa-status"
                                onChange={(e) => setFilterByQAStatus(e.target.value)}
                                value={filterByQAStatus}
                            >
                                <option value="qa-status">Filter by QA Status</option>
                                <option value="under_qa">Under QA</option>
                                <option value="rejected_nad">Not a Doable</option>
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
                        <th>Variant ID</th>
                        <th>Extraction Date & Time</th>
                        <th>QA Status</th>
                        {/* <th>Earning</th> */}
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
                            <td>
                                <img src={item.thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'} alt="" height="72px" />
                            </td>
                            <td>{item.productID}</td>
                            <td>{item.variantID || 'N/A'}</td>
                            <td>{formatDate(item.lastModified)}</td>
                            <td>{(item.status === null || item.status === 'under_qa') ? 'Under QA' : item.status === 'not_understandable' ? 'Not Understandable' : item.status === 'rejected_nad' ? 'Not a Doable' : item.status === 'minor' ? 'MINOR [QA Passed]' : item.status === 'major' ? 'MAJOR [QA Passed]' : item.status === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
                            {/* <td>{item.earning || 'N/A'}</td> */}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6}>
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
                                        return <li key={index} class={`page-item ${tableData.currentPage === index && 'active'}`}>
                                            <a class="page-link" href="#" onClick={() => {
                                                setTableData(pre => ({
                                                    ...pre,
                                                    currentPage: index
                                                }))
                                            }}>{(index + 1)}</a>
                                        </li>
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
                        </td>
                    </tr>
                </tfoot>
            </table>}
        </div >
    )
}

export default ProductsOverviewTable