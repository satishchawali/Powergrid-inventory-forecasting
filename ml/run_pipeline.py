from src.data_preprocessing import preprocess
from src.feature_engineering import engineer_features
from src.train_model import train
from src.evaluate_model import evaluate

def main():
    preprocess()
    engineer_features()
    train()
    evaluate()

if __name__ == "__main__":
    main()
