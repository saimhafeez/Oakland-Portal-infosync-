// export const formatDate = (timestamp) => {

//     console.log('timestamp', timestamp);
//     const date = new Date(timestamp);

//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year} | ${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

//     return formattedDate;
// };

export const formatDate = (timestamp) => {

    console.log('timestamp', timestamp);

    // Adding 5 hours to the timestamp
    const adjustedTimestamp = new Date(timestamp);
    adjustedTimestamp.setHours(adjustedTimestamp.getHours() + 5);

    const date = new Date(adjustedTimestamp);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year} | ${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return formattedDate;
};
