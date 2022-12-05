import re
from bson import ObjectId
from flask import Flask, request, session, jsonify
from pymongo import MongoClient, ReturnDocument
import bcrypt
from urllib.parse import urlparse, parse_qs
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from collections import OrderedDict

app = Flask(__name__)
app.secret_key = "testing"

client = MongoClient("mongodb+srv://csc505:csc505@cluster0.xflayld.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database("Test")
UserRecords = db.register
Applications = db.Applications
UserProfiles = db.Profiles

sender_address = 'sherbadcastled@gmail.com'
sender_pass =  'cqiejirwlcowgmvc'

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
	self.capacity = capacity


    def get(self, key):
        if key not in self.cache:
	    return -1
	else:
	    self.cache.move_to_end(key)
	    return self.cache[key]

        def put(self, key, value):
		self.cache[key] = value
		self.cache.move_to_end(key)
		if len(self.cache) > self.capacity:
			self.cache.popitem(last = False)

@app.route("/register", methods=["post"])
def register():
    try:
        req = request.get_json()
        name = {"firstName": req["firstName"], "lastName": req["lastName"]}
        email = req["email"]
        password = req["password"]
        confirmPassword = req["confirmPassword"]

        email_found = UserRecords.find_one({"email": email})
        if email_found:
            return jsonify({'error': "This email already exists in database"}), 400
        if password != confirmPassword:
            return jsonify({'error': "Passwords should match!"}), 400
        
        else:
            hashed = bcrypt.hashpw(confirmPassword.encode("utf-8"), bcrypt.gensalt())
            user_input = {"name": name, "email": email, "password": hashed}
            UserRecords.insert_one(user_input)
            
            # #find the new created account and its email
            # user_data = UserRecords.find_one({"email": email})
            # new_email = user_data["email"]
            # #if registered redirect to logged in as the registered user
            # session["email"] = new_email
            return jsonify({'message': 'Login successful'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/login", methods=["POST"])
def login():
    try:
        req = request.get_json()
        email = req["email"]
        password = req["password"]

        #check if email exists in database
        email_found = UserRecords.find_one({"email": email})
        if email_found:
            # email_val = email_found["email"]
            passwordcheck = email_found["password"]
            #encode the password and check if it matches
            if bcrypt.checkpw(password.encode("utf-8"), passwordcheck):
                # session["email"] = email_val
                return jsonify({'message': 'Login successful'}), 200
            else:
                if "email" in session:
                    return jsonify({'message': 'Login successful'}), 200
                return jsonify({'error': "Wrong password"}), 400
        else:
            return jsonify({'error': "Email not found"}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/logout", methods=["POST", "GET"])
def logout():
    # if "email" in session:
    #     session.pop("email", None)
    return jsonify({'message': 'Logout successful'}), 200

def filterResults(applications, filter):
    filteredApplications = []
    for application in applications:
        if( (application['companyName'].lower().find(filter.lower()) != -1) or (application['jobTitle'].lower().find(filter.lower()) != -1) or (application['jobId'].lower().find(filter.lower()) != -1) or (application['description'].lower().find(filter.lower()) != -1) or (application['url'].lower().find(filter.lower()) != -1) ):
            filteredApplications.append(application)
    return filteredApplications

@app.route("/view_applications", methods=["GET"])
def view_applications():
    try:
        # if "email" in session:
        if request:
            # email = session["email"]
            print(request.args)
            email = request.args.get("email")
            sort = request.args.get("sort")
            asc = 1 if request.args.get("asc") == "true" else -1
            filterString = request.args.get("filter")
            if(filterString is None) :
                filterString = ""
            out = Applications.find({"email": email}).sort(sort, asc)
            if out:
                applications_list = []
                # payload["msg"]="Applications present"
                for i in out:
                    del i['email']
                    i['_id']=str(i['_id'])
                    applications_list.append(i)
                filtered_applications_list = filterResults(applications_list, filterString)
                return jsonify({'message': 'Applications found', 'applications': filtered_applications_list}), 200
            else:
                return jsonify({'message': 'You have no applications'}), 200
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400
            
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400

@app.route("/add_application", methods=["POST"])
def add_application():
    try:
        # if "email" in session:
        if request:
            req = request.get_json()
            print(request.args)
            try:
                description = req["description"]
            except:
                description = ""
            try:
                date = req["date"]
            except:
                date = ""
            application = {
                "email": req["email"],
                "companyName": req["companyName"],
                "jobTitle": req["jobTitle"],
                "jobId": req["jobId"],
                "description": description,
                "url": req["url"],
                "date": date,
                "status": req["status"]
            }
            print("dd", application)
            try:
                Applications.insert_one(application)
                return jsonify({"message": "Application added successfully"}),200
            except Exception as e:
                return jsonify({"error": "Unable to add Application"}),400
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/delete_application", methods=["POST"])
def delete_application():
    try:
        # if "email" in session:
        if request:
            req = request.get_json()
            email = req["email"]
            _id = req["_id"]
            # delete_document = Applications.find_one_and_delete({"_id":jobId, "email":email})
            delete_document = Applications.find_one_and_delete({"_id":ObjectId(_id), "email":email})
            if delete_document == None:
                return jsonify({"error": "No such Job ID found for this user's email"}), 400
            else:
                return jsonify({"message": "Job Application deleted successfully"}), 200
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400

    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/modify_application", methods=["POST"])
def modify_application():
    try:
        # if "email" in session:
        if request:
            req = request.get_json()
            email = req["email"]
            _id = req["_id"]
            filter = {'_id':ObjectId(_id), "email": email}
            # filter = {"_id": jobId, "email": email}

            application = {
                "email": req["email"],
                "companyName": req["companyName"],
                "jobTitle": req["jobTitle"],
                "jobId": req["jobId"],
                "description": req["description"],
                "url": req["url"],
                "date": req["date"],
                "status": req["status"]
            }
            set_values = {"$set": application}
            modify_document = Applications.find_one_and_update(filter, set_values, return_document = ReturnDocument.AFTER)
            if modify_document == None:
                return jsonify({"error": "No such Job ID found for this user's email"}), 400
            else:
                return jsonify({"message": "Job Application modified successfully"}), 200
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400
    
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/create_profile", methods=["post"])
def create_profile():
    try:
        # if "email" in session:
        if request:
            req = request.get_json()
            email = req["email"]
            email_found = UserProfiles.find_one({"email": email})
            if email_found:
                return jsonify({"error": "Profile already created."}),400
            else:
                user_profile = {
                    "firstName": req["firstName"],
                    "lastName": req["lastName"],
                    "email": req["email"], 
                    "phone": req.get("phone"),
                    "city": req.get("city"),
                    "state": req.get("state"),
                    "resume": req.get("resume"),
                    "gitHub": req.get("gitHub"),
                    "linkedIn": req.get("linkedin"),
                    "skills": req.get("skills", '').split(","),
                    "about": req.get("about"),
                    "interests": req.get("interests", '').split(","),
                    "companyName": req.get("companyName"),
                    "jobTitle": req.get("jobTitle"),
                    "description": req.get("description"),
                    "jobCity": req.get("jobCity"),
                    "jobState": req.get("jobState"),
                    "jobFrom": req.get("jobDate"),
                    "toFrom": req.get("jobDate"),
                    "curentJob": req.get("curentJob"),
                    "institution": req.get("institution"),
                    "major": req.get("major"),
                    "degree": req.get("degree"),
                    "courses": req.get("courses", '').split(","),
                    "universityCity": req.get("universityCity"),
                    "universityState": req.get("universityState"),
                    "universityFromDate": req.get("universityDate"),
                    "universityToDate": req.get("universityDate"),
                    "curentUniversity": req.get("curentUniversity")
                }
                try:
                    UserProfiles.insert_one(user_profile)
                    return jsonify({"message": "Profile created successfully"}),200
                except Exception as e:
                    return jsonify({"error": "Unable to create profile"}),400
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/view_profile", methods=["GET"])
def view_profile():
    try:
        # if "email" in session:
        if request:
            email = request.args.get("email")
            filter = {"email": email}
            profile = UserProfiles.find(filter)
            if profile == None:
                return jsonify({'message': "Create a profile first", "profile": {}}), 200
            else:
                # payload["profile"] = profile
                profile_out = {}
                for p in profile:
                    p['_id'] = str(p['_id'])
                    profile_out = p
                return jsonify({'message': "Found User Profile", "profile": profile_out}), 200
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400

    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400


@app.route("/modify_profile", methods=["POST"])
def modify_profile(): 
    try:
        # if "email" in session:
        if request:
            req = request.get_json()
            _id = req["_id"]
            email = req["email"]
            email_found = UserProfiles.find_one({"_id": ObjectId(_id), "email": email})
            if not email_found:
                return jsonify({"error": "Profile not found."}),400
            else:
                user_profile = {
                    "firstName": req["firstName"],
                    "lastName": req["lastName"],
                    "email": req["email"], 
                    "phone": req.get("phone"),
                    "city": req.get("city"),
                    "state": req.get("state"),
                    "resume": req.get("resume"),
                    "gitHub": req.get("gitHub"),
                    "linkedIn": req.get("linkedin"),
                    "skills": req.get("skills", '').split(","),
                    "about": req.get("about"),
                    "interests": req.get("interests", '').split(","),
                    "companyName": req.get("companyName"),
                    "jobTitle": req.get("jobTitle"),
                    "description": req.get("description"),
                    "jobCity": req.get("jobCity"),
                    "jobState": req.get("jobState"),
                    "jobFrom": req.get("jobDate"),
                    "toFrom": req.get("jobDate"),
                    "curentJob": req.get("curentJob"),
                    "institution": req.get("institution"),
                    "major": req.get("major"),
                    "degree": req.get("degree"),
                    "courses": req.get("courses", '').split(","),
                    "universityCity": req.get("universityCity"),
                    "universityState": req.get("universityState"),
                    "universityFromDate": req.get("universityDate"),
                    "universityToDate": req.get("universityDate"),
                    "curentUniversity": req.get("curentUniversity")
                }

                set_values = {"$set":user_profile}
                filter = {"email": email}
                modify_document = UserProfiles.find_one_and_update(filter, set_values, return_document = ReturnDocument.AFTER)
                if modify_document == None:
                    return jsonify({"error": "Unable to modify profile"}),400
                else:
                    return jsonify({"message": "Profile modified successfully"}),200    
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400    

@app.route("/clear_profile", methods=["POST"])
def clear_profile():
    try:
        if request:
            req = request.get_json()
            email_to_delete = req["email"]
            _id = req["_id"]
            delete_user = UserRecords.find_one({"email":email_to_delete})
            if delete_user == None:
                return jsonify({'error': "User email not found"}), 400
            delete_profile = UserProfiles.find_one_and_delete({"_id": ObjectId(_id), "email":email_to_delete})
            if delete_profile == None:
                return jsonify({'error': "Profile not found"}), 400
            else:
                return jsonify({"message": "User Profile cleared successfully"}), 200
        # else:
        #     return jsonify({'error': "Not Logged in"}), 400

    except Exception as e:
        print(e)
        return jsonify({'error': "Something went wrong"}), 400

def send_reminders():
    current_date = datetime.now.strftime("%Y-%m-%d")      
    records = Applications.find({"date":{"$regex":"^"+current_date}})
    for record in records:
        receiver_address = record['email']
       
        message = MIMEMultipart()

        message['Subject'] = 'This is a Reminder for your Interview at '+record['companyName'] 
        mail_content = '''Hello,
        This is a reminder email about your interview for the role '''+record["jobTitle"]+' at '+record['companyName'] + ' on ' + record['date']
       
        message['From'] = sender_address
        message['To'] = receiver_address

        message.attach(MIMEText(mail_content, 'plain'))

        try:
            session = smtplib.SMTP('smtp.gmail.com', 587)
            session.login(sender_address, sender_pass)
            text = message.as_string()
            session.sendmail(sender_address, receiver_address, text)
            session.quit()

        except Exception as e: 
            print("Failed to send a reminder, the err: ", e)

if __name__ == "__main__":
  sched = BackgroundScheduler(daemon=True)
  sched.add_job(send_reminders, 'cron', day='*', hour='5')
  sched.start()
  app.run(debug=True, host="0.0.0.0", port=8000, threaded=True)
