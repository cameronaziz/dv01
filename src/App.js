import React, { Component } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Label } from 'recharts';
import rawData from './LoanStats3a.csv';
import Tooltip from './Tooltip';
import Loading from './Loading';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        this.getCsvData();
    }

    parseData(result) {
        result.data.splice(0, 2);
        const { data } = result;
        const graphData = [];
        for (let i = 0; i < data.length; i += 1) {
            const rawRate = data[i][6];
            const grade = data[i][8];
            if (rawRate && grade) {
                let index = graphData.findIndex((element) => element.grade === grade);
                if (index < 0) {
                    index = graphData.push({
                        grade,
                        amount: 0,
                        rate: 0,
                    }) - 1;
                }
                const rate = parseFloat(rawRate.substring(0, data[i][6].length - 1));
                const totalRate = (graphData[index].amount * graphData[index].rate) + rate;
                graphData[index].amount += 1;
                graphData[index].rate = Math.round(totalRate / graphData[index].amount * 100) / 100;
            }
        }
        graphData.sort((a, b) => {
            if(a.grade < b.grade) { return -1; }
            if(a.grade > b.grade) { return 1; }
            return 0;
        });
        this.setState({ data: graphData });
    }

    async getCsvData() {
        let csvData = await fetch(rawData).then((response) => {
            return response.text()
        })
        Papa.parse(csvData, {
            complete: this.parseData
        });
    }

    render() {
        const { data } = this.state;
        return (
            <div className="App">
                {data.length === 0 ? <Loading /> :
                    <BarChart
                        width={600}
                        height={300}
                        data={this.state.data}
                        margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
                        style={{ margin: '0 auto'}}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade">
                            <Label value="Grade" offset={-10} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value="Rate (%)" offset={15} angle={-90} position="insideLeft" />
                        </YAxis>
                        <RechartsTooltip
                            content={Tooltip}
                        />
                        <Bar dataKey="rate" fill="#8884d8" />
                    </BarChart>
                }
            </div>
        );
    }
}

export default App;
