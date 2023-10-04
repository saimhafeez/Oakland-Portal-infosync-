import React from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import WoodenSheetType from '../../res/WoodenSheetType.json'
import { MenuItem, Select, TextField } from '@mui/material';
import { styled } from 'styled-components';

function WoodenSheetTableRow({ handleEdit, data, _key, unitSelector }) {

    const propType = "woodenSheetRows"

    const getValue = (value) => {

        if (unitSelector === "Inch") {
            return (value / 12).toFixed(1)
        } else if (unitSelector === "Centimeter") {
            return (value * 0.0328084).toFixed(1)
        } else {
            return (value * 3.28084).toFixed(1)
        }
    }

    return (
        <TableRow>
            <TableCell>
                <Select
                    size='small'
                    value={data.type}
                    onChange={(e) => handleEdit(e, _key, propType)}
                    style={{ width: '130px' }}
                    name='type'
                >
                    {WoodenSheetType.map((item, index) => {
                        return <MenuItem
                            key={index}
                            value={item.Type}
                        >
                            {item.Type}
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
                    onChange={(e) => handleEdit(e, _key, propType)}
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={data.width}
                    name='width'
                    onChange={(e) => handleEdit(e, _key, propType)}
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={data.qty}
                    name='qty'
                    onChange={(e) => handleEdit(e, _key, propType)}
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={getValue(data.length)}
                    className='cell-disabled'
                    disabled
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={getValue(data.width)}
                    className='cell-disabled'
                    disabled
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={(getValue(data.length) * getValue(data.width)).toFixed(1)}
                    className='cell-disabled'
                    disabled
                />
            </TableCell>

            <TableCell>
                <TextField
                    size='small'
                    variant='outlined'
                    value={(getValue(data.length) * getValue(data.width) * data.qty).toFixed(1)}
                    className='cell-disabled'
                    disabled
                />
            </TableCell>
        </TableRow>
    )
}

export default WoodenSheetTableRow