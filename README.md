# KoinX Reconciliation Engine

Transaction Reconciliation Engine built using Node.js, Express.js, and MongoDB.

The system ingests transaction data from two CSV sources:

* User transaction export
* Exchange transaction export

It validates, normalizes, reconciles, and categorizes transactions into:

* MATCHED
* CONFLICTING
* USER_ONLY
* EXCHANGE_ONLY

The reconciliation reports are stored in MongoDB and can also be downloaded as CSV files.

---

# Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* csv-parser
* json2csv

---

# Features

## CSV Ingestion

* Parses user and exchange CSV files
* Supports uploaded CSV files
* Falls back to default sample CSVs if no files are uploaded
* Stores all transactions in MongoDB

## Validation

Handles:

* Missing transaction ID
* Missing asset
* Missing transaction type
* Invalid quantity
* Invalid timestamp
* Invalid price for BUY/SELL transactions

## Duplicate Detection

* Detects duplicate transactions using `transaction_id`
* Flags duplicates as `DUPLICATE_TRANSACTION`
* Stores duplicates instead of silently dropping them

## Normalization

Handles:

* Case-insensitive asset matching
* Asset aliases (`BTC`, `Bitcoin`)
* Type mappings (`TRANSFER_IN`, `TRANSFER_OUT`)

## Matching Engine

Transactions are matched using:

* Asset matching
* Transaction type matching
* Timestamp tolerance
* Quantity tolerance

Supported reconciliation categories:

* MATCHED
* CONFLICTING
* USER_ONLY
* EXCHANGE_ONLY

## Reporting

* Full reconciliation report API
* Summary report API
* Unmatched transactions API
* Download reconciliation report as CSV

---

# Project Structure

```txt id="6vmh7o"
src/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── utils/
├── reports/    # Store downloaded report
├── data/       # Store input sample csv
├── app.js
├── index.js
└── constants.js
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env id="1tq7kz"
PORT=8000

MONGODB_URI=your_mongodb_connection_string

TIMESTAMP_TOLERANCE_SECONDS=300

QUANTITY_TOLERANCE_PCT=0.01
```

---

# Installation

```bash id="f0ffhx"
npm install
```

---

# Run the Server

```bash id="jbr2x7"
npm run dev
```

---

# API Endpoints

## Ingest Transactions

```http id="yqmyt8"
POST /api/ingest
```

Parses and stores CSV transactions.

---

## Run Reconciliation

```http id="d8r7q6"
POST /api/reconcile
```

Runs the reconciliation engine and stores reconciliation results.

---

## Get Full Report

```http id="2vry70"
GET /api/report/:runId
```

Returns the complete reconciliation report.

---

## Get Summary Report

```http id="n8jqeo"
GET /api/report/:runId/summary
```

Returns:

* matched count
* conflicting count
* unmatched count

---

## Get Unmatched Transactions

```http id="dx52cw"
GET /api/report/:runId/unmatched
```

Returns:

* USER_ONLY transactions
* EXCHANGE_ONLY transactions

---

## Download CSV Report

```http id="l0ol71"
GET /api/report/:runId/download
```

Downloads the reconciliation report as a CSV file.

---

# Matching Logic

Transactions are matched based on:

* normalized asset
* normalized transaction type
* timestamp tolerance
* quantity tolerance

Invalid transactions are excluded from reconciliation but still stored for traceability.

---

# Key Pointers

* Duplicate transactions are identified using `transaction_id`
* First valid candidate match is selected during reconciliation
* Invalid transactions do not participate in matching
* Use sample CSVs else update the csv in data.

---

