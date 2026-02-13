import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from config import PROCESSED_DATA_PATH, MODEL_PATH, TEST_SIZE, RANDOM_STATE

def train():
    df = pd.read_csv(PROCESSED_DATA_PATH)

    X = df.drop("target_demand", axis=1)
    y = df["target_demand"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=RANDOM_STATE
    )

    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)

    print("Model trained and saved")

if __name__ == "__main__":
    train()
