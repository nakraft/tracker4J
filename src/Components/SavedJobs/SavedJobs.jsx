import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import AddSavedJob from './AddSavedJob';
import './SavedJobs.scss';

const sortingOptions = [
	{
	value: 'companyName_Asc',
	label: 'Company Name Asc',
	},
	{
	value: 'companyName_Desc',
	label: 'Company Name Desc',
	}
]

export default function SavedJobs() {
	const [applications, setApplications] = useState([]);
	const [addApplicationOpen, setAddApplicationOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const { state } = useLocation();

	useEffect(() => {
		updateApplications();
	}, []);

	const toggleAddApplication = () => setAddApplicationOpen(!addApplicationOpen);

	const updateApplications = (sort="name", asc=true) => {
		axios
			.get('/api/view_applications?email=' + state.email + '&sort=' + sort + "&asc=" + asc)
			.then(({ data }) =>
				setApplications(data.applications.filter((app) => app.status == 'saved'))
			)
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};

	const handleChange = (value) => {
		var sort = value.split("_")
		updateApplications(sort[0], sort[1] == "Asc")
	};

	return (
		<div className="SavedJobs">
			<div className="SubHeader">
				<div className="flex" />
				<Select
					defaultValue="Company Name Asc"
					style={{ width: 220 }}
					onChange={handleChange}
					options={sortingOptions}
					className="sortingDropdown"
					/>
				<Button
					id="add-application"
					type="primary"
					size="large"
					icon={<PlusOutlined />}
					onClick={toggleAddApplication}
				>
					Add Application
				</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
					id="add-career-fair"
					type="primary"
					size="large"
					icon={<PlusOutlined />}
					onClick={toggleAddCareerFair}
				>
					Add Career Fair
				</Button>
				<AddSavedJob
					isOpen={addApplicationOpen}
					onClose={toggleAddApplication}
					updateApplications={updateApplications}
				/>
			</div>
			<div className="Jobs">
				{loading && (
					<>
						<Card loading />
						<Card loading />
					</>
				)}
				{applications.map((application) => (
					<Card className="Job" key={application._id} title={application.companyName}>
						ID: {application.jobId}
						<br />
						Title: {application.jobTitle}
						<br />
						{'URL: '}
						<a href={'//' + application.url} target={'_blank'}>
							{application.url}
						</a>
					</Card>
				))}
				{applications.length === 0 && <Typography.Text>No Saved Jobs</Typography.Text>}
			</div>
		</div>
	);
}
