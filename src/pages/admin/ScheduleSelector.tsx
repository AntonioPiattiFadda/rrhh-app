import { SetStateAction, useEffect, useState } from 'react';
import { getEmployees, updateEmployeeSchedulesByWeek } from '../../services';
import Loader from '../../components/client/loader/Loader';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Typography, Box, Button } from '@mui/material';
import ScheduleChart from '../../components/admin/ScheduleChart';
import { TimeRangeCellEdit } from '../../components/admin/TimeRangeCellEdit';
import DaySelector from '../../components/admin/DaySelector';
import { ScheduleDataTableRowType, WeeklyScheduleType } from '../../types';
import {
  formatForDbWeeklySchedules,
  formatWeeklySchedules,
  getWeekSchedule,
} from '../../utils/FormatDbSchedules';
import './ScheduleSelector.css';
import { getCurrentWeek } from '../../utils';

const ScheduleSelector = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<WeeklyScheduleType[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('2024-W25');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [rows, setRows] = useState<ScheduleDataTableRowType[]>([]);
  const [isDataModified, setIsDataModified] = useState(false);
  const uid = sessionStorage.getItem('uid');
  useEffect(() => {
    const currentWeek = getCurrentWeek();
    setSelectedWeek(currentWeek);
  }, []);
  //NOTE - Rows y Schedules tiene la misma informacion por el ultimo cambio en la logica hecho

  useEffect(() => {
    if (!uid) return;
    getEmployees(uid)
      .then((res) => {
        console.log(res);

        setLoading(false);
        const newSchedules = res.map((employee) => {
          const weekSchedule = getWeekSchedule(selectedWeek, employee);
          const formattedSchedules = formatWeeklySchedules(weekSchedule);
          console.log('formattedSchedules', formattedSchedules);
          return {
            id: employee.id,
            name: employee.name,
            role: employee.role,
            schedule: formattedSchedules,
          };
        });
        setSchedules(newSchedules);
        console.log('newSchedules', newSchedules);

        const newRows = newSchedules.map((employee: WeeklyScheduleType) => {
          return {
            id: employee.id,
            name: employee.name,
            role: employee.role,
            monday: employee.schedule.Monday || 'S/A',
            tuesday: employee.schedule.Tuesday || 'S/A',
            wednesday: employee.schedule.Wednesday || 'S/A',
            thursday: employee.schedule.Thursday || 'S/A',
            friday: employee.schedule.Friday || 'S/A',
            saturday: employee.schedule.Saturday || 'S/A',
            sunday: employee.schedule.Sunday || 'S/A',
          };
        });
        setRows(newRows);
      })
      .catch((error) => {
        console.error('Error al obtener los empleados:', error);
      });
  }, [selectedWeek, uid]);

  const columns = [
    { field: 'name', headerName: 'Empleado', width: 150 },
    {
      field: 'monday',
      headerName: 'Lunes',
      width: 200,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'tuesday',
      headerName: 'Martes',
      width: 200,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'wednesday',
      headerName: 'Miércoles',
      width: 200,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'thursday',
      headerName: 'Jueves',
      width: 200,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'friday',
      headerName: 'Viernes',
      width: 200,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'saturday',
      headerName: 'Sábado',
      width: 150,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
    {
      field: 'sunday',
      headerName: 'Domingo',
      width: 150,
      editable: true,
      renderEditCell: (params: {
        id: string;
        field: string;
        value: string;
        api: { updateRows: (arg0: { id: string; data: unknown }) => void };
      }) => (
        <TimeRangeCellEdit
          handleCellEditCommit={handleCellEditCommit}
          {...params}
        />
      ),
    },
  ];

  let debounceTimeout: NodeJS.Timeout;
  const handleCellEditCommit = (params: {
    id: string;
    field: string;
    value: string;
  }) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      const updatedSchedules = [...schedules];
      const index: number = updatedSchedules.findIndex(
        (row) => row.id === params.id
      );
      if (index > -1) {
        //FIXME - El TS quedo deshabilitado
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedSchedules[index].schedule[
          params.field.charAt(0).toUpperCase() + params.field.slice(1)
        ] = params.value;
        setRows(
          updatedSchedules.map((employee) => ({
            id: employee.id,
            name: employee.name,
            role: employee.role,
            monday: employee.schedule.Monday || 'S/A',
            tuesday: employee.schedule.Tuesday || 'S/A',
            wednesday: employee.schedule.Wednesday || 'S/A',
            thursday: employee.schedule.Thursday || 'S/A',
            friday: employee.schedule.Friday || 'S/A',
            saturday: employee.schedule.Saturday || 'S/A',
            sunday: employee.schedule.Sunday || 'S/A',
          }))
        );
        setSchedules(updatedSchedules);
        setIsDataModified(true);
      }
    }, 500);
  };

  const handleSaveChanges = () => {
    console.log(schedules);
    const formattedForDbWeeklySchedules = formatForDbWeeklySchedules(
      schedules,
      selectedWeek
    );
    console.log(formattedForDbWeeklySchedules);

    if (!uid) return;
    updateEmployeeSchedulesByWeek(uid, formattedForDbWeeklySchedules)
      .then(() => {
        setIsDataModified(false);
        alert('Cambios guardados exitosamente');
      })
      .catch((error) => {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios');
      });
  };

  const handleDayChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedDay(e.target.value);
  };

  const handleWeekChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    if (isDataModified) {
      const confirmChange = window.confirm(
        'No has guardado los cambios para esta semana. Quieres irte sin guardar?'
      );
      if (!confirmChange) {
        return;
      }
    }
    setIsDataModified(false);
    setSelectedWeek(e.target.value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="schedulesSelectorContainer" >
      <Typography variant="h4" component="h1" gutterBottom>
        Selector de Horarios
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" component="label" sx={{ marginRight: 2 }}>
          Selecciona una semana:
        </Typography>
        <TextField
          type="week"
          value={selectedWeek}
          onChange={handleWeekChange}
        />
        {isDataModified && (
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            onClick={handleSaveChanges}
          >
            Aceptar cambios
          </Button>
        )}
      </Box>
      <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          //FIXME - El TS quedo deshabilitado
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          columns={columns}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
        <DaySelector
          selectedDay={selectedDay}
          handleDayChange={handleDayChange}
        />
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <ScheduleChart
          //FIXME - El TS quedo deshabilitado
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          schedules={rows}
          selectedDay={selectedDay}
        />
      </Box>
    </div>
  );
};

export default ScheduleSelector;
