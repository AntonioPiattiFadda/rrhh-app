// import { SetStateAction, useEffect, useState } from 'react';
// import Loader from '../../components/client/loader/Loader';
// import { DataGrid } from '@mui/x-data-grid';
// import { TextField, Typography, Container, Box } from '@mui/material';
// import { TimeRangeCellEdit } from '../../components/admin/TimeRangeCellEdit';
// import { ScheduleDataTableRowType } from '../../types';
// import { getEmployeeScheduleById } from '../../services';
// import {
//   formatWeeklySchedules,
//   getWeekSchedule,
// } from '../../utils/FormatDbSchedules';

// // import './Schedules.css';

// const Schedules = () => {
//   const [loading, setLoading] = useState(true);
//   const [selectedWeek, setSelectedWeek] = useState('2024-W25');
//   const [rows, setRows] = useState<ScheduleDataTableRowType[]>([]);
//   const uid = sessionStorage.getItem('uid');

//   useEffect(() => {
//     if (!uid) return;
//     setLoading(true);
//     getEmployeeScheduleById(uid)
//       .then((employee) => {
//         if (
//           employee &&
//           typeof employee !== 'string' &&
//           employee.name &&
//           employee.role
//         ) {
//           const weekSchedule = getWeekSchedule(selectedWeek, employee);
//           const formattedSchedules: {
//             Monday?: string;
//             Tuesday?: string;
//             Wednesday?: string;
//             Thursday?: string;
//             Friday?: string;
//             Saturday?: string;
//             Sunday?: string;
//           } = formatWeeklySchedules(weekSchedule);
//           const newRows = [
//             {
//               id: uid,
//               name: employee.name,
//               role: employee.role,
//               monday: formattedSchedules.Monday || 'S/A',
//               tuesday: formattedSchedules.Tuesday || 'S/A',
//               wednesday: formattedSchedules.Wednesday || 'S/A',
//               thursday: formattedSchedules.Thursday || 'S/A',
//               friday: formattedSchedules.Friday || 'S/A',
//               saturday: formattedSchedules.Saturday || 'S/A',
//               sunday: formattedSchedules.Sunday || 'S/A',
//             },
//           ];

//           setRows(newRows);
//           setLoading(false);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   }, [selectedWeek, uid]);

//   const columns = [
//     { field: 'name', headerName: 'Empleado', width: 150 },
//     {
//       field: 'monday',
//       headerName: 'Lunes',
//       width: 200,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'tuesday',
//       headerName: 'Martes',
//       width: 200,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'wednesday',
//       headerName: 'Miércoles',
//       width: 200,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'thursday',
//       headerName: 'Jueves',
//       width: 200,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'friday',
//       headerName: 'Viernes',
//       width: 200,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'saturday',
//       headerName: 'Sábado',
//       width: 150,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//     {
//       field: 'sunday',
//       headerName: 'Domingo',
//       width: 150,
//       editable: false,
//       renderEditCell: (params: {
//         id: string;
//         field: string;
//         value: string;
//         api: { updateRows: (arg0: { id: string; data: unknown }) => void };
//       }) => <TimeRangeCellEdit {...params} />,
//     },
//   ];

//   const handleWeekChange = (e: {
//     target: { value: SetStateAction<string> };
//   }) => {
//     setSelectedWeek(e.target.value);
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container className="schedulesSelectorContainer">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Mis horarios
//       </Typography>
//       <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
//         <Typography variant="h6" component="label" sx={{ marginRight: 2 }}>
//           Selecciona una semana:
//         </Typography>
//         <TextField
//           type="week"
//           value={selectedWeek}
//           onChange={handleWeekChange}
//         />
//       </Box>
//       <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
//         <DataGrid
//           rows={rows}
//           //FIXME - El TS quedo deshabilitado
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-expect-error
//           columns={columns}
//           pageSize={1}
//         />
//       </Box>
//     </Container>
//   );
// };

// export default Schedules;
