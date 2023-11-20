import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";


const ExtractorQATable = (props) => {
  const [token, setToken] = useState("");
  const lt = (new Date().getTime() / 1000).toFixed(0)

  const [tableDataStats, setTableDataStats] = useState({
    isLoading: true,
    lessThanDate: lt,
    greaterThanDate: 0,
    currentPage: 0,
    totalPages: 1,
    reset: 0,
    data: []
  })

  const [tableData, setTableData] = useState({
    isLoading: true,
    lessThanDate: lt,
    greaterThanDate: 0,
    currentPage: 0,
    totalPages: 1,
    reset: 0,
    data: []
  })

  const [searchByID, setSearchByID] = useState("");
  const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");

  const fetchTableDataStats = () => {
    setTableDataStats(pre => ({
      ...pre,
      isLoading: true
    }))
    const apiURL = `http://139.144.30.86:8000/api/super_table?job=QA-Extractor&lt=${tableDataStats.lessThanDate}&gt=${tableDataStats.greaterThanDate}&page=${tableDataStats.currentPage}&uid=${props.user.uid}`
    fetch(apiURL).then(res => res.json()).then((result) => {
      setTableDataStats(pre => ({
        ...pre,
        isLoading: false,
        data: result.data
      }))
    })
  }

  const fetchTableData = () => {
    setTableData(pre => ({
      ...pre,
      isLoading: true
    }))
    const apiURL = `http://139.144.30.86:8000/api/super_table?job=QA-Extractor&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${tableData.currentPage}&uid=${props.user.uid}`
    fetch(apiURL).then(res => res.json()).then((result) => {
      setTableData(pre => ({
        ...pre,
        isLoading: false,
        data: result.data
      }))
    })
    console.log(tableData.lessThanDate, tableData.greaterThanDate, tableData.currentPage);
  }

  useEffect(() => {

    fetchTableDataStats()
    fetchTableData()
  }, []);

  useEffect(() => {
    fetchTableData()
  }, [tableData.currentPage, tableData.reset])

  useEffect(() => {
    fetchTableDataStats()
  }, [tableDataStats.reset])

  const getStats = () => {
    const attempted = tableDataStats.data.length;

    var under_qa = 0;
    var minor = 0;
    var major = 0;
    var passed = 0;
    var rejected_nad = 0;
    var earnings = 0;

    tableDataStats.data.map((item) => {
      if (item.status === "passed") {
        passed++;
      } else if (item.status === "minor") {
        minor++;
      } else if (item.status === "major") {
        major++;
      } else if (item.status === 'rejected_nad') {
        rejected_nad++;
      } else if (item.status === 'under_qa') {
        under_qa++
      }

      if (item.earning && item.earning !== 'N/A') {
        earnings = earnings + parseInt(item.earning)
      }
    })
    return [
      attempted,
      under_qa,
      minor,
      major,
      passed,
      rejected_nad,
      earnings
    ]
  }

  const getAllProductsByFilter = () => {

    var products = tableData.data;

    if (searchByID !== '') {
      products = products.filter((item) => item.productID.includes(searchByID))
    }

    if (filterByQAStatus !== 'qa-status') {
      products = products.filter((item) => item.status === filterByQAStatus)
    }

    return products
  }

  return (
    <>
      <div>
        <h2>Stats Overview</h2>
        <div className="d-flex flex-row justify-content-end gap-2">
          <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h5 className="m-0 py-1">Starting Date</h5>
            <input className="px-3" type="date" id="myDate1"
              onChange={(e) => {
                setTableDataStats(pre => ({
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
                setTableDataStats(pre => ({
                  ...pre,
                  lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                }))
              }}
              style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <div className="d-flex flex-column gap-1">
            <button className="btn btn-fetch" onClick={fetchTableDataStats}>Submit</button>
            <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
              e.preventDefault()
              document.getElementById("myDate1").value = "";
              document.getElementById("myDate2").value = "";
              setTableDataStats(pre => ({
                ...pre,
                greaterThanDate: 0,
                lessThanDate: lt,
                reset: pre.reset + 1
              }))
            }}>Clear</button>
          </div>
        </div>
        {tableDataStats.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
          <thead className="table-info">
            <tr>
              <th>Attempted</th>
              <th>Under QA</th>
              <th>Minor Fixes</th>
              <th>Major Fixes</th>
              <th>[100%] QA Passed</th>
              <th>Rejected NAD</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            <tr tr>
              {getStats().map((item, index) => {
                return <td>{item}</td>
              })}
            </tr>
          </tbody>
        </table>}
      </div >
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
            <button className="btn btn-fetch" onClick={fetchTableData}>Submit</button>
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
        </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr className="border-0 bg-white">
              <th colSpan={2} className="bg-white text-dark border-0">
                {getAllProductsByFilter().length} Results Found
              </th>
              <th className="bg-white" style={{ maxWidth: 150 }}>
                <div className="d-flex flex-row">
                  <input
                    className="p-2 w-100"
                    type="text"
                    placeholder="Search by ProductID"
                    style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                    onChange={(e) => setSearchByID(e.target.value)}
                    value={searchByID}
                  />
                  <button className="btn btn-go-fetch" onClick={() => setSearchByID("")}>Clear</button>
                </div>
              </th>
              <th className="bg-white"></th>
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
                  <option value="minor">MINOR Fixes</option>
                  <option value="major">MAJOR Fixes</option>
                  <option value="rejected_nad">Rejected NAD</option>
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
              <th>Earning</th>
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
                  <img src={item.thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'} alt="" height="52px" />
                </td>
                <td>{item.productID}</td>
                <td>{item.variantID || 'N/A'}</td>
                <td>{formatDate(item.lastModified)}</td>
                <td>{item.status === 'under_qa' ? 'Under QA' : item.status === 'rejected_nad' ? 'Rejected NAD' : item.status === 'minor' ? 'MINOR Fixes' : item.status === 'major' ? 'MAJOR Fixes' : item.status === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
                <td>{item.earning || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div >

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
          {Array(...Array(tableData.totalPages + 3)).map((_, index) => {
            return <li key={index} class={`page-item ${tableData.currentPage === index && 'active'}`}>
              <a class="page-link" href="#" onClick={() => {
                setTableData(pre => ({
                  ...pre,
                  currentPage: index
                }))
              }}>{index + 1}</a>
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

    </>
  );
};

export default ExtractorQATable;
