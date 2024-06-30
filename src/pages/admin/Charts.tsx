import { Autocomplete, TextField } from '@mui/material';
// import SchedulesChart from '../../components/admin/charts/schedulesChart';
import { getEmployees } from '../../services';
import { useEffect, useState } from 'react';
import { EmployeesType } from '../../types';
import './Charts.css';
// import SalaryChart from '../../components/admin/charts/salaryChart';
import Loader from '../../components/client/loader/Loader';

const FILTERVALUES = {
  TYPEOFINFO: {
    SCHEDULES: 'Horarios',
    SALARY: 'Salario',
  },
  TIMERANGE: {
    ANNUAL: 'anual',
    MONTHLY: 'mensual',
  },
};

const Charts = () => {
  const uid = sessionStorage.getItem('uid');
  const [employees, setEmployees] = useState<EmployeesType[]>([]);
  const [filters, setFilters] = useState({
    employee: '',
    typeOfInfo: '',
    timeRange: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    getEmployees(uid)
      .then((res) => {
        setEmployees(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los empleados:', error);
      });
  }, [uid]);

  const employeeOptions = employees.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });
  const typeOfInfoOptions = [
    { name: FILTERVALUES.TYPEOFINFO.SCHEDULES },
    { name: FILTERVALUES.TYPEOFINFO.SALARY },
  ];
  const timeRangeOptions = [
    { name: FILTERVALUES.TIMERANGE.ANNUAL },
    { name: FILTERVALUES.TIMERANGE.MONTHLY },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeFIlters = (event: any, value: any) => {
    if (event.target.id.includes('employeeName')) {
      setFilters((prev) => ({ ...prev, employee: value.name }));
    }
    if (event.target.id.includes('typeOfInfo')) {
      setFilters((prev) => ({ ...prev, typeOfInfo: value.name }));
    }
    if (event.target.id.includes('timeRange')) {
      setFilters((prev) => ({ ...prev, timeRange: value.name }));
    }
  };

  const data1Ingreso = [
    { value: 9.56, time: 1642425322 }, // 10:00 AM
    //   { value: 10.02, time: 1642511722 },
    //   { value: 10.03, time: 1642598122 },
    { value: 10.16, time: 1642684522 },
    { value: 9.56, time: 1642770922 },
    { value: 9.59, time: 1642857322 },
    { value: 15.54, time: 1642943722 },
    { value: 15.59, time: 1643030122 },
    { value: 16.01, time: 1643116522 },
    { value: 16.16, time: 1643202922 },
  ];
  const data1Egreso = [
    { value: 14.15, time: 1642425322 }, // 10:00 AM
    //   { value: 10, time: 1642511722 },
    //   { value: 10, time: 1642598122 },
    { value: 14.35, time: 1642684522 },
    { value: 15.01, time: 1642770922 },
    { value: 15.05, time: 1642857322 },
    { value: 19, time: 1642943722 },
    { value: 19, time: 1643030122 },
    { value: 19, time: 1643116522 },
    { value: 19, time: 1643202922 },
  ];

  if (loading) {
    return (
      <div className="employeesContainer">
        <h1>Gráficos</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="employeesContainer">
      <h1>Gráficos</h1>
      {/* <SchedulesChart data1Ingreso={data1Ingreso} data1Egreso={data1Egreso} /> */}
      <div className="autocompleteContainer">
        <Autocomplete
          id="employeeName"
          options={employeeOptions.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.name}
          sx={{ width: 300 }}
          onChange={handleChangeFIlters}
          renderInput={(params) => <TextField {...params} label="Empleado" />}
        />
        {filters.employee && (
          <>
            {' '}
            <Autocomplete
              id="typeOfInfo"
              options={typeOfInfoOptions}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              onChange={handleChangeFIlters}
              //   defaultValue={typeOfInfoOptions[0]}
              renderInput={(params) => (
                <TextField {...params} label="Opciones" />
              )}
            />
            <Autocomplete
              id="timeRange"
              options={timeRangeOptions}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              onChange={handleChangeFIlters}
              //   defaultValue={timeRangeOptions[0]}
              renderInput={(params) => (
                <TextField {...params} label="Rango de tiempo" />
              )}
            />
          </>
        )}
      </div>
      {/* <BasicDatePicker /> */}
      {/* {filters.typeOfInfo === FILTERVALUES.TYPEOFINFO.SCHEDULES && (
        <SchedulesChart data1Ingreso={data1Ingreso} data1Egreso={data1Egreso} />
      )}
      {filters.typeOfInfo === FILTERVALUES.TYPEOFINFO.SALARY && (
        <SalaryChart data1Ingreso={data1Ingreso} data1Egreso={data1Egreso} />
      )} */}
    </div>
  );
};

export default Charts;
