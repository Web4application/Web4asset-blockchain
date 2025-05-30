import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Simulated blockchain transaction data
data = pd.read_csv('blockchain_transactions.csv')  # This will be your blockchain data
features = data[['transaction_time', 'user_activity', 'gas_price']]  # Features
target = data['future_transaction_volume']  # Target variable (what you want to predict)

model = RandomForestRegressor(n_estimators=100)
model.fit(features, target)

# Use the model to predict future transaction trends
prediction = model.predict(new_data)  # Where new_data is incoming blockchain data

# Example data (replace this with actual blockchain transaction data or IoT data)
data = pd.read_csv('shipment_data.csv')  # Simulated data (shipment conditions, weather, etc.)
features = data[['weather_condition', 'shipment_history', 'user_activity', 'time_of_day']]  # Features
target = data['delayed']  # Target variable (0 = no delay, 1 = delay)

# Split the data for training and testing
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Initialize and train the RandomForestClassifier model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Test the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100}%")

# Now that the model is trained, you can use it to predict future delays
def predict_delay(new_data):
    prediction = model.predict(new_data)
    return prediction
