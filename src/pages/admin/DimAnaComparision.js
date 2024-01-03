import React, { useEffect, useState } from 'react'

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
    Button,
    ButtonGroup,
    MenuItem,
    Select,
    Stack,
    TableContainer,
    Typography,
    colors,
} from "@mui/material";




// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import PropsModel from '../../res/PropsModel';
import HeaderSignOut from '../../components/header/HeaderSignOut';
import { getDimTableData } from '../../utils/getDimTableData';
import { getImagesByID } from '../../utils/getImagesByID';

function DimAnaComparision(props) {

    const [displayProductDataType, setDisplayProductDataType] = useState('images');
    const [previewImage, setPreviewImage] = useState('');

    const [filters, SetFilters] = useState({
        unitSelector: "Inch",
        buildMaterial: "IRON PIPE / MDF",
        reportIssue: false,
    });


    const [dimAnaData, setDimAnaData] = useState({
        isLoading: true,
        data: [],
        differentRows: [],
        buildMaterial: ""
    })
    const [qaDimAnaData, setQADimAnaData] = useState({
        isLoading: true,
        data: [],
        differentRows: [],
        buildMaterial: ""
    })

    const [info, setInfo] = useState({
        isLoading: true,
        images: [],
        sku: "",
        weightAndDimentions: {}
    })

    const [highlightedRows, setHighlightedRows] = useState({
        ironPipeRows: [],
        woodenSheetRows: [],
        woodTapeRows: [],
        miscTableRows: []
    })

    const getTotal = (productPropType, data) => {

        if (productPropType === 'Iron Pipe') {
            if (filters.unitSelector === "Inch") {
                return ((data.length / 12) * data.qty).toFixed(2);
            } else if (filters.unitSelector === "Centimeter") {
                return (data.length * 0.0328084 * data.qty).toFixed(2);
            } else {
                return (data.length * 3.28084 * data.qty).toFixed(2);
            }
        } else if (productPropType === 'Wooden Sheet') {
            return (getValue(data.length) * getValue(data.width) * data.qty).toFixed(2)
        }
    };

    const getValue = (value) => {
        if (filters.unitSelector === "Inch") {
            return (value / 12).toFixed(2);
        } else if (filters.unitSelector === "Centimeter") {
            return (value * 0.0328084).toFixed(2);
        } else {
            return (value * 3.28084).toFixed(2);
        }
    };


    useEffect(async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const pid = urlParams.get('pid');
        const job = urlParams.get('job');


        console.log(pid, job);

        const lt = (new Date().getTime() / 1000).toFixed(0)

        const DimAnaWorkerData = await getDimTableData({ table_type: 'worker', pid: pid })

        const DimAnaQAData = await getDimTableData({ table_type: 'qa', pid: pid })

        setInfo({
            isLoading: false,
            images: DimAnaQAData.data.final.images,
            sku: DimAnaQAData.sku,
            weightAndDimentions: DimAnaQAData.data.final['weight and dimensions']
        })

        setPreviewImage(DimAnaQAData.data.final.images[0])

        console.log('uncle SAM: DimAnaWorkerData', DimAnaWorkerData);

        console.log('uncle SAM: DimAnaQAData', DimAnaQAData);

        const productProperties = DimAnaQAData.data.final.productProperties
        const productPropertiesOld = DimAnaWorkerData.data.analysed.productProperties

        // filling rows
        if (productProperties.ironPipeRows.length > productPropertiesOld.ironPipeRows.length) {
            const margin = productProperties.ironPipeRows.length - productPropertiesOld.ironPipeRows.length

            for (var i = 0; i < margin; i++) {
                productPropertiesOld.ironPipeRows.push({})
            }
        } else if (productPropertiesOld.ironPipeRows.length > productProperties.ironPipeRows.length) {
            const margin = productPropertiesOld.ironPipeRows.length - productProperties.ironPipeRows.length

            for (var i = 0; i < margin; i++) {
                productProperties.ironPipeRows.push({})
            }
        }
        // --------------------
        if (productProperties.woodenSheetRows.length > productPropertiesOld.woodenSheetRows.length) {
            const margin = productProperties.woodenSheetRows.length - productPropertiesOld.woodenSheetRows.length

            for (var i = 0; i < margin; i++) {
                productPropertiesOld.woodenSheetRows.push(PropsModel.woodenSheetRows)
            }
        } else if (productPropertiesOld.woodenSheetRows.length > productProperties.woodenSheetRows.length) {
            const margin = productPropertiesOld.woodenSheetRows.length - productProperties.woodenSheetRows.length

            for (var i = 0; i < margin; i++) {
                productProperties.woodenSheetRows.push(PropsModel.woodenSheetRows)
            }
        }
        // ------------------
        if (productProperties.woodTapeRows.length > productPropertiesOld.woodTapeRows.length) {
            const margin = productProperties.woodTapeRows.length - productPropertiesOld.woodenSheetRows.length

            for (var i = 0; i < margin; i++) {
                productPropertiesOld.woodTapeRows.push(PropsModel.woodTapeRows)
            }
        } else if (productPropertiesOld.woodTapeRows.length > productProperties.woodTapeRows.length) {
            const margin = productPropertiesOld.woodTapeRows.length - productProperties.woodTapeRows.length

            for (var i = 0; i < margin; i++) {
                productProperties.woodTapeRows.push(PropsModel.woodTapeRows)
            }
        }
        // ------------------
        if (productProperties.miscTableRows.length > productPropertiesOld.miscTableRows.length) {
            const margin = productProperties.miscTableRows.length - productPropertiesOld.woodenSheetRows.length

            for (var i = 0; i < margin; i++) {
                productPropertiesOld.miscTableRows.push(PropsModel.miscTableRows)
            }
        } else if (productPropertiesOld.miscTableRows.length > productProperties.miscTableRows.length) {
            const margin = productPropertiesOld.miscTableRows.length - productProperties.miscTableRows.length

            for (var i = 0; i < margin; i++) {
                productProperties.miscTableRows.push(PropsModel.miscTableRows)
            }
        }


        // calculating row differences

        // Iron Pipe Row
        const ironPipeRows_highlighted = []
        for (let i = 0; i < productProperties.ironPipeRows.length; i++) {
            const props = Object.keys(productProperties.ironPipeRows[i]);
            if (Object.keys(productProperties.ironPipeRows[i]).length === 0 || Object.keys(productPropertiesOld.ironPipeRows[i]).length === 0) {
                ironPipeRows_highlighted.push(i);
            } else {
                for (const prop of props) {
                    if (productProperties.ironPipeRows[i][prop] !== productPropertiesOld.ironPipeRows[i][prop]) {
                        ironPipeRows_highlighted.push(i);
                        break;
                    }
                }
            }
        }
        console.log('ironPipeRows_highlighted', ironPipeRows_highlighted);

        // Wooden Sheet Row
        const woodenSheetRows_highlighted = []
        for (let i = 0; i < productProperties.woodenSheetRows.length; i++) {
            const props = Object.keys(productProperties.woodenSheetRows[i]);

            for (const prop of props) {
                if (productProperties.woodenSheetRows[i][prop] !== productPropertiesOld.woodenSheetRows[i][prop]) {
                    woodenSheetRows_highlighted.push(i);
                    break;
                }
            }
        }
        console.log('woodenSheetRows_highlighted', woodenSheetRows_highlighted);

        // Wood Tope Row
        const woodTapeRows_highlighted = []
        for (let i = 0; i < productProperties.woodTapeRows.length; i++) {
            const props = Object.keys(productProperties.woodTapeRows[i]);

            for (const prop of props) {
                if (productProperties.woodTapeRows[i][prop] !== productPropertiesOld.woodTapeRows[i][prop]) {
                    woodTapeRows_highlighted.push(i);
                    break;
                }
            }
        }
        console.log('woodTapeRows_highlighted', woodTapeRows_highlighted);

        // Misc Row
        const miscTableRows_highlighted = []
        for (let i = 0; i < productProperties.miscTableRows.length; i++) {
            const props = Object.keys(productProperties.miscTableRows[i]);

            for (const prop of props) {
                if (productProperties.miscTableRows[i][prop] !== productPropertiesOld.miscTableRows[i][prop]) {
                    console.log('----> ', productProperties.miscTableRows[i][prop], productPropertiesOld.miscTableRows[i][prop]);
                    console.log('----> ', typeof productProperties.miscTableRows[i][prop], typeof productPropertiesOld.miscTableRows[i][prop]);
                    console.log('----> ', productProperties.miscTableRows[i][prop].length, productPropertiesOld.miscTableRows[i][prop].length);
                    miscTableRows_highlighted.push(i);
                    break;
                }
            }
        }
        console.log('miscTableRows_highlighted', miscTableRows_highlighted);

        setHighlightedRows({
            ironPipeRows: ironPipeRows_highlighted,
            woodenSheetRows: woodenSheetRows_highlighted,
            woodTapeRows: woodTapeRows_highlighted,
            miscTableRows: miscTableRows_highlighted
        })


        setDimAnaData((pre) => ({
            ...pre,
            isLoading: false,
            data: productPropertiesOld,
            buildMaterial: DimAnaWorkerData.data.analysed.buildMaterial
        }))

        setQADimAnaData((pre) => ({
            ...pre,
            isLoading: false,
            data: productProperties,
            buildMaterial: DimAnaQAData.data.final.buildMaterial
        }))

    }, [])

    return (
        <Wrapper>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <Stack direction='row'>
                <Stack width={'30%'}>

                    <Stack direction='column' width='100%' spacing={0.5} p={1}>

                        <Stack>SKU: {info.sku}</Stack>

                        {displayProductDataType === 'images' && <img src={previewImage} width="100%" height='auto' style={{ alignSelf: 'center' }} />}

                        {!info.isLoading && displayProductDataType === 'images' ?
                            <Stack paddingTop={2} direction='row' overflow='auto' width='100%' spacing={1}>
                                {info.images.map((source, index) => {
                                    return (
                                        <img
                                            onClick={() => setPreviewImage(source)}
                                            width="90px"
                                            src={source}
                                            key={index}
                                            style={{
                                                border: `2px solid ${source === previewImage ? 'red' : 'black'}`
                                            }}
                                        />
                                    );
                                })}
                            </Stack>
                            :
                            <Stack>
                                {
                                    Object.keys(info.weightAndDimentions).map((category, index) => {

                                        return <Stack direction='column'>
                                            <Typography fontWeight='bold'>{category}</Typography>

                                            <Paper variant="outlined" direction='column' style={{ padding: 5 }}>
                                                {Object.keys(info.weightAndDimentions[category]).map((item, _index) => {

                                                    return <Stack direction='row' justifyContent='space-between' p={1} gap={1} style={{ backgroundColor: _index % 2 == 0 ? 'transparent' : colors.grey[200] }}>
                                                        <Typography>{item}: </Typography>
                                                        <Typography>{(info.weightAndDimentions[category])[item]}</Typography>
                                                    </Stack>
                                                })}
                                            </Paper>

                                        </Stack>

                                    })
                                }
                            </Stack>
                        }

                        <ButtonGroup style={{ marginTop: 10, alignSelf: 'center' }} variant="contained" aria-label="outlined primary button group">
                            <Button
                                style={{ width: '140px' }}
                                variant={displayProductDataType === 'images' ? 'contained' : 'outlined'}
                                onClick={() => setDisplayProductDataType('images')}>Images</Button>
                            <Button
                                style={{ width: '140px' }}
                                variant={displayProductDataType === 'specification' ? 'contained' : 'outlined'}
                                onClick={() => setDisplayProductDataType('specification')}>Specification</Button>
                        </ButtonGroup>

                    </Stack>

                </Stack>
                <Stack width='70%' direction='row' overflow='auto' height='calc(100vh - 70px)'>

                    {!dimAnaData.isLoading && <Stack width={'50%'} bgcolor={'beige'} direction='column' gap={3}>

                        <Stack>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={6}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Iron Pipe</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Pipe Type & Size</TableCell>
                                            <TableCell>L&nbsp;&nbsp;</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Total (ft)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dimAnaData.data.ironPipeRows.map((row, index) => {
                                            return (
                                                // <IronPipeTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     unitSelector={filters.unitSelector}
                                                //     editable={dataLoaded}
                                                //     hideDetails={true}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.ironPipeRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell'>{row.pipeTypeNSize}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.length)}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                    <TableCell className='cell'>{getTotal('Iron Pipe', { length: row.length, qty: row.qty })}</TableCell>
                                                </TableRow>
                                            );
                                        })}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>

                        <Stack>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={8}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Wooden Sheet</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Type</TableCell>
                                            <TableCell>L&nbsp;&nbsp;</TableCell>
                                            <TableCell>W&nbsp;&nbsp;</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Total S.ft</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dimAnaData.data.woodenSheetRows.map((row, index) => {
                                            return (
                                                // <WoodenSheetTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     unitSelector={filters.unitSelector}
                                                //     editable={dataLoaded}
                                                //     hideDetails={true}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.woodenSheetRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell'>{row.type}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.length)}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.width)}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                    <TableCell className='cell'>{getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty })}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                        <Stack>
                            {filters.buildMaterial !== "SOLID WOOD" && (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table padding={0} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="table-head" colSpan={8}>
                                                    <Stack direction='row' justifyContent='center'>
                                                        <Typography fontWeight='bold'>Wood Tape</Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cell-head">
                                                <TableCell>Size</TableCell>
                                                {/* <TableCell>L&nbsp;&nbsp;</TableCell> */}
                                                {/* <TableCell>Qty</TableCell> */}
                                                {/* <TableCell>Total</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dimAnaData.data.woodTapeRows.map((row, index) => {
                                                return (
                                                    // <WoodTapeTableRow
                                                    //     key={index}
                                                    //     _key={index}
                                                    //     data={row}
                                                    //     handleEdit={handleEdit}
                                                    //     unitSelector={filters.unitSelector}
                                                    //     editable={dataLoaded}
                                                    // />
                                                    <TableRow
                                                        style={{ backgroundColor: highlightedRows.woodTapeRows.includes(index) && 'red' }}
                                                    >
                                                        <TableCell className='cell'>{row.size ? row.size.toUpperCase() : "NA"}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Stack>

                        <Stack>

                            <TableContainer component={Paper} variant="outlined">
                                <Table padding={0} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={8}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Misc</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Item</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Qty</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dimAnaData.data.miscTableRows.map((row, index) => {
                                            return (
                                                // <MiscTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     editable={dataLoaded}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.miscTableRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell' style={{ textTransform: 'capitalize' }}>{row.item}</TableCell>
                                                    <TableCell className='cell'>{row.size ? row.size.toUpperCase() : "NA"}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>

                        <Stack direction="column">
                            <Typography>Build Material</Typography>
                            <Select
                                size="small"
                                value={dimAnaData.buildMaterial}
                                name="buildMaterial"
                                disabled={true}
                            >
                                <MenuItem value="IRON PIPE / MDF">IRON PIPE / MDF</MenuItem>
                                <MenuItem value="SOLID WOOD">SOLID WOOD</MenuItem>
                            </Select>
                        </Stack>

                    </Stack>}
                    {!qaDimAnaData.isLoading && <Stack width={'50%'} bgcolor={'beige'} direction='column' gap={3}>

                        <Stack>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={6}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Iron Pipe</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Pipe Type & Size</TableCell>
                                            <TableCell>L&nbsp;&nbsp;</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Total (ft)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {qaDimAnaData.data.ironPipeRows.map((row, index) => {
                                            return (
                                                // <IronPipeTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     unitSelector={filters.unitSelector}
                                                //     editable={dataLoaded}
                                                //     hideDetails={true}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.ironPipeRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell'>{row.pipeTypeNSize}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.length)}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                    <TableCell className='cell'>{getTotal('Iron Pipe', { length: row.length, qty: row.qty })}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>

                        <Stack>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={8}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Wooden Sheet</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Type</TableCell>
                                            <TableCell>L&nbsp;&nbsp;</TableCell>
                                            <TableCell>W&nbsp;&nbsp;</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Total S.ft</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {qaDimAnaData.data.woodenSheetRows.map((row, index) => {
                                            return (
                                                // <WoodenSheetTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     unitSelector={filters.unitSelector}
                                                //     editable={dataLoaded}
                                                //     hideDetails={true}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.woodenSheetRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell'>{row.type}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.length)}</TableCell>
                                                    <TableCell className='cell'>{getValue(row.width)}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                    <TableCell className='cell'>{getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty })}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                        <Stack>
                            {filters.buildMaterial !== "SOLID WOOD" && (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table padding={0} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="table-head" colSpan={8}>
                                                    <Stack direction='row' justifyContent='center'>
                                                        <Typography fontWeight='bold'>Wood Tape</Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cell-head">
                                                <TableCell>Size</TableCell>
                                                {/* <TableCell>L&nbsp;&nbsp;</TableCell> */}
                                                {/* <TableCell>Qty</TableCell> */}
                                                {/* <TableCell>Total</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {qaDimAnaData.data.woodTapeRows.map((row, index) => {
                                                return (
                                                    // <WoodTapeTableRow
                                                    //     key={index}
                                                    //     _key={index}
                                                    //     data={row}
                                                    //     handleEdit={handleEdit}
                                                    //     unitSelector={filters.unitSelector}
                                                    //     editable={dataLoaded}
                                                    // />
                                                    <TableRow
                                                        style={{ backgroundColor: highlightedRows.woodTapeRows.includes(index) && 'red' }}
                                                    >
                                                        <TableCell className='cell'>{row.size ? row.size.toUpperCase() : "NA"}</TableCell>
                                                    </TableRow>

                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Stack>

                        <Stack>

                            <TableContainer component={Paper} variant="outlined">
                                <Table padding={0} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head" colSpan={8}>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Typography fontWeight='bold'>Misc</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="cell-head">
                                            <TableCell>Item</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Qty</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {qaDimAnaData.data.miscTableRows.map((row, index) => {
                                            return (
                                                // <MiscTableRow
                                                //     key={index}
                                                //     _key={index}
                                                //     data={row}
                                                //     handleEdit={handleEdit}
                                                //     editable={dataLoaded}
                                                // />
                                                <TableRow
                                                    style={{ backgroundColor: highlightedRows.miscTableRows.includes(index) && 'red' }}
                                                >
                                                    <TableCell className='cell' style={{ textTransform: 'capitalize' }}>{row.item}</TableCell>
                                                    <TableCell className='cell'>{row.size ? row.size.toUpperCase() : "NA"}</TableCell>
                                                    <TableCell className='cell'>{row.qty}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>

                        <Stack direction="column">
                            <Typography>Build Material</Typography>
                            <Select
                                size="small"
                                value={qaDimAnaData.buildMaterial}
                                name="buildMaterial"
                                disabled={true}
                            >
                                <MenuItem value="IRON PIPE / MDF">IRON PIPE / MDF</MenuItem>
                                <MenuItem value="SOLID WOOD">SOLID WOOD</MenuItem>
                            </Select>
                        </Stack>


                    </Stack>}

                </Stack>
            </Stack>
        </Wrapper>
    )
}

const Wrapper = styled.main`
  input {
    padding: 8.5px 0px;
    text-align: center;
}
.cell {
    padding: 8.5px 0px;
    text-align: center;
    border: 2px solid black;
    font-weight: bold;
  }

  td {
    padding: 0;
    border-bottom: none;
  }
  td div {
    border-radius: 0px;
    font-size: medium;
  }
  .table-head {
    background-color: black;
    color: white;
    font-weight: bold;
    text-align: center;
    border: 2px solid black;
  }

  .cell-head {
    background-color: #ffeb9c;
    white-space: nowrap;
  }
  
  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
    text-align: center;
    border: 2px solid black;
    font-size: medium;
  }

  .cell-disabled {
    background-color: #c6efce;
  }

  .cell-disabled > div {
    font-weight: bold;
  }
`;

export default DimAnaComparision