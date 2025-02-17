import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";


const ProductOverTableManager = ({ user, job = null }) => {
    const [token, setToken] = useState("");
    const [userList, setUserList] = useState([])
    const [filterByUser, setFilterByUser] = useState("user");

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
        // const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=Extractor&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${currentPage}`

        var apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${job || user.jdesc}&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${currentPage}`

        if (filterByQAStatus !== 'qa-status') {
            apiURL += `&status=${filterByQAStatus}`
        }

        if (productID !== "") {
            apiURL += `&productID=${productID}`
        }

        if (filterByUser !== "user") {
            apiURL = apiURL + `&uid=${filterByUser.split("#")[1].trim()}`
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
        }).catch((e) => console.log('error occured', e))
    }

    const fetchUserList = async () => {
        const usersCollectionRef = collection(firestore, "users");



        const q = query(usersCollectionRef, where("jdesc", "==", (job || user.jdesc)));

        // Fetch data based on the query
        const snapshot = await getDocs(q);

        let users = [];
        snapshot.forEach((doc) => {
            if (doc.data().role !== 'manager') {
                users.push(`${doc.data().name} # ${doc.id}`);
            }
        });
        setUserList(users)
    }


    useEffect(() => {
        fetchTableData()
        fetchUserList()
    }, []);

    useEffect(() => {
        fetchTableData()
    }, [tableData.currentPage, tableData.reset])

    useEffect(() => {
        fetchTableData(0)
    }, [filterByQAStatus, tableData.totalProductsPerPage, filterByUser])

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
        <>
            <div className="mt-5">
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
                {tableData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div></div> : <table className="table mt-4 table-striped table-bordered align-middle text-center">
                    <thead className="table-dark">
                        <tr className="border-0 bg-white">
                            <th colSpan={2} className="bg-white text-dark border-0">
                                {tableData.totalItems} Results Found
                            </th>
                            <th className="bg-white" style={{ maxWidth: 150 }}>
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
                            <th className="bg-white" style={{ maxWidth: '110px' }}>
                                <select
                                    className="p-2 w-100"
                                    name="qa-status"
                                    id="qa-status"
                                    onChange={(e) => setFilterByUser(e.target.value)}
                                    value={filterByUser}
                                >
                                    <option value="user">Filter by worker</option>
                                    {userList.map((user, index) => {
                                        return <option value={user}>{user.split(" # ")[0]}</option>
                                    })}

                                </select>
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
                                    <option value="passed">100% [QA Passed]</option>
                                    <option value="minor">MINOR [QA Passed]</option>
                                    <option value="major">MAJOR [QA Passed]</option>
                                    <option value="rejected_nad">Rejected NAD</option>
                                </select>

                            </th>
                        </tr>
                        <tr>
                            <th># SR</th>
                            <th>Thumbnail</th>
                            <th>Product ID</th>
                            <th>Varient ID</th>
                            <th>{`${job || user.jdesc} Name`}</th>
                            <th>{`${job || user.jdesc} Date & Time`}</th>
                            <th>QA Status</th>
                            <th>Earning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.data.length === 0 && <tr>
                            <td colSpan={8}>
                                <h4 className="text-center p-2 w-100">0 Results</h4>
                            </td>
                        </tr>}
                        {tableData.data.map((item, index) => (
                            <tr key={index}>
                                <td>{(tableData.currentPage * tableData.totalProductsPerPage) + (index + 1)}</td>
                                <td>
                                    <img src={item.thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'} alt="" height="52px" />
                                </td>
                                <td>{item.productID}</td>
                                <td>{item.variantID}</td>
                                <td>{(job || user.jdesc).toString().includes('QA') ? item['QA-Worker'] : item['Worker']}</td>
                                <td>{formatDate(item.lastModified)}</td>
                                <td>{(item.status === null || item.status === 'under_qa') || !item.status ? 'Under QA' : item.status === 'not_understandable' ? 'Not Understandable' : item.status === 'minor' ? 'MINOR [QA Passed]' : item.status === 'major' ? 'MAJOR [QA Passed]' : item.status === 'passed' ? '100% [QA Passed]' : item.status === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</td>
                                <td>{item.earning && item.earning.toFixed(2) || 'N/A'}</td>
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
                            </td>
                        </tr>
                    </tfoot>
                </table>}
            </div >
        </>
    );
};

export default ProductOverTableManager;
