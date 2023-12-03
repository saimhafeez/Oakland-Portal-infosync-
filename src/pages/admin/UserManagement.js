import React from 'react'
import HeaderSignOut from '../../components/header/HeaderSignOut'
import SuperAdminSidebar from '../../components/sidebar/SuperAdminSidebar'
import { firestore } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

function UserManagement(props) {

    const sortOrderForJobdesc = ["Extractor", "QA-Extractor", "DimAna", "QA-DimAna"];
    const sortOrderForRole = ["manager", "worker"];


    const [userList, setUserList] = useState({
        isLoading: true,
        workers: [],
        managers: []
    })


    const getAllUsers = async () => {

        setUserList(pre => ({
            ...pre,
            isLoading: true
        }))

        const usersCollectionRef = collection(firestore, "users");

        // Use a query to filter users with role=manager
        const q = query(usersCollectionRef, where("role", "==", "worker"), where("role", "==", "manager"));

        // Fetch data based on the query
        const snapshot = await getDocs(q);

        let users = [];
        snapshot.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
        });

        console.log('users', users);

        const sortedWorkers = users.sort((a, b) => {
            const indexA = sortOrderForJobdesc.indexOf(a.jdesc);
            const indexB = sortOrderForJobdesc.indexOf(b.jdesc);
            return indexA - indexB;
        })

        const sortedManagers = users.sort((a, b) => {
            const indexA = sortOrderForRole.indexOf(a.jdesc);
            const indexB = sortOrderForRole.indexOf(b.jdesc);
            return indexA - indexB;
        })

        console.log('sorted', sortedManagers);

        setUserList({
            isLoading: false,
            workers: sortedWorkers,
            managers: sortedManagers
        })

    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <SuperAdminSidebar />

            <div className="set-right-container-252 p-3" style={{ height: 'calc(100vh - 70px)', overflow: 'auto' }}>

                {userList.isLoading ? <CircularProgress size={56} color="info" /> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
                    <thead className="table-dark">
                        <tr className="border-0 bg-white">
                            <th colSpan={2} className="bg-white text-dark border-0">
                                Results Found
                            </th>
                            <th className="bg-white" style={{ maxWidth: 150 }}>
                                <div className="d-flex flex-row">
                                    <input
                                        className="p-2 w-100"
                                        type="text"
                                        placeholder="Search by ProductID"
                                        style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                                        onChange={(e) => { }}
                                        value=''
                                    />
                                    <button className="btn btn-go-fetch" onClick={() => { }}>Clear</button>
                                </div>
                            </th>
                            <th className="bg-white"></th>
                            <th className="bg-white"></th>
                            <th className="bg-white">

                                <select
                                    className="p-2 w-100"
                                    name="qa-status"
                                    id="qa-status"
                                    onChange={(e) => { }}
                                    value={''}
                                >
                                    <option value="qa-status">Filter by QA Status</option>
                                    <option value="under_qa">Under QA</option>
                                    <option value="passed">100% [QA Passed]</option>
                                    <option value="minor">MINOR[QA Passed]</option>
                                    <option value="major">MAJOR [QA Passed]</option>
                                </select>

                            </th>
                        </tr>
                        <tr>
                            <th># SR</th>
                            <th>Name</th>
                            {/* <th>Earning</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {getAllUsers().map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
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