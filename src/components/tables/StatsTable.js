import React, { useEffect, useState } from 'react'

function StatsTable({ user, job = null }) {

    const lt = (new Date().getTime() / 1000).toFixed(0)

    console.log('user', user);

    const [tableDataStats, setTableDataStats] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: []
    })

    const fetchTableDataStats = () => {
        setTableDataStats(pre => ({
            ...pre,
            isLoading: true
        }))

        const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/stats?job=${job || user.jdesc}&uid=${user.uid}&lt=${tableDataStats.lessThanDate}&gt=${tableDataStats.greaterThanDate}`

        fetch(apiURL).then((res) => res.json()).then((result) => {

            console.log('stats result', result);

            const attempted = result.attempts;
            // var rejected_nad = result.attempts - result.not_validated - result.minor_changes - result.major_changes - result.qa_passed;
            var rejected_nad = (job || user.jdesc).includes('Extractor') ? result.rejects : 0;
            var not_understandable = (job || user.jdesc).includes('DimAna') ? result.rejects : 0;

            var under_qa = result.not_validated;
            var minor = result.minor_changes;
            var major = result.major_changes;
            var passed = result.qa_passed
            var earnings = result.earning;
            var resets = `${((result.resets / attempted) * 100).toFixed(0)} %`;
            if (attempted === 0) {
                resets = '0 %'
            }

            setTableDataStats(pre => ({
                ...pre,
                isLoading: false,
                data: (job || user.jdesc).includes('Extractor') ? [attempted, rejected_nad, under_qa, minor, major, passed, resets] : [attempted, not_understandable, under_qa, minor, major, passed, resets]
            }))

        }).catch((e) => console.log('error occured', e))

    }

    useEffect(() => {

        fetchTableDataStats()
    }, []);

    useEffect(() => {
        fetchTableDataStats()
    }, [tableDataStats.reset])

    return (
        <div>
            <h2>Stats Overview</h2>
            <div className="d-flex flex-row justify-content-end gap-2">
                <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                    <h5 className="m-0 py-1">Starting Date</h5>
                    <input className="px-3" type="date" id="myDate1"
                        onChange={(e) => {
                            setTableDataStats(pre => ({
                                ...pre,
                                greaterThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0),
                            }))
                        }}
                        style={{ backgroundColor: "#e8e8e8" }} />
                </div>
                <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                    <h5 className="m-0 py-1">Ending Date</h5>
                    <input className="px-3" type="date" id="myDate2"
                        onChange={(e) => {
                            setTableDataStats(pre => ({
                                ...pre,
                                lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                            }))
                        }}
                        style={{ backgroundColor: "#e8e8e8" }} />
                </div>
                <div className="d-flex flex-column gap-1">
                    <button className="btn btn-fetch" onClick={fetchTableDataStats}>Submit</button>
                    <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("myDate1").value = "";
                        document.getElementById("myDate2").value = "";
                        setTableDataStats(pre => ({
                            ...pre,
                            greaterThanDate: 0,
                            lessThanDate: lt,
                            reset: pre.reset + 1
                        }))
                    }}>Clear</button>
                </div>
            </div>
            {tableDataStats.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
                <thead className="table-info">
                    <tr>
                        <th>Attempted</th>
                        <th>Not a Doable</th>
                        <th>Under QA</th>
                        <th>MINOR [QA Passed]</th>
                        <th>MAJOR [QA Passed]</th>
                        <th>100% [QA Passed]</th>
                        <th style={{ background: '#ffc0c0' }}>Resets</th>
                    </tr>
                </thead>
                <tbody>
                    <tr tr>
                        {tableDataStats.data.map((item, index) => {
                            return <td>{item}</td>
                        })}
                    </tr>
                </tbody>
            </table>}
        </div >
    )
}

export default StatsTable