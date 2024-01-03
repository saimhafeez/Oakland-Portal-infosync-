import React, { useEffect, useState } from 'react'
import { getExtractorImages } from '../../utils/getExtractorImages';

function ExtractionComparision() {

    const [extractionData, setExtractionData] = useState({
        isLoading: true
    })
    const [qaextractionData, setQAExtractionData] = useState({
        isLoading: true
    })


    useEffect(async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const pid = urlParams.get('pid');
        const vid = urlParams.get('vid');
        const job = urlParams.get('job');

        console.log(pid, job);

        const lt = (new Date().getTime() / 1000).toFixed(0)

        const workerData = await getExtractorImages({ table_type: 'worker', pid, vid })

        const qaWorkerData = await getExtractorImages({ table_type: 'qa', pid, vid })

        console.log('workerData -> ', workerData);
        console.log('qaWorkerData -> ', qaWorkerData);



    }, [])

    return (
        <div>ExtractionComparision</div>
    )
}

export default ExtractionComparision