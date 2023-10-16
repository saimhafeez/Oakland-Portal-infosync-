import React from "react";

const ExtractorQATable = () => {
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
            <td>User Two</td>
            <td>Pass</td>
            <td>2,000</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000124</td>
            <td>W004489515</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User Two</td>
            <td>Reject</td>
            <td>1,000</td>
            <td>Again dummy comment for testing purpose.</td>
            <td>10/12/2023</td>
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
            <td>User Two</td>
            <td>Pass</td>
            <td>2,000</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000124</td>
            <td>W004489515</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User Two</td>
            <td>Reject</td>
            <td>1,000</td>
            <td>Again dummy comment for testing purpose.</td>
            <td>10/12/2023</td>
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
            <td>User Two</td>
            <td>Pass</td>
            <td>2,000</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000124</td>
            <td>W004489515</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User Two</td>
            <td>Reject</td>
            <td>1,000</td>
            <td>Again dummy comment for testing purpose.</td>
            <td>10/12/2023</td>
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
            <td>User Two</td>
            <td>Pass</td>
            <td>2,000</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000124</td>
            <td>W004489515</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User Two</td>
            <td>Reject</td>
            <td>1,000</td>
            <td>Again dummy comment for testing purpose.</td>
            <td>10/12/2023</td>
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
            <td>User Two</td>
            <td>Pass</td>
            <td>2,000</td>
            <td>Dummy comment for testing purpose.</td>
            <td>10/13/2023</td>
          </tr>
          <tr>
            <td>0000124</td>
            <td>W004489515</td>
            <td>
              <img
                src={process.env.PUBLIC_URL + "/logo192.png"}
                alt=""
                height={"52px"}
              />
            </td>
            <td>User Two</td>
            <td>Reject</td>
            <td>1,000</td>
            <td>Again dummy comment for testing purpose.</td>
            <td>10/12/2023</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ExtractorQATable;
