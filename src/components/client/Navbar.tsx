import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { CgGym } from 'react-icons/cg';

const ClientNavbar = () => {
  const location = useLocation();
  if (!location.pathname.includes('client')) {
    return null;
  }

  return (
    <div className="navContainer">
      <nav className="navbar">
        <Link to={`/admin/dashboard`}>
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.zxZa32HCrzcGdbiwJ3RwtAHaHZ&pid=Api&P=0&h=180"
            alt="Logo"
            className="navLogo"
          />
        </Link>
        <ul>
          {/* <li>
            <Link
              style={{
                color:
                  location.pathname === `/admin/dashboard`
                    ? '#397cbb'
                    : 'black',
              }}
              to={`/admin/dashboard`}
            >
              Inicio
            </Link>
          </li> */}
          <li>
            <Link
              style={{
                color:
                  location.pathname === `/client/register`
                    ? '#397cbb'
                    : 'black',
              }}
              to={`/client/register`}
            >
              Registrarme
            </Link>
          </li>
          {/* <li>
            <Link
              style={{
                color:
                  location.pathname === `/admin/graphics` ? '#397cbb' : 'black',
              }}
              to={`/admin/graphics`}
            >
              Gráficos
            </Link>
          </li> */}
          <li>
            <Link
              style={{
                color:
                  location.pathname === `/client/schedules`
                    ? '#397cbb'
                    : 'black',
              }}
              to={`/client/schedules`}
            >
              Mis Horarios
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="navbarMobile">
        <div className="navbar-left">
          <Link
            style={{
              color: location.pathname === `/admin/login` ? 'black' : 'red',
            }}
            to={`/admin/login`}
          >
            <IoHomeOutline />
            <p>{location.pathname === `/admin/login` ? 'Inicio' : ''}</p>
          </Link>
        </div>
        <div className="navbar-center">
          <div className="navbar-icon">
            <Link
              style={{
                color:
                  location.pathname === `/admin/dashboard` ? 'black' : 'red',
              }}
              to={`/admin/dashboard`}
            >
              {' '}
              <CgGym />
              <p>
                {location.pathname === `/admin/dashboard` ? 'Plan' : ''}
              </p>{' '}
            </Link>
          </div>
        </div>
        {/* <div className="navbar-right">
        <Link
          style={{
            color:
              location.pathname === `/graphics/${clientId}` ? 'black' : 'grey',
          }}
          to={`/graphics/${clientId}`}
        >
          {' '}
          <IoIosStats />{' '}
          <p>
            {location.pathname === `/graphics/${clientId}` ? 'graphics' : ''}
          </p>
        </Link>
      </div> */}
      </nav>
    </div>
  );
};

export default ClientNavbar;
