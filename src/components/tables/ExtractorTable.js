import React, { useEffect, useState } from "react";

const ExtractorTable = (props) => {
  const [tableData, setTableData] = useState([]);
  const [status, setStatus] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [extractedDate, setExtractedDate] = "";
  const [comment, setComment] = useState("Dummy comment for testing purpose.");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

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
              setTableData(data);
              setStatus(data.status);
              setThumbnail(data.thumbnail);
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

  return (
    <>
      <div className="">
        <table>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Product Extracted: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>220</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Extracted Products this month: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>102</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Payment Dues: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>1,220 (Rs)</u>
            </td>
          </tr>
        </table>
      </div>
      <table className="table mt-4 table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#ITN</th>
            <th>#PID</th>
            <th>Thumbnail</th>
            <th>QA By</th>
            <th>Final Status</th>
            <th>Penalty</th>
            <th>Comments</th>
            <th>Extracted Date</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.itn}</td>
              <td>{item.pid}</td>
              <td>
                <img src={item.thumbnail} alt="" height="52px" />
              </td>
              <td>{item["QA-Extractor"]}</td>
              <td>{item.status}</td>
              <td>{item.penalty}</td>
              <td>{comment}</td>
              <td>{item.lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ExtractorTable;
