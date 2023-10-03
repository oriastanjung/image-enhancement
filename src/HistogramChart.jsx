import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const HistogramChart = ({ data, label, color }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Hancurkan grafik sebelumnya (jika ada)
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    // Buat grafik baru
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Array.from({ length: 256 }, (_, i) => i.toString()),
        datasets: [{
          label: label,
          data: data,
          backgroundColor: color,
        }],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Hancurkan grafik saat komponen unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, label, color]);

  return <canvas ref={canvasRef} />;
};

export default HistogramChart;
