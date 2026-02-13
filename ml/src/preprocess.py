import pandas as pd
from sklearn.preprocessing import LabelEncoder
from config import PROCESSED_DATA_PATH

def preprocess():
    df = pd.read_csv(PROCESSED_DATA_PATH)

    # Target = next month demand
    df["target_demand"] = df.groupby("material_id")["historical_demand"].shift(-1)
    df.dropna(inplace=True)

    enc = LabelEncoder()
    df["material_id"] = enc.fit_transform(df["material_id"])
    df["season"] = enc.fit_transform(df["season"])

    df.to_csv(PROCESSED_DATA_PATH, index=False)
    print("Preprocessing done")

if __name__ == "__main__":
    preprocess()
