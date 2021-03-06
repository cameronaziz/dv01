import React, { Component } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Label } from 'recharts';
import rawData from './LoanStats3a.csv';
import Tooltip from './Tooltip';
import Loading from './Loading';
import Menu from './Menu';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeData: [],
            subGradeData: [],
            showSubGrade: false,
            size: 600,
        };
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        this.getCsvData();
    }

    async getCsvData() {
        let csvData = await fetch(rawData).then((response) => {
            return response.text()
        })
        Papa.parse(csvData, {
            complete: this.parseData
        });
    }

    parseData(result) {
        result.data.splice(0, 2);
        const { data } = result;
        const gradeData = [];
        const subGradeData = [];
        for (let i = 0; i < data.length; i += 1) {
            const rawRate = data[i][6];
            const grade = data[i][8];
            const subGrade = data[i][9];
            if (rawRate && grade && subGrade) {
                let gradeIndex = gradeData.findIndex((element) => element.value === grade);
                let subGradeIndex = subGradeData.findIndex((element) => element.value === subGrade);
                if (gradeIndex < 0) {
                    gradeIndex = gradeData.push({
                        value: grade,
                        amount: 0,
                        rate: 0,
                    }) - 1;
                }
                if (subGradeIndex < 0) {
                    subGradeIndex = subGradeData.push({
                        value: subGrade,
                        amount: 0,
                        rate: 0,
                    }) - 1;
                }
                const rate = parseFloat(rawRate.substring(0, data[i][6].length - 1));
                const gradeTotalRate = (gradeData[gradeIndex].amount * gradeData[gradeIndex].rate) + rate;
                const subGradeTotalRate = (subGradeData[subGradeIndex].amount * subGradeData[subGradeIndex].rate) + rate;
                gradeData[gradeIndex].amount += 1;
                subGradeData[subGradeIndex].amount += 1;
                gradeData[gradeIndex].rate = Math.round(gradeTotalRate / gradeData[gradeIndex].amount * 100) / 100;
                subGradeData[subGradeIndex].rate = Math.round(subGradeTotalRate / subGradeData[subGradeIndex].amount * 100) / 100;
            }
        }
        gradeData.sort((a, b) => {
            if(a.value < b.value) { return -1; }
            if(a.value > b.value) { return 1; }
            return 0;
        });
        subGradeData.sort((a, b) => {
            if(a.value < b.value) { return -1; }
            if(a.value > b.value) { return 1; }
            return 0;
        });
        this.setState({ gradeData, subGradeData });
    }

    toggleShowSubGrade = () => {
        this.setState((prevState) => {
            prevState.showSubGrade = !prevState.showSubGrade;
            return prevState;
        })
    }

    toggleSize = () => {
        this.setState((prevState) => {
            let size = 600;
            if (prevState.size === 600) {
                size = 1200;
            }
            prevState.size = size;
            return prevState;
        })
    }

    render() {
        const { subGradeData, gradeData, showSubGrade, size } = this.state;
        let data = gradeData;
        let axisLabel = 'Grade';
        if(showSubGrade) {
            data = subGradeData;
            axisLabel = 'SubGrade';
        }
        return (
            <div className="App">
                {data.length === 0 ? <Loading /> :
                    <div>
                        <BarChart
                            width={size}
                            height={300}
                            data={data}
                            margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
                            style={{ margin: '0 auto'}}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="value">
                                <Label value={axisLabel} offset={-10} position="insideBottom" />
                            </XAxis>
                            <YAxis>
                                <Label value="Rate (%)" offset={15} angle={-90} position="insideLeft" />
                            </YAxis>
                            <RechartsTooltip
                                content={Tooltip}
                            />
                            <Bar dataKey="rate" fill="#46AFDF" />
                        </BarChart>
                        <Menu toggleSize={this.toggleSize} toggleShowSubGrade={this.toggleShowSubGrade} />
                    </div>
                }
            </div>
        );
    }
}

export default App;
