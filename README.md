# Hybrid-System-for-Sleep-Disorder-Detection-Using-ML-Biomedical-Signals-and-Image-Processing
This project presents an integrated system designed to classify sleep disorders  specifically insomnia, sleep apnea, and healthy sleep  by combining the strengths of three distinct approaches traditional machine learning models, biomedical signal processing, and image-based facial analysis. Initially, the system utilizes health and lifestyle data from the Kaggle Sleep Health and Lifestyle Dataset to train a series of machine learning classifiers, including K-Nearest Neighbors (KNN), Support Vector Machine (SVM), Decision Tree, Random Forest, Artificial Neural Network (ANN), and ensemble models like Stacking and Voting Classifiers. These models provide robust prediction capabilities and demonstrate high accuracy, with the Stacking Classifier achieving 93%. To complement and strengthen the ML approach, real-time biomedical features such as EEG (Electroencephalogram) and HRV (Heart Rate Variability) are simulated based on user input and analyzed using signal processing techniques, helping to validate the ML predictions with physiological evidence. Further, an image processing module is implemented using OpenCV and dlib to extract facial landmarks and assess visual cues like eye openness, blink rate, jaw relaxation, facial symmetry, and nasolabial depth. These features assist in identifying signs of fatigue and breathing irregularities that are commonly associated with sleep disorders. Together, these components offer a flexible and user-driven system where individuals can choose their preferred diagnostic path — ML-based prediction, biomedical signal validation, or facial analysis — or combine them for a more comprehensive result. This multi-model hybrid approach enhances reliability, accessibility, and interpretability, making the system a practical solution for scalable, real-world sleep disorder diagnostics.


https://fantastic-vacherin-29fd8d.netlify.app/ 
A basic web demo is deployed to showcase the image-processing module independently. It allows users to upload a facial image and receive a sleep disorder classification based on visual analysis alone  without ML models or biomedical signal inputs  as a lightweight demo version. However, compared to machine learning models, facial analysis using OpenCV and dlib is more challenging, especially because disorders like insomnia and sleep apnea often share overlapping visual cues such as dark circles, making it difficult to distinguish between them purely based on facial landmarks. Without supporting parameters like sleep duration, physical stress levels etc, the image only approach may lack precision. Therefore, while this module serves as an experimental demonstration of visual classification, the primary foundation of the project remains the machine learning model trained on health and lifestyle data. The image processing component was added to explore its effectiveness as a standalone tool and to complement the full hybrid system for broader diagnostic flexibility.
![image](https://github.com/user-attachments/assets/2871eafc-6b48-42bc-a6f7-3b79d251895d)
![image](https://github.com/user-attachments/assets/a06f85e1-2950-4233-9654-53b5ad2ed43e)
![image](https://github.com/user-attachments/assets/4d4e1bd7-83c1-463c-8679-a02e407b13ec)
![image](https://github.com/user-attachments/assets/328f973e-a30f-4c0e-ba52-f4e2e5c30890)
![image](https://github.com/user-attachments/assets/6ad886bd-2d83-46e6-b56f-c77df9198a19)
![image](https://github.com/user-attachments/assets/c3ae850e-ace7-47cf-af0e-8efaf508d998)
![image](https://github.com/user-attachments/assets/a468e9dc-d23f-47f6-ba90-ab0136d78778)
![image](https://github.com/user-attachments/assets/162e209a-0f00-4a3b-a37f-402976dd5bec)
![image](https://github.com/user-attachments/assets/240a781e-acc4-41cd-a460-f9a794f4d9aa)
![image](https://github.com/user-attachments/assets/54aebd79-b265-4519-963b-9b523ca312a2)
![image](https://github.com/user-attachments/assets/a85f2bb4-8b02-4d8c-a2ae-b07f4fb5d399)
![image](https://github.com/user-attachments/assets/cfe67d6b-4982-47ef-963c-a9f9890186c9)
![image](https://github.com/user-attachments/assets/ff9e324e-3cbc-401b-b556-22fc95deaafa)
![image](https://github.com/user-attachments/assets/c530aa09-d864-450f-939a-e0fc69263dba)
![image](https://github.com/user-attachments/assets/716c7e20-d7ae-4c10-bef8-f0c1600c3188)
![image](https://github.com/user-attachments/assets/af72375a-159d-4c3b-b485-35164d60606c)
![image](https://github.com/user-attachments/assets/9a4a9ee5-c5a5-4c76-aea8-ff56787f3cde)
