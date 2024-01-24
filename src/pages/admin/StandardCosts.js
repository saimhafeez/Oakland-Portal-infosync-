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
import HeaderSignOut from "../../components/header/HeaderSignOut";

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

    standardCosts: {
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



function StandardCosts(props) {

    const [open, setOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('active')
    const [isLoading, setIsLoading] = useState(true);

    // =================================================
    const [currentlyAdding, setCurrentlyAdding] = useState("");
    const [currentlyEditing, setCurrentlyEditing] = useState("");

    const [newPipe, setNewPipe] = useState({
        material: '',
        brand: '',
        rate: '',
        length_feet: '',
        weight: '',
        status: 'active'
    })

    const [newSheet, setNewSheet] = useState({
        material: '',
        brand: '',
        rate: '',
        total_sq_feet: '',
        weight: '',
        status: 'active'
    })

    const [newPaint, setNewPaint] = useState({
        type: '',
        brand: '',
        size: "0'' x 0''",
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
    const [standardCosts, setStandardCosts] = useState({
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
        if (data.standardCosts) {
            setStandardCosts(data.standardCosts)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchIngredients()
    }, [])

    const editIronPipeIngredient = (ironPipe) => {
        setCurrentlyAdding("Iron Pipe")
        setCurrentlyEditing(ironPipe.toString())
        setNewPipe({
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
            [`${newPipe.type}  ${newPipe.size}`]: {
                price: parseInt(newPipe.price),
                status: currentlyEditing ? ((ingredients["Iron Pipe"])[currentlyEditing]).status : newPipe.status,
                unit: newPipe.unit,
                totalQuantity: parseInt(newPipe.totalQuantity)
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
        setNewPipe({
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

    const save = () => {
        var newCosts = standardCosts

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

        ing.standardCosts = newCosts

        console.log('newData', newCosts);


        fetch('http://139.144.30.86:8000/api/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            setStandardCosts(newCosts)
            setOpen(false)
            reset()
            console.log('updated_data', newCosts);
        })
    }

    const changeStatus = (index, type, status) => {

        var newCosts = standardCosts

        newCosts[type][index].status = status

        const ing = ingredients

        ing.standardCosts = newCosts

        fetch('http://139.144.30.86:8000/api/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result); console.log('submitted', result);
            setStandardCosts(newCosts)
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
                    label="Material"
                    variant="outlined"
                    value={newPipe.material}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, material: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Brand"
                    variant="outlined"
                    value={newPipe.brand}
                    onChange={(e) => setNewPipe((pre) => ({ ...pre, brand: e.target.value.toLowerCase() }))}
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
                    label="Material"
                    variant="outlined"
                    value={newSheet.material}
                    onChange={(e) => setNewSheet((pre) => ({ ...pre, material: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Brand"
                    variant="outlined"
                    value={newSheet.brand}
                    onChange={(e) => setNewSheet((pre) => ({ ...pre, brand: e.target.value.toLowerCase() }))}
                />
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
                <TextField
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
                </div>
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
            material: '',
            brand: '',
            rate: '',
            length_feet: '',
            weight: '',
            status: 'active'
        })

        setNewSheet({
            material: '',
            brand: '',
            rate: '',
            total_sq_feet: '',
            weight: '',
            status: 'active'
        })

        setNewPaint({
            type: '',
            brand: '',
            size: "0'' x 0''",
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
                ...standardCosts.pipe[index],
                status: updateStatus ? status : (standardCosts.pipe[index]).status
            })

        } else if (type === 'sheet') {
            setNewSheet({
                ...standardCosts.sheet[index],
                status: updateStatus ? status : (standardCosts.sheet[index]).status
            })

        } else if (type === 'paint') {
            setNewPaint({
                ...standardCosts.paint[index],
                status: updateStatus ? status : (standardCosts.paint[index]).status
            })

        } else if (type === 'tape') {
            setNewTape({
                ...standardCosts.tape[index],
                status: updateStatus ? status : (standardCosts.tape[index]).status
            })

        } else if (type === 'misc') {
            setNewMisc({
                ...standardCosts.misc[index],
                status: updateStatus ? status : (standardCosts.misc[index]).status
            })

        } else if (type === 'shipping companies') {
            setNewShippingCompany({
                ...(standardCosts['shipping companies'])[index],
                status: updateStatus ? status : ((standardCosts['shipping companies'])[index]).status
            })

        }
        setOpen(true)
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
                                                <th>Material</th>
                                                <th>Brand</th>
                                                <th>Rate</th>
                                                <th>Length</th>
                                                <th>Per Ft Rate</th>
                                                <th>Weight</th>
                                                <th>Wt / Ft</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts.pipe.map((pipe, index) => {
                                                if (activeFilter === pipe.status) {
                                                    return <tr tr key={index}>
                                                        <td>{pipe.material}</td>
                                                        <td>{pipe.brand}</td>
                                                        <td>{pipe.rate}</td>
                                                        <td>{pipe.length_feet} ft</td>
                                                        <td>{(pipe.rate / pipe.length_feet).toFixed(2)}</td>
                                                        <td>{pipe.weight}</td>
                                                        <td>{(pipe.weight / pipe.length_feet).toFixed(2)}</td>
                                                        <td>
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
                                                <th>Material</th>
                                                <th>Brand</th>
                                                <th>Rate</th>
                                                <th>Total Sq. Feet</th>
                                                <th>Per sq.ft Rate</th>
                                                <th>Weight</th>
                                                <th>Wt / Sq Ft</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts.sheet.map((sheet, index) => {
                                                if (activeFilter === sheet.status) {
                                                    return <tr tr key={index}>
                                                        <td>{sheet.material}</td>
                                                        <td>{sheet.brand}</td>
                                                        <td>{sheet.rate}</td>
                                                        <td>{sheet.total_sq_feet} sq.ft</td>
                                                        <td>{(sheet.rate / sheet.total_sq_feet).toFixed(2)}</td>
                                                        <td>{sheet.weight}</td>
                                                        <td>{(sheet.weight / sheet.total_sq_feet).toFixed(2)}</td>
                                                        <td>
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
                                                <th>Type</th>
                                                <th>Brand</th>
                                                <th>Size</th>
                                                <th>Rate</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts.paint.map((paint, index) => {
                                                if (activeFilter === paint.status) {
                                                    return <tr tr key={index}>
                                                        <td>{paint.type}</td>
                                                        <td>{paint.brand}</td>
                                                        <td>{paint.size}</td>
                                                        <td>{paint.rate}</td>
                                                        <td>
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts.tape.map((tape, index) => {
                                                if (activeFilter === tape.status) {
                                                    return <tr tr key={index}>
                                                        <td>{tape.type}</td>
                                                        <td>{tape.size_inch}</td>
                                                        <td>{tape.rate}</td>
                                                        <td>
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts.misc.map((misc, index) => {
                                                if (activeFilter === misc.status) {
                                                    return <tr tr key={index}>
                                                        <td>{misc.item}</td>
                                                        <td>{misc.details}</td>
                                                        <td>{misc.rate}</td>
                                                        <td>{misc.weight}</td>
                                                        <td>
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standardCosts["shipping companies"].map((shippingCompany, index) => {
                                                if (activeFilter === shippingCompany.status) {
                                                    return <tr tr key={index}>
                                                        <td>{shippingCompany.company}</td>
                                                        <td>{shippingCompany.overland}</td>
                                                        <td>{shippingCompany.detain}</td>
                                                        <td>{shippingCompany.overnight}</td>
                                                        <td>
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

export default StandardCosts