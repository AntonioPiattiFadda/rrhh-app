import { useState } from 'react';

const EmployeeScheduleForm = ({ addSchedule }) => {
  const [employee, setEmployee] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addSchedule({ employee, day, startTime, endTime });
    setEmployee('');
    setDay('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Empleado:</label>
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Día:</label>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hora de Entrada:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hora de Salida:</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Agregar Horario</button>
    </form>
  );
};

export default EmployeeScheduleForm;
