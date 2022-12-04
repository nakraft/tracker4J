import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Skeleton, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';

import './Statistics.scss';

export default function Statistics() {
    const [plot, setPlot] = useState(0);
	const [loading, setloading] = useState(true);
	const { state } = useLocation();

	useEffect(() => {
		axios
			.get('/api/get_statistics?email=' + state.email)
			.then(data=> {
                console.log("Data Returned");
                console.log(data);
                // console.log(data.json());
                // console.log(data.dashboard.json());
                setPlot(data.data);
			})
			.catch((err) => message.error(err.response?.data?.error))
			.finally(() => setloading(false));
	}, []);

	return (
		<div className="statistics_page">
            <Plot data={plot.data} layout={plot.layout}/>
            {/* <Plot
                data={plotAble}
                layout={ {width: 500, height: 500, title: 'Electronics Prices 2016/2017'} } /> */}

        </div>

	);
}
