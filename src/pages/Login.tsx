import { useState } from 'react';
import './Login.css';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { login } from '../validator';
import z from 'zod';
import { Button, Box, TextField, FormLabel } from '@mui/material';
import { checkRole } from '../services';

// TODO Limpiar de console.log y refactorizar handleLogin

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const auth = getAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    try {
      login.parse(loginInfo);
      signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
        .then((userCredential) => {
          const user = userCredential.user;
          window.sessionStorage.setItem('uid', user.uid);
          checkRole(user.uid).then((res) => {
            if (res === 'admin') {
              window.location.href = '/admin/schedules';
            } else {
              window.location.href = '/client/register';
            }
          });
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          console.error('Error al iniciar sesión:', error);
        });
    } catch (error) {
      setErrors(error as z.ZodError);
      setTimeout(() => {
        setErrors(null);
      }, 3000);
    }
  };

  return (
    <div className="homeContainer">
      <Box
        className="insertForm"
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
      >
        {/* <h1>Login</h1> */}
        <FormLabel>Email</FormLabel>
        <TextField
          onChange={handleChange}
          name="email"
          error={errors?.issues[0]?.path[0] === 'email'}
          helperText={
            errors?.issues[0]?.path[0] === 'email' && errors?.issues[0]?.message
          }
        />
        <FormLabel>Password</FormLabel>
        <TextField
          onChange={handleChange}
          type="password"
          name="password"
          error={errors?.issues[0]?.path[0] === 'password'}
          helperText={
            errors?.issues[0]?.path[0] === 'password' &&
            errors?.issues[0]?.message
          }
        />

        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          className="loginButton"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
        {/* <Button variant="outlined">Salida</Button> */}
      </Box>
    </div>
  );
};

export default Login;
