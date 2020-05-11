import React, { Component } from "react";
import axios from "axios";
import CanvasJSReact from "./assets/canvasjs.react";
import "./App.css";

var NumberFormat = require("react-number-format");
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dps = [];
var updateInterval = 1000;

class DynamicLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbolValue: 0,
      symbol: "ETHEUR",
      graphHide: true,
    };
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    setInterval(this.updateChart, updateInterval);
  }

  updateChart() {
    var date = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current Minutes
    var sec = new Date().getSeconds(); //To get the Current Seconds
    var dt = new Date(year, month, date, hours, min, sec);
    axios
      .get("https://api.binance.com/api/v3/klines?symbol=ETHEUR&interval=1m")
      .then((res) => {
        const cryptos = res.data;
        var crypto = cryptos[cryptos.length - 1][4];
        dps.push({ x: dt, y: parseFloat(crypto) });
        this.setState({ symbolValue: crypto });
        if (dps.length > 800) {
          dps.shift();
        }
        this.chart.options.data[0].legendText =
          " Ethereum Binance - " + crypto + " €";
        this.chart.render();
      });
  }

  /*graphShow() {
    this.state.graphHide
      ? this.setState({ graphHide: false })
      : this.setState({ graphHide: true });
  }*/

  render() {
    const options = {
      title: {
        text: "Ethereum Binance ",
      },
      data: [
        {
          type: "line",
          dataPoints: dps,
          showInLegend: true,
        },
      ],
      axisY: {
        includeZero: false,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        fontSize: 18,
        fontColor: "dimGrey",
        itemclick: function (e) {
          if (
            typeof e.dataSeries.visible === "undefined" ||
            e.dataSeries.visible
          ) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        },
      },
    };

    return (
      <div>
        <div className="App">
          <div className="crypto-container">
            <span className="left">{this.state.symbol}</span>
            <span className="right">
              <NumberFormat
                value={this.state.symbolValue}
                displayType={"text"}
                decimalScale={2}
                suffix={"€"}
              />
            </span>
          </div>
        </div>

        <div className="crypto-container">
          <CanvasJSChart
            options={options}
            onRef={(ref) => (this.chart = ref)}
          />
        </div>
      </div>
    );
  }
}

export default DynamicLineChart;
