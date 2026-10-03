from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report , confusion_matrix

# Load the Iris dataset
iris = datasets.load_iris()
x = iris.data
y = iris.target

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.21, random_state=44)

# Standardize the features
scaler = StandardScaler()
X_train, X_test = scaler.fit_transform(X_train), scaler.transform(X_test)

# Create the SVM model using a linear kernel and Train SVM
model = SVC(kernel="linear", C=1.0)
model.fit(X_train, y_train)

# Predict the classes of the test data
y_pred = model.predict(X_test)

# Metrics
accuracy = accuracy_score(y_test, y_pred) * 100
report = classification_report(y_test, y_pred, target_names=iris.target_names)
matrix = confusion_matrix(y_test,y_pred)

print(f"Accuracy : {accuracy}%")
print("Classification Report \n", report)
print("Confusion Matrix \n", matrix)
