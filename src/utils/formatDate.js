export const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year} | ${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return formattedDate;
};