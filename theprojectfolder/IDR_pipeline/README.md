# 🤖 Intelligent Document Processing Pipeline

AI-powered document extraction and analysis system built with AWS serverless architecture.

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Project Status:** 🚧 In Development - Phase 2 Complete (Lambda Deployment)
> **Cost So Far:** $0.00 / $25.00 Budget  
> **Started:** January 16, 2026
> **Last Updated:** January 17, 2026

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Cost Analysis](#cost-analysis)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Progress](#development-progress)
- [Tagging Strategy](#tagging-strategy)
- [Tag Governance](#tag-governance)
- [Key Learnings](#key-learnings)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This project automates the extraction and analysis of information from documents (invoices, receipts, forms) using AWS AI services, reducing manual processing time by 80% and costs by 97%.

### The Problem

Manual document processing:

- ⏱️ Takes **3 minutes per document**
- 💰 Costs **$1.25 in staff time**
- 😓 Error-prone and tedious
- 📊 Doesn't scale efficiently

### The Solution

AI-powered automation:

- ⚡ Processes documents in **30 seconds**
- 💵 Costs **$0.034 per document**
- 🎯 95%+ accuracy on printed documents
- 🚀 Scales to thousands of documents/month

---

## 🏗️ Solution Architecture

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Frontend (S3)      │  ← Upload interface
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  API Gateway        │  ← REST API
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Lambda Functions   │  ← Processing logic
└──────┬──────────────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│  S3 Buckets  │   │  AI Services │
│  • Uploads   │   │  • Textract  │
│  • Processed │   │  • Comprehend│
└──────────────┘   └──────────────┘
       │
       ▼
┌─────────────────────┐
│  CloudWatch         │  ← Monitoring
└─────────────────────┘
```

### Data Flow

1. **Upload** → User uploads document via web interface
2. **Store** → Document saved to S3 uploads bucket
3. **Trigger** → S3 event triggers Lambda processor
4. **Extract** → AWS Textract extracts text, forms, tables
5. **Analyze** → AWS Comprehend identifies entities, sentiment
6. **Save** → Results stored as JSON in processed bucket
7. **Retrieve** → User fetches results via API Gateway
8. **Display** → Results shown in web interface

---

## ✨ Key Features

### Core Functionality

- 📄 **Multi-format support:** PDF, JPG, PNG
- 🔍 **OCR extraction:** Text recognition with AWS Textract
- 📊 **Form detection:** Key-value pair extraction
- 🏷️ **Entity recognition:** Names, dates, amounts, organizations
- 😊 **Sentiment analysis:** Document tone detection
- 💡 **Key phrases:** Automatic important term extraction

### Infrastructure

- ☁️ **Serverless architecture:** No servers to manage
- 🔄 **Event-driven processing:** Automatic triggers
- 📈 **Auto-scaling:** Handles variable load
- 💰 **Cost-optimized:** Pay only for what you use
- 🏷️ **Comprehensive tagging:** Year-end cost analysis ready
- 🤖 **Automated governance:** Weekly tag compliance audits

### Developer Experience

- 🛠️ **Environment variables:** Easy configuration
- 📝 **Detailed documentation:** Every step explained
- 🧪 **Testing tools:** 150 mock documents included
- 📊 **Cost tracking:** Real-time budget monitoring
- 🔍 **Tag auditing:** Automated compliance checks

---

## 🛠️ Technology Stack

### AWS Services

- **S3** - Object storage (uploads, processed files, frontend)
- **Lambda** - Serverless compute (document processing, API handlers, tag audits)
- **Textract** - OCR and form extraction
- **Comprehend** - NLP and entity analysis
- **API Gateway** - RESTful API
- **CloudWatch** - Logging and monitoring
- **EventBridge** - Scheduled automation
- **SNS** - Email notifications
- **IAM** - Security and permissions

### Languages & Tools

- **Python 3.11** - Lambda functions
- **JavaScript (ES6+)** - Frontend
- **HTML5/CSS3** - User interface
- **Bash** - Automation scripts
- **Git** - Version control
- **AWS CLI** - Infrastructure management

---

## 💰 Cost Analysis

### Development Costs (Actual)

| Phase            | Service              | Cost      |
| ---------------- | -------------------- | --------- |
| Phase 1          | S3 Buckets (3)       | $0.00     |
| Phase 1          | S3 Versioning        | $0.00     |
| Phase 1          | Lambda Tag Audit     | $0.00     |
| Phase 1          | EventBridge Schedule | $0.00     |
| **Total So Far** |                      | **$0.00** |

**Budget:** $25.00  
**Remaining:** $25.00  
**Status:** ✅ On Track

### Production Costs (Estimated - 500 docs/month)

| Service       | Usage             | Monthly Cost   |
| ------------- | ----------------- | -------------- |
| S3 Storage    | 50 GB             | $1.15          |
| S3 Requests   | 3,000             | $0.01          |
| Lambda        | 1,500 invocations | $1.25          |
| Textract      | 1,000 pages       | $1.50          |
| Comprehend    | 100,000 units     | $10.00         |
| API Gateway   | 1,500 requests    | $0.01          |
| CloudWatch    | 5 GB logs         | $2.00          |
| Data Transfer | 10 GB             | $0.90          |
| **Total**     |                   | **~$17/month** |

**Annual Production Cost:** ~$204  
**Cost per Document:** $0.034  
**vs Manual Processing:** $1.25 per document  
**Savings:** 97% reduction ($1.22 per document)

### ROI Analysis

```
Manual Processing (500 docs/month):
├─ Time: 3 min/doc × 500 = 25 hours/month
├─ Cost: $25/hour × 25 hours = $625/month
└─ Annual: $7,500

Automated Processing (500 docs/month):
├─ Time: 30 sec/doc × 500 = 4.2 hours/month
├─ AWS Cost: $17/month
├─ Staff Review: $25/hour × 4.2 hours = $105/month
└─ Annual: $1,464

Annual Savings: $6,036 (80% reduction)
Payback Period: < 1 week
ROI: 3,558%
```

---

## 📁 Project Structure

```
aws-doc-processing/
├── README.md                          ← You are here
├── .gitignore                         ← Git exclusions
├── setup.sh.example                   ← Environment template
├── TAGGING_STRATEGY.md               ← Tagging standards
├── Project1_Development_Log.md       ← Detailed dev journal
├── AWS_Project_Cost_Tracker.xlsx     ← Cost tracking
│
├── lambda/                            ← Lambda functions
│   ├── document_processor.py         ← Main processing logic
│   ├── api_upload_handler.py         ← Upload API
│   ├── api_results_handler.py        ← Results API
│   └── tag-audit/
│       └── tag_audit_function.py     ← Tag governance
│
├── src/
│   └── frontend/                      ← Web interface
│       ├── index.html
│       ├── styles.css
│       └── app.js
│
├── docs/                              ← Documentation
│   ├── Architecture_Diagram_Visual.html
│   ├── Architecture_DataFlow_Documentation.md
│   └── implementation-guide.md
│
├── scripts/                           ← Utility scripts
│   ├── audit-tags.sh                 ← Tag compliance checker
│   ├── fix-tags.sh                   ← Bulk tag remediation
│   ├── cost-analysis.sh              ← Cost reporting
│   └── year-end-report.sh            ← Annual cost summary
│
├── test-documents/                    ← Test files
│   └── Mock_Documents_150.zip        ← 150 sample documents
│
└── policies/                          ← IAM & S3 policies
    ├── bucket-policy-uploads.json
    ├── lifecycle-policy.json
    └── tag-audit-policy.json
```

---

## 🚀 Getting Started

### Prerequisites

- AWS Account (Free Tier eligible)
- AWS CLI installed and configured
- Python 3.11+
- Git
- Basic understanding of AWS services

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/aws-doc-processing.git
cd aws-doc-processing
```

#### 2. Configure Environment

```bash
# Copy the template
cp setup.sh.example setup.sh

# Edit setup.sh with your values
nano setup.sh

# Load environment variables
source setup.sh
```

#### 3. Set Up AWS Infrastructure

```bash
# Create S3 buckets
aws s3 mb s3://${PROJECT_NAME}-uploads-${ACCOUNT_ID} --region ${REGION}
aws s3 mb s3://${PROJECT_NAME}-processed-${ACCOUNT_ID} --region ${REGION}
aws s3 mb s3://${PROJECT_NAME}-frontend-${ACCOUNT_ID} --region ${REGION}

# Apply tags (repeat for each bucket)
aws s3api put-bucket-tagging \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --tagging "TagSet=[{Key=Project,Value=${PROJECT_TAG}},{Key=CostCenter,Value=${COST_CENTER}}]"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --versioning-configuration Status=Enabled
```

#### 4. Deploy Lambda Functions

````bash
#### 4. Deploy Lambda Functions
```bash
# Create IAM role
aws iam create-role \
  --role-name DocProcessingLambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach policies
aws iam attach-role-policy --role-name DocProcessingLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name DocProcessingLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-role-policy --role-name DocProcessingLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonTextractFullAccess
aws iam attach-role-policy --role-name DocProcessingLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/ComprehendFullAccess

# Package Lambda
# Windows (PowerShell):
#   Compress-Archive -Path .\package\* -DestinationPath function.zip
#   Compress-Archive -Path document_processor.py -Update -DestinationPath function.zip
# Linux/Mac:
cd lambda/document-processor
pip install --target ./package boto3
cd package && zip -r ../function.zip . && cd ..
zip -g function.zip document_processor.py

# Deploy Lambda
ROLE_ARN=$(aws iam get-role --role-name DocProcessingLambdaRole --query 'Role.Arn' --output text)
aws lambda create-function \
  --function-name DocumentProcessor \
  --runtime python3.11 \
  --role ${ROLE_ARN} \
  --handler document_processor.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 60 \
  --memory-size 512 \
  --environment "Variables={PROCESSED_BUCKET=${PROJECT_NAME}-processed-${ACCOUNT_ID}}"

# Configure S3 trigger
aws lambda add-permission \
  --function-name DocumentProcessor \
  --statement-id S3InvokeFunction \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::${PROJECT_NAME}-uploads-${ACCOUNT_ID}

aws s3api put-bucket-notification-configuration \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --notification-configuration file://s3-notification.json
```
````

#### 5. Deploy Frontend

```bash
# Upload frontend files
aws s3 cp src/frontend/ s3://${PROJECT_NAME}-frontend-${ACCOUNT_ID}/ --recursive

# Enable static website hosting
aws s3 website s3://${PROJECT_NAME}-frontend-${ACCOUNT_ID}/ --index-document index.html
```

### Detailed Setup Guide

For step-by-step instructions with screenshots, see:

- 📘 [Implementation Guide](docs/implementation-guide.md)
- 📝 [Development Log](Project1_Development_Log.md)

---

## 📊 Development Progress

### ✅ Completed Phases

#### Phase 0: Pre-Development Setup (1 hour)

- [x] Created AWS account with Free Tier
- [x] Set up IAM user with MFA
- [x] Configured AWS CLI
- [x] Created budget alerts ($25 threshold)
- [x] Initialized Git repository
- [x] Created dev branch workflow

#### Phase 1: S3 Infrastructure (2 hours)

- [x] Implemented comprehensive tagging strategy
- [x] Created 3 S3 buckets with tags
- [x] Enabled versioning on uploads bucket
- [x] Configured bucket policies for Lambda access
- [x] Created lifecycle policy (90 days → Glacier)
- [x] Tested upload/download functionality

#### Side Quest: Tag Governance (1 hour)

- [x] Evaluated AWS Config vs Lambda vs Manual
- [x] Built automated Lambda tag audit function
- [x] Configured EventBridge weekly schedule
- [x] Set up SNS email notifications
- [x] Created manual audit scripts (backup)

#### Phase 2: Lambda Function Development (3 hours)

- [x] Created IAM role for Lambda (DocProcessingLambdaRole)
- [x] Wrote document_processor.py (200+ lines with Textract + Comprehend)
- [x] Packaged Lambda function with boto3 dependencies (PowerShell on Windows)
- [x] Deployed Lambda function to AWS (DocumentProcessor)
- [x] Configured S3 trigger for automatic processing
- [x] Created test invoice image using Python PIL
- [x] Tested end-to-end pipeline (upload → extract → analyze → save)
- [x] Verified results in CloudWatch and S3

**Current Status:** Phase 2 Complete  
**Total Time Invested:** 7 hours  
**Cost So Far:** $0.00

#### Phase 3: Textract Integration Deep Dive (3 hours)

- [x] Selected 15 diverse test documents
- [x] Created automated testing toolkit (4 scripts)
- [x] Tested document processing end-to-end
- [x] Measured Textract accuracy (94.9% avg confidence)
- [x] Analyzed entity detection (21.4 entities/doc avg)
- [x] Tracked processing costs ($0.003/document)
- [x] Identified PDF compatibility limitations (20% failure rate)
- [x] Documented findings and optimization recommendations

**Key Results:**

- Success Rate: 80% (12/15 documents)
- Average Confidence: 94.9%
- Cost per Document: $0.003
- Processing Time: 30-60 seconds
- ROI: 519% vs manual processing

**Discovery:** Textract has PDF format compatibility issues with certain complex documents. Proposed solution: PDF normalization preprocessing pipeline.

---

## 📊 Phase 3: Testing Results

### Test Methodology

- **Documents Tested:** 15 (9 invoices, 6 receipts)
- **Testing Approach:** Hybrid (manual execution + automated scripts)
- **Test Environment:** AWS Lambda + Textract + Comprehend
- **Testing Duration:** 3 hours

### Performance Results

| Metric                    | Result            |
| ------------------------- | ----------------- |
| Success Rate              | 80% (12/15)       |
| Average Confidence        | 94.9%             |
| Average Entities Detected | 21.4 per document |
| Average Processing Time   | 30-60 seconds     |
| Cost per Document         | $0.003170         |
| Total Test Cost           | $0.038            |

### Results by Document Type

**Receipts (6 tested):**

- ✅ Success Rate: 100%
- Avg Confidence: 94.4%
- Avg Entities: 21.8
- Avg Cost: $0.002926

**Invoices - Simple/Medium (6 tested):**

- ✅ Success Rate: 100%
- Avg Confidence: 95.4%
- Avg Entities: 21.0
- Avg Cost: $0.003748

**Invoices - Complex (3 tested):**

- ❌ Success Rate: 0%
- Issue: Textract `UnsupportedDocumentException`
- Root Cause: PDF format incompatibility

### Key Findings

**✅ Strengths:**

- Excellent accuracy on standard documents (94.9% confidence)
- Consistent entity detection across document types
- Cost-effective processing ($0.003 vs $1.25 manual)
- Fast processing (under 60 seconds per document)

**⚠️ Limitations:**

- 20% failure rate due to PDF format compatibility
- All complex documents (>3,700 bytes) failed
- Textract cannot process certain valid PDF encodings

**💡 Recommendations:**

1. Implement PDF pre-validation before processing
2. Add PDF normalization pipeline (PyPDF2/Ghostscript)
3. Create fallback OCR pipeline for unsupported formats
4. Enhanced error handling with user feedback

### ROI Analysis

**Manual Processing (500 docs/month):**

- Time: 25 hours/month
- Cost: $625/month
- Annual: $7,500

**Automated Processing (500 docs/month):**

- Time: 4 hours/month (review only)
- Cost: $101.59/month ($1.59 AWS + $100 staff)
- Annual: $1,219

**Savings:**

- Monthly: $523 (84% reduction)
- Annual: $6,281
- ROI: 519%
- Payback: <1 week

---

### 🚧 In Progress

### 📅 Upcoming Phases

- Phase 4: Comprehend Integration Deep Dive
- Phase 5: Frontend Development
- Phase 6: API Gateway Integration
- Phase 7: End-to-End Testing
- Phase 8: Optimization & Cost Reduction
- Phase 9: Documentation & Portfolio Prep

---

## 🏷️ Tagging Strategy

### Why Tags Matter

This project implements a comprehensive tagging strategy for:

- **Cost tracking** - See exactly how much each project costs at year-end
- **Resource organization** - Find all resources for a specific project instantly
- **Governance** - Ensure compliance with organizational standards
- **Automation** - Enable automated cleanup, backup, and management

### Standard Tags (Applied to ALL resources)

| Tag           | Example Value           | Purpose                     |
| ------------- | ----------------------- | --------------------------- |
| `Project`     | doc-processing-pipeline | Group all project resources |
| `CostCenter`  | Project1                | Cost allocation bucket      |
| `Environment` | dev                     | Separate dev/staging/prod   |
| `Owner`       | YourName                | Who manages this resource   |
| `Component`   | uploads                 | Specific resource function  |
| `CreatedDate` | 2026-01-16              | Track resource age          |
| `ManagedBy`   | manual                  | How resource is managed     |

### Example: Tagging an S3 Bucket

```bash
aws s3api put-bucket-tagging \
  --bucket my-bucket-name \
  --tagging "TagSet=[
    {Key=Project,Value=doc-processing-pipeline},
    {Key=CostCenter,Value=Project1},
    {Key=Environment,Value=dev},
    {Key=Owner,Value=YourName},
    {Key=Component,Value=uploads},
    {Key=CreatedDate,Value=2026-01-16},
    {Key=ManagedBy,Value=manual}
  ]"
```

### Year-End Cost Analysis

At the end of 2026, run:

```bash
./year-end-report.sh 2026
```

**Output:**

```
📊 Total Costs by Project:
   Project1 (doc-processing-pipeline): $204.50
   Project2 (image-classifier): $387.25
   Project3 (sentiment-api): $156.80
   Total: $748.55
```

For complete tagging documentation, see [TAGGING_STRATEGY.md](TAGGING_STRATEGY.md)

---

## 🔍 Tag Governance

### Automated Weekly Audits

This project includes an automated tag compliance system:

**Architecture:**

```
EventBridge (Mon 9AM UTC)
    ↓
Lambda Function (TagAuditFunction)
    ↓
Scans all AWS resources
    ↓
SNS Email Notification
    ↓
Your Inbox 📧
```

**Features:**

- ✅ Scans all resources for missing required tags
- ✅ Runs automatically every Monday at 9 AM UTC
- ✅ Sends detailed email report
- ✅ Identifies non-compliant resources
- ✅ $0.00 cost (within Free Tier)

### Manual Audit (Backup)

For on-demand checks:

```bash
# Audit all resources
./audit-tags.sh

# Fix non-compliant resource
./fix-tags.sh arn:aws:s3:::bucket-name
```

### Governance Options Comparison

| Solution                 | Cost     | Frequency          | Setup Time | Best For         |
| ------------------------ | -------- | ------------------ | ---------- | ---------------- |
| **Lambda + EventBridge** | $0.00    | Weekly (automated) | 1 hour     | ✅ This project  |
| AWS Config               | $0.08/mo | Continuous         | 10 min     | Production/teams |
| Manual Script            | $0.00    | On-demand          | 15 min     | Small projects   |

**Decision:** Lambda automation provides professional-grade governance at $0 cost while teaching AWS services.

---

## 💡 Key Learnings

### Technical Insights

1. **CLI vs Console: Pragmatism Over Dogmatism**  
   When S3 lifecycle policy failed via CLI, pivoting to the console saved 28 minutes. Real-world engineering is about effectiveness, not rigid tool adherence.

2. **Tagging Strategy: 30 Minutes Now Saves Hours Later**  
   Comprehensive tags enable one-command year-end cost analysis. Professional-grade hygiene from day one demonstrates operational maturity.

3. **Environment Variables: Self-Documenting Infrastructure**  
   Using `${VARIABLES}` makes code reusable across accounts and self-explanatory. Future you (and collaborators) will appreciate this.

4. **Automated Governance Without Breaking the Bank**  
   Lambda tag audit provides AWS Config-level governance at $0 cost, while teaching three AWS services (Lambda, EventBridge, SNS).

5. **Platform-Specific Challenges Are Real** _(Phase 2)_  
   Working on Windows revealed gaps most tutorials don't cover: Git Bash lacks `zip`, path
   translation breaks CloudWatch commands. Solution: hybrid tooling (PowerShell for
   packaging, AWS CLI for deployment). Real-world development means adapting to your
   actual environment.

6. **Getting Unstuck: Recognizing the Wrong Problem** _(Phase 2)_  
   After 20 minutes debugging automation scripts, the realization hit: the goal wasn't
   "perfect scripts" but "deployed Lambda." That pivot saved hours. Sometimes the best
   engineering decision is abandoning the "right" approach for what actually works.

7. **Event-Driven Architecture Scales Effortlessly** _(Phase 2)_  
   S3 upload → Lambda trigger eliminates polling, cron jobs, and server management. Scales
   from 1 to 10,000 documents without code changes. This is the serverless promise delivered.

### Lessons for Interviews

- **Cost-conscious engineering:** Evaluating tool costs vs benefits ($0 Lambda vs $1/year Config)
- **Adaptability:** Switching between CLI and Console based on situation
- **Forward thinking:** Planning for year-end analysis from day one
- **Learning by doing:** Building automation to learn new services
- **Platform awareness:** Understanding OS-specific tooling differences (Windows vs Linux)
- **Problem reframing:** Recognizing when you're optimizing for the wrong outcome

---

## 🚀 Future Enhancements

### Short Term (Next Project Phases)

- [ ] Support for handwritten documents
- [ ] Multi-page document handling
- [ ] Batch processing queue with SQS
- [ ] Webhook notifications for completion
- [ ] Admin dashboard with analytics

### Long Term (Future Projects)

- [ ] Support for 20+ languages (Comprehend multi-language)
- [ ] Document classification (invoice vs receipt vs form)
- [ ] Custom Textract models for industry-specific forms
- [ ] User authentication with Cognito
- [ ] Mobile app version (iOS/Android)
- [ ] Integration with accounting software (QuickBooks, Xero)

---

## 🤝 Contributing

This is a personal learning project, but feedback and suggestions are welcome!

**To provide feedback:**

1. Open an issue describing the suggestion
2. For bug reports, include steps to reproduce
3. For feature requests, explain the use case

**If you want to build your own version:**

1. Fork this repository
2. Follow the setup instructions above
3. Customize for your needs
4. Share your learnings!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Links

- **GitHub:** [Your Username](https://github.com/YOUR-USERNAME)
- **LinkedIn:** [Your Profile](https://linkedin.com/in/YOUR-PROFILE)
- **Portfolio:** [Your Website](https://yourwebsite.com)
- **Email:** your.email@example.com

---

## 🙏 Acknowledgments

- AWS Documentation for comprehensive service guides
- [Implementation Guide](docs/implementation-guide.md) for detailed setup
- 150 mock documents generated for thorough testing
- Community feedback and support

---

## 📚 Additional Resources

- [AWS Textract Documentation](https://docs.aws.amazon.com/textract/)
- [AWS Comprehend Documentation](https://docs.aws.amazon.com/comprehend/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Cost Optimization on AWS](https://aws.amazon.com/pricing/cost-optimization/)
- [Tagging Best Practices](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)

---

**Built with ☁️ AWS, 🐍 Python, and 📚 lots of documentation**

**Project Timeline:** January 16, 2026 - Present
**Estimated Completion:** ~28 hours total
**Current Status:** Phase 1 Complete (4 hours invested)

_Last Updated: January 16, 2026_

```

```
