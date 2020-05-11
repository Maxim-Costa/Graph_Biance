import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

var NumberFormat = require("react-number-format");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptos: [],
      symbol: "ETHEUR",
    };
  }

  async componentDidMount() {
    //setInterval(async () => {
    axios
      .get(
        "https://api.binance.com/api/v3/klines?symbol=" +
          this.state.symbol +
          "&interval=1m"
      )
      .then((res) => {
        const cryptos = res.data;
        var crypto = cryptos[cryptos.length - 1][4];
        this.setState({ cryptos: crypto });
      });
    //}, 1000);
  }
  render() {
    return (
      <div className="App">
        <div id="crypto-container">
          <span className="left">{this.state.symbol}</span>
          <span className="right">
            <NumberFormat
              value={parseFloat(this.state.cryptos)}
              displayType={"text"}
              decimalScale={2}
              suffix={"€"}
            />
          </span>
        </div>
      </div>
    );
  }
}

export default App;
