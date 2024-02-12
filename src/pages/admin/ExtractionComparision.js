import React, { useEffect, useState } from 'react'
import { getExtractorImages } from '../../utils/getExtractorImages';
import HeaderSignOut from '../../components/header/HeaderSignOut';
import { Box, Stack } from '@mui/material';
import { CloseFullscreen, CloseTwoTone } from '@mui/icons-material';

function ExtractionComparision({ closeCallback, pid, vid, job, result }) {

    const default_imageSet = {
        thumbnails: [],
        dimensional: [],
        ordinary: [],
        whitebg: [],
        discard: []
    }

    // const urlParams = new URLSearchParams(window.location.search);
    // const pid = urlParams.get('pid');
    // const vid = urlParams.get('vid');
    // const job = urlParams.get('job');
    // const result = urlParams.get('result');

    const [extractionData, setExtractionData] = useState({
        isLoading: true,
        data: default_imageSet,
        status: ""
    })
    const [qaextractionData, setQAExtractionData] = useState({
        isLoading: true,
        data: default_imageSet,
        status: ""
    })

    const [info, setInfo] = useState({
        pid: "",
        vid: ""
    })

    const init = async () => {
        setInfo({
            idLoading: false,
            pid, vid
        })

        var workerData = []
        if (result !== 'qaOnly') {

            workerData = await getExtractorImages({ table_type: 'worker', pid, vid })
        }

        console.log('workerData', workerData);


        var qaWorkerData = []

        if (job === 'QA-Extractor') {
            qaWorkerData = await getExtractorImages({ table_type: 'qa', pid, vid })
        }

        if (result !== 'qaOnly') {
            setExtractionData({
                isLoading: false,
                data: workerData.data.sorted.change !== 'rejected_nad' ? workerData.data.sorted : default_imageSet,
                status: workerData.data.sorted.change
            })
        } else {
            setExtractionData({
                isLoading: false,
                data: {
                    thumbnails: [],
                    dimensional: [],
                    whitebg: [],
                    ordinary: [],
                    discard: []
                },
                status: ""
            })
        }


        if (job === 'QA-Extractor') {
            setQAExtractionData({
                isLoading: false,
                data: qaWorkerData.data.final.change !== 'rejected_nad' ? qaWorkerData.data.final : default_imageSet,
                status: qaWorkerData.data.final.change
            })
        } else {
            setQAExtractionData({
                isLoading: false,
                data: {
                    thumbnails: [],
                    dimensional: [],
                    whitebg: [],
                    ordinary: [],
                    discard: []
                },
                status: ""
            })
        }
    }

    useEffect(() => {
        init()
    }, [])

    const ImagesContainer = ({ containerTitle, imageSet, column }) => {
        return <div className="container-fluid py-2" style={{ borderRight: column === 1 ? '3px solid #7b9480' : '0px solid black' }}>
            <div className="main-div thumbnail-bg p-2">
                <div className="row">
                    <div>
                        <h3 className="m-0 p-0">{containerTitle}</h3>
                    </div>
                    <div className="row gap-2">
                        {imageSet.map((src, index) => (
                            <div key={index} style={{ width: '180px' }}>
                                <a href={src} target="_blank" rel="noopener noreferrer">
                                    <img
                                        className="card-img-top img-fluid"
                                        src={src}
                                    />
                                </a>
                            </div>
                        ))}
                        {Object.keys(imageSet).length === 0 &&
                            <div style={{ width: '180px', opacity: '0.3' }}>
                                <img
                                    className="card-img-top img-fluid opacity-0"
                                    src='https://st3.depositphotos.com/17828278/33150/v/450/depositphotos_331503262-stock-illustration-no-image-vector-symbol-missing.jpg'
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            {/* <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            /> */}
            <div className='d-flex flex-row justify-content-between align-items-center bg-warning text-white text-center p-1'>
                <div></div>
                <h4>
                    {`SKU: ${info.pid}-${info.vid}`}
                </h4>
                <div className='bg-black' style={{ cursor: 'pointer' }} onClick={closeCallback}>
                    <CloseTwoTone />
                </div>
            </div>
            <div className='d-flex flex-row'>
                <div className='w-100'>

                    {extractionData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div></div>

                        :

                        <>
                            <div className='bg-black text-white text-center'>
                                <h4 style={{ textTransform: 'capitalize' }}>
                                    Extractor Selected: '{extractionData.status ? extractionData.status === 'rejected_nad' ? 'NOT A DOABLE' : extractionData.status : 'N/A'}'
                                </h4>
                            </div>


                            <ImagesContainer
                                containerTitle='Colored Thumbnail'
                                imageSet={extractionData.data.thumbnails}
                                column={1}
                            />
                            <ImagesContainer
                                containerTitle='Dimensional'
                                imageSet={extractionData.data.dimensional}
                                column={1}
                            />
                            <ImagesContainer
                                containerTitle='White Thumbnails'
                                imageSet={extractionData.data.whitebg}
                                column={1}
                            />
                            <ImagesContainer
                                containerTitle='Supporting'
                                imageSet={extractionData.data.ordinary}
                                column={1}
                            />
                            <ImagesContainer
                                containerTitle='Discard'
                                imageSet={extractionData.data.discard}
                                column={1}
                            />
                        </>

                    }


                </div>

                <div className='w-100'>
                    {qaextractionData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div></div>
                        :
                        <>
                            <div className='bg-black text-white text-center' style={{ textTransform: 'capitalize' }}>
                                <h4>
                                    QA-Extractor Selected: '{qaextractionData.status ? qaextractionData.status === 'rejected_nad' ? 'NOT A DOABLE' : qaextractionData.status : 'N/A'}'
                                </h4>
                            </div>

                            <ImagesContainer
                                containerTitle='Colored Thumbnail'
                                imageSet={qaextractionData.data.thumbnails}
                            />
                            <ImagesContainer
                                containerTitle='Dimensional'
                                imageSet={qaextractionData.data.dimensional}
                            />
                            <ImagesContainer
                                containerTitle='White Thumbnails'
                                imageSet={qaextractionData.data.whitebg}
                            />
                            <ImagesContainer
                                containerTitle='Supporting'
                                imageSet={qaextractionData.data.ordinary}
                            />
                            <ImagesContainer
                                containerTitle='Discard'
                                imageSet={qaextractionData.data.discard}
                            />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ExtractionComparision