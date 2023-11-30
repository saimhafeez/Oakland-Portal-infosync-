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
  hideDetails = false
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

  const [ingredients, setIngredients] = useState([])

  const fetchIngredients = async () => {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).then((result) => {
      console.log('result', result);
      // // setIngredients(result.data)
      // console.log(result.data);
      const ing = []
      Object.keys(result.data["Iron Pipe"]).map((type, index) => {
        console.log(type);
        if ((result.data["Iron Pipe"])[type].status === 'active') {
          ing.push(type)
        }
      });
      setIngredients(ing)
    }).catch((e) => console.log('error occured', e))
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

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
          {ingredients.map((item, index) => {
            return (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            );
          })}
          {/* {PipeTypeNSize.map((item, index) => {
            return (
              <MenuItem key={index} value={`${item.Type}  ${item.Size}`}>
                {`${item.Type}  ${item.Size}`}
              </MenuItem>
            );
          })} */}
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
