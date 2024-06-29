import './ScheduleChart.css';

interface ScheduleChartProps {
  schedules: {
    name: string;
    role: string;
    [key: string]: string;
  }[];
  selectedDay: string;
}

const ScheduleChart = ({ schedules, selectedDay }: ScheduleChartProps) => {
  const timeToPercentage = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours * 60 + minutes) / 1440) * 100;
  };

  const generateHourLabels = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      hours.push(`${hour}:00`);
    }
    return hours;
  };

  const hourLabels = generateHourLabels();

  // Define colores para cada rol
  const roleColors: { [key: string]: string } = {
    cocina: '#9ad3bc',
    barista: '#f7cac9',
    caja: '#f9f586',
    runner: '#b5d0eb',
    batistaCocina: '#f7cac9',

  };

  return (
    <div className="schedule-chart">
      {schedules.map((schedule, index) => {
        const [start, end] = schedule[selectedDay]
          ? schedule[selectedDay].split(' - ')
          : [null, null];
        const startPercentage = start ? timeToPercentage(start) : 0;
        const endPercentage = end ? timeToPercentage(end) : 100;

        // Obtener el color basado en el rol
        const roleColor = roleColors[schedule.role] || '#cccccc';

        return (
          <div key={index} className="schedule-row">
            <div className="schedule-name">
              <div
                className="role-label"
                style={{ backgroundColor: roleColor }}
              >
                {schedule.role}
              </div>
              <div className="employee-name">{schedule.name}</div>
            </div>
            <div className="schedule-bar-container">
              {[...Array(24)].map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  className="hour-line"
                  style={{ left: `${hourIndex * (100 / 24)}%` }}
                ></div>
              ))}
              {start && end && (
                <div
                  className="schedule-bar"
                  style={{
                    left: `${startPercentage}%`,
                    width: `${endPercentage - startPercentage}%`,
                    backgroundColor: roleColor,
                  }}
                ></div>
              )}
            </div>
          </div>
        );
      })}
      <div className="hour-reference">
        {hourLabels.map((hour, index) => (
          <div key={index} className="hour-label">
            {hour}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleChart;
