from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score , classification_report , confusion_matrix

# Load Datasets
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Split and Tranform Datasets
X_train, X_test , y_train,y_test = train_test_split(X,y,test_size=0.21,random_state=44)

scaler = StandardScaler()
X_train,X_test = scaler.fit_transform(X_train),scaler.transform(X_test)

# Train Model
k = 4
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(X_train,y_train)

# Predict
y_pred = knn.predict(X_test)

# Metrics
accuracy = accuracy_score(y_test,y_pred)*100
report = classification_report(y_test,y_pred,target_names=iris.target_names)
matrix = confusion_matrix(y_test,y_pred)

print(f"Accuracy : {accuracy}")
print("Classification Report \n",report)
print("Confusion Matrix \n",matrix)

