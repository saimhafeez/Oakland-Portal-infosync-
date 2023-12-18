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
import SuperAdminSidebar from "../components/sidebar/SuperAdminSidebar";

function Ingredients(props) {

    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active')
    const [isLoading, setIsLoading] = useState(true);


    // =================================================
    const [currentlyAdding, setCurrentlyAdding] = useState("");
    const [currentlyEditing, setCurrentlyEditing] = useState("");
    const [newIronPipe, setNewIronPipe] = useState({
        type: '',
        size: '',
        price: 0,
        unit: '',
        totalQuantity: 0,
        status: 'active'
    })

    const [newWoodSheet, setNewWoodSheet] = useState({
        price: 0,
        unit: '',
        totalQuantity: 0,
        status: 'active'
    })

    const [newWoodTape, setNewWoodTape] = useState({
        price: 0,
        unit: '',
        totalQuantity: 0,
        status: 'active'
    })

    const [newMisc, setNewMisc] = useState({
        name: '',
        price: 0,
        status: 'active'
    })
    // =================================================


    const [newIngredient, setNewIngredient] = useState({
        name: '',
        price: 0,
        unit: '',
        totalQuantity: 0,
        status: 'active'
    })

    const [ingredients, setIngredients] = useState()

    const getIngredientsCount = () => {
        var count = 0;

        Object.keys(ingredients).map((ingredient) => {
            if (ingredients[ingredient].status === activeFilter) {
                count++
            }
        })
        return count
    }

    const fetchIngredients = async () => {
        setIsLoading(true)
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).then((result) => {
            console.log('result', result);
            // setIngredients(result.data)
            // setIsLoading(false)
        }).catch((e) => console.log('error occured', e))

        const { data } = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).catch((e) => console.log('error occured', e));

        console.log('result', data);
        setIngredients(data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchIngredients()
    }, [])

    const editIronPipeIngredient = (ironPipe) => {
        setCurrentlyAdding("Iron Pipe")
        setCurrentlyEditing(ironPipe.toString())
        setNewIronPipe({
            type: ironPipe.split('  ')[0],
            size: ironPipe.split('  ')[1],
            price: (ingredients['Iron Pipe'])[ironPipe].price,
            unit: (ingredients['Iron Pipe'])[ironPipe].unit,
            totalQuantity: (ingredients['Iron Pipe'])[ironPipe].totalQuantity
        })
        setOpen(true)
    }

    const changeActiveStatusIronPipeIngredient = (ironPipe, status) => {

        const newData = {
            ...ingredients,
            ['Iron Pipe']: {
                ...(ingredients['Iron Pipe']),
                [ironPipe]: {
                    ...((ingredients['Iron Pipe'])[ironPipe]),
                    status
                }
            }
        }

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))
        // console.log('original', (ingredients["Iron Pipe"])[currentlyEditing])
        // console.log('changes', changes);
    }

    const saveIronPipeIngredient = () => {
        const changes = {
            [`${newIronPipe.type}  ${newIronPipe.size}`]: {
                price: parseInt(newIronPipe.price),
                status: currentlyEditing ? ((ingredients["Iron Pipe"])[currentlyEditing]).status : newIronPipe.status,
                unit: newIronPipe.unit,
                totalQuantity: parseInt(newIronPipe.totalQuantity)
            }
        }
        console.log('original', (ingredients["Iron Pipe"])[currentlyEditing])
        console.log('changes', changes);

        const newData = {
            ...ingredients,
            ['Iron Pipe']: {
                ...(ingredients['Iron Pipe']),
                ...changes
            }
        }

        setOpen(false)
        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
        setNewIronPipe({
            type: '',
            size: '',
            price: 0,
            unit: '',
            totalQuantity: 0,
            status: 'active'
        })

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))

        // Object.keys(ingredients["Iron Pipe"]).map((ironPipe) => {
        //     if ((ingredients["Iron Pipe"])[ironPipe] !== currentlyAdding) {
        //         return (ingredients["Iron Pipe"])[ironPipe]
        //     } else {
        //         return {
        //             [`${newIronPipe.type}  ${newIronPipe.size}`]: {
        //                 price: newIronPipe.price,
        //                 status: newIronPipe.status,
        //                 unit: newIronPipe.unit,
        //                 totalQuantity: newIronPipe.totalQuantity
        //             }
        //         }
        //     }
        // })

        console.log('newData', newData);

    }

    const editMiscIngredient = (misc) => {
        setCurrentlyAdding("Misc")
        // console.log('misc.toString()', misc.toString());
        setCurrentlyEditing(misc.toString())
        console.log('misc', misc);
        setNewMisc({
            name: misc,
            price: (ingredients['Misc'])[misc].price,
            unit: (ingredients['Misc'])[misc].unit,
        })
        setOpen(true)
    }

    const saveMiscIngredient = () => {
        const changes = {
            [`${newMisc.name}`]: {
                price: parseInt(newMisc.price),
                status: currentlyEditing ? ((ingredients["Misc"])[currentlyEditing]).status : newMisc.status,
            }
        }
        console.log('original', (ingredients["Misc"])[currentlyEditing])
        console.log('changes', changes);

        const newData = {
            ...ingredients,
            ['Misc']: {
                ...(ingredients['Misc']),
                ...changes
            }
        }

        setOpen(false)
        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
        setNewMisc({
            name: '',
            price: 0,
            status: 'active'
        })

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))

        console.log('newData', newData);
    }

    const changeActiveStatusMiscIngredient = (ing, status) => {
        const newData = {
            ...ingredients,
            ['Misc']: {
                ...(ingredients['Misc']),
                [ing]: {
                    ...((ingredients['Misc'])[ing]),
                    status
                }
            }
        }

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))
    }


    // useEffect(() => {
    //     const ingredient = {
    //         "Iron Pipe": {
    //             "Square  01'' x 01''": {
    //                 "price": 2000,
    //                 "unit": "ft",
    //                 "totalQuantity": 20,
    //                 "status": "active"
    //             },
    //             "Square  0.5'' x 0.5''": {
    //                 "price": 5000,
    //                 "unit": "ft",
    //                 "totalQuantity": 10,
    //                 "status": "active"
    //             },
    //             "Solid Wood  1.5'' x 1.5''": {
    //                 "price": 7000,
    //                 "unit": "ft",
    //                 "totalQuantity": 30,
    //                 "status": "active"
    //             },
    //         },
    //         "Wooden Sheet": {
    //             "price": 5000,
    //             "unit": "sq.ft",
    //             "totalQuantity": 32,
    //             "status": "active"
    //         },
    //         "Wood Tape": {
    //             "price": 2000,
    //             "unit": "ft",
    //             "totalQuantity": 10,
    //             "status": "active"
    //         },
    //         "Misc": {
    //             "wheels": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "cross rods": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "gauze": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "realing": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "wooden legs": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "handles": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "box": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "wooden piller": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //             "steel piller": {
    //                 "price": 10,
    //                 "status": "active"
    //             },
    //         }
    //     }

    //     fetch('http://139.144.30.86:8000/api/ingredients', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(ingredient),
    //     }).then((res) => res.json()).then((result) => {
    //         console.log('submitted', result);
    //     })
    // })

    const IronPipeModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Type"
                    variant="outlined"
                    value={newIronPipe.type}
                    onChange={(e) => setNewIronPipe((pre) => ({ ...pre, type: e.target.value }))}
                />
                <TextField
                    label="Size"
                    variant="outlined"
                    value={newIronPipe.size}
                    onChange={(e) => setNewIronPipe((pre) => ({ ...pre, size: e.target.value }))}
                />
                <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={newIronPipe.price}
                    onChange={(e) => setNewIronPipe((pre) => ({ ...pre, price: e.target.value }))}
                />
                <TextField
                    label="Unit"
                    variant="outlined"
                    type="text"
                    value={newIronPipe.unit}
                    onChange={(e) => setNewIronPipe((pre) => ({ ...pre, unit: e.target.value }))}
                />
                <TextField
                    label="Total Quantity"
                    variant="outlined"
                    type="number"
                    value={newIronPipe.totalQuantity}
                    onChange={(e) => setNewIronPipe((pre) => ({ ...pre, totalQuantity: e.target.value }))}
                />
                <Button
                    onClick={saveIronPipeIngredient}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const editWoodenSheetIngredient = (woodenSheet) => {
        setCurrentlyAdding("Wooden Sheet")
        // setCurrentlyEditing(ironPipe.toString())
        setNewWoodSheet({
            ...woodenSheet
        })
        setOpen(true)
    }

    const editWoodenTapeIngredient = (woodenTape) => {
        setCurrentlyAdding("Wood Tape")
        // setCurrentlyEditing(ironPipe.toString())
        setNewWoodTape({
            ...woodenTape
        })
        setOpen(true)
    }

    const saveWoodenSheetIngredient = () => {

        const newData = {
            ...ingredients,
            ['Wooden Sheet']: {
                ...newWoodSheet
            }
        }

        setOpen(false)
        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
        setNewWoodSheet({
            price: 0,
            unit: '',
            totalQuantity: 0,
            status: 'active'
        })

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))
    }

    const saveWoodenTapeIngredient = () => {
        const newData = {
            ...ingredients,
            ['Wood Tape']: {
                ...newWoodTape
            }
        }

        console.log('newData', newData);

        setOpen(false)
        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
        setNewWoodTape({
            price: 0,
            unit: '',
            totalQuantity: 0,
            status: 'active'
        })

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))
    }

    const WoodenSheetNTapeModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={currentlyAdding === "Wooden Sheet" ? newWoodSheet.price : newWoodTape.price}
                    onChange={(e) => currentlyAdding === "Wooden Sheet" ? setNewWoodSheet((pre) => ({ ...pre, price: e.target.value })) : setNewWoodTape((pre) => ({ ...pre, price: e.target.value }))}
                />
                <TextField
                    label="Unit"
                    variant="outlined"
                    type="text"
                    value={currentlyAdding === "Wooden Sheet" ? newWoodSheet.unit : newWoodTape.unit}
                    onChange={(e) => currentlyAdding === "Wooden Sheet" ? setNewWoodSheet((pre) => ({ ...pre, unit: e.target.value })) : setNewWoodTape((pre) => ({ ...pre, unit: e.target.value }))}
                />
                <TextField
                    label="Total Quantity"
                    variant="outlined"
                    type="number"
                    value={currentlyAdding === "Wooden Sheet" ? newWoodSheet.totalQuantity : newWoodTape.totalQuantity}
                    onChange={(e) => currentlyAdding === "Wooden Sheet" ? setNewWoodSheet((pre) => ({ ...pre, totalQuantity: e.target.value })) : setNewWoodTape((pre) => ({ ...pre, totalQuantity: e.target.value }))}
                />
                <Button
                    onClick={currentlyAdding === "Wooden Sheet" ? saveWoodenSheetIngredient : saveWoodenTapeIngredient}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const changeActiveStatusWoodenSheetNTapeIngredient = (ing, status) => {
        const newData = {
            ...ingredients,
            [ing]: {
                ...(ingredients[ing]),
                status,
            }
        }

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            fetchIngredients()
        }).catch((e) => console.log('error occured', e))
    }

    const MiscModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={newMisc.name}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, name: e.target.value }))}
                />
                <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={newMisc.price}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, price: e.target.value }))}
                />
                <Button
                    onClick={saveMiscIngredient}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
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
                    setNewIronPipe({
                        name: '',
                        price: 0,
                        unit: '',
                        totalQuantity: 0,
                        status: 'active'
                    })
                    setNewMisc({
                        name: '',
                        price: 0,
                        status: 'active'
                    })
                    setCurrentlyAdding(null)
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
                    {currentlyAdding === 'Iron Pipe' && IronPipeModal()}
                    {(currentlyAdding === 'Wooden Sheet' || currentlyAdding === 'Wood Tape') && WoodenSheetNTapeModal()}
                    {(currentlyAdding === 'Misc') && MiscModal()}
                </Box>
            </Modal>

            <SuperAdminSidebar />

            <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>

                <Stack direction='row' justifyContent='center'>
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
                </Stack>
                {
                    isLoading ? <CircularProgress /> :
                        <>
                            <div className="px-5">
                                <h2>Iron Pipe</h2>
                                <div className="mt-1">
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("Iron Pipe")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add New Iron Pipe Material</Typography>
                                    </Button>
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Pipe Type & Size</th>
                                                <th>Total Quantity</th>
                                                <th>Price</th>
                                                <th>Unit Cost</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingredients && Object.keys(ingredients["Iron Pipe"]).map((ironPipe, index) => {
                                                if (activeFilter === (ingredients["Iron Pipe"])[ironPipe].status) {
                                                    return <tr tr key={index}>
                                                        <td>{ironPipe}</td>
                                                        <td>
                                                            {(ingredients["Iron Pipe"])[ironPipe].totalQuantity} {(ingredients["Iron Pipe"])[ironPipe].unit}
                                                        </td>
                                                        <td>
                                                            {(ingredients["Iron Pipe"])[ironPipe].price}
                                                        </td>
                                                        <td>{((ingredients["Iron Pipe"])[ironPipe].price / (ingredients["Iron Pipe"])[ironPipe].totalQuantity).toFixed(2)}</td>
                                                        <td>
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => editIronPipeIngredient(ironPipe)}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeActiveStatusIronPipeIngredient(ironPipe, activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => activeFilter !== 'trash' ? changeActiveStatusIronPipeIngredient(ironPipe, "trash") : changeActiveStatusIronPipeIngredient(ironPipe, "active")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                >
                                                                    {activeFilter !== 'trash' ? 'Remove' : 'Restore'}
                                                                </Button>
                                                            </Stack>
                                                        </td>
                                                    </tr>
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div >

                            <div className="px-5">
                                <h2>Wooden Sheet</h2>
                                <div className="mt-1">
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Total Quantity</th>
                                                <th>Price</th>
                                                <th>Unit Cost</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingredients && ingredients["Wooden Sheet"].status === activeFilter && <tr tr>
                                                <td>
                                                    {ingredients["Wooden Sheet"].totalQuantity} {ingredients["Wooden Sheet"].unit}
                                                </td>
                                                <td>
                                                    {ingredients["Wooden Sheet"].price}
                                                </td>
                                                <td>{(ingredients["Wooden Sheet"].price / ingredients["Wooden Sheet"].totalQuantity).toFixed(2)}</td>
                                                <td>
                                                    <Stack direction='row' justifyContent='center'>
                                                        {activeFilter !== 'trash' && <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="secondary"
                                                            variant="outlined"
                                                            onClick={() => editWoodenSheetIngredient(ingredients["Wooden Sheet"])}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                        >Edit</Button>}
                                                        {activeFilter !== 'trash' && <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="info"
                                                            variant="outlined"
                                                            onClick={() => changeActiveStatusWoodenSheetNTapeIngredient('Wooden Sheet', activeFilter === 'inactive' ? "active" : "inactive")}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                            {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                        </Button>}
                                                        <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={() => changeActiveStatusWoodenSheetNTapeIngredient('Wooden Sheet', activeFilter === 'trash' ? "active" : "trash")}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                        >
                                                            {activeFilter !== 'trash' ? 'Remove' : 'Restore'}
                                                        </Button>
                                                    </Stack>
                                                </td>
                                            </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div >

                            <div className="px-5">
                                <h2>Wood Tape</h2>
                                <div className="mt-1">

                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Total Quantity</th>
                                                <th>Price</th>
                                                <th>Unit Cost</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingredients && ingredients["Wood Tape"].status === activeFilter && <tr tr>
                                                <td>
                                                    {ingredients["Wood Tape"].totalQuantity} {ingredients["Wood Tape"].unit}
                                                </td>
                                                <td>
                                                    {ingredients["Wood Tape"].price}
                                                </td>
                                                <td>{(ingredients["Wood Tape"].price / ingredients["Wood Tape"].totalQuantity).toFixed(2)}</td>
                                                <td>
                                                    <Stack direction='row' justifyContent='center'>
                                                        {activeFilter !== 'trash' && <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="secondary"
                                                            variant="outlined"
                                                            onClick={() => editWoodenTapeIngredient(ingredients["Wood Tape"])}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                        >Edit</Button>}
                                                        {activeFilter !== 'trash' && <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="info"
                                                            variant="outlined"
                                                            onClick={() => changeActiveStatusWoodenSheetNTapeIngredient('Wood Tape', activeFilter === 'inactive' ? "active" : "inactive")}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                            {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                        </Button>}
                                                        <Button
                                                            // style={{ width: '75px', height: '100%' }}
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={() => changeActiveStatusWoodenSheetNTapeIngredient('Wood Tape', activeFilter === 'trash' ? "active" : "trash")}
                                                            style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                        >
                                                            {activeFilter !== 'trash' ? 'Remove' : 'Restore'}
                                                        </Button>
                                                    </Stack>
                                                </td>
                                            </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div >

                            <div className="px-5">
                                <h2>Misc</h2>
                                <div className="mt-1">
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("Misc")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add New Misc Item</Typography>
                                    </Button>
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Item</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingredients && Object.keys(ingredients["Misc"]).map((misc, index) => {
                                                if (activeFilter === (ingredients["Misc"])[misc].status) {
                                                    return <tr tr key={index}>
                                                        <td>{misc}</td>
                                                        <td>
                                                            {(ingredients["Misc"])[misc].price}
                                                        </td>
                                                        <td>
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => editMiscIngredient(misc)}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeActiveStatusMiscIngredient(misc, activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => activeFilter !== 'trash' ? changeActiveStatusMiscIngredient(misc, "trash") : changeActiveStatusMiscIngredient(misc, "active")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                >
                                                                    {activeFilter !== 'trash' ? 'Remove' : 'Restore'}
                                                                </Button>
                                                            </Stack>
                                                        </td>
                                                    </tr>
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div >
                        </>
                }

            </div>



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



// {
//     "Iron Pipe [Square  01'' x 01'']": {
//         price: 2000,
//         unit: "ft",
//         totalQuantity: 20,
//         status: 'active'
//     },
//     "Iron Pipe [Square  0.5'' x 0.5'']": {
//         price: 5000,
//         unit: "ft",
//         totalQuantity: 10,
//         status: 'inactive'
//     },
//     "Iron Pipe [Solid Wood  1.5'' x 1.5'']": {
//         price: 7000,
//         unit: "ft",
//         totalQuantity: 30,
//         status: 'active'
//     },
//     "Wooden Sheet": {
//         price: 5000,
//         unit: 'sq.ft',
//         totalQuantity: 32,
//         status: 'active'
//     },
//     "Wood Tape": {
//         price: 2000,
//         unit: 'ft',
//         totalQuantity: 10,
//         status: 'trash'
//     }
// }

// {
//     "Iron Pipe [Square  01'' x 01'']": {
//       "price": "4000",
//       "unit": "ft",
//       "totalQuantity": 20,
//       "status": "active"
//     },
//     "Iron Pipe [Square  0.5'' x 0.5'']": {
//       "price": "5000",
//       "unit": "ft",
//       "totalQuantity": "10",
//       "status": "active"
//     },
//     "Iron Pipe [Solid Wood  1.5'' x 1.5'']": {
//       "price": "7000",
//       "unit": "ft",
//       "totalQuantity": "30",
//       "status": "active"
//     },
//     "Wooden Sheet": {
//       "price": "5000",
//       "unit": "sq.ft",
//       "totalQuantity": "32",
//       "status": "active"
//     },
//     "Wood Tape": {
//       "price": "2000",
//       "unit": "ft",
//       "totalQuantity": "10",
//       "status": "active"
//     },
//     "Iron Pipe [Square  2'' x 2'']": {
//       "price": "500",
//       "unit": "ft",
//       "totalQuantity": "5000",
//       "status": "active"
//     }
//   }

const newFor = {
    "Iron Pipe": {
        "Square  01'' x 01''": {
            "price": 2000,
            "unit": "ft",
            "totalQuantity": 20,
            "status": "active"
        },
        "Square  0.5'' x 0.5''": {
            "price": 5000,
            "unit": "ft",
            "totalQuantity": 10,
            "status": "active"
        },
        "Solid Wood  1.5'' x 1.5''": {
            "price": 7000,
            "unit": "ft",
            "totalQuantity": 30,
            "status": "active"
        },
    },
    "Wooden Sheet": {
        "price": 5000,
        "unit": "sq.ft",
        "totalQuantity": 32,
        "status": "active"
    },
    "Wood Tape": {
        "price": 2000,
        "unit": "ft",
        "totalQuantity": 10,
        "status": "active"
    }
}