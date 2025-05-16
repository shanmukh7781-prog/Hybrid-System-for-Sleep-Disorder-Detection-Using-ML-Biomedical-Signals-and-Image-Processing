import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.tree import DecisionTreeClassifier
from imblearn.over_sampling import SMOTE
import pickle

# Load and preprocess data
df = pd.read_csv('Dataset/Sleep_health_and_lifestyle_dataset.csv')

# Encode categorical variables
le = LabelEncoder()
df['Gender'] = le.fit_transform(df['Gender'])
df['Occupation'] = le.fit_transform(df['Occupation'])
df['BMI Category'] = le.fit_transform(df['BMI Category'])

# Convert Blood Pressure to numeric (use systolic pressure)
df['Blood Pressure'] = df['Blood Pressure'].apply(lambda x: int(x.split('/')[0]))

# Handle Sleep Disorder (target variable)
df['Sleep Disorder'] = df['Sleep Disorder'].fillna('None')
df['Sleep Disorder'] = le.fit_transform(df['Sleep Disorder'])

# Prepare features and target
X = df.drop(['Person ID', 'Sleep Disorder'], axis=1)
y = df['Sleep Disorder']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Apply SMOTE for class balancing
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)

# Select K best features
k_best = SelectKBest(score_func=f_classif, k=8)
X_train_selected = k_best.fit_transform(X_train_balanced, y_train_balanced)
X_test_selected = k_best.transform(X_test_scaled)

# Train a simple Decision Tree model
model = DecisionTreeClassifier(
    max_depth=10,  # Limit tree depth
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)
model.fit(X_train_selected, y_train_balanced)

# Save the models and preprocessors using pickle protocol 3 for better compatibility
with open('Models/Random Forest_model_k_best.pkl', 'wb') as f:
    pickle.dump(model, f, protocol=3)

with open('Models/k_best_selector.pkl', 'wb') as f:
    pickle.dump(k_best, f, protocol=3)

with open('Models/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f, protocol=3)