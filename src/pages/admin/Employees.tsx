import { useEffect, useMemo, useState } from 'react';
import EmployeesTable from '../../components/admin/DataTable';
import './Employees.css';
import { getEmployeesSchedules } from '../../services';
import { Button } from '@mui/material';
import Loader from '../../components/client/loader/Loader';
import { DocumentData } from 'firebase/firestore';
import { groupSchedulesByMonth } from '../../utils/FormatDbSchedules';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
  nickname: string,
  password: string,
  role: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history?: any
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    nickname,
    password,
    role,
    history,
  };
}
const Employees = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [employees, setEmployees] = useState<DocumentData>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const uid = window.sessionStorage.getItem('uid');
  const rows: ReturnType<typeof createData>[] = useMemo(() => [], []);

  useEffect(() => {
    if (!uid) return;
    getEmployeesSchedules(uid)
      .then((res) => {
        setLoading(false);
        // console.log(res);

        setEmployees(res);
        res.map((employee) => {
          console.log(employee);

          const scheduleByMonth = groupSchedulesByMonth(
            employee,
            employee.hour_value
          );
          console.log(scheduleByMonth);

          const history: {
            date: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            totalHours: any;
            hourValue: string;
            totalMonthlyPayment?: number;
          }[] = [];
          scheduleByMonth.schedulesByMonth.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (schedule: { month: any; totalHours: any }) => {
              console.log(schedule);

              history.push({
                date: schedule.month,
                totalHours: schedule.totalHours,
                hourValue: employee.hour_value,
              });
            }
          );

          rows.push(
            createData(
              employee.name,
              356,
              16.0,
              49,
              3.9,
              1.5,
              employee.nickname,
              employee.password,
              employee.role,
              history
            )
          );
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error al obtener los horarios:', error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <div className="employeesContainer">
      <h1>Empleados</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <EmployeesTable rows={rows} />
          {employees.length ? (
            <Button
              style={{
                marginTop: '20px',
              }}
              type="submit"
              variant="contained"
            >
              {' '}
              Agregar empleado
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Employees;
