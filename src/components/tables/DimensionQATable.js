import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";


const DimensionQATable = (props) => {
  const [token, setToken] = useState("");

  const [tableDataStats, setTableDataStats] = useState({
    isLoading: true,
    data: [
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "1122233",
        variantID: "1122233",
        extractionTimeStamp: "2023-09-12T15:25:16+00:00",
        QAStatus: "passed",
        Earning: "8"
      },
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "1122233",
        variantID: "1122233",
        extractionTimeStamp: "2023-11-12T15:25:16+00:00",
        QAStatus: "minor",
        Earning: "6"
      },
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "123423",
        variantID: "1122233",
        extractionTimeStamp: "2023-10-12T15:25:16+00:00",
        QAStatus: 'not_understandable',
        Earning: 0
      }
    ]
  })

  const executePythonScript = async () => {
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const uid = props.user.uid;
          const apiUrl = `http://139.144.30.86:8000/api/stats?job=QA-Extractor&uid=${uid}`
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

    executePythonScript()

    //uiEZHND3DxfKMndj6iI2YSYiKZQ2

  })

  const [tableData, setTableData] = useState({
    isLoading: true,
    data: [
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "1122233",
        variantID: "12431",
        extractionTimeStamp: '2023-10-24T18:00:23.678Z',
        QAStatus: "passed",
        Earning: "8"
      },
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "1122233",
        variantID: "542342",
        extractionTimeStamp: '2023-11-11T02:30:23.678Z',
        QAStatus: "minor",
        Earning: "6"
      },
      {
        thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
        productID: "123423",
        variantID: "543636",
        extractionTimeStamp: '2023-11-09T07:55:23.678Z',
        QAStatus: 'not_understandable',
        Earning: 0
      }
    ]
  })

  const [searchByID, setSearchByID] = useState("");
  const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");



  useEffect(() => {
    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          const apiUrl = "http://139.144.30.86:8000/api/table";
          console.log(token);
          setToken(token);
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
              return response.json();
            })
            .then((data) => {
              // Handle the API response data
              console.log("API Response:", data);
              // setExtractedDate(data.lastModified);
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
  }, []);

  const getStats = () => {
    const attempted = tableDataStats.data.length;

    var not_understandable = 0;
    var under_qa = 0;
    var passed = 0;
    var minor = 0;
    var major = 0;
    var earnings = 0;



    tableDataStats.data.map((item) => {
      if (item.QAStatus === "passed") {
        passed++;
      } else if (item.QAStatus === "minor") {
        minor++;
      } else if (item.QAStatus === "major") {
        major++;
      } else if (item.QAStatus === 'under_qa') {
        under_qa++
      } else if (item.QAStatus === 'not_understandable') {
        not_understandable++
      }

      if (item.Earning !== 'N/A') {
        earnings = earnings + parseInt(item.Earning)
      }
    })

    return [
      attempted,
      not_understandable,
      minor,
      major,
      passed,
      earnings
    ]

  }

  const getAllProductsByFilter = () => {

    var products = tableData.data;

    if (searchByID !== '') {
      products = products.filter((item) => item.productID.includes(searchByID))
    }

    if (filterByQAStatus !== 'qa-status') {
      products = products.filter((item) => item.QAStatus === filterByQAStatus)
    }

    return products
  }

  return (
    <>
      <div>
        <h2>Stats Overview</h2>
        <div className="d-flex flex-row justify-content-end gap-2">
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Starting Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Ending Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <button className="btn btn-fetch">Submit</button>
        </div>
        <table className="table mt-4 table-bordered">
          <thead className="table-info">
            <tr>
              <th>Attempted</th>
              <th>Not Understandble</th>
              <th>MINOR Fixes</th>
              <th>MAJOR Fixes</th>
              <th>100% [QA Passed]</th>
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
        </table>
      </div >
      <div className="mt-5">
        <h2>All Products Overview</h2>
        <div className="d-flex flex-row justify-content-end gap-2">
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Starting Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Ending Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <button className="btn btn-fetch">Submit</button>
        </div>
        <table className="table mt-4 table-striped table-bordered">
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
                  <option value="not_understandable">Not Understandable</option>
                  <option value="passed">100% [QA Passed]</option>
                  <option value="minor">MINOR Fixes</option>
                  <option value="major">MAJOR Fixes</option>
                </select>

              </th>
            </tr>
            <tr>
              <th># SR</th>
              <th>Thumbnail</th>
              <th>Product ID</th>
              <th>Varient ID</th>
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
                  <img src={item.thumbnail} alt="" height="52px" />
                </td>
                <td>{item.productID}</td>
                <td>{item.variantID}</td>
                <td>{formatDate(item.extractionTimeStamp)}</td>
                <td>{item.QAStatus === 'under_qa' ? 'Under QA' : item.QAStatus === 'not_understandable' ? 'Not Understandable' : item.QAStatus === 'minor' ? 'MINOR Fixes' : item.QAStatus === 'major' ? 'MAJOR Fixes' : item.QAStatus === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
                <td>{item.Earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >

      <nav>
        <ul class="pagination">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1">Previous</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item active">
            <a class="page-link" href="#">2</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>

    </>
  );
};

export default DimensionQATable;
