import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import MiscItemSize from "../../res/MiscItemSize.json";
import { MenuItem, Select, TextField, Typography } from "@mui/material";
import { styled } from "styled-components";

function MiscTableRow({ handleEdit, data, _key, editable = true }) {
  const propType = "miscTableRows";

  return (
    <TableRow>
      <TableCell>
        <TextField
          size="small"
          variant="outlined"
          className="cell-disabled"
          disabled
          fullWidth
          value={data.item}
        />
      </TableCell>

      {/* <TableCell>
        <Select
          size="small"
          value={data.size}
          disabled={!editable}
          onChange={(e) => handleEdit(e, _key, propType)}
          name="size"
          style={{ width: "100%" }}
        >
          {MiscItemSize.map((item, index) => {
            return (
              <MenuItem key={index} value={item.Size}>
                {item.details}
              </MenuItem>
            );
          })}
        </Select>
      </TableCell> */}

      <TableCell>
        <TextField
          size="small"
          variant="outlined"
          name="qty"
          fullWidth
          disabled={!editable}
          onChange={(e) => {
            handleEdit(e, _key, propType);
          }}
          value={data.qty}
        />
      </TableCell>
    </TableRow>
  );
}

export default MiscTableRow;
