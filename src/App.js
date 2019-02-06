import React, { Component } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import graphData from './dataModel';
import rawData from './LoanStats3a.csv';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        this.getCsvData();
    }

    fetchCsv() {
        return fetch(rawData).then((response) => {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');
            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    parseData(result) {
        result.data.splice(0, 2);
        result.data.pop();
        const { data } = result;
        for (let i = 0; i < data.length; i += 1) {
            const rate = parseFloat(data[i][6].substring(0, data[i][6].length - 1));
            const grade = data[i][8];
            let index = graphData.findIndex((element) => element.grade === grade);
            const totalRate = (graphData[index].amount * graphData[index].rate) + rate
            graphData[index].amount += 1;
            graphData[index].rate = Math.round(totalRate / graphData[index].amount * 100) / 100;
        }
        this.setState({ data: graphData });
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();
        Papa.parse(csvData, {
            complete: this.parseData
        });
    }

    render() {
        return (
            <div className="App">
                <BarChart
                    width={600}
                    height={300}
                    data={this.state.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    style={{ margin: '100px auto'}}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#8884d8" />
                </BarChart>
            </div>
        );
    }
}

export default App;
