import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from "chart.js";
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler 
);

const Visualization = () => {
  const role = localStorage.getItem('role');
  const userFields = useSelector((state) => state.field.userFields);
  const otherFields = useSelector((state) => state.field.otherFields);
  const [loading, setLoading] = useState(true)
  
  const [fields, setFields] = useState(role === 'Farmer' ? userFields : otherFields);

  useEffect(() => {
    const storedFields = JSON.parse(localStorage.getItem('fields'));
    if (storedFields) {
      setFields(storedFields);
      setLoading(false)
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('fields', JSON.stringify(fields));
  }, [fields]);

  const cropNames = fields.map((field) => field.fieldName);
  const areaSizes = fields.map((field) => field.areaSize);

  const healthStats = areaSizes.map(() => Math.random() * 100);

  const lineData = {
    labels: cropNames,
    datasets: [
      {
        label: "Dummy Crop Yield Trend",
        data: areaSizes.map((size) => Math.random() * size),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Health Statistics",
        data: healthStats,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const lineOptions = { responsive: true, plugins: { legend: { position: "top" } } };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen border">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      <div className="w-full h-[13vh] sticky z-[2] md:top-[10vh] top-[10vh] flex justify-between items-center ">
        <img src='https://res.cloudinary.com/dhhxki61s/image/upload/v1736521906/analytics_ismm00_jt7cca.jpg' alt='menu' className='object-cover w-full h-full filter brightness-[60%]'></img>
        <h1 className="absolute left-[3vw] text-white md:text-3xl text-xl font-bold italic md:drop-shadow-[5px_5px_2px_black] drop-shadow-[3px_3px_2px_black]">Field Data Visualizations</h1>
      </div>
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Visualization;
