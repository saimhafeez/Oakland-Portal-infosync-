import React from 'react'

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

function CollapsibleRow({ file }) {

    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Stack
                        width='fit-content'
                        direction='row'
                        gap={1}
                        border='1px solid #1976d2'
                        borderRadius='15px'
                        paddingX='10px'
                        paddingY='5px'
                    // style={{ background: '#bbddff' }}
                    >
                        <ArticleIcon style={{ color: '#1976d2' }} />
                        <Typography color='#1976d2' fontWeight='bold'>
                            {file.title}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell>{file.assignees.extraction || '-'}</TableCell>
                <TableCell>{file.assignees.extractionQA || '-'}</TableCell>
                <TableCell>{file.assignees.dimensions || '-'}</TableCell>
                <TableCell>{file.assignees.dimensionsQA || '-'}</TableCell>
                <TableCell>{file.status}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography> */}
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: "#FCEADA", fontWeight: 'bold' }} colSpan={3}>Extraction Stats</TableCell>
                                        <TableCell style={{ background: "#C0EEFF", fontWeight: 'bold' }} colSpan={2}>Dimensions Stats</TableCell>
                                        <TableCell style={{ background: "#C0FFE5", fontWeight: 'bold' }} colSpan={3}>Dimensions QA Stats</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Not Doable</TableCell>
                                        <TableCell>Duplicate</TableCell>
                                        <TableCell>QA Passed</TableCell>
                                        <TableCell>Not Understandable</TableCell>
                                        <TableCell>Product/URL Missing</TableCell>
                                        <TableCell>Wrong Calculation</TableCell>
                                        <TableCell>Pic Missing</TableCell>
                                        <TableCell>QA Passed</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{file.stats.extraction["not-doable"]}</TableCell>
                                        <TableCell>{file.stats.extraction["duplicate"]}</TableCell>
                                        <TableCell>{file.stats.extraction["qa-passed"]}</TableCell>
                                        <TableCell>{file.stats.dimension["not-understandable"]}</TableCell>
                                        <TableCell>{file.stats.dimension["product-url-missing"]}</TableCell>
                                        <TableCell>{file.stats["dimension-qa"]["wrong-calc"]}</TableCell>
                                        <TableCell>{file.stats["dimension-qa"]["pic-missing"]}</TableCell>
                                        <TableCell>{file.stats["dimension-qa"]["qa-passed"]}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default CollapsibleRow