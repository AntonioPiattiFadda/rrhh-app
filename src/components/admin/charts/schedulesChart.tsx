// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';

// const SchedulesChart = ({ data1Egreso, data1Ingreso }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     const chartOptions = {
//       title: 'string',
//       lastValueVisible: false,
//       layout: {
//         textColor: 'black',
//         background: { type: 'solid', color: 'white' },
//       },
//     };

//     const chart = createChart(chartContainerRef.current, chartOptions);
//     const lineSeries1Light = chart.addAreaSeries({
//       lineColor: 'rgba(129, 199, 132, 0.5)',
//     });
//     const lineSeries1Dark = chart.addLineSeries({
//       color: 'rgba(56, 142, 60, 0.3)',
//     });
//     lineSeries1Dark.applyOptions({
//       title: 'Ingreso',
//       lastValueVisible: false,
//     });
//     lineSeries1Light.applyOptions({
//       title: 'Egreso',
//       lastValueVisible: false,
//       priceLineColor: 'rgba(129, 199, 132, 0.5)',
//       priceFormat: {
//         type: 'price',
//         precision: 2,
//         minMove: 0.01,
//       },
//     });

//     // const lineSeries2Dark = chart.addLineSeries({
//     //   color: 'rgba(255, 87, 51, 0.8)',
//     // });
//     // const lineSeries2Light = chart.addLineSeries({
//     //   color: 'rgba(255, 138, 101, 0.5)',
//     // });

//     // const lineSeries3Dark = chart.addLineSeries({
//     //   color: 'rgba(56, 142, 60, 0.8)',
//     // });
//     // const lineSeries3Light = chart.addLineSeries({
//     //   color: 'rgba(129, 199, 132, 0.5)',
//     // });

//     // const data2Ingreso = [
//     //   { value: 10.15, time: 1642425322 }, // 10:00 AM
//     //   //   { value: 10.02, time: 1642511722 },
//     //   //   { value: 10.03, time: 1642598122 },
//     //   { value: 10.1, time: 1642684522 },
//     //   { value: 9.56, time: 1642770922 },
//     //   { value: 9.59, time: 1642857322 },
//     //   { value: 15.54, time: 1642943722 },
//     //   { value: 15.59, time: 1643030122 },
//     //   { value: 16.01, time: 1643116522 },
//     //   { value: 16.16, time: 1643202922 },
//     // ];
//     // const data2Egreso = [
//     //   { value: 14.1, time: 1642425322 }, // 10:00 AM
//     //   //   { value: 10, time: 1642511722 },
//     //   //   { value: 10, time: 1642598122 },
//     //   { value: 14.3, time: 1642684522 },
//     //   { value: 15.02, time: 1642770922 },
//     //   { value: 15.04, time: 1642857322 },
//     //   { value: 19.1, time: 1642943722 },
//     //   { value: 19.01, time: 1643030122 },
//     //   { value: 19.12, time: 1643116522 },
//     //   { value: 19.15, time: 1643202922 },
//     // ];

//     lineSeries1Dark.setData(data1Ingreso);
//     lineSeries1Light.setData(data1Egreso);
//     // lineSeries2Dark.setData(data2Ingreso);
//     // lineSeries2Light.setData(data2Egreso);

//     chart.timeScale().fitContent();

//     return () => {
//       chart.remove();
//     };
//   }, [data1Egreso, data1Ingreso]);

//   return (
//     <div
//       ref={chartContainerRef}
//       style={{
//         width: '100%',
//         height: '400px',
//         // backgroundColor: 'white',
//         // borderRadius: '10px',
//         // border: '1px solid rgba(129, 199, 132, 0.5)',
//         // overflow: 'hidden',
//         // boxShadow: '0 0 10px rgba(129, 199, 132, 0.5)',
//       }}
//     />
//   );
// };

// export default SchedulesChart;
