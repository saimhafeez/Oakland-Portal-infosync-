import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import {
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SuperAdminSidebar from "../../components/sidebar/SuperAdminSidebar";
import Header from "../../components/header/Header";
import { useAppContext } from "../../context/appContext";

const demoData = {

    portalVariables: {
        pipeTypesNSizes: [
            {
                type: "square",
                size: "01'' x 01''",
                status: 'active'
            },
            {
                type: "square",
                size: "0.5'' x 0.5''",
                status: 'active'
            },
            {
                type: "solid wood",
                size: "1.5'' x 1.5''",
                status: 'active'
            }
        ]
    },

    rawIngredients: {
        "pipe": [
            {
                "material": "kala pipe",
                "brand": "china",
                "rate": "2000",
                "length_feet": "20",
                "weight": "40",
                "status": "active"
            }
        ],
        "sheet": [
            {
                "material": "mdf",
                "brand": "patex",
                "rate": "5000",
                "total_sq_feet": "32",
                "weight": "40",
                "status": "active"
            }
        ],
        "paint": [
            {
                "type": "powder coat",
                "brand": "nippon",
                "size": "1'' x 1''",
                "rate": "35",
                "status": "active"
            },
            {
                "type": "spray paint",
                "brand": "nippon",
                "size": "1'' x 1''",
                "rate": "20",
                "status": "active"
            }
        ],
        "tape": [
            {
                "type": "slim",
                "size_inch": "0.75",
                "rate": "30",
                "status": "active"
            },
            {
                "type": "wide",
                "size_inch": "1.5",
                "rate": "50",
                "status": "active"
            }
        ],
        "misc": [
            {
                "item": "jaali",
                "details": "wheels",
                "rate": "1500",
                "weight": "1",
                "status": "active"
            },
            {
                "item": "wheels",
                "details": "small",
                "rate": "1500",
                "weight": "1",
                "status": "active"
            }
        ],
        "shipping companies": [
            {
                "company": "leopard",
                "overland": "80",
                "detain": "150",
                "overnight": "220",
                "status": "active"
            }
        ]
    }
}



function RawIngredients(props) {

    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active')
    const [isLoading, setIsLoading] = useState(true);

    // =================================================
    const [currentlyAdding, setCurrentlyAdding] = useState("");
    const [currentlyEditing, setCurrentlyEditing] = useState("");

    const [newPipe, setNewPipe] = useState({
        type: '',
        size: "00'' x 00''",
        rate: '',
        length_feet: '',
        weight: '',
        status: 'active'
    })

    const [newSheet, setNewSheet] = useState({
        rate: '',
        total_sq_feet: '',
        weight: '',
        status: 'active'
    })

    const [newPaint, setNewPaint] = useState({
        rate: '',
        status: 'active'
    })

    const [newTape, setNewTape] = useState({
        type: '',
        size_inch: '',
        rate: '',
        status: 'active'
    })

    const [newMisc, setNewMisc] = useState({
        item: '',
        details: '',
        rate: '',
        weight: '',
        status: 'active'
    })

    const [newShippingCompany, setNewShippingCompany] = useState({
        company: '',
        overland: '',
        detain: '',
        overnight: '',
        status: 'active'
    })
    // =================================================)

    const [ingredients, setIngredients] = useState()
    const [rawIngredients, setRawIngredients] = useState({
        'pipe': [],
        'sheet': [],
        'paint': [],
        'tape': [],
        'misc': [],
        'shipping companies': [],
    })

    const fetchIngredients = async () => {
        setIsLoading(true)
        const { data } = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).catch((e) => console.log('error occured', e));
        setIngredients(data)
        console.log('result', data);
        if (data.rawIngredients) {
            setRawIngredients(data.rawIngredients)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchIngredients()
    }, [])

    const save = () => {
        var newCosts = rawIngredients

        if (currentlyEditing !== null) {
            newCosts = {
                ...newCosts,
                [currentlyAdding]: [...newCosts[currentlyAdding].filter((item, index) => index !== currentlyEditing)]
            }
        }

        newCosts[currentlyAdding].push(
            currentlyAdding === 'pipe' && newPipe ||
            currentlyAdding === 'sheet' && newSheet ||
            currentlyAdding === 'paint' && newPaint ||
            currentlyAdding === 'tape' && newTape ||
            currentlyAdding === 'misc' && newMisc ||
            currentlyAdding === 'shipping companies' && newShippingCompany
        )

        const ing = ingredients

        ing.rawIngredients = newCosts

        console.log('newData', newCosts);


        fetch('http://139.144.30.86:8000/api/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            setRawIngredients(newCosts)
            setOpen(false)
            reset()
            console.log('updated_data', newCosts);
        })
    }

    const changeStatus = (index, type, status) => {

        var newCosts = rawIngredients

        newCosts[type][index].status = status

        const ing = ingredients

        ing.rawIngredients = newCosts

        fetch('http://139.144.30.86:8000/api/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result); console.log('submitted', result);
            setRawIngredients(newCosts)
            setOpen(false)
            reset()
            console.log('updated_data', newCosts);
        })
    }

    // useEffect(() => {

    //     fetch('http://139.144.30.86:8000/api/ingredients', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(demoData),
    //     }).then((res) => res.json()).then((result) => {
    //         console.log('submitted', result);
    //     })

    // }, [])

    const PipeModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Type"
                    variant="outlined"
                    value={newPipe.type}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, type: e.target.value.toLowerCase() }))}
                />
                <div>
                    Size
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        <TextField
                            label="''"
                            variant="outlined"
                            type="number"
                            value={newPipe.size.split(" x ")[0].split("''")[0]}
                            onChange={(e) => {
                                const pre_value = newPipe.size.split(" x ")[1]
                                setNewPipe(pre => ({ ...pre, size: `${e.target.value.padStart(2, "0")}'' x ${pre_value}` }))
                            }}
                        />
                        x
                        <TextField
                            label="''"
                            variant="outlined"
                            type="number"
                            value={newPipe.size.split(" x ")[1].split("''")[0]}
                            onChange={(e) => {
                                const pre_value = newPipe.size.split(" x ")[0]
                                setNewPipe(pre => ({ ...pre, size: `${pre_value} x ${e.target.value.padStart(2, "0")}''` }))
                            }}
                        />
                    </div>
                </div>
                <TextField
                    label="Type & Size"
                    variant="outlined"
                    disabled={true}
                    value={`${newPipe.type} ${newPipe.size}`}
                />
                <TextField
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={newPipe.rate}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, rate: e.target.value }))}
                />
                <TextField
                    label="Length"
                    variant="outlined"
                    type="number"
                    value={newPipe.length_feet}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, length_feet: e.target.value }))}
                />
                <TextField
                    label="Weight"
                    variant="outlined"
                    type="number"
                    value={newPipe.weight}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, weight: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const SheetModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={newSheet.rate}
                    onChange={(e) => setNewSheet((pre) => ({ ...pre, rate: e.target.value }))}
                />
                <TextField
                    label="Total Sq. Feets"
                    variant="outlined"
                    type="number"
                    value={newSheet.total_sq_feet}
                    onChange={(e) => setNewSheet((pre) => ({ ...pre, total_sq_feet: e.target.value }))}
                />
                <TextField
                    label="Weight"
                    variant="outlined"
                    type="number"
                    value={newSheet.weight}
                    onChange={(e) => setNewSheet((pre) => ({ ...pre, weight: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const PaintModal = () => {
        return <>
            <Stack gap={2}>
                {/* <TextField
                    label="Type"
                    variant="outlined"
                    value={newPaint.type}
                    onChange={(e) => setNewPaint((pre) => ({ ...pre, type: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Brand"
                    variant="outlined"
                    value={newPaint.brand}
                    onChange={(e) => setNewPaint((pre) => ({ ...pre, brand: e.target.value.toLowerCase() }))}
                />
                <div>
                    Size
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        <TextField
                            label="''"
                            variant="outlined"
                            type="number"
                            value={newPaint.size.split(" x ")[0].split("''")[0]}
                            onChange={(e) => {
                                const pre_value = newPaint.size.split(" x ")[1]
                                setNewPaint(pre => ({ ...pre, size: `${e.target.value}'' x ${pre_value}` }))
                            }}
                        />
                        x
                        <TextField
                            label="''"
                            variant="outlined"
                            type="number"
                            value={newPaint.size.split(" x ")[1].split("''")[0]}
                            onChange={(e) => {
                                const pre_value = newPaint.size.split(" x ")[0]
                                setNewPaint(pre => ({ ...pre, size: `${pre_value} x ${e.target.value}''` }))
                            }}
                        />
                    </div>
                </div> */}
                <TextField
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={newPaint.rate}
                    onChange={(e) => setNewPaint((pre) => ({ ...pre, rate: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const TapeModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Type"
                    variant="outlined"
                    value={newTape.type}
                    onChange={(e) => setNewTape((pre) => ({ ...pre, type: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Size (inch)"
                    variant="outlined"
                    type="number"
                    value={newTape.size_inch}
                    onChange={(e) => setNewTape((pre) => ({ ...pre, size_inch: e.target.value }))}
                />
                <TextField
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={newTape.rate}
                    onChange={(e) => setNewTape((pre) => ({ ...pre, rate: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const MiscModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Item"
                    variant="outlined"
                    value={newMisc.item}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, item: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Details"
                    variant="outlined"
                    value={newMisc.details}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, details: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={newMisc.rate}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, rate: e.target.value }))}
                />
                <TextField
                    label="Weight"
                    variant="outlined"
                    type="number"
                    value={newMisc.weight}
                    onChange={(e) => setNewMisc((pre) => ({ ...pre, weight: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }

    const ShippingCompanyModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Company"
                    variant="outlined"
                    value={newShippingCompany.company}
                    onChange={(e) => setNewShippingCompany((pre) => ({ ...pre, company: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Overland Rate"
                    variant="outlined"
                    type="number"
                    value={newShippingCompany.overland}
                    onChange={(e) => setNewShippingCompany((pre) => ({ ...pre, overland: e.target.value }))}
                />
                <TextField
                    label="Detain Rate"
                    variant="outlined"
                    type="number"
                    value={newShippingCompany.detain}
                    onChange={(e) => setNewShippingCompany((pre) => ({ ...pre, detain: e.target.value }))}
                />
                <TextField
                    label="Overnight Rate"
                    variant="outlined"
                    type="number"
                    value={newShippingCompany.overnight}
                    onChange={(e) => setNewShippingCompany((pre) => ({ ...pre, overnight: e.target.value }))}
                />
                <Button
                    onClick={save}
                    variant="contained"
                    style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                >
                    Save
                </Button>
            </Stack>
        </>
    }


    const reset = () => {
        setNewPipe({
            type: '',
            size: "00'' x 00''",
            rate: '',
            length_feet: '',
            weight: '',
            status: 'active'
        })

        setNewSheet({
            rate: '',
            total_sq_feet: '',
            weight: '',
            status: 'active'
        })

        setNewPaint({
            rate: '',
            status: 'active'
        })

        setNewTape({
            type: '',
            size_inch: '',
            rate: '',
            status: 'active'
        })

        setNewMisc({
            item: '',
            details: '',
            rate: '',
            weight: '',
            status: 'active'
        })

        setNewShippingCompany({
            company: '',
            overland: '',
            detain: '',
            overnight: '',
            status: 'active'
        })

        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
    }

    const edit = (index, type, updateStatus = false, status = 'active') => {

        setCurrentlyAdding(type)
        setCurrentlyEditing(index)

        if (type === 'pipe') {
            setNewPipe({
                ...rawIngredients.pipe[index],
                status: updateStatus ? status : (rawIngredients.pipe[index]).status
            })

        } else if (type === 'sheet') {
            setNewSheet({
                ...rawIngredients.sheet[index],
                status: updateStatus ? status : (rawIngredients.sheet[index]).status
            })

        } else if (type === 'paint') {
            setNewPaint({
                ...rawIngredients.paint[index],
                status: updateStatus ? status : (rawIngredients.paint[index]).status
            })

        } else if (type === 'tape') {
            setNewTape({
                ...rawIngredients.tape[index],
                status: updateStatus ? status : (rawIngredients.tape[index]).status
            })

        } else if (type === 'misc') {
            setNewMisc({
                ...rawIngredients.misc[index],
                status: updateStatus ? status : (rawIngredients.misc[index]).status
            })

        } else if (type === 'shipping companies') {
            setNewShippingCompany({
                ...(rawIngredients['shipping companies'])[index],
                status: updateStatus ? status : ((rawIngredients['shipping companies'])[index]).status
            })

        }
        setOpen(true)
    }

    const { sidebarOpened } = useAppContext()

    return (
        <Wrapper>
            <Header
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    reset()
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
                    {currentlyAdding === 'pipe' && PipeModal()}
                    {currentlyAdding === 'sheet' && SheetModal()}
                    {currentlyAdding === 'paint' && PaintModal()}
                    {(currentlyAdding === 'tape') && TapeModal()}
                    {(currentlyAdding === 'misc') && MiscModal()}
                    {(currentlyAdding === 'shipping companies') && ShippingCompanyModal()}
                </Box>
            </Modal>

            <SuperAdminSidebar />

            <div className={`${sidebarOpened && "set-right-container-252"} p-3`} style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>

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
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Pipe</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("pipe")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Material</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Type</th>
                                                <th>Size</th>
                                                <th>Rate</th>
                                                <th>Length</th>
                                                <th>Per Ft Rate</th>
                                                <th>Weight</th>
                                                <th>Wt / Ft</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients.pipe.map((pipe, index) => {
                                                if (activeFilter === pipe.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{pipe.type}</td>
                                                        <td className="t-cell">{pipe.size}</td>
                                                        <td className="t-cell">{pipe.rate}</td>
                                                        <td className="t-cell">{pipe.length_feet} ft</td>
                                                        <td className="t-cell">{(pipe.rate / pipe.length_feet).toFixed(2)}</td>
                                                        <td className="t-cell">{pipe.weight}</td>
                                                        <td className="t-cell">{(pipe.weight / pipe.length_feet).toFixed(2)}</td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'pipe')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'pipe', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'pipe', activeFilter === 'trash' ? "active" : "trash")}
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
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Sheet</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("sheet")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Material</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Rate</th>
                                                <th>Total Sq. Feet</th>
                                                <th>Per sq.ft Rate</th>
                                                <th>Weight</th>
                                                <th>Wt / Sq Ft</th>
                                                <th></th>
                                                <th></th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients.sheet.map((sheet, index) => {
                                                if (activeFilter === sheet.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{sheet.rate}</td>
                                                        <td className="t-cell">{sheet.total_sq_feet} sq.ft</td>
                                                        <td className="t-cell">{(sheet.rate / sheet.total_sq_feet).toFixed(2)}</td>
                                                        <td className="t-cell">{sheet.weight}</td>
                                                        <td className="t-cell">{(sheet.weight / sheet.total_sq_feet).toFixed(2)}</td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'sheet')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'sheet', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'sheet', activeFilter === 'trash' ? "active" : "trash")}
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
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Paint</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("paint")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Material</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Rate</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients.paint.map((paint, index) => {
                                                if (activeFilter === paint.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{paint.rate}</td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'paint')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'paint', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'paint', activeFilter === 'trash' ? "active" : "trash")}
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

                            {/*
                            <div className="px-5">

                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Tape</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("tape")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Material</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">

                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Type</th>
                                                <th>Size</th>
                                                <th>Rate</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients.tape.map((tape, index) => {
                                                if (activeFilter === tape.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{tape.type}</td>
                                                        <td className="t-cell">{tape.size_inch}</td>
                                                        <td className="t-cell">{tape.rate}</td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'tape')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'tape', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'tape', activeFilter === 'trash' ? "active" : "trash")}
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

                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Misc</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("misc")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Material</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">

                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Item</th>
                                                <th>Details</th>
                                                <th>Rate</th>
                                                <th>Weight</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients.misc.map((misc, index) => {
                                                if (activeFilter === misc.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{misc.item}</td>
                                                        <td className="t-cell">{misc.details}</td>
                                                        <td className="t-cell">{misc.rate}</td>
                                                        <td className="t-cell">{misc.weight}</td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'misc')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'misc', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'misc', activeFilter === 'trash' ? "active" : "trash")}
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

                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <h2>Shipping Companies</h2>
                                    <Button
                                        onClick={() => {
                                            setCurrentlyAdding("shipping companies")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Company</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">

                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Company</th>
                                                <th>Overland</th>
                                                <th>Detain</th>
                                                <th>Overnight</th>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawIngredients["shipping companies"].map((shippingCompany, index) => {
                                                if (activeFilter === shippingCompany.status) {
                                                    return <tr tr key={index}>
                                                        <td className="t-cell">{shippingCompany.company}</td>
                                                        <td className="t-cell">{shippingCompany.overland}</td>
                                                        <td className="t-cell">{shippingCompany.detain}</td>
                                                        <td className="t-cell">{shippingCompany.overnight}</td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell"></td>
                                                        <td className="t-cell-action">
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'shipping companies')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'shipping companies', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'shipping companies', activeFilter === 'trash' ? "active" : "trash")}
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
                            
                            */}
                        </>
                }

            </div>



        </Wrapper>
    );
}

const Wrapper = styled.main`
    
    .t-cell {
        width: 11.11%;
    }

    .t-cell-action {
        width: 33.33%;
    }
`

export default RawIngredients



const d = {
    "portalVariables": {
        "pipeTypesNSizes": [
            {
                "type": "square",
                "size": "01'' x 01''",
                "status": "active"
            },
            {
                "type": "square",
                "size": "0.5'' x 0.5''",
                "status": "active"
            },
            {
                "type": "solid wood",
                "size": "1.5'' x 1.5''",
                "status": "active"
            },
            {
                "type": "square",
                "size": "01'' x 02''",
                "status": "active"
            }
        ]
    },
    "standardCosts": {
        "pipe": [
            {
                "material": "kala pipe",
                "brand": "china",
                "rate": "2000",
                "length_feet": "20",
                "weight": "40",
                "status": "active"
            }
        ],
        "sheet": [
            {
                "material": "mdf",
                "brand": "patex",
                "rate": "5000",
                "total_sq_feet": "32",
                "weight": "40",
                "status": "active"
            }
        ],
        "paint": [
            {
                "type": "powder coat",
                "brand": "nippon",
                "size": "1'' x 1''",
                "rate": "35",
                "status": "active"
            },
            {
                "type": "spray paint",
                "brand": "nippon",
                "size": "1'' x 1''",
                "rate": "20",
                "status": "active"
            }
        ],
        "tape": [
            {
                "type": "slim",
                "size_inch": "0.75",
                "rate": "30",
                "status": "active"
            },
            {
                "type": "wide",
                "size_inch": "1.5",
                "rate": "50",
                "status": "active"
            }
        ],
        "misc": [
            {
                "item": "wheels",
                "details": "small",
                "rate": "1500",
                "weight": "1",
                "status": "active"
            },
            {
                "item": "jaali",
                "details": "small",
                "rate": "1600",
                "weight": "1",
                "status": "active"
            }
        ],
        "shipping companies": [
            {
                "company": "leopard",
                "overland": "80",
                "detain": "150",
                "overnight": "220",
                "status": "active"
            }
        ]
    },
    "rawIngredients": {
        "pipe": [
            {
                "rate": "2000",
                "length_feet": "20",
                "weight": "40",
                "status": "active",
                "type": "square",
                "size": "01'' x 01''"
            },
            {
                "type": "square",
                "size": "0.5'' x 0.5''",
                "rate": "1500",
                "length_feet": "20",
                "weight": "40",
                "status": "active"
            }
        ],
        "sheet": [
            {
                "rate": "5000",
                "total_sq_feet": "32",
                "weight": "40",
                "status": "active"
            }
        ],
        "paint": [
            {
                "rate": "35",
                "status": "active"
            }
        ],
    }
}