import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

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
        <ul>
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

          <li>
            <Link to={`/admin/dashboard`}>
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.zxZa32HCrzcGdbiwJ3RwtAHaHZ&pid=Api&P=0&h=180"
                alt="Logo"
                className="navLogo"
              />
            </Link>
          </li>

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
    </div>
  );
};

export default ClientNavbar;
