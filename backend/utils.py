import pandas as pd


def prepare_input(data, model_columns):
    """
    Convert user input into the same feature format
    used during model training.
    """

    # Create dataframe from user input
    df = pd.DataFrame([data])

    # One-hot encode
    df = pd.get_dummies(df)

    # Add any missing columns
    for col in model_columns:
        if col not in df.columns:
            df[col] = 0

    # Keep only training columns in correct order
    df = df[model_columns]

    return df