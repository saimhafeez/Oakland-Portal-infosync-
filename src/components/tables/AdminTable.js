import React from "react";

const AdminTable = () => {
  return (
    <>
      <div className="">
        <table>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Product Extracted: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>1,220</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Varient Extracted: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>156</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Product Extracted this Month: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>456</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Product Extracted Today: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>42 (Rs)</u>
            </td>
          </tr>
          <tr>
            <td className="ps-3 pt-2">
              <strong>Total Expenditures: </strong>&nbsp;
            </td>
            <td className="ps-3 pt-2">
              <u>12,220 (Rs)</u>
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
            <th>Sorted By</th>
            <th>Sorter QA</th>
            <th>Dim. Ana. By</th>
            <th>Dim. Ana. QA By</th>
            <th>Final Status</th>
            <th>Comments</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000123</td>
            <td>W004489514</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User One</td>
            <td>User Two</td>
            <td>User Three</td>
            <td>User Four</td>
            <td>Pass</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default AdminTable;
