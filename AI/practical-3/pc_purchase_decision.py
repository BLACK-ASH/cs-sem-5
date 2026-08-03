import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier, plot_tree, export_graphviz
import matplotlib.pyplot as plt
import graphviz

df = pd.read_csv("pc_purchase.csv")

le = LabelEncoder()
for col in ['Age', 'Income', 'Education', 'Prior Purchase', 'Buys PC']:
    df[col] = le.fit_transform(df[col])

X = df[['Age', 'Income', 'Education', 'Prior Purchase']]
y = df['Buys PC']

clf = DecisionTreeClassifier(criterion='entropy')
clf = clf.fit(X, y)

plt.figure(figsize=(12, 8))
plot_tree(
    clf,
    feature_names=['Age', 'Income', 'Education', 'Prior Purchase'],
    class_names=['No', 'Yes'],
    filled=True,
    rounded=True
)
plt.show()

dot_data = export_graphviz(
    clf,
    out_file=None,
    feature_names=['Age', 'Income', 'Education', 'Prior Purchase'],
    class_names=['No', 'Yes'],
    filled=True,
    rounded=True,
    special_characters=True
)

graph = graphviz.Source(dot_data)
graph.render(
    "pc_purchase_decision_tree",
    format="png"
)
graph.view()

y_pred = clf.predict(X)
print("Preciction : ", y_pred)
print("Actuals : ", y.values)
print("Match Mask : ", y.values == y_pred)

accuracy = np.mean(y.values == y_pred)
print(f"Tranning accuracy : {accuracy*100:.1f}%")
