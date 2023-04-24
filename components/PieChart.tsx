import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Post } from '../Interface';
ChartJS.register(ArcElement, Tooltip, Legend);
type Props = {
    data: Post,
    faktors: string[]
}
const PieChart = ({ data, faktors }: Props) => {
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: '',
                data: [],
                backgroundColor: [],
            },
        ],
    });
    const [chartOptions, setChartOptions] = useState({});
    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    useEffect(() => {
        if (data) {
            const getValues = faktors.map((f: any) => {
                if (data.risk_factors[f]) {
                    return data.risk_factors[f]
                }
                else {
                    return 0
                }

            })
            const labels = data.risk_factors ? faktors : [];
            const values = data.risk_factors ? getValues : [];
            const backgroundColors = labels.map((_, index) => {
                return getRandomColor()
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: '',
                        data: values,
                        backgroundColor: backgroundColors,
                    },
                ],
            });
        }
    }, [data]);

    return (
        <div className='content'>
            <Pie data={chartData} options={chartOptions} />
        </div>
    );
};

export default PieChart;
