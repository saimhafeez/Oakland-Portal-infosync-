import React, { useEffect, useState } from 'react'
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Box, Button, Chip, CircularProgress, Container, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PostAddIcon from '@mui/icons-material/PostAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CollapsibleRow from '../components/CollapsibleRow';

function Dashboard(props) {

    const [filesData, setFileData] = useState({
        isLoading: true,
        data: null
    });

    const [newFileName, setNewFileName] = useState('')

    const getFiles = async () => {

        new Promise(async (resolve, reject) => {
            try {
                const { data } = await axios.get('/get-files?filename=infosync-files.json');
                resolve(data)
            } catch (error) {
                reject(error)
            }
        }).then((data) => {
            console.log(data);
            setFileData({
                isLoading: false,
                data
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getFiles();
    }, [])

    return (
        <>
        <h1>Dashboard</h1>
        <Stack >
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{ background: '#F5DFBB' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Expand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>FILE NAME</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>EXTRACTION </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>EXTRACTION QA</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>DIMENTIONS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>DIMENTIONS QA</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!filesData.isLoading && filesData.data && filesData.data.map((file, index) => {
                            return <CollapsibleRow file={file} />
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack >
        </>
    )
}

export default Dashboard