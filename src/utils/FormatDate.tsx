import { Timestamp } from 'firebase/firestore';

export const formatDate = (dateToFormat: Timestamp | Date | string | null) => {
  if (!dateToFormat) {
    return null;
  }

  let date;

  // Convertir el input a un objeto Date
  if (dateToFormat instanceof Timestamp) {
    date = dateToFormat.toDate();
  } else if (dateToFormat instanceof Date) {
    date = dateToFormat;
  } else if (typeof dateToFormat === 'string') {
    date = new Date(dateToFormat);
  } else {
    return null;
  }

  // Array con los nombres de los meses
  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  // Obtener los componentes de la fecha
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Construir la cadena con el formato "MMM DD YYYY"
  // const formattedDate = `${month} ${day
  //   .toString()
  //   .padStart(2, '0')} ${year}, hora ${hours}:${minutes
  //   .toString()
  //   .padStart(2, '0')}`;
  return {
    month,
    day,
    year,
    hours,
    minutes,
  };
};

export const formatAssemblyDate = (dateToFormat: Timestamp) => {
  if (!dateToFormat) {
    return null;
  }

  const date = dateToFormat.toDate();

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Construir la cadena con el formato "MMM DD YYYY"
  const formattedDate = `${day
    .toString()
    .padStart(2, '0')} de ${month} ${year}`;
  return formattedDate;
};

export const getYear = (dateToFormat: Timestamp) => {
  const { seconds } = dateToFormat;
  const date = new Date(seconds * 1000); // Convertir segundos a milisegundos

  const year = date.getFullYear();

  return year;
};

export const getPastMonths = (dateToFormat: Timestamp) => {
  const date = dateToFormat.toDate();

  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nacimiento: any = new Date(year, month, day);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hoy: any = new Date();

  let tiempoPasado = hoy - nacimiento;
  const segs = 1000;
  const mins = segs * 60;
  const hours = mins * 60;
  const days = hours * 24;
  const months = days * 30.416666666666668;
  const years = months * 12;

  //calculo
  const anos = Math.floor(tiempoPasado / years);
  tiempoPasado = tiempoPasado - anos * years;
  const meses = Math.floor(tiempoPasado / months);
  tiempoPasado = tiempoPasado - meses * months;
  // const dias = Math.floor(tiempoPasado / days);
  // tiempoPasado = tiempoPasado - dias * days;
  // const horas = Math.floor(tiempoPasado / hours);
  // tiempoPasado = tiempoPasado - horas * hours;
  // const minutos = Math.floor(tiempoPasado / mins);
  // tiempoPasado = tiempoPasado - minutos * mins;
  // let segundos = Math.floor(tiempoPasado / segs);

  // console.log(
  //   `Han pasado ${anos} años, ${meses} meses,  ${dias} dias, ${horas} horas, y ${minutos} minutos.`
  // );

  return meses;
};

interface InputTimestamps {
  [key: string]: Timestamp;
}

function getMonthYear(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes de 0 a 11, sumamos 1
  return `${year}-${month}`;
}

export function groupDatesByMonth(
  timestamps: InputTimestamps
): Record<string, { id: string; timestamp: Timestamp }[]> {
  const groupedDates: Record<string, { id: string; timestamp: Timestamp }[]> =
    {};

  Object.entries(timestamps).forEach(([id, timestamp]) => {
    const monthYear = getMonthYear(timestamp);
    if (!groupedDates[monthYear]) {
      groupedDates[monthYear] = [];
    }
    groupedDates[monthYear].push({ id, timestamp });
  });

  return groupedDates;
}
