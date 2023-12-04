import React from 'react'
import HeaderSignOut from '../../components/header/HeaderSignOut'
import SuperAdminSidebar from '../../components/sidebar/SuperAdminSidebar'
import { firestore } from '../../firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { CircularProgress, Stack, Typography, Button } from '@mui/material';

function UserManagement(props) {

    const sortOrderForJobdesc = ["Extractor", "QA-Extractor", "DimAna", "QA-DimAna"];

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

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <SuperAdminSidebar />

            <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>

                <Stack direction='row' justifyContent='center'>
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