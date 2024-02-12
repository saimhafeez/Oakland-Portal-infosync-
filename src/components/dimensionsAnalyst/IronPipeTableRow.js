import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import PipeTypeNSize from "../../res/PipeTypeNSize.json";
import { MenuItem, Select, TextField } from "@mui/material";
import { styled } from "styled-components";

function IronPipeTableRow({
  handleEdit,
  data,
  _key,
  unitSelector,
  editable = true,
  hideDetails = false,
  pipeTypeAndSizes = []
}) {
  const propType = "ironPipeRows";

  const getTotal = () => {
    if (unitSelector === "Inch") {
      return ((data.length / 12) * data.qty).toFixed(1);
    } else if (unitSelector === "Centimeter") {
      return (data.length * 0.0328084 * data.qty).toFixed(1);
    } else {
      return (data.length * 3.28084 * data.qty).toFixed(1);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Select
          size="small"
          value={data.pipeTypeNSize}
          onChange={(e) => handleEdit(e, _key, propType)}
          fullWidth
          name="pipeTypeNSize"
          disabled={!editable}
        >
          {pipeTypeAndSizes.map((pipeTypeNSize, index) => {
            return (
              <MenuItem key={index} value={`${pipeTypeNSize.type}  ${pipeTypeNSize.size}`}>
                {`${pipeTypeNSize.type}  ${pipeTypeNSize.size}`}
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>

      {
        !hideDetails && (
          <>
            <TableCell>
              <TextField
                size="small"
                variant="outlined"
                value={data.pipeTypeNSize.split("  ")[0]}
                className="cell-disabled"
                disabled
                fullWidth
              />
            </TableCell>

            <TableCell>
              <TextField
                size="small"
                variant="outlined"
                value={data.pipeTypeNSize.split("  ")[1]}
                className="cell-disabled"
                disabled
                fullWidth
              />
            </TableCell>
          </>
        )
      }

      <TableCell>
        <TextField
          size="small"
          variant="outlined"
          value={data.length}
          name="length"
          disabled={!editable}
          fullWidth
          onChange={(e) => handleEdit(e, _key, propType)}
        />
      </TableCell>

      <TableCell>
        <TextField
          size="small"
          variant="outlined"
          value={data.qty}
          name="qty"
          disabled={!editable}
          fullWidth
          onChange={(e) => handleEdit(e, _key, propType)}
        />
      </TableCell>

      <TableCell>
        <TextField
          size="small"
          variant="outlined"
          value={getTotal()}
          className="cell-disabled"
          disabled
          fullWidth
        />
      </TableCell>
    </TableRow>
  );
}

export default IronPipeTableRow;
