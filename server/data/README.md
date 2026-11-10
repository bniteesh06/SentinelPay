# Dataset Source & Provenance

### Dataset Name
**Credit Card Fraud Detection Dataset (2020)**  
* Originally published on Kaggle by Kartik Shenoy: `kartik2112/fraud-detection`
* Mirrored on Hugging Face: `dazzle-nu/CIS435-CreditCardFraudDetection` (Apache 2.0 / CC0 Public Domain)

### Schema & Features
This dataset contains simulated credit card transactions covering legitimate behavior and real fraud patterns:
* `trans_date_trans_time`: Timestamp of transaction
* `cc_num`: Credit card number (masked)
* `merchant`: Merchant / retailer name
* `category`: Transaction spending category (`grocery_pos`, `shopping_net`, `gas_transport`, `misc_net`, etc.)
* `amt`: Transaction amount in USD ($)
* `first`, `last`: Cardholder name
* `city`, `state`, `zip`: Cardholder billing location
* `lat`, `long`: Cardholder GPS coordinates
* `merch_lat`, `merch_long`: Merchant POS coordinates
* `is_fraud`: Ground-truth fraud label (`1` = Fraudulent transaction, `0` = Legitimate)

### Ingestion in SentinelPay
* The raw extracted CSV slice is preserved in [`kaggle_creditcard_fraud_dataset.csv`](./kaggle_creditcard_fraud_dataset.csv).
* The normalized records are mapped in [`dataset.json`](./dataset.json) for live WebSocket streaming and database seeding.


