import { useState } from 'react';

interface TimeRangeCellEditProps {
  id: string;
  value: string;
  //NOTE - Ver de donde viene este api y como tiparla
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  field: string;
  handleCellEditCommit?: (params: {
    id: string;
    field: string;
    value: string;
  }) => void;
}

export const TimeRangeCellEdit = ({
  id,
  value,
  api,
  field,
  handleCellEditCommit,
}: TimeRangeCellEditProps) => {
  const defaultStartTime = '-';
  const defaultEndTime = '-';
  const initialStartTime = value ? value.split(' - ')[0] : defaultStartTime;
  const initialEndTime = value ? value.split(' - ')[1] : defaultEndTime;

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const commitChange = (newStartTime: string, newEndTime: string) => {
    const newValue = `${newStartTime} - ${newEndTime}`;
    handleCellEditCommit({
      id,
      field,
      value: newValue,
    });
    api.setEditCellValue({ id, field, value: newValue });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    commitChange(newStartTime, endTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    commitChange(startTime, newEndTime);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 100000,
      }}
    >
      <input type="time" value={startTime} onChange={handleStartTimeChange} />
      <span> - </span>
      <input type="time" value={endTime} onChange={handleEndTimeChange} />
    </div>
  );
};
