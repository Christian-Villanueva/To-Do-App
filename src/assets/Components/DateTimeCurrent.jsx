import React from 'react';

const DateTime = () => {
    const showdate = new Date();
    const month = String(showdate.getMonth() + 1).padStart(2, '0');
    const date = String(showdate.getDate()).padStart(2, '0');
    const year = showdate.getFullYear();
    let hours = showdate.getHours();
    const minutes = String(showdate.getMinutes()).padStart(2, '0');
    const seconds = String(showdate.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const displayDateTime = `${month}/${date}/${year} | ${hours}:${minutes}:${seconds} ${ampm}`;

    return displayDateTime;
}

export default DateTime;
