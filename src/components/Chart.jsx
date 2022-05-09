import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { COLOURS, FONTS } from '@constants/variables';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart({ type, ...props }) {
    function SwitchCase({ param }) {
        switch (param) {
            case 'doughnut':
                return <DoughnutChart {...props} />;
            case 'bar':
                return <BarChart {...props} />;
            default:
                return 'No chart type specified';
        }
    }

    return <div>
        <SwitchCase param={type} />
    </div>
}

function DoughnutChart({ data, label }) {
    const chartData = {
        labels: data.map(({ label }) => label),
        datasets: [{
            label,
            data: data.map(({ value }) => value),
            backgroundColor: data.map(({ colour }) => COLOURS.addAlpha(colour, 0.8)),
            borderColor: data.map(({ colour }) => colour),
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        plugins: {
            legend: { labels: { color: COLOURS.WHITE, font: { family: FONTS.SANS_SERIF, size: 14 } } },
            tooltip: { bodyFont: { family: FONTS.SANS_SERIF, size: 14 } },
        },
    };

    return <Doughnut data={chartData} options={chartOptions} />;
}

function BarChart({ data, labels, align }) {
    const chartData = {
        labels,
        datasets: [{
            label: '',
            data: data.map(({ value }) => value),
            backgroundColor: data.map(({ colour }) => COLOURS.addAlpha(colour, 0.8)),
            borderColor: data.map(({ colour }) => colour),
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        indexAxis: align === 'horizontal' ? 'x' : 'y',
        plugins: { legend: { display: false, labels: { color: COLOURS.WHITE, font: { family: FONTS.SANS_SERIF, size: 13 } } } },
        scales: {
            y: { ticks: { beginAtZero: true, color: COLOURS.WHITE, font: { family: FONTS.SANS_SERIF, size: 13 } } },
            x: { ticks: { beginAtZero: true, color: COLOURS.WHITE, font: { family: FONTS.SANS_SERIF, size: 13 } } },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
}
