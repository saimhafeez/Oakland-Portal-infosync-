export const getSuperAdminTable = async ({ job, lt, gt, currentPage, uid, status, filterByQAStatus, searchByID }) => {

    var apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${job}&lt=${lt}&gt=${gt}&page=${currentPage}`

    if (uid && uid !== '') {
        apiURL += `&uid=${uid}`
    }

    if (filterByQAStatus && filterByQAStatus !== 'qa-status') {
        apiURL += `&status=${status}`
    }

    if (searchByID && searchByID !== "") {
        apiURL += `&productID=${searchByID}`
    }

    const data = await fetch(apiURL).then(res => res.json()).then((result) => {
        return result
    }).catch((e) => console.log('error occured', e))

    return data
}