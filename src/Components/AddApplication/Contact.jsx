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

export default function Contact({ application, onClose, email }) {
	const [form] = Form.useForm();

	const closeForm = () => {
		form.resetFields();
		onClose();
	};

	const updateApplication = (values) => {
		const loading = message.loading('Saving...', 0);
		axios
			.post('/api/next_stage_application', {
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
        <div className="ContactCompany">
			<div className="SubHeader">
                Track Company Communications
            </div>
            <div>
            <Card
                    key={col + index}
                    title={application.companyName}
                    className="Job"
                    bordered={false}
                >
                    ID: {application.jobId}
                    <br />
                    Title: {application.jobTitle}
                    <br />
                </Card>
            </div>
            <div>
                <Modal
                    title="Log Making Contact with Company"
                    open={true}
                    onCancel={closeForm}
                    width={700}
                    centered
                    footer={[
                        <Button type="primary" onClick={() => form.submit()} id="save" key="save">
                            Log New Communication Information
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
                        <Form.Item label="ContactInformation" name="contact">
                            <Input.TextArea placeholder="Enter Contact Information (name, email, purpose)" />
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
                    </Form>
                </Modal>
            </div>
	    </div>
    );
}
