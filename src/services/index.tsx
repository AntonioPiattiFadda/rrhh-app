import { db } from '../../firebaseConfig';
import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { formatDate } from '../utils/FormatDate';
import { EmployeesType } from '../types';

export const checkRole = async (userId: string) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDoc);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.role;
    } else {
      return 'No se encontró el usuario';
    }
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    throw error;
  }
};

export const getEmployeeById = async (employeeId: string) => {
  try {
    const employeeDoc = doc(db, 'employees', employeeId);
    const employeeDocSnap = await getDoc(employeeDoc);

    if (employeeDocSnap.exists()) {
      return employeeDocSnap.data();
    } else {
      console.error('No se encontró el empleado');
      throw new Error('No se encontró el empleado');
    }
  } catch (error) {
    console.error('Error al obtener el empleado:', error);
    throw error;
  }
};

export const getEmployeeScheduleById = async (employeeId: string) => {
  let employeeSchedule: DocumentData = {};
  try {
    const employeeDocRef = doc(db, 'employees', employeeId);
    const employeeDoc = await getDoc(employeeDocRef);
    if (employeeDoc.exists()) {
      const userRef = employeeDoc.data().userRef;
      if (userRef) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userEmployeeDocRef = doc(
            db,
            `users/${userDoc.id}/employees`,
            employeeId
          );
          const userEmployeeDoc = await getDoc(userEmployeeDocRef);
          if (userEmployeeDoc.exists()) {
            const employeeData = userEmployeeDoc.data();
            employeeSchedule = employeeData;
            return employeeSchedule;
          } else {
            return 'No se encontró el horario del empleado';
          }
        } else {
          console.log('No such user document');
        }
      } else {
        console.log('No userRef field found in the employee document');
      }
    } else {
      console.log('No such employee document');
    }
  } catch (error) {
    console.error('Error al insertar la hora:', error);
    throw error;
  }
};

export const insertDate = async (employeeId: string, instance: string) => {
  console.log(employeeId);

  const actualDate = Timestamp.now();
  const formattedDate = formatDate(actualDate);

  if (formattedDate) {
    const { year, month, day } = formattedDate;
    const fieldName = `${instance}_${year}_${month}_${day}`;
    try {
      // Get the employee document
      const employeeDocRef = doc(db, 'employees', employeeId);
      const employeeDoc = await getDoc(employeeDocRef);

      if (employeeDoc.exists()) {
        console.log(fieldName);
        const userRef = employeeDoc.data().userRef;
        if (userRef) {
          console.log(`User reference found: ${userRef}`);

          // Fetch the user document using userRef
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            console.log(`User document found: ${userDoc.id}`);

            // Access the employees sub-collection within the user document
            const userEmployeeDocRef = doc(
              db,
              `users/${userDoc.id}/employees`,
              employeeId
            );
            const userEmployeeDoc = await getDoc(userEmployeeDocRef);

            if (userEmployeeDoc.exists()) {
              const employeeData = userEmployeeDoc.data();
              if (fieldName in employeeData) {
                const errorMessage =
                  instance === 'entry'
                    ? 'Ya has registrado tu entrada'
                    : 'Ya has registrado tu salida';
                throw new Error(errorMessage);
              } else {
                await updateDoc(userEmployeeDocRef, {
                  [fieldName]: actualDate,
                });
                return 'Hora insertada correctamente';
              }
            } else {
              await setDoc(userEmployeeDocRef, {
                [fieldName]: actualDate,
              });
              return 'Hora insertada correctamente';
            }
          } else {
            console.log('No such user document');
          }
        } else {
          console.log('No userRef field found in the employee document');
        }
      } else {
        console.log('No such employee document');
      }
    } catch (error) {
      console.error('Error al insertar la hora:', error);
      throw error;
    }
  }
};

// export const insertDate = async (
//   userId: string,
//   employeeId: string,
//   instance: string
// ) => {
//   const actualDate = Timestamp.now();
//   const formattedDate = formatDate(actualDate);
//   let scheduleNewRefInfo;
//   if (formattedDate) {
//     scheduleNewRefInfo = `${formattedDate.year}`;
//     try {
//       const dateDoc = doc(
//         db,
//         'users',
//         userId,
//         'employees',
//         employeeId,
//         'schedules',
//         scheduleNewRefInfo
//       );
//       const dateSnapshot = await getDoc(dateDoc);
//       if (dateSnapshot.exists()) {
//         const dateRef = dateSnapshot.data();
//         if (
//           `${instance}_${formattedDate.month}_${formattedDate.day}` in dateRef
//         ) {
//           const errorMessage =
//             instance === 'entry'
//               ? 'Ya has registrado tu entrada'
//               : 'Ya has registrado tu salida';
//           throw new Error(errorMessage);
//         } else {
//           await updateDoc(dateDoc, {
//             [`${instance}_${formattedDate.month}_${formattedDate.day}`]:
//               actualDate,
//           });
//         }
//       } else {
//         await setDoc(dateDoc, {
//           [`${instance}_${formattedDate.month}_${formattedDate.day}`]:
//             actualDate,
//         });
//       }
//       //NOTE - Agregar un mensaje personalizado con el nickName
//       return 'Hora insertada correctamente';
//     } catch (error) {
//       console.error('Error al insertar la hora:', error);
//       throw error;
//     }
//   }
// };

export const getEmployees = async (userId: string) => {
  try {
    const employeesCol = collection(db, 'users', userId, 'employees');
    const employeesSnapshot = await getDocs(employeesCol);
    const employees: EmployeesType[] = [];
    employeesSnapshot.forEach((doc) => {
      employees.push({
        name: '',
        role: '',
        nickname: '',
        password: '',
        ...doc.data(),
        id: doc.id,
      });
    });
    return employees;
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw error;
  }
};

export const getEmployeesSchedules = async (userId: string) => {
  try {
    const employees: DocumentData[] = [];

    const employeesCol = collection(db, 'users', userId, 'employees');
    const employeesSnapshot = await getDocs(employeesCol);

    // Iterar sobre cada empleado
    employeesSnapshot.forEach((docEmp) => {
      // Obtener los datos básicos del empleado
      const employeeData = docEmp.data();

      // Agregar el ID del empleado a los datos
      employeeData.id = docEmp.id;

      // Agregar los datos del empleado al array de empleados
      employees.push(employeeData);
    });

    return employees;
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw error;
  }
};

// export const getEmployeesSchedules = async (userId: string) => {
//   try {
//     eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let schedules: any[] = [];
//     const employeesCol = collection(db, 'users', userId, 'employees');
//     const employeesSnapshot = await getDocs(employeesCol);

//     const schedulePromises = employeesSnapshot.docs.map(async (docEmp) => {
//       const schedulesCol = collection(employeesCol, docEmp.id, 'schedules');
//       const schedulesSnapshot = await getDocs(schedulesCol);

//       const employeeSchedules = schedulesSnapshot.docs.map((docSch) => {
//         const data = docSch.data();
//         const gruopedDates = groupDatesByMonth(data);

//         return {
//           name: '',
//           nickname: '',
//           password: '',
//           ...docEmp.data(),
//           id: docEmp.id,
//           schedules: [{ ...gruopedDates }],
//         };
//       });
//       const reducedSchedules = employeeSchedules.reduce((acc, curr) => {
//         const found = acc.find((item) => item.id === curr.id);
//         if (found) {
//           found.schedules.push(curr.schedules[0]);
//         } else {
//           acc.push(curr);
//         }
//         return acc;
//       }, []);
//       console.log(reducedSchedules);

//       return reducedSchedules;
//     });

//     const allSchedules = await Promise.all(schedulePromises);
//     allSchedules.forEach((employeeSchedules) => {
//       schedules = schedules.concat(employeeSchedules);
//     });

//     return schedules;
//   } catch (error) {
//     console.error('Error al obtener los horarios:', error);
//     throw error;
//   }
// };

type WeeklyScheduleType = {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

export const updateEmployeeSchedulesByWeek = async (
  usedId: string,
  employeesSchedule: WeeklyScheduleType[]
) => {
  console.log(usedId, employeesSchedule);

  try {
    const employeesCol = collection(db, 'users', usedId, 'employees');
    const employeesSnapshot = await getDocs(employeesCol);

    // Create a map from employeesSchedule array for quick lookup
    const scheduleMap = employeesSchedule.reduce((acc, employeeSchedule) => {
      const [employeeId, schedule] = Object.entries(employeeSchedule)[0];
      acc[employeeId] = schedule;
      return acc;
    }, {});
    console.log(scheduleMap);

    employeesSnapshot.forEach(async (docEmp) => {
      const employeeId = docEmp.id;
      if (scheduleMap[employeeId]) {
        const employeeDoc = doc(employeesCol, employeeId);
        await updateDoc(employeeDoc, {
          ...scheduleMap[employeeId],
        });
      }
    });

    return 'Horarios actualizados correctamente';
  } catch (error) {
    console.error('Error al actualizar los horarios:', error);
    throw error;
  }
};
