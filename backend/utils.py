import pandas as pd

def prepare_input(data, model_columns):
    """
    Convert user input into the same feature format
    used during model training.
    """

    df = pd.DataFrame([data])

    df = pd.get_dummies(df)

    for col in model_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[model_columns]

    return df