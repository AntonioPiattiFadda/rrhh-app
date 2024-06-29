import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { SelectChangeEvent } from '@mui/material';

interface DaySelectorProps {
  selectedDay: string;
  handleDayChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}

const DaySelector = ({ selectedDay, handleDayChange }: DaySelectorProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="day-select-label">Día</InputLabel>
      <Select
        labelId="day-select-label"
        id="day-select"
        value={selectedDay}
        label="Día"
        onChange={handleDayChange}
      >
        <MenuItem value="monday">Lunes</MenuItem>
        <MenuItem value="tuesday">Martes</MenuItem>
        <MenuItem value="wednesday">Miércoles</MenuItem>
        <MenuItem value="thursday">Jueves</MenuItem>
        <MenuItem value="friday">Viernes</MenuItem>
        <MenuItem value="saturday">Sábado</MenuItem>
        <MenuItem value="sunday">Domingo</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DaySelector;
