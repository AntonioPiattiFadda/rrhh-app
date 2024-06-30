import { DocumentData, Timestamp } from 'firebase/firestore';
import { WeeklyScheduleType } from '../types';

interface EmployeeInfo {
  name: string;
  nickname: string;
  role: string;
  password: string;
  id: string;
}

interface Schedule {
  date: Date;
  type: 'entry' | 'end';
}

interface MonthlySummary {
  month: string;
  schedules: Schedule[];
  totalHours: number;
  totalMinutes: number;
  totalPay: number;
}

export const groupSchedulesByMonth = (
  employee: DocumentData,
  hourlyRate: number
) => {
  // Obtener la información básica del empleado
  const employeeInfo: EmployeeInfo = {
    name: employee.name,
    nickname: employee.nickname,
    role: employee.role,
    password: employee.password,
    id: employee.id,
  };

  // Objeto para almacenar los horarios organizados por mes
  const monthsMap: { [key: string]: MonthlySummary } = {};

  // Iterar sobre las propiedades del objeto employee
  for (const key in employee) {
    if (key.startsWith('entry') || key.startsWith('end')) {
      const timestamp = employee[key];

      if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate(); // Convertir el Timestamp a un objeto Date

        // Ajustar la zona horaria a UTC-3
        date.setUTCHours(date.getUTCHours() - 3); // Ajuste para UTC-3

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Mes como número (1-12)

        const monthKey = `${year}-${month.toString().padStart(2, '0')}`; // Formato 'YYYY-MM'

        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = {
            month: monthKey,
            schedules: [],
            totalHours: 0,
            totalMinutes: 0,
            totalPay: 0,
          };
        }

        monthsMap[monthKey].schedules.push({
          date: date,
          type: key.startsWith('entry') ? 'entry' : 'end',
        });
      }
    }
  }

  // Calcular horas totales y valor a liquidar por cada mes
  Object.values(monthsMap).forEach((summary) => {
    const { schedules } = summary;

    const { totalHours, totalMinutes } =
      calculateTotalHoursAndMinutes(schedules);
    summary.totalHours = totalHours;
    summary.totalMinutes = totalMinutes;
    summary.totalPay = calculatePay(totalHours, totalMinutes, hourlyRate);
  });

  // Construir el objeto de retorno
  const result = {
    ...employeeInfo,
    schedulesByMonth: Object.values(monthsMap),
  };

  return result;
};

const calculateTotalHoursAndMinutes = (
  schedules: Schedule[]
): { totalHours: number; totalMinutes: number } => {
  let totalHours = 0;
  let totalMinutes = 0;

  // Primero agrupar los schedules por día
  const dailySchedules: {
    [key: string]: { entryTime: Date | null; endTime: Date | null };
  } = {};

  schedules.forEach((schedule) => {
    const dateKey = schedule.date.toISOString().split('T')[0]; // Usar la fecha como clave (YYYY-MM-DD)
    if (!dailySchedules[dateKey]) {
      dailySchedules[dateKey] = { entryTime: null, endTime: null };
    }

    if (schedule.type === 'entry') {
      dailySchedules[dateKey].entryTime = schedule.date;
    } else if (schedule.type === 'end') {
      dailySchedules[dateKey].endTime = schedule.date;
    }
  });

  // Calcular las horas y minutos totales por día
  Object.keys(dailySchedules).forEach((dateKey) => {
    const { entryTime, endTime } = dailySchedules[dateKey];

    if (entryTime && endTime) {
      const entryTimeMillis = entryTime.getTime();
      const endTimeMillis = endTime.getTime();
      const diffMillis = endTimeMillis - entryTimeMillis;

      if (diffMillis > 0) {
        const diffMinutes = diffMillis / (1000 * 60); // Convertir a minutos

        totalHours += Math.floor(diffMinutes / 60); // Sumar las horas completas
        totalMinutes += diffMinutes % 60; // Sumar los minutos restantes
      }
    }
  });

  // Redondear totalMinutes a dos decimales
  totalMinutes = Math.round(totalMinutes * 100) / 100;

  // Ajustar los minutos si superan 60
  if (totalMinutes >= 60) {
    const additionalHours = Math.floor(totalMinutes / 60);
    totalHours += additionalHours;
    totalMinutes -= additionalHours * 60;
  }

  // Redondear totalHours a dos decimales
  totalHours = Math.round(totalHours * 100) / 100;

  return { totalHours, totalMinutes };
};

// Función para calcular el valor a liquidar basado en las horas y minutos trabajados
const calculatePay = (
  totalHours: number,
  totalMinutes: number,
  hourlyRate: number
): number => {
  const totalHoursDecimal = totalHours + totalMinutes / 60;
  return totalHoursDecimal * hourlyRate;
};

export function getWeekSchedule(
  week: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  employee: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [day: string]: any[] } {
  // Crear un objeto para almacenar los horarios por día de la semana
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const weekSchedule: { [day: string]: any[] } = {};

  // Definir una expresión regular para encontrar fechas de entrada y salida en el formato `schedule_in_<date>` y `schedule_out_<date>`
  const scheduleRegex = /schedule_(in|out)_(\d{4}-\d{2}-\d{2})/;

  // Recorrer todas las claves del objeto `employee`
  Object.keys(employee).forEach((key) => {
    console.log(key);

    // Intentar hacer coincidir cada clave con la expresión regular
    const match = key.match(scheduleRegex);
    console.log(match);

    if (match) {
      // Extraer el tipo de horario (entrada o salida) y la fecha de la clave
      const [, type] = match;

      // Convertir la fecha a un objeto `Date`
      const timestamp = employee[key];

      const timeStampToDate = timestamp.toDate();

      const dateObj = new Date(timeStampToDate);
      dateObj.setUTCHours(dateObj.getUTCHours() - 3); // Ajuste para UTC-3
      // La informacion que llega a dateObj es: new Date('2024-06-22T08:00:00.000Z')hasta aqui todo bien
      // Calcular el número de la semana correspondiente a la fecha
      const year = dateObj.getUTCFullYear();
      const month = dateObj.getUTCMonth();
      const day = dateObj.getUTCDate();

      const targetDate = new Date(Date.UTC(year, month, day));

      const dayNumber = (targetDate.getUTCDay() + 6) % 7; // Ajustar para que el lunes sea 0

      targetDate.setUTCDate(targetDate.getUTCDate() - dayNumber + 3); // Ajustar al jueves de la semana actual
      const firstThursday = targetDate.getTime();
      targetDate.setUTCMonth(0, 1); // Establecer al 1 de enero
      if (targetDate.getUTCDay() !== 4) {
        // Si no es jueves
        targetDate.setUTCMonth(0, 1 + ((4 - targetDate.getUTCDay() + 7) % 7)); // Ajustar al primer jueves
      }
      const weekNumber =
        1 +
        Math.round(
          (firstThursday - targetDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );

      // Crear la clave para el año y semana en el formato `YYYY-Www`
      const weekKey = `${year}-W${String(weekNumber).padStart(2, '0')}`;

      // Verificar si la semana coincide con la semana solicitada
      if (weekKey === week) {
        // Obtener el día de la semana (lunes, martes, etc.)
        const dayOfWeek = dateObj.toLocaleDateString('en-EN', {
          weekday: 'long',
        });

        // Verificar si el día de la semana ya existe en `weekSchedule`, si no, inicializarlo como un array vacío
        if (!weekSchedule[dayOfWeek]) {
          weekSchedule[dayOfWeek] = [];
        }

        // Agregar el horario (entrada o salida) al array correspondiente del día de la semana
        weekSchedule[dayOfWeek].push({ type, time: employee[key] });
      }
    }
  });

  // Devolver el objeto con los horarios agrupados por día de la semana
  return weekSchedule;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatWeeklySchedules(data: any) {
  const horariosPorDia: { [day: string]: string } = {};
  // console.log(data);

  // Definir un array con los nombres de los días de la semana
  const diasSemana = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Iterar sobre cada día de la semana
  diasSemana.forEach((day) => {
    const entries = data[day];

    // Verificar si hay entradas para este día
    if (entries && entries.length > 0) {
      // Ordenar las entradas por tipo y luego por tiempo
      entries.sort(
        (
          a: { type: string; time: { seconds: number } },
          b: { type: string; time: { seconds: number } }
        ) => {
          if (a.type === 'in' && b.type === 'out') return -1;
          if (a.type === 'out' && b.type === 'in') return 1;
          return a.time.seconds - b.time.seconds;
        }
      );

      // Construir el string con los horarios en el formato deseado
      let horarioString = '';
      let startTime = '';
      let endTime = '';

      entries.forEach((entry: { type: string; time: { seconds: number } }) => {
        if (entry.type === 'in') {
          startTime = new Date(entry.time.seconds * 1000).toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          );
        } else if (entry.type === 'out') {
          endTime = new Date(entry.time.seconds * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      });

      // Formatear el string en el formato 'HH:mm - HH:mm'
      if (startTime && endTime) {
        horarioString = `${startTime} - ${endTime}`;
      }

      // Guardar el string de horarios en el objeto resultado
      horariosPorDia[day] = horarioString;
    } else {
      // Si no hay entradas para este día, asignar 'S/A'
      horariosPorDia[day] = 'S/A';
    }
  });

  return horariosPorDia;
}

export function formatForDbWeeklySchedules(
  schedules: WeeklyScheduleType[],
  selectedWeek: string
) {
  // console.log(schedules, selectedWeek);

  const formattedSchedules: { [x: string]: { [x: string]: Timestamp } }[] = [];

  // Extract year and week number from the selected week
  const [yearStr, weekNumberStr] = selectedWeek.split('-W');
  const year = parseInt(yearStr, 10);
  const weekNumber = parseInt(weekNumberStr, 10);

  // Get the first day of the selected week
  const firstDayOfWeek = getFirstDayOfWeekIso(year, weekNumber);
  // console.log(firstDayOfWeek);

  // Loop through all employees in the schedules
  for (const employee of schedules) {
    // console.log(employee);

    // Loop through each day of the week in the employee's schedule
    for (const day in employee.schedule) {
      // console.log(day);

      // eslint-disable-next-line no-prototype-builtins
      if (employee.schedule.hasOwnProperty(day)) {
        //FIXME - El TS quedo deshabilitado
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const scheduleValue = employee.schedule[day];
        // console.log(day, scheduleValue);

        // Check if the schedule is not 'S/A' or empty ''
        if (scheduleValue !== 'S/A' && scheduleValue !== '') {
          // Split the schedule into start and end times
          const [startTime, endTime] = scheduleValue.split(' - ');

          // Get the day number (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
          const dayNumber = getDayNumber(day);

          // Calculate the date for the current day of the week
          const currentDay = new Date(firstDayOfWeek);
          currentDay.setDate(firstDayOfWeek.getDate() + dayNumber);

          // Format the start and end times with the date
          const startTimeDate = formatDateWithTime(
            year,
            currentDay.getMonth(),
            currentDay.getDate(),
            startTime
          );
          const endTimeDate = formatDateWithTime(
            year,
            currentDay.getMonth(),
            currentDay.getDate(),
            endTime
          );
          // console.log(startTimeDate, endTimeDate);

          // Create the keys for schedule_in and schedule_out
          const scheduleInKey = `schedule_in_${getFormattedDate(currentDay)}`;
          const scheduleOutKey = `schedule_out_${getFormattedDate(currentDay)}`;

          // Convert the start and end times to Firebase Timestamps
          const startTimeDateToTimestamp = Timestamp.fromDate(
            new Date(startTimeDate)
          );
          const endTimeDateToTimestamp = Timestamp.fromDate(
            new Date(endTimeDate)
          );

          const employeeID = employee.id;

          // Check if the employeeID already exists in formattedSchedules
          const existingSchedule = formattedSchedules.find(
            (schedule) => schedule[employeeID]
          );

          if (existingSchedule) {
            // Employee ID exists, update the existing schedule
            existingSchedule[employeeID][scheduleInKey] =
              startTimeDateToTimestamp;
            existingSchedule[employeeID][scheduleOutKey] =
              endTimeDateToTimestamp;
          } else {
            // Employee ID does not exist, push a new schedule
            formattedSchedules.push({
              [employeeID]: {
                [scheduleInKey]: startTimeDateToTimestamp,
                [scheduleOutKey]: endTimeDateToTimestamp,
              },
            });
          }
        }
      }
    }
  }

  return formattedSchedules;
}

// Function to get the day number (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
function getDayNumber(day: string) {
  const daysMap: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
  return daysMap[day];
}

function getFirstDayOfWeekIso(year: number, weekNumber: number) {
  // Create a date object for January 4th of the given year
  const jan4 = new Date(year, 0, 4);

  // Find the nearest Thursday to determine the first week of the year
  const dayOfWeek = jan4.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const nearestThursday = new Date(jan4);
  nearestThursday.setDate(jan4.getDate() - ((dayOfWeek + 6) % 7) + 3);

  // Calculate the first day of the target week
  const firstDayOfYear = nearestThursday;
  const firstDayOfWeek = new Date(firstDayOfYear);
  firstDayOfWeek.setDate(
    firstDayOfYear.getDate() +
      (weekNumber - 1) * 7 -
      (firstDayOfYear.getDay() - 1)
  );

  // Adjust to ensure the first day of the week is Monday
  firstDayOfWeek.setDate(
    firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() - 1)
  );

  return firstDayOfWeek;
}

// Function to get the formatted date in YYYY-MM-DD
function getFormattedDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to format the date with time in the desired format
function formatDateWithTime(
  year: number,
  month: number,
  day: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: { split: (arg0: string) => [any, any] }
) {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}:00`;
}

// Function to extract date from a string
// function extractDateFromString(dateTimeString: string) {
//   const delimiterIndex = dateTimeString.search(/[^0-9-]/);
//   if (delimiterIndex === -1) {
//     return dateTimeString;
//   }
//   return dateTimeString.slice(0, delimiterIndex);
// }
