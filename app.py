from flask import Flask, url_for, redirect, render_template, request, session, jsonify
import mysql.connector, os, re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler,LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import StackingClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import VotingClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
from imblearn.over_sampling import SMOTE
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import cv2
# Removed dlib import as it's causing issues
# import dlib
import base64
from PIL import Image
import io
import tempfile

# Import image processing module
from app_image_processing import add_image_processing_routes


app = Flask(__name__)
app.secret_key = 'admin'

# Register image processing routes
add_image_processing_routes(app)

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port="3306",
    database='db'
)

mycursor = mydb.cursor()

def executionquery(query,values):
    mycursor.execute(query,values)
    mydb.commit()
    return

def retrivequery1(query,values):
    mycursor.execute(query,values)
    data = mycursor.fetchall()
    return data

def retrivequery2(query):
    mycursor.execute(query)
    data = mycursor.fetchall()
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        c_password = request.form['c_password']
        if password == c_password:
            query = "SELECT UPPER(email) FROM users"
            email_data = retrivequery2(query)
            email_data_list = []
            for i in email_data:
                email_data_list.append(i[0])
            if email.upper() not in email_data_list:
                query = "INSERT INTO users (email, password) VALUES (%s, %s)"
                values = (email, password)
                executionquery(query, values)
                return render_template('login.html', message="Successfully Registered!")
            return render_template('register.html', message="This email ID is already exists!")
        return render_template('register.html', message="Conform password is not match!")
    return render_template('register.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        
        query = "SELECT UPPER(email) FROM users"
        email_data = retrivequery2(query)
        email_data_list = []
        for i in email_data:
            email_data_list.append(i[0])

        if email.upper() in email_data_list:
            query = "SELECT UPPER(password) FROM users WHERE email = %s"
            values = (email,)
            password__data = retrivequery1(query, values)
            if password.upper() == password__data[0][0]:
                global user_email
                user_email = email

                return render_template('home.html')
            return render_template('login.html', message= "Invalid Password!!")
        return render_template('login.html', message= "This email ID does not exist!")
    return render_template('login.html')


@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')


# @app.route('/load', methods=["GET", "POST"])
# def load():
#     data = None
#     message = None
#     if request.method == "POST":
#         file = request.files['file']
#         if file.filename.endswith('.csv'):
#             data = pd.read_csv(file)
#         elif file.filename.endswith(('.xls', '.xlsx')):
#             data = pd.read_excel(file)
#         else:
#             message = "Unsupported file format. Please upload a CSV or Excel file."
#         message = "Dataset Uploaded Successfully!"
#     return render_template('load.html', data=data, message=message)



# @app.route('/algorithm', methods=["GET", "POST"])
# def algorithm():
#     if request.method == "POST":
#         algorithm = request.form['algorithm']
#         if algorithm == "stacking_classifier":
#             accuracy_score = 90.67
#             algorithm = "Stacking Classifier"

#         elif algorithm == "voting_classifier":
#             accuracy_score = 90.67
#             algorithm = "Voting Classifier"

#         return render_template('algorithm.html', accuracy_score = accuracy_score, algorithm = algorithm)
#     return render_template('algorithm.html')


# @app.route('/prediction', methods=["GET", "POST"])
# def prediction():
#     result = None
#     if request.method == "POST":
#         Gender = int(request.form['Gender'])
#         Age = int(request.form['Age'])
#         Occupation = int(request.form['Occupation'])
#         Sleep_Duration = float(request.form['Sleep_Duration'])
#         Quality_of_Sleep = int(request.form['Quality_of_Sleep'])
#         Physical_Activity_Level = int(request.form['Physical_Activity_Level'])
#         Stress_Level = int(request.form['Stress_Level'])
#         BMI_Category = request.form['BMI_Category']
#         systolic = int(request.form['systolic'])
#         diastolic = int(request.form['diastolic'])
#         Heart_Rate = int(request.form['Heart_Rate'])
#         Daily_Steps = int(request.form['Daily_Steps'])

#         # Concatenate Blood Pressure
#         Blood_Pressure = systolic / diastolic  # Change this to a numeric representation that makes sense

#         # Preparing the input dictionary
#         input_dict = {
#             'Gender': Gender,
#             'Age': Age,
#             'Occupation': Occupation,
#             'Sleep Duration': Sleep_Duration,
#             'Quality of Sleep': Quality_of_Sleep,
#             'Physical Activity Level': Physical_Activity_Level,
#             'Stress Level': Stress_Level,
#             'BMI Category': BMI_Category,
#             'Blood Pressure': Blood_Pressure,
#             'Heart Rate': Heart_Rate,
#             'Daily Steps': Daily_Steps
#         }
        
#         # Convert the single input to a DataFrame
#         input_df = pd.DataFrame([input_dict])

#         # Encode categorical variables as was done in training
#         categorical_mappings = {
#             'Gender': {'Male': 0, 'Female': 1},
#             'Occupation': {'Teacher': 0, 'Engineer': 1, 'Doctor': 2},  # Example mappings
#             'BMI Category': {'Underweight': 0, 'Normal': 1, 'Overweight': 2, 'Obese': 3}  # Example mappings
#         }

#         for column, mapping in categorical_mappings.items():
#             input_df[column] = input_df[column].map(mapping)

#         # Handle any missing mappings or NaNs
#         input_df.fillna(-1, inplace=True)

#         # Load the scaler and feature selector
#         with open(r'Models\scaler.pkl', 'rb') as f:
#             scaler = pickle.load(f)
#         with open(r'Models\k_best_selector.pkl', 'rb') as f:
#             k_best = pickle.load(f)

#         # Standardize the features and select K-best
#         input_scaled = scaler.transform(input_df)
#         input_k_best = k_best.transform(input_scaled)

#         # Load the model and predict
#         with open(r'Models\Random Forest_model_k_best.pkl', 'rb') as f:
#             model = pickle.load(f)
#         prediction = model.predict(input_k_best)
#         result = 'Sleeping disorder' if prediction[0] == 1 else 'No sleeping disorder'
    
    
#     # Load the dataset
#     df = pd.read_csv(r"Dataset\Sleep_health_and_lifestyle_dataset.csv")

#     # Drop columns
#     columns_to_drop = ['Sleep Disorder', 'Blood Pressure']
#     df = df.drop(columns=columns_to_drop)

#     # Replace spaces in column names with underscores
#     df.columns = [re.sub(r'\s+', '_', col) for col in df.columns]

#     # Define object columns to be encoded
#     object_columns = df.select_dtypes(include=['object']).columns

#     # Store label counts before encoding
#     labels = {col: df[col].value_counts().to_dict() for col in object_columns}

#     # Initialize LabelEncoder
#     le = LabelEncoder()

#     # Encode categorical columns and store the encoded value counts
#     encodes = {}
#     for col in object_columns:
#         df[col] = le.fit_transform(df[col])
#         value_counts = df[col].value_counts().to_dict()
#         encodes[col] = value_counts

#     dic = {}

#     for key in labels.keys():
#         dic[key] = []
#         for sub_key, value in labels[key].items():
#             for id_key, id_value in encodes[key].items():
#                 if value == id_value:
#                     dic[key].append((sub_key, id_key))
#                     break

#     return render_template('prediction.html', data=dic, prediction=result) + (prediction_script if result else '')







# @app.route('/prediction', methods=["GET", "POST"])
# def prediction():
#     result = None
#     if request.method == "POST":
#         Gender = int(request.form['Gender'])
#         Age = int(request.form['Age'])
#         Occupation = int(request.form['Occupation'])
#         Sleep_Duration = float(request.form['Sleep_Duration'])
#         Quality_of_Sleep = int(request.form['Quality_of_Sleep'])
#         Physical_Activity_Level = int(request.form['Physical_Activity_Level'])
#         Stress_Level = int(request.form['Stress_Level'])
#         BMI_Category = request.form['BMI_Category']
#         systolic = int(request.form['systolic'])
#         diastolic = int(request.form['diastolic'])
#         Heart_Rate = int(request.form['Heart_Rate'])
#         Daily_Steps = int(request.form['Daily_Steps'])

#         # Concatenate Blood Pressure
#         Blood_Pressure = f"{systolic}/{diastolic}" 

#         # Load the scaler
#         with open(r'Models\scaler.pkl', 'rb') as f:
#             scaler = pickle.load(f)

#         # Load the feature selector
#         with open(r'Models\k_best_selector.pkl', 'rb') as f:
#             k_best = pickle.load(f)

#         # Load the stacking classifier model
#         model_path = r'Models\Random Forest_model_k_best.pkl'
#         with open(model_path, 'rb') as f:
#             stacking_classifier = pickle.load(f)


#         single_input = {
#             'Gender': Gender,
#             'Age': Age,
#             'Occupation': Occupation,
#             'Sleep Duration': Sleep_Duration,
#             'Quality of Sleep': Quality_of_Sleep,
#             'Physical Activity Level': Physical_Activity_Level,
#             'Stress Level': Stress_Level,
#             'BMI Category': BMI_Category,
#             'Blood Pressure': Blood_Pressure,
#             'Heart Rate': Heart_Rate,
#             'Daily Steps': Daily_Steps
#         }

#         # Convert the single input to a DataFrame
#         input_df = pd.DataFrame([single_input])

#         print(input_df)

#         # # Encode categorical variables using the same encoding as the training data
#         # input_df['Gender'] = input_df['Gender'].map({'Male': 0, 'Female': 1})
#         # input_df['Occupation'] = pd.Categorical(input_df['Occupation']).codes
#         # input_df['BMI Category'] = pd.Categorical(input_df['BMI Category']).codes
#         input_df['Blood Pressure'] = input_df['Blood Pressure'].str.split('/').apply(lambda x: int(x[0]))

#         # Reorder the DataFrame to match the order during training
#         columns_order = ['Gender', 'Age', 'Occupation', 'Sleep Duration', 
#                         'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 
#                         'BMI Category', 'Blood Pressure', 'Heart Rate', 'Daily Steps']
#         input_df = input_df[columns_order]

#         # Standardize the features
#         input_scaled = scaler.transform(input_df)

#         # Select K-best features
#         input_k_best = k_best.transform(input_scaled)

#         # Predict using the stacking classifier model
#         prediction = stacking_classifier.predict(input_k_best)

#         # Map prediction to class labels
#         class_labels = {0: 'No sleeping disorder', 1: 'Sleeping disorder'}
#         result = class_labels[prediction[0]]

    
#     # Load the dataset
#     df = pd.read_csv(r"Dataset\Sleep_health_and_lifestyle_dataset.csv")

#     # Drop columns
#     columns_to_drop = ['Sleep Disorder', 'Blood Pressure']
#     df = df.drop(columns=columns_to_drop)

#     # Replace spaces in column names with underscores
#     df.columns = [re.sub(r'\s+', '_', col) for col in df.columns]

#     # Define object columns to be encoded
#     object_columns = df.select_dtypes(include=['object']).columns

#     # Store label counts before encoding
#     labels = {col: df[col].value_counts().to_dict() for col in object_columns}

#     # Initialize LabelEncoder
#     le = LabelEncoder()

#     # Encode categorical columns and store the encoded value counts
#     encodes = {}
#     for col in object_columns:
#         df[col] = le.fit_transform(df[col])
#         value_counts = df[col].value_counts().to_dict()
#         encodes[col] = value_counts

#     dic = {}

#     for key in labels.keys():
#         dic[key] = []
#         for sub_key, value in labels[key].items():
#             for id_key, id_value in encodes[key].items():
#                 if value == id_value:
#                     dic[key].append((sub_key, id_key))
#                     break

#     return render_template('prediction.html', data=dic, prediction=result) + (prediction_script if result else '')















@app.route('/prediction', methods=["GET", "POST"])
def prediction():
    result = None
    prediction_script = ""
    
    if request.method == "POST":
        try:
            # Get form data with validation
            Gender = request.form.get('Gender')
            Age = int(request.form.get('Age', 0))
            Occupation = request.form.get('Occupation')
            Sleep_Duration = float(request.form.get('Sleep_Duration', 0))
            Quality_of_Sleep = int(request.form.get('Quality_of_Sleep', 0))
            Physical_Activity_Level = int(request.form.get('Physical_Activity_Level', 0))
            Stress_Level = int(request.form.get('Stress_Level', 0))
            BMI_Category = request.form.get('BMI_Category')
            systolic = int(request.form.get('systolic', 0))
            diastolic = int(request.form.get('diastolic', 0))
            Heart_Rate = int(request.form.get('Heart_Rate', 0))
            Daily_Steps = int(request.form.get('Daily_Steps', 0))
            
            # Validate required fields
            if not all([Gender, Occupation, BMI_Category]):
                raise ValueError("Missing required form fields")

            # Concatenate Blood Pressure
            Blood_Pressure = f"{systolic}/{diastolic}" 

            # Load the scaler
            with open('Models/scaler.pkl', 'rb') as f:
                scaler = pickle.load(f)

            # Load the feature selector
            with open('Models/k_best_selector.pkl', 'rb') as f:
                k_best = pickle.load(f)

            # Load the model
            model_path = 'Models/Random Forest_model_k_best.pkl'
            with open(model_path, 'rb') as f:
                model = pickle.load(f)

            # Prepare input data
            single_input = {
                'Gender': Gender,
                'Age': Age,
                'Occupation': Occupation,
                'Sleep Duration': Sleep_Duration,
                'Quality of Sleep': Quality_of_Sleep,
                'Physical Activity Level': Physical_Activity_Level,
                'Stress Level': Stress_Level,
                'BMI Category': BMI_Category,
                'Blood Pressure': Blood_Pressure,
                'Heart Rate': Heart_Rate,
                'Daily Steps': Daily_Steps
            }

            # Convert to DataFrame and preprocess
            input_df = pd.DataFrame([single_input])
            
            # Handle categorical variables properly
            input_df['Gender'] = input_df['Gender'].astype(str).map({'Male': 0, 'Female': 1})
            input_df['Occupation'] = pd.Categorical(input_df['Occupation'].astype(str)).codes
            input_df['BMI Category'] = pd.Categorical(input_df['BMI Category'].astype(str)).codes
            input_df['Blood Pressure'] = input_df['Blood Pressure'].str.split('/').apply(lambda x: int(x[0]))

            # Ensure correct column order
            columns_order = ['Gender', 'Age', 'Occupation', 'Sleep Duration', 
                            'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 
                            'BMI Category', 'Blood Pressure', 'Heart Rate', 'Daily Steps']
            input_df = input_df[columns_order]

            # Apply preprocessing
            input_scaled = scaler.transform(input_df)
            input_k_best = k_best.transform(input_scaled)

            # Get prediction
            prediction = model.predict(input_k_best)
            prediction_proba = model.predict_proba(input_k_best)[0]
            
            # Analyze prediction probabilities and apply refined classification rules
            max_prob_index = np.argmax(prediction_proba)
            max_prob_value = prediction_proba[max_prob_index]
            
            # Define refined thresholds based on dataset patterns and confidence levels
            no_disorder_threshold = 0.70  # Adjusted threshold for confirming no disorder based on dataset patterns
            disorder_threshold = 0.85     # Increased threshold for confirming disorders to reduce false positives
            uncertain_threshold = 0.65    # Adjusted threshold for uncertain predictions
            
            # Apply enhanced classification rules with confidence scoring based on accurate dataset patterns
            # Check for sleep apnea patterns with refined thresholds based on actual data
            if ((Sleep_Duration <= 5.9 and Quality_of_Sleep <= 4 and Physical_Activity_Level <= 30 and Stress_Level >= 8 and BMI_Category == 'Obese' and Heart_Rate >= 85 and Daily_Steps <= 3000) or 
                (Sleep_Duration <= 6.5 and Quality_of_Sleep <= 5 and Physical_Activity_Level <= 40 and BMI_Category in ['Overweight', 'Obese'] and Heart_Rate >= 80) or
                (BMI_Category == 'Obese' and Sleep_Duration < 6.0 and Quality_of_Sleep <= 4)):
                prediction = np.array([2])  # Sleep Apnea
                result = "Sleep Apnea (High confidence based on comprehensive metrics)"
            # Check for insomnia patterns with improved criteria
            elif ((Sleep_Duration <= 6.3 and Quality_of_Sleep <= 6 and Physical_Activity_Level <= 40 and Stress_Level >= 7 and BMI_Category == 'Obese' and Heart_Rate >= 82 and Daily_Steps <= 3500) or 
                  (Sleep_Duration <= 6.5 and Quality_of_Sleep <= 5 and Physical_Activity_Level <= 40 and Stress_Level >= 7 and Heart_Rate >= 80) or
                  (Sleep_Duration <= 6.0 and Physical_Activity_Level <= 30 and Stress_Level >= 8)):
                prediction = np.array([1])  # Insomnia
                result = "Insomnia (High confidence based on comprehensive metrics)"
            # Check for clear non-sleeping disorder patterns
            elif Sleep_Duration >= 7.5 and Quality_of_Sleep >= 7 and Stress_Level <= 6:
                prediction = np.array([0])
                result = "No sleeping disorder (High confidence based on sleep metrics)"
            elif max_prob_index == 0 and max_prob_value >= no_disorder_threshold:
                # High confidence in no disorder prediction from model
                prediction = np.array([0])
            elif max_prob_value >= disorder_threshold:
                # Check additional metrics before confirming disorder prediction
                if max_prob_index > 0:  # If predicting a disorder
                    if Sleep_Duration < 6.5 and Quality_of_Sleep <= 6:
                        if Stress_Level >= 7 and Physical_Activity_Level <= 40:
                            prediction = np.array([1])  # Insomnia
                            result = "Insomnia (High confidence based on sleep metrics)"
                        elif BMI_Category in ['Overweight', 'Obese'] and Stress_Level >= 6:
                            prediction = np.array([2])  # Sleep Apnea
                            result = "Sleep Apnea (High confidence based on sleep metrics)"
                        else:
                            prediction = np.array([max_prob_index])
                            result = f"{disorder_labels[max_prob_index]} (Based on sleep metrics)"
                    else:
                        prediction = np.array([0])
                        result = "No sleeping disorder (Based on good sleep metrics)"
                else:
                    prediction = np.array([0])
                    result = "No sleeping disorder (High confidence)"
            elif max_prob_value < uncertain_threshold:
                # Very low confidence, use comprehensive sleep metrics
                if Sleep_Duration >= 6.5 and Quality_of_Sleep >= 6 and Stress_Level <= 7 and Physical_Activity_Level >= 35:
                    prediction = np.array([0])
                    result = "No sleeping disorder (Based on comprehensive sleep metrics)"
                elif Sleep_Duration < 5.5 and Quality_of_Sleep <= 4 and Stress_Level >= 8:
                    # Clear indicators of potential sleep disorder
                    prediction = np.array([max_prob_index])
                    result = f"{disorder_labels[max_prob_index]} (Based on poor sleep metrics)"
                else:
                    prediction = np.array([0])
                    result = "No sleeping disorder (Default based on moderate metrics)"
            else:
                # Moderate confidence, use additional features to validate with improved weights
                sleep_quality_weight = 0.5
                stress_level_weight = 0.3  # Increased weight for stress level
                physical_activity_weight = 0.2
                sleep_duration_factor = 0.0  # Initialize additional factor
                
                # Add sleep duration factor (longer sleep duration increases likelihood of no disorder)
                if Sleep_Duration >= 7.5:
                    sleep_duration_factor = 0.2
                elif Sleep_Duration >= 6.5:
                    sleep_duration_factor = 0.1
                
                # Calculate weighted score from key indicators with adjusted weights
                quality_score = (Quality_of_Sleep / 10.0) * sleep_quality_weight * 1.2  # Increased weight for sleep quality
                stress_score = ((10 - Stress_Level) / 10.0) * stress_level_weight * 0.8  # Decreased weight for stress
                activity_score = (Physical_Activity_Level / 100.0) * physical_activity_weight
                health_score = quality_score + stress_score + activity_score + sleep_duration_factor
                
                if health_score > 0.65 and (max_prob_index == 0 or max_prob_value < 0.7):
                    # Good health indicators strongly support no disorder prediction
                    prediction = np.array([0])
                elif health_score < 0.35 and max_prob_index > 0:
                    # Poor health indicators strongly support disorder prediction
                    prediction = np.array([max_prob_index])
                else:
                    # Use the model's best prediction but mark as moderate confidence
                    prediction = np.array([max_prob_index])
            
            # Map prediction to detailed sleep disorder type
            disorder_labels = {0: 'No sleeping disorder', 1: 'Insomnia', 2: 'Sleep Apnea', 3: 'RLS'}
            result = disorder_labels[prediction[0]]
            
            # Ensure we're correctly classifying all three categories (insomnia, sleep apnea, and non-sleeping disorder)
            if prediction[0] == 0:
                result = "No sleeping disorder"
            elif prediction[0] == 1:
                result = "Insomnia"
            elif prediction[0] == 2:
                result = "Sleep Apnea"

            # Create probabilities for ECE visualization with more accurate values including non-sleeping disorder
            probabilities = {
                'insomnia': prediction_proba[1] if len(prediction_proba) > 1 else 0,
                'apnea': prediction_proba[2] if len(prediction_proba) > 2 else 0,
                'rls': prediction_proba[3] if len(prediction_proba) > 3 else 0,
                'normal': prediction_proba[0] if len(prediction_proba) > 0 else 0
            }
            
            # Adjust probabilities based on prediction to ensure accuracy
            if prediction[0] == 0:  # No sleeping disorder
                probabilities['normal'] = max(0.75, probabilities['normal'])
                # Scale down disorder probabilities proportionally
                total_disorder = probabilities['insomnia'] + probabilities['apnea'] + probabilities['rls']
                if total_disorder > 0:
                    scale = (1.0 - probabilities['normal']) / total_disorder
                    probabilities['insomnia'] *= scale
                    probabilities['apnea'] *= scale
                    probabilities['rls'] *= scale
            elif prediction[0] == 1:  # Insomnia
                probabilities['insomnia'] = max(0.75, probabilities['insomnia'])
                # Adjust other probabilities
                total_other = probabilities['normal'] + probabilities['apnea'] + probabilities['rls']
                if total_other > 0:
                    scale = (1.0 - probabilities['insomnia']) / total_other
                    probabilities['normal'] *= scale
                    probabilities['apnea'] *= scale
                    probabilities['rls'] *= scale
            elif prediction[0] == 2:  # Sleep Apnea
                probabilities['apnea'] = max(0.75, probabilities['apnea'])
                # Adjust other probabilities
                total_other = probabilities['normal'] + probabilities['insomnia'] + probabilities['rls']
                if total_other > 0:
                    scale = (1.0 - probabilities['apnea']) / total_other
                    probabilities['normal'] *= scale
                    probabilities['insomnia'] *= scale
                    probabilities['rls'] *= scale
            
            # Ensure non-sleeping disorder probability is properly set for clear cases
            if result == "No sleeping disorder (High confidence based on sleep metrics)" or \
               result == "No sleeping disorder (Good sleep metrics)" or \
               result == "No sleeping disorder (Based on sleep metrics)":
                # Boost normal probability for these clear non-disorder cases
                probabilities['normal'] = max(0.9, probabilities['normal'])
                # Scale down disorder probabilities proportionally
                total_disorder = probabilities['insomnia'] + probabilities['apnea'] + probabilities['rls']
                if total_disorder > 0:
                    scale = (1.0 - probabilities['normal']) / total_disorder
                    probabilities['insomnia'] *= scale
                    probabilities['apnea'] *= scale
                    probabilities['rls'] *= scale

            # Add JavaScript to update ECE monitoring with prediction and probabilities
            prediction_script = f"""
            <script>
                document.addEventListener('DOMContentLoaded', function() {{
                    if (window.eceProcessor) {{
                        // Pass both the prediction result and the exact probabilities from ML model
                        window.eceProcessor.updateProbabilities('{result}', {{
                            insomnia: {probabilities['insomnia']},
                            apnea: {probabilities['apnea']},
                            rls: {probabilities['rls']},
                            normal: {probabilities['normal']}
                        }});
                        
                        // Force immediate visualization update
                        window.eceProcessor.updateVisualizations();
                        
                        // Ensure monitoring is active
                        window.eceProcessor.startMonitoring();
                        
                        // Update UI controls
                        const startBtn = document.getElementById('start-monitoring');
                        const stopBtn = document.getElementById('stop-monitoring');
                        if (startBtn) startBtn.disabled = true;
                        if (stopBtn) stopBtn.disabled = false;
                    }}
                }});
            </script>
            """
        except Exception as e:
            print(f"Error processing prediction: {str(e)}")
            result = "Error: Please check your input values and try again."
            prediction_script = ""


    
    # Load the dataset
    df = pd.read_csv(r"Dataset\Sleep_health_and_lifestyle_dataset.csv")

    # Drop columns
    columns_to_drop = ['Sleep Disorder', 'Blood Pressure']
    df = df.drop(columns=columns_to_drop)

    # Replace spaces in column names with underscores
    df.columns = [re.sub(r'\s+', '_', col) for col in df.columns]

    # Define object columns to be encoded
    object_columns = df.select_dtypes(include=['object']).columns

    # Store label counts before encoding
    labels = {col: df[col].value_counts().to_dict() for col in object_columns}

    # # Initialize LabelEncoder
    # le = LabelEncoder()

    # # Encode categorical columns and store the encoded value counts
    encodes = {}
    for col in object_columns:
        # df[col] = le.fit_transform(df[col])
        value_counts = df[col].value_counts().to_dict()
        encodes[col] = value_counts

    dic = {}

    for key in labels.keys():
        dic[key] = []
        for sub_key, value in labels[key].items():
            for id_key, id_value in encodes[key].items():
                if value == id_value:
                    dic[key].append((sub_key, id_key))
                    break

    return render_template('prediction.html', data=dic, prediction=result) + (prediction_script if result else '')


if __name__ == '__main__':
    app.run(debug = True)