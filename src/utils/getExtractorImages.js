export const getExtractorImages = async ({ table_type, pid, vid }) => {

    const data = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/images/${table_type}/${pid}/${vid}`).then(res => res.json()).then((result) => {
        return result;

    }).catch((e) => console.log('error occured', e))

    return data
}