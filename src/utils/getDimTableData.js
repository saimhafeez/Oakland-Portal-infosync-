export const getDimTableData = async ({ table_type, pid, }) => {

    const data = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/table/${table_type}/${pid}`).then(res => res.json()).then((result) => {
        return result;

    }).catch((e) => console.log('error occured', e))

    return data
}