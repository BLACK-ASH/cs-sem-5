import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score

# 1. Load a sample dataset (Iris dataset for binary classification)
iris = datasets.load_iris()
X = iris.data[iris.target != 2]  # Take only two classes for simple binary classification
y = iris.target[iris.target != 2]

# 2. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Scale features (SVM is sensitive to unscaled feature ranges)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 4. Initialize the Support Vector Classifier
# Common kernels: 'linear', 'rbf' (Radial Basis Function), 'poly'
model = SVC(kernel='linear', C=1.0) 

# 5. Train the model
model.fit(X_train, y_train)

# 6. Make predictions
predictions = model.predict(X_test)

# 7. Evaluate the performance
print(f"Accuracy: {accuracy_score(y_test, predictions):.2f}")
print("\nClassification Report:\n", classification_report(y_test, predictions))
