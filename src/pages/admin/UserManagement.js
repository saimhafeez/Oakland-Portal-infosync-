import React from 'react'
import HeaderSignOut from '../../components/header/HeaderSignOut'
import SuperAdminSidebar from '../../components/sidebar/SuperAdminSidebar'
import { firestore, secondaryApp } from '../../firebase';
import { collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { CircularProgress, Stack, Typography, Button, Box, TextField, Select, MenuItem, Modal, FormControl, InputLabel } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

function UserManagement(props) {


    const sortOrderForJobdesc = ["Extractor", "QA-Extractor", "DimAna", "QA-DimAna"];
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        password: '',
        jdesc: 'Extractor',
        role: 'worker',
        status: 'active'
    })
    const [open, setOpen] = useState(false);

    const [filter, setFilter] = useState({
        status: 'active',
        isEditingRole: false
    })


    const [userList, setUserList] = useState({
        isLoading: true,
        workers: [],
        managers: []
    })

    const [workersRoleUpdated, setWorkersRoleUpdated] = useState({})
    const [managersRoleUpdated, setManagersRoleUpdated] = useState({})


    const getAllUsers = async () => {

        setUserList(pre => ({
            ...pre,
            isLoading: true
        }))

        const usersCollectionRef = collection(firestore, "users");

        // Use a query to filter users with role=manager
        const q = query(usersCollectionRef);

        // Fetch data based on the query
        const snapshot = await getDocs(q);

        let users = [];
        snapshot.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
        });

        console.log('users', users);

        const sortedWorkers = users.filter((user) => user.role === 'worker' && user.status === filter.status).sort((a, b) => {
            const indexA = sortOrderForJobdesc.indexOf(a.jdesc);
            const indexB = sortOrderForJobdesc.indexOf(b.jdesc);
            return indexA - indexB;
        })

        const sortedManagers = users.filter((user) => user.role === 'manager' && user.status === filter.status).sort((a, b) => {
            const indexA = sortOrderForJobdesc.indexOf(a.jdesc);
            const indexB = sortOrderForJobdesc.indexOf(b.jdesc);
            return indexA - indexB;
        })

        console.log('sorted', sortedManagers);

        setUserList(pre => ({
            ...pre,
            isLoading: false,
            workers: sortedWorkers,
            managers: sortedManagers
        }))

    }

    useEffect(() => {
        getAllUsers()
    }, [filter.status])


    const AddUserForUpdation = (user, newRole) => {

        console.log('user', user);

        if (user.role === 'manager') {
            userList.managers.map((_user, index) => {
                if (_user.id === user.id && _user.jdesc !== newRole) {
                    setManagersRoleUpdated(pre => ({
                        ...pre,
                        [user.id]: newRole
                    }))
                }
            })
        } else {
            userList.workers.map((_user, index) => {
                if (_user.id === user.id && _user.jdesc !== newRole) {
                    setWorkersRoleUpdated(pre => ({
                        ...pre,
                        [user.id]: newRole
                    }))
                }
            })
        }

    }

    const updateUserStatus = async (docId, newStatus) => {
        console.log(docId, newStatus);
        const usersCollectionRef = collection(firestore, "users");
        const userDocRef = doc(usersCollectionRef, docId);
        // Update the jdesc field with the new value
        await updateDoc(userDocRef, { status: newStatus });
        getAllUsers()
    }

    const handleUpdateUserRoles = async () => {
        const usersCollectionRef = collection(firestore, "users");

        for (const [docId, newJdesc] of Object.entries(managersRoleUpdated)) {
            const userDocRef = doc(usersCollectionRef, docId);

            // Update the jdesc field with the new value
            await updateDoc(userDocRef, { jdesc: newJdesc });
        }

        for (const [docId, newJdesc] of Object.entries(workersRoleUpdated)) {
            const userDocRef = doc(usersCollectionRef, docId);

            // Update the jdesc field with the new value
            await updateDoc(userDocRef, { jdesc: newJdesc });
        }

        getAllUsers()
    };


    const createUserAndAddToFirestore = async (userInfo) => {
        try {
            // Create user in Authentication
            const auth = getAuth(secondaryApp);
            const { email, password } = userInfo;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Add user data to Firestore
            const firestore = getFirestore();
            const usersCollectionRef = collection(firestore, 'users');
            const userDocRef = doc(usersCollectionRef, userId);

            // Extract relevant data from userInfo
            const { name, jdesc, role, status } = userInfo;

            // Create data object for Firestore document
            const userData = {
                name,
                email,
                jdesc,
                role,
                status
            };

            // Set the document data
            await setDoc(userDocRef, userData);
            console.log('User created and added to Firestore successfully');
            setOpen(false)
            setNewEmployee({
                name: '',
                email: '',
                password: '',
                jdesc: 'Extractor',
                role: 'worker',
                status: 'active'
            })
            getAllUsers()
        } catch (error) {
            console.error('Error creating user and adding to Firestore:', error.message);
        }
    };

    const addNewEmployee = () => {
        if (newEmployee.email !== "" && newEmployee.password !== "" && newEmployee.name !== "") {
            createUserAndAddToFirestore(newEmployee)
        }
    }

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <SuperAdminSidebar />

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    setNewEmployee({
                        name: '',
                        email: '',
                        password: '',
                        jdesc: 'Extractor',
                        role: 'worker',
                        status: 'active'
                    })
                }}
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
                            type="text"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee(pre => ({
                                ...pre,
                                name: e.target.value
                            }))}
                        />

                        <TextField
                            label="Email"
                            variant="outlined"
                            type="text"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee(pre => ({
                                ...pre,
                                email: e.target.value
                            }))}
                        />

                        <TextField
                            label="password"
                            variant="outlined"
                            type={'password'}
                            value={newEmployee.password}
                            onChange={(e) => setNewEmployee(pre => ({
                                ...pre,
                                password: e.target.value
                            }))}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="jdesc-select-label">Job Description</InputLabel>
                            <Select
                                value={newEmployee.jdesc}
                                label="Job Description"
                                onChange={(e) => setNewEmployee(pre => ({
                                    ...pre,
                                    jdesc: e.target.value
                                }))}
                            >
                                <MenuItem value='Extractor'>Extractor</MenuItem>
                                <MenuItem value='QA-Extractor'>QA-Extractor</MenuItem>
                                <MenuItem value='DimAna'>DimAna</MenuItem>
                                <MenuItem value='QA-DimAna'>QA-DimAna</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId='role-select-label'
                                id='role-select-label'
                                value={newEmployee.role}
                                label="Role"
                                onChange={(e) => setNewEmployee(pre => ({
                                    ...pre,
                                    role: e.target.value
                                }))}
                            >
                                <MenuItem value='worker'>worker</MenuItem>
                                {/* <MenuItem value='manager'>manager</MenuItem> */}
                            </Select>
                        </FormControl>

                        <Button
                            onClick={addNewEmployee}
                            variant="contained"
                            style={{ width: 'fit-content', borderRadius: 0, margin: '10px', alignSelf: 'end', gap: 2 }}
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>

                <Stack direction='row' justifyContent='space-between'>
                    <div></div>
                    <Stack direction='row' margin='10px' gap={1}>
                        <Button
                            onClick={() => setFilter(pre => ({
                                ...pre,
                                status: 'active'
                            }))}
                            variant={filter.status === 'active' ? "contained" : "outlined"}

                        >
                            <Typography>Active</Typography>
                        </Button>
                        <Button
                            onClick={() => setFilter(pre => ({
                                ...pre,
                                status: 'inactive'
                            }))}
                            variant={filter.status === 'inactive' ? "contained" : "outlined"}
                        >
                            <Typography>Inactive</Typography>
                        </Button>
                    </Stack>
                    <Button
                        onClick={() => setOpen(true)}
                        variant='contained'
                    >
                        <Typography>Add Employee</Typography>
                    </Button>
                </Stack>

                {userList.isLoading ? <CircularProgress size={56} color="info" /> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <td colSpan={5} style={{ backgroundColor: '#ffca28', color: 'black' }}>
                                <h3 className='fw-bold'>Managers</h3>
                            </td>
                        </tr>
                        <tr>
                            <th># SR</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th className='d-flex justify-content-between align-items-center'>
                                <div></div>
                                <span>Role</span>
                                <button className='btn btn-outline-light d-flex justify-content-center gap-1 align-items-center' style={{ cursor: 'pointer' }} onClick={() => {
                                    if (filter.isEditingRole) {
                                        console.log('saved', managersRoleUpdated);
                                        handleUpdateUserRoles()
                                    }
                                    setFilter(pre => ({
                                        ...pre,
                                        isEditingRole: !pre.isEditingRole
                                    }))
                                }}>
                                    <span className='small'>
                                        {!filter.isEditingRole ? 'Edit?' : 'Save'}
                                    </span>
                                </button>
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.managers.length === 0 && <tr >
                            <td colSpan={5}>
                                Empty Results
                            </td>
                        </tr>}
                        {userList.managers.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>
                                    <select
                                        value={managersRoleUpdated[item.id] || item.jdesc}
                                        disabled={!filter.isEditingRole}
                                        onChange={(e) => AddUserForUpdation(item, e.currentTarget.value)}
                                    >
                                        <option value='Extractor'>Extractor</option>
                                        <option value='QA-Extractor'>QA-Extractor</option>
                                        <option value='DimAna'>DimAna</option>
                                        <option value='QA-DimAna'>QA-DimAna</option>
                                    </select>
                                </td>
                                <td>
                                    {
                                        <button className='btn btn-fetch btn-go-fetch'
                                            onClick={() => updateUserStatus(item.id, filter.status === 'active' ? 'inactive' : 'active')}
                                        >
                                            {filter.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                                        </button>
                                    }

                                </td>
                            </tr>
                        ))}
                    </tbody>

                    <thead className="table-dark">
                        <tr>
                            <td colSpan={5} style={{ backgroundColor: '#ffca28', color: 'black' }}>
                                <h3 className='fw-bold'>Workers</h3>
                            </td>
                        </tr>
                        <tr>
                            <th># SR</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th className='d-flex justify-content-between align-items-center'>
                                <div></div>
                                <span>Role</span>
                                <button className='btn btn-outline-light d-flex justify-content-center gap-1 align-items-center' style={{ cursor: 'pointer' }} onClick={() => {
                                    if (filter.isEditingRole) {
                                        console.log('saved', workersRoleUpdated);
                                        handleUpdateUserRoles()
                                    }
                                    setFilter(pre => ({
                                        ...pre,
                                        isEditingRole: !pre.isEditingRole
                                    }))
                                }}>
                                    <span className='small'>
                                        {!filter.isEditingRole ? 'Edit?' : 'Save'}
                                    </span>
                                </button>
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.workers.length === 0 && <tr >
                            <td colSpan={5}>
                                Empty Results
                            </td>
                        </tr>}
                        {userList.workers.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>
                                    <select
                                        value={workersRoleUpdated[item.id] || item.jdesc}
                                        disabled={!filter.isEditingRole}
                                        onChange={(e) => AddUserForUpdation(item, e.currentTarget.value)}
                                    >
                                        <option value='Extractor'>Extractor</option>
                                        <option value='QA-Extractor'>QA-Extractor</option>
                                        <option value='DimAna'>DimAna</option>
                                        <option value='QA-DimAna'>QA-DimAna</option>
                                    </select>
                                </td>
                                <td>
                                    {
                                        <button className='btn btn-fetch btn-go-fetch'
                                            onClick={() => updateUserStatus(item.id, filter.status === 'active' ? 'inactive' : 'active')}
                                        >
                                            {filter.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                                        </button>
                                    }

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                }
            </div>

        </>
    )
}

export default UserManagement