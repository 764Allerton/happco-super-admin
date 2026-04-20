// src/components/ColumnChart.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { colorCode } from 'Utils/MediaEndpoints';

const ColumnChart = () => {
  const options = {
    chart: {
      type: 'column',
      spacingTop: 20,    // Add padding to the top
      spacingRight: 20,  // Add padding to the right
      spacingBottom: 20, // Add padding to the bottom
      spacingLeft: 20,
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: ['Manager1', 'Manager2', 'Manager3', 'Manager4', 'Manager5', 'Manager6', 'Manager7', 'Manager8', 'Manager9']
    },
    yAxis: {
      title: {
        text: 'Direct Reports'
      },
      gridLineWidth: 0
    },
    series: [{
      name: 'Managers',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
      color: colorCode?.defaultDarkColor
    }],
    credits: {
      enabled: false
    },
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}

      />
    </div>
  );
};

export default ColumnChart;
