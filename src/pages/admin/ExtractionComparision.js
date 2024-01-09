import React, { useEffect, useState } from 'react'
import { getExtractorImages } from '../../utils/getExtractorImages';
import HeaderSignOut from '../../components/header/HeaderSignOut';

const default_imageSet = {
    thumbnails: [],
    dimensional: [],
    ordinary: [],
    whitebg: [],
    discard: []
}

function ExtractionComparision(props) {

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


    useEffect(async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const pid = urlParams.get('pid');
        const vid = urlParams.get('vid');
        const job = urlParams.get('job');

        setInfo({
            idLoading: false,
            pid, vid
        })

        console.log(pid, job);

        const lt = (new Date().getTime() / 1000).toFixed(0)

        const workerData = await getExtractorImages({ table_type: 'worker', pid, vid })

        const qaWorkerData = await getExtractorImages({ table_type: 'qa', pid, vid })

        console.log('workerData -> ', workerData);
        console.log('qaWorkerData -> ', qaWorkerData);


        // console.log('---------------------------');
        // console.log(workerData.data.sorted.change !== 'rejected_nad' ? workerData.data.sorted : default_imageSet);
        // console.log('---------------------------');
        // console.log(qaWorkerData.data.final.change !== 'rejected_nad' ? qaWorkerData.data.final : default_imageSet);

        setExtractionData({
            isLoading: false,
            data: workerData.data.sorted.change !== 'rejected_nad' ? workerData.data.sorted : default_imageSet,
            status: workerData.data.sorted.change
        })

        setQAExtractionData({
            isLoading: false,
            data: qaWorkerData.data.final.change !== 'rejected_nad' ? qaWorkerData.data.final : default_imageSet,
            status: qaWorkerData.data.final.change
        })


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
                                <img
                                    className="card-img-top img-fluid"
                                    src={src}
                                />
                            </div>
                        ))}
                        {Object.keys(imageSet).length === 0 &&
                            <div style={{ width: '180px', opacity: '0.3' }}>
                                <img
                                    className="card-img-top img-fluid"
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
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <div className='bg-warning text-white text-center'>
                <h4>
                    {`SKU: ${info.pid}-${info.vid}`}
                </h4>
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