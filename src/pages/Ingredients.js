import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IronPipeTableRow from "../components/dimensionsAnalyst/IronPipeTableRow";
import HeaderSignOut from "../components/header/HeaderSignOut";
import {
    Button,
    ButtonGroup,
    Card,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    Stack,
    TableFooter,
    TextField,
    Typography,
    colors,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function Ingredients(props) {

    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active')

    const [newIngredient, setNewIngredient] = useState({
        name: '',
        price: '',
        unit: '',
        totalQuantity: 0,
        status: 'active'
    })

    const [currentlyEditing, setCurrentlyEditing] = useState(null)

    const [ingredients, setIngredients] = useState({
        "Iron Pipe [Square  01'' x 01'']": {
            price: 2000,
            unit: "ft",
            totalQuantity: 20,
            status: 'active'
        },
        "Iron Pipe [Square  0.5'' x 0.5'']": {
            price: 5000,
            unit: "ft",
            totalQuantity: 10,
            status: 'inactive'
        },
        "Iron Pipe [Solid Wood  1.5'' x 1.5'']": {
            price: 7000,
            unit: "ft",
            totalQuantity: 30,
            status: 'active'
        },
        "Wooden Sheet": {
            price: 5000,
            unit: 'sq.ft',
            totalQuantity: 32,
            status: 'active'
        },
        "Wood Tape": {
            price: 2000,
            unit: 'ft',
            totalQuantity: 10,
            status: 'trash'
        }
    })

    function deleteItem(data, itemName) {
        if (data.hasOwnProperty(itemName)) {
            delete data[itemName];
        }
        return { ...data };
    }

    const getIngredientsCount = () => {
        var count = 0;

        Object.keys(ingredients).map((ingredient) => {
            if (ingredients[ingredient].status === activeFilter) {
                count++
            }
        })

        return count

    }

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    setCurrentlyEditing(null)
                    setNewIngredient({
                        name: '',
                        price: '',
                        unit: '',
                        totalQuantity: 0,
                        status: 'active'
                    })
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Stack gap={2}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={newIngredient.name}
                            onChange={(e) => setNewIngredient((pre) => ({ ...pre, name: e.target.value }))}
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            type="number"
                            value={newIngredient.price}
                            onChange={(e) => setNewIngredient((pre) => ({ ...pre, price: e.target.value }))}
                        />
                        <TextField
                            label="Unit"
                            variant="outlined"
                            type="text"
                            value={newIngredient.unit}
                            onChange={(e) => setNewIngredient((pre) => ({ ...pre, unit: e.target.value }))}
                        />
                        <TextField
                            label="Total Quantity"
                            variant="outlined"
                            type="number"
                            value={newIngredient.totalQuantity}
                            onChange={(e) => setNewIngredient((pre) => ({ ...pre, totalQuantity: e.target.value }))}
                        />
                        <Button
                            onClick={() => {

                                if (currentlyEditing != null) {
                                    const updatedIng = deleteItem(ingredients, currentlyEditing.name)
                                    setIngredients((pre) => ({
                                        ...updatedIng,
                                        [newIngredient.name]: {
                                            price: newIngredient.price,
                                            unit: newIngredient.unit,
                                            totalQuantity: newIngredient.totalQuantity,
                                            status: newIngredient.status
                                        }

                                    }))
                                    setOpen(false)
                                    setNewIngredient({
                                        name: '',
                                        price: '',
                                        unit: '',
                                        totalQuantity: 0,
                                        status: 'active'
                                    })
                                    setCurrentlyEditing(null)
                                } else {
                                    setIngredients((pre) => ({
                                        ...pre,
                                        [newIngredient.name]: {
                                            price: newIngredient.price,
                                            unit: newIngredient.unit,
                                            totalQuantity: newIngredient.totalQuantity,
                                            status: newIngredient.status
                                        }

                                    }))
                                    setOpen(false)
                                    setNewIngredient({
                                        name: '',
                                        price: '',
                                        unit: '',
                                        totalQuantity: 0,
                                        status: 'active'
                                    })
                                }

                            }}
                            variant="contained"
                            style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <Wrapper>
                <Stack>
                    <Stack direction='row' justifyContent='space-between'>
                        <div></div>
                        <Stack direction='row' margin='10px' gap={1}>
                            <Button
                                onClick={() => setActiveFilter('active')}
                                variant={activeFilter === 'active' ? "contained" : "outlined"}

                            >
                                <Typography>Active</Typography>
                            </Button>
                            <Button
                                onClick={() => setActiveFilter('inactive')}
                                variant={activeFilter === 'inactive' ? "contained" : "outlined"}

                            >
                                <Typography>Inactive</Typography>
                            </Button>
                            <Button
                                onClick={() => setActiveFilter('trash')}
                                variant={activeFilter === 'trash' ? "contained" : "outlined"}

                            >
                                <Typography>Trash</Typography>
                            </Button>
                        </Stack>

                        <Button
                            onClick={() => setOpen(true)}
                            variant="contained"
                            style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                        >
                            <AddCircleOutlineIcon />
                            <Typography>Add New Ingredient</Typography>
                        </Button>
                    </Stack>

                    {getIngredientsCount() === 0 ?
                        <Stack style={{ textAlign: 'center' }}>

                            <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Not Record Found</Typography>

                        </Stack>
                        :
                        <TableContainer TableContainer className="cost-table" component={Paper} variant="outlined" style={{ width: '80%', alignSelf: 'center' }}>
                            <Table>
                                <TableHead>
                                    <TableRow className="cell-head">
                                        <TableCell>Raw Material</TableCell>
                                        <TableCell>Total Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Unit Cost</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(ingredients).map((ingredient, index) => {
                                        console.log(ingredient);
                                        if (ingredients[ingredient].status === activeFilter) {
                                            return (
                                                <TableRow>
                                                    <TableCell width='30%'>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={ingredient}
                                                            className="cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell width='14%'>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={
                                                                `${ingredients[ingredient].totalQuantity} ${ingredients[ingredient].unit}`
                                                            }
                                                            className="cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell width='14%'>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={ingredients[ingredient].price}
                                                            className="cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell width='14%'>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={(ingredients[ingredient].price / ingredients[ingredient].totalQuantity).toFixed(2)}
                                                            className="cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell width='14%'>
                                                        <Stack direction='row' justifyContent='center'>
                                                            {activeFilter !== 'trash' && <Button
                                                                // style={{ width: '75px', height: '100%' }}
                                                                color="secondary"
                                                                variant="outlined"
                                                                style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                onClick={() => {
                                                                    setCurrentlyEditing({
                                                                        name: ingredient,
                                                                        ...ingredients[ingredient]
                                                                    })
                                                                    setNewIngredient({
                                                                        name: ingredient,
                                                                        ...ingredients[ingredient]
                                                                    })
                                                                    setOpen(true)
                                                                }}>Edit</Button>}
                                                            {activeFilter !== 'trash' && <Button
                                                                // style={{ width: '75px', height: '100%' }}
                                                                color="info"
                                                                variant="outlined"
                                                                style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                onClick={() => {
                                                                    setIngredients(pre => ({
                                                                        ...pre,
                                                                        [ingredient]: {
                                                                            ...ingredients[ingredient],
                                                                            status: activeFilter === 'inactive' ? 'active' : 'inactive'
                                                                        }
                                                                    }))
                                                                }}>
                                                                {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                            </Button>}
                                                            <Button
                                                                // style={{ width: '75px', height: '100%' }}
                                                                color="error"
                                                                variant="outlined"
                                                                style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                onClick={() => {
                                                                    // setIngredients(deleteItem(ingredients, ingredient))
                                                                    activeFilter !== 'trash' ? setIngredients(pre => ({
                                                                        ...pre,
                                                                        [ingredient]: {
                                                                            ...ingredients[ingredient],
                                                                            status: 'trash'
                                                                        }
                                                                    })) : setIngredients(pre => ({
                                                                        ...pre,
                                                                        [ingredient]: {
                                                                            ...ingredients[ingredient],
                                                                            status: 'active'
                                                                        }
                                                                    }))

                                                                    // console.log(deleteItem(ingredients, ingredient));
                                                                }}>
                                                                {activeFilter !== 'trash' ? 'Remove' : 'Restore'}
                                                            </Button>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    }

                </Stack>
            </Wrapper >

        </>
    );
}

const Wrapper = styled.main`
  input {
    padding: 8.5px 0px;
    text-align: center;
  }

  td {
    padding: 0;
    border-bottom: none;
  }
  td div {
    border-radius: 0px;
    font-size: small;
  }
  .table-head {
    background-color: black;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  .cell-head {
    background-color: #ffeb9c;
    white-space: nowrap;
    border: 1px solid black;
  }

  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
    border: 1px solid black;
    font-size: medium;
  }

  .costProduct-cell-head {
    background-color: black;
    white-space: nowrap;
    border: 1px solid black;
}

.costProduct-cell-head > th {
    border: 1px solid white;
    color: white;
    font-weight: bold;
    font-size: medium;
  }

  .productCost-cell-disabled {
    background-color: #e4c1f9;
  }

  .productCost-cell-disabled > div {
    font-weight: bold;
  }

  .cell-disabled {
    background-color: #c6efce;
  }

  .cell-disabled > div {
    font-weight: bold;
  }

  .cost-table td div {
    font-size: medium;
  }

  .costProduct-cell-head .cell-disabled {
    background-color: black;
  }
`;

export default Ingredients