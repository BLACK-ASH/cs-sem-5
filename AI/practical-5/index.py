from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

# Load the Iris dataset
iris = datasets.load_iris()
x = iris.data[iris.target != 2]
y = iris.target[iris.target != 2]

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.21, random_state=44)

# Standardize the features
scaler = StandardScaler()
X_train, X_test = scaler.fit_transform(X_train), scaler.transform(X_test)

# Create the SVM model using a linear kernel
model = SVC(kernel="linear", C=1.0)

# Train the SVM model
model.fit(X_train, y_train)

# Predict the classes of the test data
pred = model.predict(X_test)

# Calculate the accuracy of the model
accuracy = accuracy_score(y_test, pred) * 100

# Generate the classification report
report = classification_report(y_test, pred)

print(f"Accuracy : {accuracy}%")
print("Classification Report:\n", report)
