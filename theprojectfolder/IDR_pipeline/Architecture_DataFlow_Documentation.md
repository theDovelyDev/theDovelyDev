# Project 1: Intelligent Document Processing Pipeline
## Architecture & Data Flow Documentation

---

## 🏗️ System Architecture Overview

### High-Level Components

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FRONTEND (S3 Static Website)           │
│  • HTML/CSS/JavaScript                  │
│  • File upload interface                │
│  • Results display                      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  API GATEWAY (REST API)                 │
│  • POST /upload   → Upload Handler      │
│  • GET  /results  → Results Handler     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  LAMBDA FUNCTIONS (Serverless)          │
│  • Upload Handler                       │
│  • Document Processor (Core Logic)      │
│  • Results Handler                      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  STORAGE (S3 Buckets)                   │
│  • Uploads bucket   (raw files)         │
│  • Processed bucket (JSON results)      │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  AI/ML SERVICES                         │
│  • AWS Textract  (OCR, Form extraction) │
│  • AWS Comprehend (NLP, Entities)       │
└─────────────────────────────────────────┘
```

---

## 📊 Detailed Data Flow

### Flow 1: Document Upload (User → Storage)

```
Step 1: User selects document
├─ User Action: Click upload or drag-drop file
├─ File Type: PDF, JPG, PNG
└─ Size Limit: 5MB (configurable)

Step 2: Frontend processes file
├─ JavaScript converts file to Base64
├─ Prepares JSON payload
└─ Sends POST request to API Gateway

Step 3: API Gateway receives request
├─ Validates request format
├─ Routes to Upload Handler Lambda
└─ Returns immediately (async processing)

Step 4: Upload Handler Lambda
├─ Decodes Base64 file content
├─ Generates unique document ID (UUID)
├─ Constructs S3 key: uploads/{uuid}_{filename}
├─ Uploads to S3 Uploads bucket
└─ Returns success + documentId to user

Data Format at Each Stage:
┌──────────────────────────────────────────────────┐
│ Frontend → API                                   │
│ {                                                │
│   "fileName": "invoice_2024.pdf",                │
│   "fileContent": "base64_encoded_string...",     │
│   "contentType": "application/pdf"               │
│ }                                                │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Upload Handler → User                            │
│ {                                                │
│   "message": "File uploaded successfully",       │
│   "documentId": "a7f8d9e2-4b1c-...",            │
│   "s3Key": "uploads/a7f8d9e2_invoice_2024.pdf"  │
│ }                                                │
└──────────────────────────────────────────────────┘
```

### Flow 2: Document Processing (Storage → AI Services)

```
Step 5: S3 triggers Lambda function
├─ S3 Event: ObjectCreated
├─ Filter: uploads/* prefix
└─ Invokes: Document Processor Lambda

Step 6: Document Processor Lambda starts
├─ Receives: S3 event notification
├─ Extracts: Bucket name + Object key
└─ Logs: "Processing document: {key}"

Step 7: AWS Textract extraction
├─ Input: S3 bucket + key reference
├─ API Call: analyze_document()
├─ Features: TABLES, FORMS
├─ Processing: 
│   ├─ Identifies text blocks
│   ├─ Extracts key-value pairs
│   ├─ Detects tables
│   └─ Returns structured data
└─ Output: Blocks array with text + metadata

Step 8: AWS Comprehend analysis
├─ Input: Full text from Textract
├─ Truncates: Max 5000 bytes
├─ API Calls:
│   ├─ detect_entities() → Names, dates, amounts
│   ├─ detect_sentiment() → Positive/Negative/Neutral
│   └─ detect_key_phrases() → Important terms
└─ Output: Structured analysis results

Step 9: Combine & store results
├─ Merges: Textract + Comprehend results
├─ Adds metadata: Timestamp, status
├─ Constructs: Final JSON object
├─ Saves to: S3 Processed bucket
└─ Key format: processed/{original_filename}.json

Data Format at Each Stage:
┌──────────────────────────────────────────────────┐
│ Textract Output (simplified)                     │
│ {                                                │
│   "Blocks": [                                    │
│     {                                            │
│       "BlockType": "LINE",                       │
│       "Text": "Invoice #12345",                  │
│       "Confidence": 99.8                         │
│     },                                           │
│     {                                            │
│       "BlockType": "KEY_VALUE_SET",              │
│       "EntityTypes": ["KEY"],                    │
│       "Text": "Amount Due"                       │
│     }                                            │
│   ]                                              │
│ }                                                │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Comprehend Output (simplified)                   │
│ {                                                │
│   "Entities": [                                  │
│     {                                            │
│       "Text": "Acme Corporation",                │
│       "Type": "ORGANIZATION",                    │
│       "Score": 0.98                              │
│     },                                           │
│     {                                            │
│       "Text": "$1,250.00",                       │
│       "Type": "QUANTITY",                        │
│       "Score": 0.95                              │
│     }                                            │
│   ],                                             │
│   "Sentiment": "NEUTRAL"                         │
│ }                                                │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Final JSON (S3 Processed Bucket)                 │
│ {                                                │
│   "document_name": "invoice_2024.pdf",           │
│   "processed_at": "2025-01-07T10:30:45Z",        │
│   "extraction": {                                │
│     "full_text": "Invoice #12345...",            │
│     "key_value_pairs": {                         │
│       "Invoice Number": "12345",                 │
│       "Date": "2025-01-05",                      │
│       "Amount Due": "$1,250.00"                  │
│     },                                           │
│     "page_count": 2                              │
│   },                                             │
│   "analysis": {                                  │
│     "entities": [                                │
│       {                                          │
│         "text": "Acme Corporation",              │
│         "type": "ORGANIZATION",                  │
│         "score": 0.98                            │
│       }                                          │
│     ],                                           │
│     "sentiment": {                               │
│       "overall": "NEUTRAL",                      │
│       "scores": {                                │
│         "Positive": 0.05,                        │
│         "Negative": 0.02,                        │
│         "Neutral": 0.93                          │
│       }                                          │
│     },                                           │
│     "key_phrases": [                             │
│       {"text": "payment terms", "score": 0.95}  │
│     ]                                            │
│   },                                             │
│   "status": "success"                            │
│ }                                                │
└──────────────────────────────────────────────────┘
```

### Flow 3: Results Retrieval (User Request → Display)

```
Step 10: User requests results
├─ Frontend polls API (or user clicks "View Results")
├─ Sends: GET /results?documentId={uuid}
└─ API Gateway routes to Results Handler

Step 11: Results Handler Lambda
├─ Extracts: documentId from query params
├─ Constructs: S3 key pattern
├─ Lists: Objects in Processed bucket with prefix
├─ Finds: Matching result file
├─ Fetches: JSON from S3
└─ Returns: Processed results to frontend

Step 12: Frontend displays results
├─ Parses: JSON response
├─ Renders: Extracted data in UI
├─ Shows: Entities, sentiment, key phrases
└─ Updates: Stats counters
```

---

## 🔧 Key Components Breakdown

### 1. Frontend (S3 Static Website)

**Files:**
- `index.html` - Main page structure
- `styles.css` - Styling and layout
- `app.js` - Upload logic, API calls, results display

**Responsibilities:**
- File selection and validation
- Base64 encoding
- API communication
- Results visualization
- Statistics tracking

**Data Inputs:** User file selection
**Data Outputs:** API requests with Base64 files

---

### 2. API Gateway (REST API)

**Endpoints:**

```
POST /upload
├─ Purpose: Receive file uploads
├─ Integration: Lambda proxy → Upload Handler
├─ Request: JSON with Base64 file
├─ Response: documentId + s3Key
└─ CORS: Enabled

GET /results
├─ Purpose: Retrieve processing results
├─ Integration: Lambda proxy → Results Handler
├─ Query Param: documentId (required)
├─ Response: Processed JSON results
└─ CORS: Enabled
```

**Responsibilities:**
- Request routing
- CORS handling
- Request/response transformation
- Rate limiting (optional)

---

### 3. Lambda Functions

#### 3a. Upload Handler
**Trigger:** API Gateway POST /upload
**Runtime:** Python 3.11
**Memory:** 256MB
**Timeout:** 30s

**Process:**
1. Receive Base64 file
2. Decode to binary
3. Generate UUID
4. Upload to S3
5. Return documentId

**Data Flow:**
```
API Request → Decode → Generate ID → S3 Upload → Response
```

#### 3b. Document Processor (Core)
**Trigger:** S3 ObjectCreated event (uploads/*)
**Runtime:** Python 3.11
**Memory:** 512MB
**Timeout:** 60s

**Process:**
1. Receive S3 event
2. Call Textract (OCR + Forms)
3. Call Comprehend (NLP)
4. Merge results
5. Save to S3 Processed bucket

**Data Flow:**
```
S3 Event → Fetch File → Textract → Comprehend → Combine → Save JSON
```

**Key Functions:**
- `extract_text_from_document()` - Textract integration
- `analyze_text()` - Comprehend integration
- `extract_text_from_relationship()` - Parse Textract blocks
- `extract_value_text()` - Get key-value pairs

#### 3c. Results Handler
**Trigger:** API Gateway GET /results
**Runtime:** Python 3.11
**Memory:** 256MB
**Timeout:** 30s

**Process:**
1. Extract documentId from query
2. Search S3 Processed bucket
3. Fetch JSON result
4. Return to API Gateway

**Data Flow:**
```
API Request → Parse documentId → S3 Lookup → Fetch JSON → Response
```

---

### 4. S3 Buckets

#### Uploads Bucket
**Name:** `{project}-uploads-{account-id}`
**Purpose:** Store raw uploaded documents
**Lifecycle:** 90 days → Glacier (optional)
**Versioning:** Enabled (recommended)
**Encryption:** AES-256 (default)

**Structure:**
```
uploads/
├── {uuid}_document1.pdf
├── {uuid}_document2.jpg
└── {uuid}_document3.png
```

#### Processed Bucket
**Name:** `{project}-processed-{account-id}`
**Purpose:** Store processing results (JSON)
**Lifecycle:** 90 days → Glacier
**Structure:**
```
processed/
├── {uuid}_document1.pdf.json
├── {uuid}_document2.jpg.json
└── {uuid}_document3.png.json
```

#### Frontend Bucket
**Name:** `{project}-frontend-{account-id}`
**Purpose:** Host static website
**Public Access:** Enabled (for website)
**Structure:**
```
/
├── index.html
├── styles.css
└── app.js
```

---

### 5. AI/ML Services

#### AWS Textract
**API:** `analyze_document()`
**Features Used:**
- TABLES - Extract tabular data
- FORMS - Extract key-value pairs

**Input:** S3 reference (bucket + key)
**Output:** Blocks array with:
- LINE blocks (text lines)
- WORD blocks (individual words)
- KEY_VALUE_SET blocks (form fields)
- TABLE blocks (rows/cells)

**Cost:** $1.50 per 1,000 pages
**Free Tier:** 1,000 pages/month (first 3 months)

#### AWS Comprehend
**APIs Used:**
1. `detect_entities()` - Find people, places, dates, amounts
2. `detect_sentiment()` - Determine document tone
3. `detect_key_phrases()` - Extract important phrases

**Input:** Text string (max 5000 bytes)
**Output:** JSON with confidence scores

**Cost:** $0.0001 per unit (100 chars = 1 unit)
**Free Tier:** 50,000 units/month (first 12 months)

---

### 6. CloudWatch (Monitoring)

**Log Groups:**
- `/aws/lambda/DocumentProcessor`
- `/aws/lambda/APIUploadHandler`
- `/aws/lambda/APIResultsHandler`

**Metrics Tracked:**
- Lambda invocations
- Lambda duration
- Lambda errors
- S3 bucket size
- API Gateway requests

**Alarms (Optional):**
- Lambda error rate > 5%
- Processing time > 30s
- Estimated charges > $20

---

## 🔄 End-to-End Data Flow Summary

```
1. User uploads document (PDF/Image)
   └─> Frontend converts to Base64

2. Frontend → API Gateway → Upload Handler Lambda
   └─> Lambda saves to S3 Uploads bucket

3. S3 ObjectCreated event → Document Processor Lambda
   └─> Lambda fetches document from S3

4. Lambda → AWS Textract (OCR + Forms)
   └─> Returns: Text blocks, key-value pairs, tables

5. Lambda → AWS Comprehend (NLP)
   └─> Returns: Entities, sentiment, key phrases

6. Lambda combines results → JSON
   └─> Saves to S3 Processed bucket

7. User requests results
   └─> Frontend → API Gateway → Results Handler Lambda

8. Results Handler fetches JSON from S3
   └─> Returns to Frontend for display

9. All actions logged to CloudWatch
   └─> Monitored for errors and performance
```

---

## 📈 Data Volume & Performance

**Typical Document:**
- Size: 500KB - 2MB
- Pages: 1-3
- Processing time: 20-40 seconds

**Breakdown:**
- Upload: 2-5 seconds
- Textract: 10-20 seconds (depends on pages)
- Comprehend: 3-5 seconds
- Storage: 1-2 seconds

**Bottlenecks:**
1. Textract API (slowest component)
2. Lambda cold starts (first invocation)
3. Network latency (file upload)

**Optimization:**
- Use async Textract for large documents
- Implement Lambda warm-up
- Compress files before upload
- Batch processing for multiple documents

---

## 🔒 Security & Access Control

**IAM Roles:**

```
DocProcessingLambdaRole
├── AWSLambdaBasicExecutionRole (CloudWatch logs)
├── AmazonS3FullAccess (Read/Write S3)
├── AmazonTextractFullAccess (Textract API)
└── ComprehendFullAccess (Comprehend API)
```

**S3 Bucket Policies:**
- Uploads: Lambda read/write only
- Processed: Lambda write, API read only
- Frontend: Public read (static website)

**API Gateway:**
- CORS enabled for frontend domain
- Rate limiting: 1000 requests/second
- Authentication: None (can add API keys/Cognito)

---

## 💰 Cost Attribution

**Per Document Processing:**
- Textract: $0.0015 per page (avg 2 pages = $0.003)
- Comprehend: $0.01 per 100 units (avg 500 chars = $0.005)
- Lambda: $0.000002 per invocation (3 functions = $0.000006)
- S3: $0.000001 storage + requests
- **Total: ~$0.034 per document**

**Monthly Costs (500 documents):**
- AI Services: $8.00
- Lambda: $1.25
- S3: $1.15
- API Gateway: $0.01
- Data Transfer: $0.90
- CloudWatch: $2.00
- **Total: ~$17.00/month**

---

## 🎯 Success Metrics

**Performance:**
- Processing time: < 60 seconds
- Success rate: > 95%
- Extraction accuracy: > 90% for printed docs

**Cost:**
- Per document: < $0.05
- Monthly (500 docs): < $25
- Development: < $15

**Reliability:**
- Uptime: 99.9% (AWS SLA)
- Error rate: < 5%
- Recovery time: < 5 minutes

---

This architecture is designed to be:
✅ Scalable (handles 10,000+ docs/month)
✅ Cost-effective (leverages Free Tier)
✅ Maintainable (serverless, no infrastructure)
✅ Secure (IAM roles, encryption)
✅ Monitorable (CloudWatch integration)
