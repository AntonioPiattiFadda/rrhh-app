const Dashboard = () => {
  const uid = sessionStorage.getItem('uid');
  console.log(uid);

  // getUserById(uid as string).then((user) => {
  //   console.log(user);
  // });

  return (
    <div className="employeesContainer">
      <h1>Inicio</h1>
      {/* <ChartComponent /> */}
    </div>
  );
};

export default Dashboard;
