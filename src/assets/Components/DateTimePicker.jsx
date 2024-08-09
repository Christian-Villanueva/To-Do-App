import React, { useState, useEffect } from 'react';

export default function DateTimePicker({ onDateTimeChange, reset, classNumber}) {
  const [localDate, setLocalDate] = useState('');
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    if (reset) {
      setLocalDate('');
      setLocalTime('');
    }
  }, [reset]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (date, time) => {
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    let hours = parseInt(time.split(':')[0], 10);
    const minutes = time.split(':')[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${formattedDate} | ${hours}:${minutes} ${ampm}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setLocalDate(selectedDate);
    onDateTimeChange(formatDateTime(selectedDate, localTime || '23:59'));
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setLocalTime(selectedTime);
    onDateTimeChange(formatDateTime(localDate || getCurrentDate(), selectedTime));
  };

  return (
    <div className={classNumber === 1 ? 'date-time-picker' : 'modal-date-time-picker'}>
      <div className={classNumber === 1 ? 'picker-container' : 'modal-picker-container'}>
        <input
          type="date"
          min={getCurrentDate()}
          value={localDate}
          onKeyDown={(e) => e.preventDefault()}
          onChange={handleDateChange}
        />
        <input
          type="time"
          value={localTime}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}
