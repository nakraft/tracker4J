import React, { useEffect, useState } from 'react';
import { Button, Card, Tag, Typography, Dropdown, Select, Input } from 'antd';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import AddApplication from '../AddApplication/AddApplication';
import EditApplication from '../AddApplication/EditApplication';
import './LandingPage.scss';

const columns = {
	applied: 'Applied',
	inReview: 'In Review',
	interview: 'Interview',
	decision: 'Decision',
};

const sortingOptions = [
	{
	value: 'companyName_Asc',
	label: 'Company Name Asc',
	},
	{
	value: 'companyName_Desc',
	label: 'Company Name Desc',
	},
	{
	value: 'date_Asc',
	label: 'Date Asc',
	},
	{
	value: 'date_Desc',
	label: 'Date Desc',
	}
]

export default function LandingPage() {
	const [applications, setApplications] = useState([]);
	const [filter, setFilter] = useState("");
	const [sort, setSort] = useState("name_Asc");
	const [loading, setLoading] = useState(true);
	const [addApplicationOpen, setAddApplicationOpen] = useState(false);
	const [editApplication, setEditApplication] = useState(false);
	const { state } = useLocation();

	useEffect(() => {
		updateApplications();
	}, [sort, filter]);

	const updateApplications = () => {
		axios
			.get('/api/view_applications?email=' + state.email + '&sort=' + sort.split("_")[0] + "&asc=" + (sort.split("_")[1] == "Asc") + "&filter=" + filter)
			.then(({ data }) => setApplications(data.applications))
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};

	const handleChange = (value) => {
		setSort(value)
		updateApplications()
	};

	const toggleAddApplication = () => setAddApplicationOpen(!addApplicationOpen);

	const onSearch = (string) => {
		setFilter(string)
	}

	return (
		<div className="LandingPage">
			<div className="SubHeader">
				<Input.Search
					placeholder="search text"
					allowClear
					enterButton="Search"
					size="large"
      				style={{ width: 400 }}
      				onSearch={onSearch}
				/>
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
				<AddApplication
					isOpen={addApplicationOpen}
					onClose={toggleAddApplication}
					updateApplications={updateApplications}
				/>
			</div>

			<div className="MainContent">
				{Object.keys(columns).map((col) => (
					<div className="Status" key={col}>
						<Typography.Title level={5}>{columns[col]}</Typography.Title>
						{loading ? (
							<>
								<Card loading bordered={false} />
								<Card loading bordered={false} />
								<Card loading bordered={false} />
							</>
						) : (
							applications.map(
								(application, index) =>
									(application.status === col ||
										(col === 'decision' &&
											['rejected', 'accepted'].includes(
												application.status
											))) && (
										<Card
											key={col + index}
											title={application.companyName}
											extra={
												<Button
													type="text"
													icon={<EditFilled />}
													onClick={() => setEditApplication(application)}
													id={application.jobId + 'edit'}
												/>
											}
											className="Job"
											bordered={false}
											actions={
												['rejected', 'accepted'].includes(
													application.status
												) && [
													application.status === 'accepted' ? (
														<Tag color="#87d068">Accepted</Tag>
													) : (
														application.status === 'rejected' && (
															<Tag color="#f50">Rejected</Tag>
														)
													),
												]
											}
										>
											ID: {application.jobId}
											<br />
											Title: {application.jobTitle}
											<br />
											{'URL: '}
											<a href={'//' + application.url} target={'_blank'}>
												{application.url}
											</a>
											<br />
											Notes: {application.description}
										</Card>
									)
							)
						)}
						{applications.length === 0 && 'No applications found.'}
					</div>
				))}
			</div>
			{editApplication && (
				<EditApplication
					application={editApplication}
					onClose={() => setEditApplication(false)}
					updateApplications={updateApplications}
					email={state.email}
				/>
			)}
		</div>
	);
}
