export const getImagesByID = async (pid) => {

    const data = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/images/all/${pid}`).then(res => res.json()).then((result) => {
        return result;

    }).catch((e) => console.log('error occured', e))

    return data

}