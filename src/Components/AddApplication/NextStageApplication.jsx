/* eslint-disable react/prop-types */
import React from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
import axios from 'axios';

const statuses = {
	applied: 'Applied',
	inReview: 'In Review',
	interview: 'Interview',
	rejected: 'Rejected',
	accepted: 'Accepted',
};

export default function NextStageApplication({ application, onClose, email }) {
	const [form] = Form.useForm();

	const closeForm = () => {
		form.resetFields();
		onClose();
	};

	const updateApplication = (values) => {
		const loading = message.loading('Saving...', 0);
		axios
			.post('/api/next_stage_application', { // TODO add in API 
				...values,
				_id: application._id,
				email,
			})
			.then(({ data }) => {
				message.success(data.message);
				updateApplications();
			})
			.catch((err) => message.error(err.response.data?.error))
			.finally(() => {
				loading();
				closeForm();
			});
	};

	return (
		<Modal
			title="Change in Application Status - Update Stage"
			open={true}
			onCancel={closeForm}
			width={700}
			centered
			footer={[
				<Button type="primary" onClick={() => form.submit()} id="save" key="save">
					Update Application
				</Button>,
			]}
		>
			<Form
				form={form}
				layout="vertical"
				requiredMark={false}
				initialValues={{
					companyName: application.companyName,
					jobId: application.jobId,
					jobTitle: application.jobTitle,
					description: application.description,
					url: application.url,
					status: application.status,
					// interview: moment(application.interview),
                    // reminder: moment(application.reminder)
				}}
				onFinish={updateApplication}
			>
				<Form.Item
					label="Company Name"
					name="companyName"
					rules={[
						{
							required: true,
							message: 'Please enter Company Name!',
						},
					]}
				>
					<Input placeholder="Enter Company Name" />
				</Form.Item>
				<Form.Item
					label="Job Title"
					name="jobTitle"
					rules={[
						{
							required: true,
							message: 'Please enter Job Title!',
						},
					]}
				>
					<Input placeholder="Enter Job Title" />
				</Form.Item>
				<Form.Item
					label="Job Id"
					name="jobId"
					rules={[
						{
							required: true,
							message: 'Please enter Job Id!',
						},
					]}
				>
					<Input placeholder="Enter Job Id" />
				</Form.Item>
				<Form.Item label="Notes" name="description">
					<Input.TextArea placeholder="Enter Notes" />
				</Form.Item>
				<Form.Item
					label="Set Reminder"
					name="reminder"
					rules={[
						{
							required: true,
							message: 'Enter Date that You Need to Take Your Next Action Before!',
						},
					]}
				>
					<DatePicker />
				</Form.Item>
                <Form.Item
					label="Set Interview Date"
					name="interview"
					rules={[
						{
							required: false,
							message: 'Set your interview date!',
						},
					]}
				>
					<DatePicker />
				</Form.Item>
				<Form.Item
					label="Status"
					name="status"
					rules={[
						{
							required: true,
							message: 'Please enter your new Status!',
						},
					]}
				>
					<Select>
						{Object.keys(statuses).map((key) => (
							<Select.Option value={key} key={key}>
								{statuses[key]}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
}
