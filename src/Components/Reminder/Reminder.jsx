/* eslint-disable react/prop-types */
import React from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
import axios from 'axios';

const statuses = {
	applied: 'Applied',
	interview: 'Interview',
	rejected: 'Rejected',
	accepted: 'Accepted',
};

export default function Reminder({ application, onClose, email }) {
	const [form] = Form.useForm();

	const closeForm = () => {
		form.resetFields();
		onClose();
	};

	return (
        <Modal
            title="Just a friendly reminder..."
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
            <div>
				Data : {application.companyName}
				<br />
				Job Title : {application.jobTitle}
				<hr />
            </div>
            
        </Modal>
    );
}
