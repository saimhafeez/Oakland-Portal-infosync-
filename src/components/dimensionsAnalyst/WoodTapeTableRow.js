import React from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import WoodTapeSize from '../../res/WoodTapeSize.json'
import { MenuItem, Select, TextField } from '@mui/material';
import { styled } from 'styled-components';

function WoodTapeTableRow({ handleEdit, data, _key, unitSelector }) {

    const propType = "woodTapeRows"

    const getTotal = () => {

        if (unitSelector === "Inch") {
            return ((data.length / 12) * data.qty).toFixed(1)
        } else if (unitSelector === "Centimeter") {
            return ((data.length * 0.0328084) * data.qty).toFixed(1)
        } else {
            return ((data.length * 3.28084) * data.qty).toFixed(1)
        }
    }

    return (
        <TableRow>
            <TableCell>
                <Select
                    size='small'
                    value={data.size}
                    onChange={(e) => handleEdit(e, _key, propType)}
                    name='size'
                >
                    {WoodTapeSize.map((item, index) => {
                        return <MenuItem
                            key={index}
                            value={item.Size}
                        >
                            {item.Size}
                        </MenuItem>
                    })}
                </Select>
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={data.length}
                    name='length'
                    onChange={(e) => { handleEdit(e, _key, propType) }}
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={data.qty}
                    name='qty'
                    onChange={(e) => { handleEdit(e, _key, propType) }}
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    className='cell-disabled'
                    disabled
                    value={getTotal()}
                />
            </TableCell>

        </TableRow>
    )
}

export default WoodTapeTableRow