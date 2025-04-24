
import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useGlobeData, ClimateDataPoint } from '../../hooks/useGlobeData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'line' | 'bar';
type DataType = 'co2' | 'methane' | 'temperature';

const DataDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [dataType, setDataType] = useState<DataType>('co2');
  
  const { data, loading, error, getRegionData } = useGlobeData();
  
  // Prepare data for the chart
  const prepareChartData = (data: ClimateDataPoint[] | null) => {
    if (!data) return null;

    const labels = data.map(point => point.year.toString());
    const values = data.map(point => point[dataType]);
    
    return {
      labels,
      datasets: [
        {
          label: getDataTypeLabel(),
          data: values,
          borderColor: getDataTypeColor(),
          backgroundColor: getDataTypeColor(0.6),
          tension: 0.3,
        },
      ],
    };
  };
  
  // Get data label based on selected type
  const getDataTypeLabel = () => {
    switch(dataType) {
      case 'co2': return 'CO₂ Concentration (ppm)';
      case 'methane': return 'Methane (ppb)';
      case 'temperature': return 'Temperature Change (°C)';
    }
  };
  
  // Get color based on data type
  const getDataTypeColor = (alpha = 1) => {
    switch(dataType) {
      case 'co2': return `rgba(255, 99, 132, ${alpha})`;
      case 'methane': return `rgba(255, 159, 64, ${alpha})`;
      case 'temperature': return `rgba(54, 162, 235, ${alpha})`;
    }
  };

  // Chart options
  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${getDataTypeLabel()} by Year (${selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)})`,
      },
    },
    scales: {
      y: {
        beginAtZero: dataType !== 'temperature',
      }
    },
  };

  // Get current data to be displayed
  const chartData = prepareChartData(getRegionData(selectedRegion));
  
  // Available regions
  const regions = data ? ['global', ...Object.keys(data.regions)] : ['global'];

  if (loading) {
    return (
      <div className="p-8 rounded-xl glassmorphism flex items-center justify-center h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-60 bg-white/20 rounded-md mb-4"></div>
          <div className="w-full h-[300px] bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-xl glassmorphism text-red-400">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          className="mt-4 bg-primary px-4 py-2 rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl glassmorphism">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region.charAt(0).toUpperCase() + region.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
          >
            <option value="co2">CO₂ Concentration</option>
            <option value="methane">Methane Level</option>
            <option value="temperature">Temperature Change</option>
          </select>
          
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 ${chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        {chartData && (
          <>
            {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
            {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
          </>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Data source: US Greenhouse Gas Center (placeholder). Last updated: April 2025.</p>
      </div>
    </div>
  );
};

export default DataDashboard;
