import { Chart, registerables } from "chart.js";
import React from "react";

import { CHART_COLORS, months, numbers } from './Graph.utils';
import {ReactComponent as ShareLogo} from './share.svg';
import './Graph.scss';

const DATA_COUNT = 14;
const NUMBER_CFG = {count: DATA_COUNT, min: 50, max: 100};

export interface GraphProps {
  dealId: string;
  dealName: string;
  onShare: (base64Image: string) => any;
}

export class Graph extends React.PureComponent<GraphProps> {

  private chartId: string;
  private chartRef: React.RefObject<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(props: GraphProps) {
    super(props);
    this.chartId = `chart-${this.props.dealId}`
    this.chartRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    Chart.register(...registerables);
    this.chart = new Chart(this.chartRef.current!.getContext('2d')!, {
      type: 'line',
      data: {
          labels: months({count: DATA_COUNT}),
          datasets: [{
            data: numbers(NUMBER_CFG),
            borderColor: CHART_COLORS.red,
            backgroundColor: CHART_COLORS.red,
          }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.props.dealName
          }
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current!.getContext('2d')!, {
      type: 'line',
      data: {
          labels: months({count: DATA_COUNT}),
          datasets: [{
            data: numbers(NUMBER_CFG),
            borderColor: CHART_COLORS.red, // TODO: USE THEME HERE
            backgroundColor: CHART_COLORS.red, // TODO: USE THEME HERE
          }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.props.dealName
          }
        }
      }
    });
  }

  share = () => {
    if (this.chart) {
      this.props.onShare(this.chart.toBase64Image('image/jpeg', 1))
    }
  }

  render() {
    return (
      <>
        <div className="share-logo" onClick={this.share}>
          <ShareLogo ></ShareLogo>
        </div>
        <div className="chart-container">
          <canvas ref={this.chartRef} id={this.chartId}></canvas>
        </div>
      </>
    );
  }
}
