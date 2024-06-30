import { getEmployeeById, insertDate } from '../../services';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import Loader from '../../components/client/loader/Loader';
import useGeoLocalization from '../../utils/useGeoLocalization';
import { EmployeesType } from '../../types';
import './Register.css';

const Home = () => {
  const [employee, setEmployee] = useState<EmployeesType>({
    id: '',
    nickname: '',
    password: '',
    role: '',
    name: '',
  });
  const [loading, setLoading] = useState(true);

  const isLocationAllowed = useGeoLocalization();
  console.log('isLocationAllowed', isLocationAllowed);
  const uid = window.sessionStorage.getItem('uid');

  useEffect(() => {
    if (!uid) return;
    getEmployeeById(uid)
      .then((res) => {
        setEmployee(res as EmployeesType);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los empleados:', error);
      });
  }, [uid]);

  const handleSendCode = async (instance: string) => {
    if (!employee) return;
    const employeePassword = employee.password;
    const employeeNickName = employee.nickname;

    Swal.fire({
      title: `Para registrar la ${
        instance === 'entry' ? 'entrada' : 'salida'
      } de ${employeeNickName}, por favor ingrese su codigo`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: async (code) => {
        try {
          // if (!isLocationAllowed) {
          //   Swal.showValidationMessage('No se ha permitido desde la ubicación');
          //   throw new Error('No se ha permitido desde la ubicación');
          // }
          if (employeePassword !== code) {
            Swal.showValidationMessage('Codigo incorrecto	');
            throw new Error('Codigo incorrecto');
          }
          if (!uid) {
            return;
          }
          const response = await insertDate(uid, instance);
          console.log('response', response);

          return response;
        } catch (error) {
          Swal.showValidationMessage(`
            ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Horario de ${employeeNickName} registrado correctamente`,
          // imageUrl: result.value.avatar_url,
        });
      }
    });
  };

  // const handleRegisterDate = async () => {
  if (loading) {
    return (
      <div className="homeContainer"> 
        {/* <Box
          className="insertNameForm"
          style={{
            width: '340px',
            height: '140px',
          }}
          component="form"
          noValidate
          autoComplete="off"
        > */}
        <Loader />
        {/* </Box> */}
      </div>
    );
  }

  return (
    <div className="homeContainer">
      <Box
        className="insertNameForm"
        component="form"
        noValidate
        autoComplete="off"
      >
        <label htmlFor="grouped-demo">{employee.name}</label>

        <div className="buttonContainer">
          <Button onClick={() => handleSendCode('entry')} variant="contained">
            Entrada
          </Button>
          <Button onClick={() => handleSendCode('end')} variant="outlined">
            Salida
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Home;
