import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
// import { IoIosStats } from 'react-icons/io';
import { IoHomeOutline } from 'react-icons/io5';
import { CgGym } from 'react-icons/cg';

const ClientNavbar = () => {
  const location = useLocation();

  if (location.pathname.includes('admin')) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          style={{
            color: location.pathname === `/cli/home` ? 'black' : 'grey',
          }}
          to={`/cli/home`}
        >
          <IoHomeOutline />
          <p>{location.pathname === `/cli/home` ? 'Inicio' : ''}</p>
        </Link>
      </div>
      <div className="navbar-center">
        <div className="navbar-icon">
          <Link
            style={{
              color: location.pathname === `/cli/patient` ? 'black' : 'grey',
            }}
            to={`/cli/patient`}
          >
            {' '}
            <CgGym />
            <p>{location.pathname === `/cli/patient` ? 'Plan' : ''}</p>{' '}
          </Link>
        </div>
      </div>
      {/* <div className="navbar-right">
        <Link
          style={{
            color:
              location.pathname === `/graphics/${cliId}` ? 'black' : 'grey',
          }}
          to={`/graphics/${cliId}`}
        >
          {' '}
          <IoIosStats />{' '}
          <p>
            {location.pathname === `/graphics/${cliId}` ? 'graphics' : ''}
          </p>
        </Link>
      </div> */}
    </nav>
  );
};

export default ClientNavbar;
