import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ActiveUserGraph = (props) => {
    const { categories, series } = props
    const options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Companies Details'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories,
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Persons',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                borderRadius: '15%',
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.3
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        series
    }
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
};
export default ActiveUserGraph;