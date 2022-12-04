import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { Button, Card, Tag, Typography } from 'antd';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AddApplication from '../AddApplication/AddApplication';
import EditApplication from '../AddApplication/EditApplication';
import './LandingPage.scss'

// import item_details from '../../../.,/backend/app.py';


const columns = {
   applied: 'Applied',
   inReview: 'In Review',
   interview: 'Interview',
   decision: 'Decision',
};

export default function LandingPage() {
   const [applications, setApplications] = useState([]);
   const [testVariable, settestVariable] = useState([]);
   const [loading, setLoading] = useState(true);
   const [addApplicationOpen, setAddApplicationOpen] = useState(false);
   const [editApplication, setEditApplication] = useState(false);
   const { state } = useLocation();

   useEffect(() => {
      updateApplications();
   }, []);

   const updateApplications = () => {
      axios
         .get('/api/view_applications?email=' + state.email)
         .then(({ data }) => setApplications(data.applications))
         .catch((err) => console.log(err))
         .finally(() => setLoading(false));
   };

    useEffect(() => {
      axios
         .get('/api/test')
         .then(({ data }) => settestVariable(data))
         .catch((err) => message.error(err.response?.data?.error));
   }, []);

   const toggleAddApplication = () => setAddApplicationOpen(!addApplicationOpen);
    console.log(testVariable);
   return (


      <div className="LandingPage">
         <div className="SubHeader">
            <div className="flex" />
            <Popup trigger={<Button id="modal" > Reminders </Button>}
            position="down" size="100px">
            <div><b>Upcoming interviews</b></div>
            {/* {
               console.log(item_details.entries())
            } */}
               {testVariable.map(({companyName, date, jobTitle}) => {
				<table>
					<tr>
					<th>
						Company Name
					</th>
					<th>
						Job title
					</th>
					<th>
						Interview Date
					</th>
					</tr>
				</table>
                  return (
					<tr>
                    <td width="100px">{companyName}</td>
					<td width="150px">{jobTitle}</td>
					<td width="200px">{date}</td>
                    </tr>
                  );
               }
               )
            }
            <div>

            </div>
            </Popup>
            &nbsp; &nbsp;
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
<script type="text/javascript">
document.getElementById("modal").click();
</script>