"use client"
import { Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, } from 'chart.js/auto'
import { Line }            from 'react-chartjs-2'
import { useEffect, useState } from 'react';

const CpuUsageChart = () => {
  const [chartData, setChartData] = useState<CpuUsage>({
    labels: [],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  });
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )
  useEffect(() => {
    const fetchData = () => {
      fetch('/api/cpu')
        .then(response => response.json())
        .then(data => {
          const newLabel = new Date().toLocaleTimeString();
          const newData = data.cpuUsage; // Assume you get the latest CPU usage

            setChartData(chartData => {
                const newChartData = { ...chartData };
                newChartData.labels.push(newLabel);
                newChartData.datasets[0].data.push(newData);
    
                if (newChartData.labels.length > 10) {
                newChartData.labels.shift();
                newChartData.datasets[0].data.shift();
                }
    
                return newChartData;
            });
        });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>CPU Usage Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default CpuUsageChart;

export interface CpuUsage {
    labels: string[];
    datasets: [
      {
        label: string;
        data: any[],
        borderColor: string;
        fill: boolean;
      },
    ],
  }
