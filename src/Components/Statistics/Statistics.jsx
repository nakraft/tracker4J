import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Skeleton, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import axios from 'axios';

import './Statistics.scss';

export default function Statistics() {
	const [form] = Form.useForm();
	const [loading, setloading] = useState(true);
	const { state } = useLocation();
	const [initialValues, setInitialValues] = useState();
    var plot;

	useEffect(() => {
		axios
			.get('/api/get_statistics?email=' + state.email)
			.then(({ data }) => {
                console.log("Data Returned");
                console.log(data['dashboard']);
                plot = data['dashboard'];
			})
			.catch((err) => message.error(err.response?.data?.error))
			.finally(() => setloading(false));
	}, []);

	return (
		<div className="statistics_page">
            <Plot
                data={plot}
                layout={ {width: 500, height: 500, title: 'Electronics Prices 2016/2017'} } />

        </div>

	);
}
