import React, { useEffect, useRef, useState } from 'react'

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
    Switch,
    TableContainer,
    TableFooter,
    TextField,
    Typography,
    colors,
} from "@mui/material";

import styled from 'styled-components';
import HeaderSignOut from '../components/header/HeaderSignOut';
import { getDimTableData } from '../utils/getDimTableData';
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf';
import { triggerToast } from '../utils/triggerToast';
import WoodenSheetType from "../res/WoodenSheetType.json";

function ProductVendorInformation(props) {
    const urlParams = new URLSearchParams(window.location.search);

    const [enableLegacyEdit, setEnableLegacyEdit] = useState(false)
    const [pipeTypeAndSizes, setPipeTypeAndSizes] = useState([])
    const [tapeSizes, setTapeSizes] = useState([])

    const [editable, setEditable] = useState(true)
    const [displayProductDataType, setDisplayProductDataType] = useState('images');
    const [previewImage, setPreviewImage] = useState('');

    const [filters, SetFilters] = useState({
        unitSelector: "Inch",
        buildMaterial: "IRON PIPE / MDF",
        reportIssue: false,
    });

    const [costingSheet, setCostingSheet] = useState(null)

    const uploadData = () => {

        const currentTimeStamp = new Date().getTime();

        const old_timebasedData = costingSheet ? costingSheet.timebasedData : {}

        const costingS = {
            currentVersion: currentTimeStamp,
            timebasedData: {
                ...old_timebasedData,
                [currentTimeStamp]: {
                    summary,
                    actualCostTable,
                    qaDimAnaData,
                    standardCost,
                    info
                }
            }
        }

        const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/cost_table/${urlParams.get('pid')}`
        fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(costingS)
        }).then(res => res.json()).then((result) => {
            console.log('submitted', result);
            triggerToast('submitted', 'success');
            window.location.href = '/actual-costs'
        }).catch((e) => {
            console.log('error occured', e);
            triggerToast(`error occured: ${e}`, 'error');
        });
    }

    useEffect(() => {
        getDropdownItems()

        const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/cost_table/${urlParams.get('pid')}`
        const version = urlParams.get('version');

        fetch(apiURL).then(res => res.json()).then((result) => {

            console.log('costing sheet retrived', typeof result, result);
            setCostingSheet(result.data);
            if (!version) {
                fetchData()
            } else {
                setSummary(result.data.timebasedData[version].summary)
                setActualCostTable(result.data.timebasedData[version].actualCostTable)
                setQADimAnaData(result.data.timebasedData[version].qaDimAnaData)
                setInfo(result.data.timebasedData[version].info)
                setStandardCost(result.data.timebasedData[version].standardCost)
                setPreviewImage(result.data.timebasedData[version].info.images[0])
                setEditable(false)
            }


        }).catch((e) => {
            fetchData()
            console.log('error occured', e)
        });

    }, [])

    const targetPDFRef = useRef()

    const [summary, setSummary] = useState({
        pipe: {
            total_ft: 0,
            pipe_cost: 0,
            paint_cost: 0,
            total_ft__x__wt_ft: 0
        },
        sheet: {
            total_ft: 0,
            sheet_rate: 0,
            tape_cost: 0,
            total_ft__x__wt_ft: 0
        },
        misc: {
            total_rate: 0,
            total_weight: 0
        }
    })

    const [actualCostTable, setActualCostTable] = useState({
        isLoading: true,
        pipe: [],
        sheet: [],
        misc: [],
        shipping: {
            company: "",
            service: ""
        }
    })

    const [qaDimAnaData, setQADimAnaData] = useState({
        isLoading: true,
        data: [],
        differentRows: [],
        buildMaterial: "",
        status: ""
    })

    const [standardCost, setStandardCost] = useState({
        isLoading: true,
        data: null
    })

    const [info, setInfo] = useState({
        isLoading: true,
        images: [],
        sku: "",
        weightAndDimentions: {}
    })

    const [rawIngredients, setRawIngredients] = useState({
        isLoading: true,
        data: null
    })

    const getTotal = (productPropType, data) => {

        if (productPropType === 'Iron Pipe') {
            if (filters.unitSelector === "Inch") {

                return ((data.length) * data.qty).toFixed(2);
                // return ((data.length / 12) * data.qty).toFixed(2);
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
        return value
        if (filters.unitSelector === "Inch") {
            return (value / 12).toFixed(2);
        } else if (filters.unitSelector === "Centimeter") {
            return (value * 0.0328084).toFixed(2);
        } else {
            return (value * 3.28084).toFixed(2);
        }
    };

    const fetchData = async () => {
        const pid = urlParams.get('pid');

        const DimAnaQAData = await getDimTableData({ table_type: 'qa', pid: pid })

        setInfo({
            isLoading: false,
            images: DimAnaQAData.data.final.images,
            sku: DimAnaQAData.sku,
            weightAndDimentions: DimAnaQAData.data.final['weight and dimensions']
        })

        setPreviewImage(DimAnaQAData.data.final.images[0])

        setQADimAnaData((pre) => ({
            ...pre,
            isLoading: false,
            data: DimAnaQAData.data.final.productProperties,
            buildMaterial: DimAnaQAData.data.final.buildMaterial,
            status: DimAnaQAData.data.final.change,
        }))

        const apiURL_ingredients = `${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`

        // getStandardCosts
        setActualCostTable(pre => ({
            ...pre,
            isLoading: true
        }))
        fetch(apiURL_ingredients).then(res => res.json()).then((result) => {
            console.log('getIngredients', result);

            setStandardCost({
                isLoading: false,
                data: result.data.standardCosts
            })

            setRawIngredients({
                isLoading: false,
                data: result.data.rawIngredients
            })



            const actualCTable = {
                isLoading: false,
                pipe: [],
                sheet: [],
                misc: [],
                shipping: {
                    company: (result.data.standardCosts['shipping companies'])[0].company,
                    service: "detain"
                }
            }

            DimAnaQAData.data.final.productProperties.ironPipeRows.map((pipe, index) => {

                actualCTable.pipe.push({
                    material: "",
                    paint: `${result.data.standardCosts.paint[0].type} - ${result.data.standardCosts.paint[0].brand}`
                })

            })

            DimAnaQAData.data.final.productProperties.woodenSheetRows.map((sheet, index) => {

                // const tape_used = DimAnaQAData.data.final.productProperties.woodTapeRows[0].size.toLowerCase() === 'small' ? 0 : 1;
                const tape_used = DimAnaQAData.data.final.productProperties.woodTapeRows[0].size;
                actualCTable.sheet.push({
                    material: "",
                    // tape: `${result.data.standardCosts.tape[tape_used].type} - ${result.data.standardCosts.tape[tape_used].size_inch}`
                    tape: tape_used
                })

            })

            DimAnaQAData.data.final.productProperties.miscTableRows.map((misc, index) => {

                actualCTable.misc.push({
                    item: `${misc.item} - ${misc.size}`,
                })

            })

            console.log('act', actualCTable);
            setActualCostTable(actualCTable);

        }).catch((e) => console.log('error occured', e))

    }

    const getPipeRawCost = (pipeTypeNSize) => {
        const found = rawIngredients.data.pipe.filter((p, index) => `${p.type}  ${p.size}` == pipeTypeNSize)
        console.log('found ', found);
        return found.length > 0 ? found[0] : {}
    }

    const getMiscStandanrdCost = (item_n_details) => {

        const item = item_n_details.split(' - ')[0]
        const details = item_n_details.split(' - ')[1]

        console.log('--> ', item_n_details);

        const found = standardCost.data.misc.filter((p) => p.item.toLowerCase() === item.toLowerCase() && p.details.toLowerCase() === details.toLowerCase())[0]

        if (!found) {
            return {}
        }
        return found
    }

    const getShippingCompanyStandanrdCost = (company) => {

        const found = standardCost.data["shipping companies"].filter((p) => p.company.toLowerCase() === company.toLowerCase())[0]

        if (!found) {
            return {}
        }
        return found
    }

    const calculatePipeTotals = () => {

        var total_ft = 0;
        var total_ft__x__wt_ft = 0;
        var pipe_cost = 0;
        var paint_cost = 0;

        if (qaDimAnaData.isLoading) {
            return
        }

        qaDimAnaData.data.ironPipeRows.map((row, index) => {

            const rawCost = getPipeRawCost(row.pipeTypeNSize);

            const _total_ft = getTotal('Iron Pipe', { length: row.length, qty: row.qty }) / 12

            const wt_ft = rawCost.weight / rawCost.length_feet

            total_ft += _total_ft;
            total_ft__x__wt_ft += _total_ft * wt_ft;

            pipe_cost += _total_ft * (rawCost.rate / rawCost.length_feet)

            paint_cost += _total_ft * rawIngredients.data.paint[0].rate

        })

        setSummary(pre => ({
            ...pre,
            pipe: {
                ...pre.pipe,
                total_ft,
                pipe_cost,
                paint_cost,
                total_ft__x__wt_ft
            }
        }))

    }

    const calculateSheetTotals = () => {

        var total_ft = 0;
        var sheet_rate = 0;
        var tape_cost = 0;
        var total_ft__x__wt_ft = 0;

        if (qaDimAnaData.isLoading) {
            return
        }

        qaDimAnaData.data.woodenSheetRows.map((row, index) => {

            const _total_ft = getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty }) / 12

            const rawSheet = rawIngredients.data.sheet[0]

            const rawTape = rawIngredients.data.tape[0]

            const wt_ft = (rawSheet.weight / rawSheet.total_sq_feet)

            total_ft += _total_ft;
            total_ft__x__wt_ft += _total_ft * wt_ft;

            sheet_rate += _total_ft * (rawSheet.rate / rawSheet.total_sq_feet)

            tape_cost += _total_ft * (rawTape.rate)

        })

        setSummary(pre => ({
            ...pre,
            sheet: {
                ...pre.sheet,
                total_ft,
                sheet_rate,
                tape_cost,
                total_ft__x__wt_ft
            }
        }))

    }

    const calculateMiscTotals = () => {

        var total_rate = 0
        var total_weight = 0

        if (qaDimAnaData.isLoading) {
            return
        }

        qaDimAnaData.data.miscTableRows.map((row, index) => {


            total_rate += parseInt(getMiscStandanrdCost(actualCostTable.misc[index].item).rate * row.qty)

            total_weight += parseInt(getMiscStandanrdCost(actualCostTable.misc[index].item).weight)

        })

        setSummary(pre => ({
            ...pre,
            misc: {
                ...pre.misc,
                total_rate,
                total_weight
            }
        }))

    }

    const getBiggerWeight = () => {
        const mass = summary.pipe.total_ft__x__wt_ft + summary.sheet.total_ft__x__wt_ft + summary.misc.total_weight
        const volumetric = (qaDimAnaData.data.volume && qaDimAnaData.data.volume.length * qaDimAnaData.data.volume.width * qaDimAnaData.data.volume.height) / 5000 || 0

        return Math.max(mass, volumetric)
    }

    const activateSaveButton = () => {

        return (actualCostTable.pipe.filter((p, index) => p.material === "").length > 0 || actualCostTable.sheet.filter((s, index) => s.material === "").length > 0) ? false : true
    }

    const PDFoptions = {
        filename: `${urlParams.get('pid')}.pdf`,
        page: {
            orientation: 'landscape',
        },
    };

    const getDropdownItems = async () => {
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/ingredients`).then((res) => res.json()).then((result) => {
            console.log('ingredients result', result);
            const ing = result.data.portalVariables.pipeTypesNSizes.filter((pipeTypeNSize) => pipeTypeNSize.status === 'active');
            setPipeTypeAndSizes(ing)
            setTapeSizes(result.data.standardCosts.tape)
        }).catch((e) => console.log('error occured', e))
    }

    // const handleEdit = (e, key, propType) => {
    //     setProductProperties((pre) => {
    //         const updatedRows = [...pre[propType]];
    //         updatedRows[key] = {
    //             ...updatedRows[key],
    //             [e.target.name]: e.target.value,
    //         };
    //         return { ...pre, [propType]: updatedRows };
    //     });
    // };
    const handleEdit = (e, key, propType) => {
        setQADimAnaData((prevData) => {
            const updatedData = {
                ...prevData,
                data: {
                    ...prevData.data,
                    [propType]: prevData.data[propType].map((item, index) =>
                        index === key
                            ? {
                                ...item,
                                [e.target.name]: e.target.value,
                            }
                            : item
                    ),
                },
            };
            return updatedData;
        });
    };

    useEffect(() => {
        if (!qaDimAnaData.isLoading && !actualCostTable.isLoading) {
            calculatePipeTotals()
            calculateSheetTotals()
            calculateMiscTotals()
        }
    }, [actualCostTable, qaDimAnaData.buildMaterial, qaDimAnaData.data])

    return (
        <Wrapper>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <div ref={targetPDFRef}>
                <Stack direction='row'>
                    <Stack width={'30%'}>

                        <Stack direction='column' width='100%' spacing={0.5}>

                            <div className='bg-black text-white text-center p-1' style={{ textTransform: 'capitalize' }}>
                                <h4>
                                    SKU: {info.sku}
                                </h4>
                            </div>

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

                    <Stack width='70%' direction='row' >
                        <Stack width={'100%'} bgcolor={'beige'} direction='column' gap={3}>

                            {(qaDimAnaData.isLoading || standardCost.isLoading || rawIngredients.isLoading) ?

                                <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div></div>
                                :
                                <>
                                    <div className='bg-black text-white text-center d-flex flex-row align-items-center justify-content-center gap-2 p-1' style={{ textTransform: 'capitalize' }}>
                                        <div></div>
                                        <h4>
                                            BASIC COST
                                        </h4>
                                    </div>

                                    <Stack>
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-head" colSpan={6}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Build Material</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className='cell'>
                                                            {qaDimAnaData.buildMaterial}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Stack>

                                    <Stack>
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-head" colSpan={5}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Pipe</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell className="table-head" colSpan={2} style={{ backgroundColor: '#F0D700', color: "black" }}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Paint</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow className="cell-head">
                                                        <TableCell>Pipe Type & Size</TableCell>
                                                        <TableCell>Measures</TableCell>
                                                        <TableCell>Qty</TableCell>
                                                        <TableCell>Total '' [Ft]</TableCell>
                                                        <TableCell>Pipe Cost</TableCell>
                                                        <TableCell>Paint Rate</TableCell>
                                                        <TableCell>Paint - Cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {qaDimAnaData.data.ironPipeRows.map((row, index) => {
                                                        return (
                                                            <TableRow>

                                                                <TableCell className='cell'>

                                                                    {row.pipeTypeNSize}

                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {`${row.length} ''`}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {row.qty}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {`${getTotal('Iron Pipe', { length: row.length, qty: row.qty })} '' [${(getTotal('Iron Pipe', { length: row.length, qty: row.qty }) / 12).toFixed(2)} ft]`}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {((getTotal('Iron Pipe', { length: row.length, qty: row.qty }) / 12) * (getPipeRawCost(row.pipeTypeNSize).rate / getPipeRawCost(row.pipeTypeNSize).length_feet)).toFixed(0)}
                                                                </TableCell>
                                                                <TableCell className='cell'>
                                                                    {rawIngredients.data.paint[0].rate}
                                                                </TableCell>
                                                                <TableCell className='cell'>
                                                                    {((getTotal('Iron Pipe', { length: row.length, qty: row.qty }) / 12) * rawIngredients.data.paint[0].rate).toFixed(0)}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell className='cell cell-head'>Total</TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.pipe.total_ft.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.pipe.pipe_cost.toFixed(0)}
                                                        </TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.pipe.paint_cost.toFixed(0)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                    </Stack>

                                    <Stack>
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-head" colSpan={5}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Sheet</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell className="table-head" colSpan={2} style={{ backgroundColor: '#F0D700', color: "black" }}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Tape</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow className="cell-head">
                                                        <TableCell>Type</TableCell>
                                                        <TableCell>Measures</TableCell>
                                                        <TableCell>Qty</TableCell>
                                                        <TableCell>Total [Sq Ft]</TableCell>
                                                        <TableCell>Rate</TableCell>
                                                        <TableCell>Tape</TableCell>
                                                        <TableCell>Tape - Cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {qaDimAnaData.data.woodenSheetRows.map((row, index) => {
                                                        return (
                                                            <TableRow>


                                                                <TableCell className='cell'>
                                                                    {row.type}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {`${row.length}'' x ${row.width}''`}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {row.qty}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {`${(getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty }) / 12).toFixed(2)} Sq Ft`}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {((getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty }) / 12) * (rawIngredients.data.sheet[0].rate / rawIngredients.data.sheet[0].total_sq_feet)).toFixed(0)}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {qaDimAnaData.data.woodTapeRows[0].size}
                                                                </TableCell>

                                                                <TableCell className='cell'>
                                                                    {(
                                                                        (getTotal('Wooden Sheet', { length: row.length, width: row.width, qty: row.qty }) / 12) * (rawIngredients.data.tape[0].rate)
                                                                    ).toFixed(0)}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell className='cell cell-head'>Total</TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.sheet.total_ft.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.sheet.sheet_rate.toFixed(0)}
                                                        </TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.sheet.tape_cost.toFixed(0)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
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
                                                        <TableCell>Qty</TableCell>
                                                        <TableCell>Rate [Total]</TableCell>
                                                        <TableCell>Weight</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {qaDimAnaData.data.miscTableRows.map((row, index) => {
                                                        return (
                                                            <TableRow>
                                                                <TableCell className='cell' style={{ textTransform: 'capitalize' }}>{row.item}</TableCell>

                                                                <TableCell className='cell'>
                                                                    {row.qty}
                                                                </TableCell>
                                                                <TableCell className='cell'>
                                                                    {`${getMiscStandanrdCost(actualCostTable.misc[index].item).rate}  
                                                                [${getMiscStandanrdCost(actualCostTable.misc[index].item).rate * row.qty}]`}
                                                                </TableCell>
                                                                <TableCell className='cell'>
                                                                    {getMiscStandanrdCost(actualCostTable.misc[index].item).weight}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell className='cell cell-head'>Total</TableCell>
                                                        <TableCell className='cell cell-head'></TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.misc.total_rate.toFixed(0)}
                                                        </TableCell>
                                                        <TableCell className='cell cell-head'>
                                                            {summary.misc.total_weight.toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                    </Stack>

                                    <Stack direction='row'>

                                        <TableContainer sx={{ width: '50%' }} component={Paper} variant="outlined">
                                            <Table padding={0} size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-head" colSpan={8}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Weight & Volume</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow className="cell-head">
                                                        <TableCell colSpan={2}>VOLUME</TableCell>
                                                        <TableCell colSpan={2}>WEIGHT</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className='cell'>
                                                            Length
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {(qaDimAnaData.data.volume && qaDimAnaData.data.volume.length) || 0}
                                                        </TableCell>

                                                        <TableCell className='cell'>
                                                            Mass Weight
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {(summary.pipe.total_ft__x__wt_ft + summary.sheet.total_ft__x__wt_ft + summary.misc.total_weight).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>
                                                            Width
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {(qaDimAnaData.data.volume && qaDimAnaData.data.volume.width) || 0}
                                                        </TableCell>

                                                        <TableCell className='cell'>
                                                            Volumetric Weight
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {((qaDimAnaData.data.volume && qaDimAnaData.data.volume.length * qaDimAnaData.data.volume.width * qaDimAnaData.data.volume.height) / 5000).toFixed(2) || 0}
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>
                                                            Height
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {(qaDimAnaData.data.volume && qaDimAnaData.data.volume.height) || 0}
                                                        </TableCell>

                                                        <TableCell className='cell'></TableCell>
                                                        <TableCell className='cell'></TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>
                                                            Volume
                                                        </TableCell>
                                                        <TableCell className='cell'>
                                                            {(qaDimAnaData.data.volume && (qaDimAnaData.data.volume.length * qaDimAnaData.data.volume.width * qaDimAnaData.data.volume.height).toFixed(2)) || 0}
                                                        </TableCell>

                                                        <TableCell className='cell'></TableCell>
                                                        <TableCell className='cell'></TableCell>
                                                    </TableRow>


                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <TableContainer sx={{ width: '50%' }} component={Paper} variant="outlined">
                                            <Table padding={0} size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-head" colSpan={8}>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Typography fontWeight='bold'>Summary</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className='cell'>IRON</TableCell>
                                                        <TableCell className='cell'>{summary.pipe.pipe_cost.toFixed(0)}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>SHEET</TableCell>
                                                        <TableCell className='cell'>{summary.sheet.sheet_rate.toFixed(0)}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>PAINT</TableCell>
                                                        <TableCell className='cell'>{summary.pipe.paint_cost.toFixed(0)}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>TAPE</TableCell>
                                                        <TableCell className='cell'>{summary.sheet.tape_cost.toFixed(0)}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>MISC</TableCell>
                                                        <TableCell className='cell'>{summary.misc.total_rate.toFixed(0)}</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>LABOUR</TableCell>
                                                        <TableCell className='cell'>{
                                                            ((summary.pipe.pipe_cost + summary.pipe.paint_cost + summary.sheet.sheet_rate + summary.sheet.tape_cost + summary.misc.total_rate) * 0.3).toFixed(0)
                                                        }</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>OTHERS</TableCell>
                                                        <TableCell className='cell'>{
                                                            ((summary.pipe.pipe_cost + summary.pipe.paint_cost + summary.sheet.sheet_rate + summary.sheet.tape_cost + summary.misc.total_rate) * 0.1).toFixed(0)
                                                        }</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell className='cell'>DELIVERY</TableCell>
                                                        <TableCell className='cell'>{
                                                            // (whichever is bigger volumertic vs mass weight) * delivery_company_rate
                                                            (getBiggerWeight() * getShippingCompanyStandanrdCost(actualCostTable.shipping.company)[actualCostTable.shipping.service]).toFixed(0)
                                                        }</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Stack padding={1} direction='row' justifyContent='end'>
                                                                <Button
                                                                    variant='contained'
                                                                    color='success'
                                                                    onClick={() => generatePDF(targetPDFRef, PDFoptions)}
                                                                >
                                                                    Generate PDF
                                                                </Button>

                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>

                                    </Stack>

                                </>
                            }


                        </Stack>

                    </Stack>
                </Stack>
            </div>
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

export default ProductVendorInformation