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

function PortalVariables(props) {

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

    const [newMisc, setNewMisc] = useState({
        name: '',
        price: 0,
        status: 'active'
    })
    // =================================================)

    const [ingredients, setIngredients] = useState()

    const [portalVariables, setPortalVariables] = useState([])

    const fetchIngredients = async () => {
        setIsLoading(true)
        const { data } = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).catch((e) => console.log('error occured', e));
        console.log('result', data);
        setIngredients(data)
        setPortalVariables(data.portalVariables)
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
    //         portalVariables: {
    //             pipeTypesNSizes: [
    //                 {
    //                     type: "square",
    //                     size: "01'' x 01''"
    //                 },
    //                 {
    //                     type: "square",
    //                     size: "0.5'' x 0.5''"
    //                 },
    //                 {
    //                     type: "solid wood",
    //                     size: "1.5'' x 1.5''"
    //                 }
    //             ]
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

    const [newPipeTypeNSize, setNewPipeTypeNSize] = useState({
        type: '',
        size: '',
        status: 'active'
    })

    const save = () => {
        var newVariables = portalVariables

        if (currentlyEditing !== null) {
            newVariables = {
                ...newVariables,
                [currentlyAdding]: [...newVariables[currentlyAdding].filter((item, index) => index !== currentlyEditing)]
            }
        }

        newVariables[currentlyAdding].push(
            currentlyAdding === 'pipeTypesNSizes' && newPipeTypeNSize
        )

        const ing = ingredients

        ing.portalVariables = newVariables

        console.log('newData', newVariables);


        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result);
            setPortalVariables(newVariables)
            setOpen(false)
            reset()
            console.log('updated_data', newVariables);
        })
        console.log('ing --> ', ing);
    }

    const reset = () => {
        setNewPipeTypeNSize({
            type: '',
            size: '',
            status: 'active'
        })

        setCurrentlyAdding(null)
        setCurrentlyEditing(null)
    }

    const pipeTypesNSizesModal = () => {
        return <>
            <Stack gap={2}>
                <TextField
                    label="Type"
                    variant="outlined"
                    value={newPipeTypeNSize.type}
                    onChange={(e) => setNewPipeTypeNSize((pre) => ({ ...pre, type: e.target.value.toLowerCase() }))}
                />
                <TextField
                    label="Size"
                    variant="outlined"
                    value={newPipeTypeNSize.size}
                    onChange={(e) => setNewPipeTypeNSize((pre) => ({ ...pre, size: e.target.value.toLowerCase() }))}
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

    const edit = (index, type, updateStatus = false, status = 'active') => {

        setCurrentlyAdding(type)
        setCurrentlyEditing(index)

        if (type === 'pipeTypesNSizes') {
            setNewPipeTypeNSize({
                ...portalVariables.pipeTypesNSizes[index],
                status: updateStatus ? status : (portalVariables.pipeTypesNSizes[index]).status
            })
        }
        setOpen(true)
    }

    const changeStatus = (index, type, status) => {

        var newVariable = portalVariables
        newVariable[type][index].status = status
        const ing = ingredients
        ing.standardCosts = newVariable

        fetch('http://139.144.30.86:8000/api/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ing),
        }).then((res) => res.json()).then((result) => {
            console.log('submitted', result); console.log('submitted', result);
            setPortalVariables(newVariable)
            setOpen(false)
            reset()
            console.log('updated_data', newVariable);
        })
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
                    setNewIronPipe({
                        name: '',
                        price: 0,
                        unit: '',
                        totalQuantity: 0,
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
                    {currentlyAdding === 'pipeTypesNSizes' && pipeTypesNSizesModal()}
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
                                            setCurrentlyAdding("pipeTypesNSizes")
                                            setOpen(true)
                                        }}
                                        variant="contained"
                                        style={{ width: 'fit-content', borderRadius: 0, margin: '10px', gap: 2 }}
                                    >
                                        <AddCircleOutlineIcon />
                                        <Typography>Add Variable</Typography>
                                    </Button>
                                </div>
                                <div className="mt-1">
                                    <table className="table table-bordered table-striped align-middle text-center">
                                        <thead className="table-info">
                                            <tr>
                                                <th>Type</th>
                                                <th>Size</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {portalVariables.pipeTypesNSizes.map((pipe, index) => {
                                                if (activeFilter === pipe.status) {
                                                    return <tr tr key={index}>
                                                        <td>{pipe.type}</td>
                                                        <td>{pipe.size}</td>
                                                        <td>
                                                            <Stack direction='row' justifyContent='center'>
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}
                                                                    onClick={() => edit(index, 'pipeTypesNSizes')}
                                                                >
                                                                    Edit
                                                                </Button>}
                                                                {activeFilter !== 'trash' && <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="info"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'pipeTypesNSizes', activeFilter === 'inactive' ? "active" : "inactive")}
                                                                    style={{ borderRadius: 0, width: '100%', whiteSpace: 'nowrap' }}>
                                                                    {activeFilter === 'inactive' ? 'Set Active' : 'Set Inactive'}
                                                                </Button>}
                                                                <Button
                                                                    // style={{ width: '75px', height: '100%' }}
                                                                    color="error"
                                                                    variant="outlined"
                                                                    onClick={() => changeStatus(index, 'pipeTypesNSizes', activeFilter === 'trash' ? "active" : "trash")}
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

export default PortalVariables