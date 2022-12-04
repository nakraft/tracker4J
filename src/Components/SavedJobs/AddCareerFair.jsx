/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function AddCareerFair({ isOpen, onClose, updateApplications }) {
	const [form] = Form.useForm();
	const { state } = useLocation();

	const closeForm = () => {
		form.resetFields();
		onClose();
	};

	const onOk = (values) => {
		axios
			.post('/api/add_application', { ...values, email: state.email })
			.then(({ data }) => {
				message.success(data.message);
			})
			.catch((err) => message.error(err.response.data?.error));
	};

	return (
		<Modal
			title="Add Career Fair"
			open={isOpen}
			onCancel={closeForm}
			width={700}
			centered
			footer={[
				<Button onClick={closeForm} key="cancel" id="cancel">
					Cancel
				</Button>,
				<Button type="primary" onClick={() => form.submit()} id="add-submit" key="ok">
					Add
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" requiredMark={false} onFinish={onOk}>
				<Form.Item
					label="Career Fair Name"
					name="careerFairName"
					rules={[
						{
							required: true,
							message: 'Please enter Career Fair Name!',
						},
					]}
				>
					<Input placeholder="Enter Career Fair Name" />
				</Form.Item>
			</Form>
		</Modal>
	);
}

