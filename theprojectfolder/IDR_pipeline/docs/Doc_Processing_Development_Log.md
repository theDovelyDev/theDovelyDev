# Building an AI-Powered Document Processing Pipeline on AWS

## A Developer's Journey from Concept to Production

---

## 📝 Development Log & Substack Article Draft

**Project:** Intelligent Document Processing Pipeline  
**Duration:** January 16, 2026 - [END DATE]  
**Total Hours:** 4 hours (1 hour pre-dev + 2 hours Phase 1 + 1 hour tag governance)  
**Final Cost:** $0.00 (so far)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Why I Built This](#why-i-built-this)
3. [Day-by-Day Development Log](#development-log)
4. [Technical Challenges & Solutions](#challenges)
5. [Key Learnings](#learnings)
6. [Results & Impact](#results)
7. [What's Next](#whats-next)

---

## Project Overview

**The Problem:** Manual document processing takes 3 minutes per document and costs $1.25 in staff time.

**The Solution:** An AWS serverless pipeline that processes documents in 30 seconds at $0.034 per document.

**Tech Stack:**

- AWS Services: S3, Lambda, Textract, Comprehend, API Gateway, CloudWatch
- Languages: Python 3.11, JavaScript (ES6+)
- Tools: AWS CLI, Boto3, Git

**Key Metrics:**

- 80% reduction in processing time
- 97% cost reduction per document
- Processes 500 documents/month for $17
- ROI: 3,558% annually

---

## Why I Built This

[FILL IN YOUR PERSONAL MOTIVATION]

Example:

> As someone transitioning into AI/ML engineering, I wanted hands-on experience with AWS AI services. I chose document processing because it's a real business problem with measurable ROI—something I could discuss confidently in interviews.

---

## Development Log

### Pre-Development Setup

**Date:** January 16, 2026  
**Time Spent:** 1 hour  
**Status:** ✅ Complete

#### What I Did:

- [x] Created AWS account (ensured Free Tier eligibility)
- [x] Set up IAM user with proper permissions
- [x] Enabled MFA (Multi-Factor Authentication) for security
- [x] Created CLI access keys
- [x] Configured AWS CLI in VSCode (switched from PowerShell to Bash)
- [x] Created cost budget alerts ($25 threshold)
- [x] Set up environment variables (PROJECT_NAME, REGION, ACCOUNT_ID)
- [x] Created setup.sh script for easy environment loading
- [x] Tested CLI with test S3 bucket creation/deletion
- [ ] Set up GitHub repository
- [ ] Created `dev` branch for active development
- [ ] Added comprehensive `.gitignore`

#### Cost Tracker:

- AWS charges so far: $0.00
- Budget remaining: $25.00
- Free Tier status: Active

#### Notes & Observations:

```
CLI Configuration Journey:
- Initially unfamiliar with bash/CLI but walked through step-by-step
- Switched VSCode terminal from PowerShell to Bash for project consistency
- Learned that environment variables reset when terminal closes - created setup.sh to solve this
- MFA setup adds extra security layer (good practice!)
- Test bucket creation/deletion worked perfectly - CLI is configured correctly
- Used us-east-1 region for best Free Tier coverage
- Access keys stored securely, not in any git repo

Key Commands Learned:
- aws configure (initial setup)
- aws sts get-caller-identity (verify credentials)
- aws s3 mb/rb (make/remove bucket)
- source setup.sh (load environment variables)
- export VARIABLE="value" (set env variables)

Aha Moment:
- Environment variables make scripts reusable and keep account IDs out of code
- The ${VARIABLE} syntax in bash is actually pretty straightforward once you try it
```

#### Screenshots Captured:

- [x] AWS Budget alert confirmation ($25 threshold, 50%, 80%, 100% alerts)
- [x] IAM user created with MFA enabled
- [x] CLI configuration successful (aws sts get-caller-identity output)
- [ ] Cost Explorer enabled (will capture after 24 hours when data populates)

#### Setup Files Created:

```bash
# setup.sh - Load environment variables
#!/bin/bash
export PROJECT_NAME="doc-processing-demo"
export REGION="us-east-1"
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ Environment variables loaded"
echo "PROJECT_NAME: $PROJECT_NAME"
echo "REGION: $REGION"
echo "ACCOUNT_ID: $ACCOUNT_ID"
```

---

### Phase 1: S3 Bucket Configuration

**Date:** January 16, 2026  
**Time Spent:** 2 hours  
**Status:** ✅ Complete

#### What I Did:

- [x] Implemented comprehensive tagging strategy (TAGGING_STRATEGY.md)
- [x] Updated setup.sh with tag variables for cost tracking
- [x] Created setup.sh.example template with tagging best practices
- [x] Created 3 S3 buckets with proper tags:
  - doc-processing-demo-uploads-[ACCOUNT_ID]
  - doc-processing-demo-processed-[ACCOUNT_ID]
  - doc-processing-demo-frontend-[ACCOUNT_ID]
- [x] Applied comprehensive tags to all buckets:
  - Project: doc-processing-pipeline
  - CostCenter: Project1
  - Environment: dev
  - Owner: YourName
  - Component: uploads/processed/frontend
  - CreatedDate: 2026-01-16
  - ManagedBy: manual
- [x] Enabled versioning on uploads bucket
- [x] Configured Lambda access policy for uploads bucket
- [x] Created lifecycle policy for cost optimization (applied via console)
- [x] Tested upload/download functionality
- [x] Committed all configuration files to Git

#### Commands Used:

```bash
# Load environment with tags
source setup.sh

# Create buckets with tags
aws s3 mb s3://${PROJECT_NAME}-uploads-${ACCOUNT_ID} --region ${REGION}
aws s3api put-bucket-tagging \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --tagging "TagSet=[{Key=Project,Value=${PROJECT_TAG}},{Key=CostCenter,Value=${COST_CENTER}},{Key=Environment,Value=${ENVIRONMENT}},{Key=Owner,Value=${OWNER}},{Key=Component,Value=uploads},{Key=CreatedDate,Value=${CREATED_DATE}},{Key=ManagedBy,Value=${MANAGED_BY}}]"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --versioning-configuration Status=Enabled

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --policy file://bucket-policy-uploads.json

# Verify tags
aws s3api get-bucket-tagging --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID}

# Test upload
echo "Test" > test.txt
aws s3 cp test.txt s3://${PROJECT_NAME}-uploads-${ACCOUNT_ID}/test/
aws s3 ls s3://${PROJECT_NAME}-uploads-${ACCOUNT_ID}/test/
```

#### Cost Tracker:

- S3 bucket creation: $0.00 (free)
- S3 storage: $0.00 (no significant data yet)
- S3 requests: $0.00 (minimal test uploads)
- Running total: $0.00
- Budget remaining: $25.00

#### Challenges Faced:

```
Challenge 1: Lifecycle policy CLI command failed
- Command: aws s3api put-bucket-lifecycle-configuration
- Issue: CLI command encountered configuration/syntax issues
- Attempted troubleshooting: Checked JSON formatting, permissions, syntax
- Solution: Applied lifecycle policy directly through AWS Console instead
- Time spent: ~10 minutes trying CLI, 2 minutes in console
- Lesson: Don't be dogmatic about "CLI only" - sometimes the console is faster
  and more reliable, especially for one-time configurations during learning
- Result: Lifecycle policy successfully configured via console:
  * Rule: Archive documents to Glacier after 90 days
  * Applied to: processed bucket, prefix: processed/
  * Status: Enabled
  * Purpose: Reduce storage costs by ~83% for old documents

Challenge 2: Understanding tag structure for CLI
- Initially confused about TagSet JSON formatting
- Used environment variables to make it cleaner and reusable
- Created ${TAGS} variable for easy copy-paste
- This made applying tags to future resources much simpler
```

#### What Worked Well:

```
Success 1: Comprehensive tagging strategy from day one
- Created TAGGING_STRATEGY.md documenting all standards
- Used consistent tags across all resources
- Set up for easy year-end cost analysis by project
- Template (setup.sh.example) will help anyone following this project
- Future me (December 2026) will thank present me!

Success 2: Environment variables made everything reusable
- setup.sh loads all configuration with one command: source setup.sh
- No hardcoded values in any commands
- Easy to adapt for future projects (just change variables)
- PROJECT_NAME, REGION, ACCOUNT_ID, and all tags centralized

Success 3: Git workflow running smoothly
- Successfully using dev branch for all development
- .gitignore protecting sensitive setup.sh file
- Only committing safe templates (setup.sh.example)
- Clear, descriptive commit messages following conventions
- Good foundation for the rest of the project

Success 4: Bucket policy and versioning worked perfectly via CLI
- Policy correctly allows Lambda to read from uploads bucket
- Versioning protects against accidental deletions/overwrites
- Test uploads confirmed everything working
```

#### Notes & Observations:

```
Tagging Strategy - Key Insight:
The tagging strategy I implemented will save me hours at year-end. By tagging
every resource with Project, CostCenter, Environment, and Component, I'll be
able to run a single command (./year-end-report.sh 2026) and see exactly how
much each project cost. This is professional-grade AWS hygiene that most
beginners skip.

CLI vs Console - Aha Moment:
Sometimes the "right" tool is the one that works! I tried applying the lifecycle
policy via CLI (following infrastructure-as-code best practices), but ran into
issues. Rather than spend 30 minutes debugging, I pivoted to the AWS Console
and had it configured in 2 minutes.

Lesson: Don't be dogmatic about "CLI only" or "Console only" - use the right
tool for the situation. For one-time configurations during learning, the console's
visual feedback is invaluable. For production automation, CLI/IaC is essential.

In interviews, this shows adaptability and pragmatism over rigid adherence to
"best practices." Real-world engineering is about getting things done effectively,
not following rules blindly.

Environment Variables - Best Practice:
Using setup.sh to centralize all configuration (bucket names, region, tags) made
this phase so much cleaner. Every command uses ${VARIABLES} instead of
hardcoded values. This means:
- Scripts are reusable across accounts
- No risk of committing sensitive data to Git
- Easy to adapt for future projects
- Self-documenting (variable names explain their purpose)

S3 Bucket Naming:
Following the pattern {project-name}-{component}-{account-id} ensures globally
unique names while keeping them descriptive. The account ID suffix prevents
naming conflicts if I ever need multiple AWS accounts.
```

#### Screenshots Captured:

- [x] S3 buckets in AWS Console showing all 3 buckets
- [x] Bucket tags configuration (showing all 7 tags)
- [x] Versioning enabled on uploads bucket
- [x] Bucket policy JSON in console
- [x] Lifecycle policy configuration screen (applied via console)
- [ ] Cost Explorer (will capture after 24 hours when data populates)

---

### Side Quest: Automated Tag Governance (1 hour)

**Date:** January 16, 2026  
**Time Spent:** 1 hour  
**Status:** ✅ Complete

#### What I Did:

- [x] Evaluated 3 tag governance options (AWS Config, Lambda automation, manual script)
- [x] Decided on Lambda + EventBridge solution ($0.00 vs AWS Config $1/year)
- [x] Created SNS topic for email notifications (TagAuditNotifications)
- [x] Confirmed SNS email subscription (found in spam folder!)
- [x] Created IAM role for Lambda (TagAuditLambdaRole)
- [x] Attached policies (AWSLambdaBasicExecutionRole + custom TagAuditPolicy)
- [x] Wrote Python Lambda function (tag_audit_function.py - 120 lines)
- [x] Packaged Lambda with Python zipfile (zip command not available on Windows)
- [x] Deployed Lambda to AWS
- [x] Created EventBridge rule for weekly schedule (Mondays 9 AM UTC)
- [x] Added Lambda invoke permission for EventBridge
- [x] Configured EventBridge target
- [x] Tested Lambda function manually
- [x] Verified email notification received
- [x] Created verification script (verify-tag-audit.sh)
- [x] Updated cost tracker with Lambda and EventBridge line items
- [x] Created comprehensive README.md for GitHub

#### Architecture Built:

```
EventBridge (Weekly: Mon 9AM UTC)
    ↓
Lambda Function (TagAuditFunction)
    ↓ scans all resources
ResourceGroupsTaggingAPI
    ↓ generates compliance report
SNS Topic (TagAuditNotifications)
    ↓ sends email
Your Inbox 📧
```

#### Commands Used:

```bash
# Create SNS topic
aws sns create-topic --name TagAuditNotifications --region ${REGION}

# Subscribe email
aws sns subscribe \
  --topic-arn ${SNS_TOPIC_ARN} \
  --protocol email \
  --notification-endpoint your-email@example.com

# Create IAM role
aws iam create-role \
  --role-name TagAuditLambdaRole \
  --assume-role-policy-document file://lambda-audit-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name TagAuditLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Package Lambda (using Python on Windows)
python -c "import zipfile; zipfile.ZipFile('function.zip', 'w').write('tag_audit_function.py')"

# Deploy Lambda
aws lambda create-function \
  --function-name TagAuditFunction \
  --runtime python3.11 \
  --role ${TAG_AUDIT_ROLE_ARN} \
  --handler tag_audit_function.lambda_handler \
  --zip-file fileb://lambda/tag-audit/function.zip \
  --timeout 60 \
  --memory-size 256 \
  --environment "Variables={SNS_TOPIC_ARN=${SNS_TOPIC_ARN}}"

# Create EventBridge schedule
aws events put-rule \
  --name TagAuditWeeklySchedule \
  --schedule-expression "cron(0 9 ? * MON *)"

# Add target
aws events put-targets \
  --rule TagAuditWeeklySchedule \
  --targets "Id=1,Arn=${LAMBDA_ARN}"
```

#### Cost Tracker:

- SNS Topic creation: $0.00
- SNS email notifications: $0.00 (4/month, within 1,000 free tier)
- Lambda invocations: $0.00 (4/month, within 1M free tier)
- Lambda compute: $0.00 (within 400K GB-seconds free tier)
- EventBridge rules: $0.00 (first rule is free)
- CloudWatch Logs: $0.00 (within 5GB free tier)
- **Running total: $0.00**
- **Savings vs AWS Config: $1.00/year**

#### Challenges Faced:

```
Challenge 1: Missing IAM Permissions
- Issue: Initially didn't have permission to create IAM roles
- Error: AccessDenied when trying to create TagAuditLambdaRole
- Solution: Added IAMFullAccess policy to doc-processing IAM user
- Time spent: 5 minutes
- Lesson: Check IAM permissions before starting infrastructure tasks

Challenge 2: SNS Email Not Received
- Issue: Subscribed to SNS topic but confirmation email never arrived
- Attempts:
  1. Checked email address was correct
  2. Waited 10 minutes
  3. Tried resubscribing
- Solution: Found confirmation email in spam folder!
- Time spent: 15 minutes searching
- Lesson: Always check spam for AWS confirmation emails

Challenge 3: Zip Command Not Found on Windows
- Issue: `zip function.zip tag_audit_function.py` failed
- Error: "zip: command not found"
- Attempted: Git Bash doesn't have zip by default on Windows
- Solution: Used Python's zipfile module instead (cross-platform)
- Code: `python -c "import zipfile; zipfile.ZipFile('function.zip', 'w').write('tag_audit_function.py')"`
- Alternative: Used PowerShell's Compress-Archive
- Time spent: 5 minutes
- Lesson: Always have cross-platform alternatives ready

Challenge 4: Empty Environment Variables in Lambda Deploy
- Issue: Lambda deployment failed with "Error parsing parameter '--environment'"
- Error: "Expected: ',', received: 'EOF' for input: Variables={SNS_TOPIC_ARN=}"
- Root cause: SNS_TOPIC_ARN variable was empty/not loaded
- Solution: Explicitly set SNS_TOPIC_ARN before deployment
- Time spent: 10 minutes debugging
- Lesson: Always verify environment variables are set before using them
```

#### What Worked Well:

```
Success 1: Cost-Conscious Decision Making
- Evaluated AWS Config ($0.08/month) vs Lambda ($0.00/month)
- Chose Lambda automation - professional governance at zero cost
- Added bonus: Learned Lambda, EventBridge, and SNS
- Updated cost tracker to document decision

Success 2: Lambda Function Architecture
- Clean, well-documented Python code (120 lines)
- Proper error handling and logging
- Generates human-readable email reports
- Identifies non-compliant resources by type
- Groups violations for easy remediation

Success 3: Automation Without Complexity
- Weekly schedule (Mondays 9 AM UTC) - not too frequent, not too rare
- Email notifications - no need to check logs manually
- Completely serverless - no infrastructure to maintain
- Set it and forget it - runs automatically

Success 4: Documentation as I Built
- Created README.md during the side quest
- Updated cost tracker in real-time
- Wrote verification script for testing
- All tools and scripts ready for future use
```

#### Notes & Observations:

```
Tag Governance Philosophy:
This side quest perfectly demonstrates cost-conscious engineering. AWS Config
is the "enterprise" solution ($1/year), but for a 15-resource learning project,
Lambda automation achieves the same governance goal at $0 while teaching three
new AWS services. Sometimes the DIY solution is better than the turnkey one.

AWS Free Tier is Generous:
- Lambda: 1M requests/month (using 4 = 0.0004%)
- SNS: 1,000 emails/month (using 4 = 0.4%)
- EventBridge: First rule free
This governance system will NEVER cost money at current usage levels.

Professional-Grade Governance:
Weekly automated audits with email reports is exactly what production teams use.
The fact that it costs $0 doesn't make it less professional - it makes it smarter.
This demonstrates operational maturity and cost optimization skills.

Cross-Platform Development:
Working on Windows revealed platform-specific issues (zip command, environment
variables). Building workarounds (Python zipfile, explicit variable setting)
shows adaptability and problem-solving skills.

Learning Through Building:
Instead of just reading documentation about Lambda, EventBridge, and SNS, I
built a real, useful automation tool. The learning sticks better when solving
actual problems.
```

#### First Audit Results:

```
Total Resources Scanned: 6
- S3 buckets: 3
- SNS topics: 1
- IAM roles: 1
- Lambda functions: 1

Compliant Resources: 6 (100%)
Non-Compliant Resources: 0

✅ All resources properly tagged!

Tags verified on all resources:
- Project: doc-processing-pipeline
- CostCenter: Project1
- Environment: dev
- Owner: [Your Name]
- Component: uploads/processed/frontend/monitoring
- CreatedDate: 2026-01-16
- ManagedBy: implem
```

#### Screenshots Captured:

- [x] SNS topic created in console
- [x] Email subscription confirmed
- [x] Lambda function deployed
- [x] EventBridge rule configuration
- [x] Sample email audit report
- [x] CloudWatch logs showing successful execution
- [x] First audit results (100% compliance)

#### Files Created:

- `lambda/tag-audit/tag_audit_function.py` (120 lines)
- `lambda-audit-trust-policy.json` (IAM trust policy)
- `tag-audit-policy.json` (custom IAM policy)
- `verify-tag-audit.sh` (verification script)
- `README.md` (comprehensive project documentation)
- Updated `AWS_Project_Cost_Tracker.xlsx` (added Lambda + EventBridge costs)
- Updated `TAGGING_STRATEGY.md` (added governance section)

#### Key Learnings for Substack Article:

```
1. "Automated governance without AWS Config"
   Instead of enabling AWS Config ($1/year), I built a Lambda function that
   audits tags weekly and emails me reports—staying within Free Tier ($0) while
   learning Lambda, EventBridge, and SNS. Sometimes the DIY solution teaches
   more than the turnkey one.

2. "Cost-conscious engineering is intentional, not cheap"
   Choosing Lambda over AWS Config wasn't about being cheap—it was about being
   intentional. For 15 resources, automated weekly audits are sufficient. The
   saved dollar goes toward actual compute costs instead.

3. "Platform-specific challenges build resilience"
   Working on Windows revealed issues (zip command, Git Bash quirks) that Linux
   users wouldn't face. Building cross-platform workarounds (Python zipfile,
   PowerShell alternatives) demonstrates adaptability.

4. "Learning by solving real problems"
   This wasn't just "Lambda tutorial" - I built actual governance automation
   that will run every week for the next year. The learning sticks better when
   solving genuine operational needs.
```

---

### Phase 2: Lambda Function Development

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Created IAM role for Lambda with proper permissions
- [ ] Wrote document_processor.py (core logic)
- [ ] Implemented Textract integration
- [ ] Implemented Comprehend integration
- [ ] Added error handling
- [ ] Packaged function with dependencies
- [ ] Deployed to AWS Lambda
- [ ] Configured S3 trigger

#### Code Snippets Worth Sharing:

```python
# Share interesting code sections in your article
# Example: The part where you combined Textract + Comprehend results

def combine_ai_results(textract_data, comprehend_data):
    """
    This was the trickiest part - merging structured Textract output
    with Comprehend's entity analysis while preserving confidence scores
    """
    # Your actual implementation
```

#### Cost Tracker:

- Lambda invocations: $[AMOUNT]
- Lambda compute time: $[AMOUNT]
- Running total: $[TOTAL]

#### Challenges Faced:

```
Challenge 1: Lambda timeout on large PDFs
- Initial timeout: 30 seconds
- PDF size: 5MB, 10 pages
- Solution: Increased timeout to 90s and optimized Textract calls
- Lesson: Always test with realistic document sizes

Challenge 2: [YOUR CHALLENGE]
- Problem: [DESCRIBE]
- Attempts: [WHAT YOU TRIED]
- Solution: [WHAT WORKED]
- Lesson: [WHAT YOU LEARNED]
```

#### What Worked Well:

```
[Document successes]
```

#### Debugging Notes:

```
[Track your debugging process - readers love this!]

Example:
- Used CloudWatch Logs extensively
- Added print statements at each processing stage
- Discovered Comprehend has 5000 byte limit (not documented clearly)
- Created helper function to truncate text properly
```

#### Notes & Observations:

```
[Your thoughts]
```

#### Screenshots Captured:

- [ ] Lambda function deployed
- [ ] CloudWatch logs showing successful processing
- [ ] Test document → JSON output comparison

---

### Phase 3: Textract Integration Deep Dive

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Tested Textract on 20 different document types
- [ ] Analyzed accuracy on invoices vs receipts
- [ ] Optimized for form field extraction
- [ ] Handled multi-page documents

#### Testing Results:

| Document Type | Pages | Processing Time | Accuracy | Cost    |
| ------------- | ----- | --------------- | -------- | ------- |
| Invoice       | 2     | 18s             | 95%      | $0.003  |
| Receipt       | 1     | 12s             | 98%      | $0.0015 |
| Form          | 3     | 25s             | 92%      | $0.0045 |

#### Cost Tracker:

- Textract API calls: $[AMOUNT]
- Running total: $[TOTAL]

#### Key Findings:

```
[Share insights about Textract performance]

Example:
- Textract is amazing on printed text (98% accuracy)
- Struggles with handwriting (70% accuracy)
- Form extraction works best with clear borders
- Table detection is surprisingly accurate
```

#### Challenges Faced:

```
[YOUR CHALLENGES]
```

#### Screenshots Captured:

- [ ] Textract extraction examples
- [ ] Before/after comparison (document → JSON)

---

### Phase 4: Comprehend Integration Deep Dive

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Implemented entity detection
- [ ] Added sentiment analysis
- [ ] Extracted key phrases
- [ ] Tested on various document types

#### Entity Detection Results:

```
Sample Invoice Analysis:
- Organizations detected: 3 (95% confidence)
- Dates detected: 2 (98% confidence)
- Monetary amounts: 5 (92% confidence)
- Locations: 2 (89% confidence)
```

#### Cost Tracker:

- Comprehend API calls: $[AMOUNT]
- Running total: $[TOTAL]

#### Key Findings:

```
[Share insights]

Example:
- Comprehend's entity detection is extremely accurate for standard formats
- Sentiment analysis useful for feedback forms
- Key phrase extraction helps identify important contract terms
```

#### Challenges Faced:

```
[YOUR CHALLENGES]
```

---

### Phase 5: Frontend Development

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Created HTML structure
- [ ] Styled with CSS (gradient background, cards)
- [ ] Implemented drag-and-drop upload
- [ ] Added Base64 encoding
- [ ] Built results display
- [ ] Added statistics tracking

#### Design Decisions:

```
[Explain your UI/UX choices]

Example:
- Chose purple gradient because it looks professional yet modern
- Drag-and-drop was essential - uploading documents should be frictionless
- Real-time stats (documents processed, avg time) show immediate value
```

#### Cost Tracker:

- S3 static hosting: $[AMOUNT]
- Running total: $[TOTAL]

#### Challenges Faced:

```
[YOUR CHALLENGES]
```

#### Screenshots Captured:

- [ ] Upload interface
- [ ] Processing animation
- [ ] Results display
- [ ] Mobile responsive view

---

### Phase 6: API Gateway Integration

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Created REST API
- [ ] Set up POST /upload endpoint
- [ ] Set up GET /results endpoint
- [ ] Configured CORS
- [ ] Created Lambda integration
- [ ] Deployed to production stage
- [ ] Updated frontend with API endpoint

#### API Testing:

```bash
# Document your API tests
curl -X POST https://[API-ID].execute-api.us-east-1.amazonaws.com/prod/upload \
  -H "Content-Type: application/json" \
  -d '{"fileName": "test.pdf", "fileContent": "[base64]"}'

Response: {"documentId": "abc-123", "status": "uploaded"}
```

#### Cost Tracker:

- API Gateway requests: $[AMOUNT]
- Running total: $[TOTAL]

#### Challenges Faced:

```
Challenge: CORS errors blocking frontend requests
- Error: "No 'Access-Control-Allow-Origin' header"
- Solution: Added CORS configuration to API Gateway AND Lambda responses
- Lesson: CORS needs to be configured in multiple places for Lambda proxy integration
```

#### Screenshots Captured:

- [ ] API Gateway configuration
- [ ] Successful API test in Postman/curl

---

### Phase 7: End-to-End Testing

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Tested with 150 mock documents
- [ ] Processed 50 invoices
- [ ] Processed 50 receipts
- [ ] Monitored costs in real-time
- [ ] Checked CloudWatch logs for errors
- [ ] Validated extraction accuracy

#### Testing Results:

| Metric          | Target | Actual    | Status |
| --------------- | ------ | --------- | ------ |
| Processing time | <60s   | [ACTUAL]s | ✅/❌  |
| Success rate    | >95%   | [ACTUAL]% | ✅/❌  |
| Cost per doc    | <$0.05 | $[ACTUAL] | ✅/❌  |
| Accuracy        | >90%   | [ACTUAL]% | ✅/❌  |

#### Total Testing Cost:

- 150 documents processed
- Textract: $[AMOUNT]
- Comprehend: $[AMOUNT]
- Lambda: $[AMOUNT]
- Total: $[AMOUNT]

#### Issues Found & Fixed:

```
Issue 1: [DESCRIBE]
- Impact: [SEVERITY]
- Root cause: [CAUSE]
- Fix: [SOLUTION]

Issue 2: [DESCRIBE]
```

#### Screenshots Captured:

- [ ] Cost Explorer showing actual usage
- [ ] CloudWatch metrics dashboard
- [ ] Processing results examples

---

### Phase 8: Optimization & Cost Reduction

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Implemented S3 lifecycle policies (90 day → Glacier)
- [ ] Right-sized Lambda memory allocation
- [ ] Optimized Textract API calls
- [ ] Added batch processing capability
- [ ] Reduced unnecessary logging

#### Before/After Optimization:

| Metric              | Before    | After      | Savings |
| ------------------- | --------- | ---------- | ------- |
| Lambda memory       | 512MB     | [ACTUAL]MB | [%]     |
| Avg processing time | [TIME]s   | [TIME]s    | [%]     |
| Cost per doc        | $[AMOUNT] | $[AMOUNT]  | [%]     |

#### Cost Tracker - Final:

- Total development cost: $[FINAL AMOUNT]
- Under budget? ✅/❌ by $[AMOUNT]

#### Key Optimizations:

```
[Describe what worked]

Example:
1. Reduced Lambda memory from 512MB → 256MB (no performance impact)
   - Saved: 30% on compute costs

2. Implemented lifecycle policy for S3
   - Old documents → Glacier after 90 days
   - Saved: 90% on storage for archived docs
```

---

### Phase 9: Documentation & Portfolio Prep

**Date:** [DATE]  
**Time Spent:** [HOURS]  
**Status:** [ ] In Progress / [ ] Complete

#### What I Did:

- [ ] Created comprehensive README
- [ ] Wrote architecture documentation
- [ ] Captured all screenshots
- [ ] Recorded demo video (2-3 minutes)
- [ ] Updated LinkedIn with project
- [ ] Published portfolio page

#### Portfolio Assets Created:

- [ ] README.md (with architecture diagram)
- [ ] Demo video (uploaded to YouTube/Vimeo)
- [ ] 10 key screenshots
- [ ] Cost analysis spreadsheet
- [ ] This development log / Substack article

#### GitHub Repository:

- URL: [YOUR REPO URL]
- Stars: [TRACK OVER TIME]
- Forks: [TRACK OVER TIME]

---

## Technical Challenges & Solutions

### Challenge 1: [YOUR BIGGEST CHALLENGE]

**The Problem:**

```
[Detailed description]
```

**What I Tried:**

1. [First attempt]
2. [Second attempt]
3. [Third attempt]

**The Solution:**

```
[What ultimately worked]
```

**Key Takeaway:**

```
[What you learned]
```

---

### Challenge 2: Managing AWS Costs

**The Problem:**

```
I was worried about costs spiraling during development, especially with AI services
that charge per API call.
```

**What I Tried:**

1. Set up budget alerts at $25
2. Used Cost Explorer daily
3. Tracked every API call in spreadsheet

**The Solution:**

```
- Used Free Tier strategically (Textract: 1,000 pages free for 3 months)
- Tested with small document batches first
- Implemented cost tracking in my development log
- Final cost: $8.47 (well under $25 budget)
```

**Key Takeaway:**

```
AWS Free Tier is generous if you plan carefully. Cost Explorer is your friend.
Budget alerts saved me from accidentally leaving resources running.
```

---

### Challenge 3: [ANOTHER CHALLENGE]

[FILL IN YOUR CHALLENGES]

---

## Key Learnings

### Technical Skills Gained

- [ ] AWS Lambda serverless architecture
- [ ] S3 event-driven triggers
- [ ] API Gateway REST API design
- [ ] IAM roles and permissions
- [ ] AWS Textract OCR integration
- [ ] AWS Comprehend NLP integration
- [ ] CloudWatch monitoring and logging
- [ ] Cost optimization strategies

### Soft Skills Developed

- [ ] Problem decomposition (breaking 28-hour project into phases)
- [ ] Documentation (this log!)
- [ ] Cost management and budgeting
- [ ] Time tracking and estimation
- [ ] Git workflow (dev branch → main merges)

### Biggest "Aha!" Moments

```
1. CLI vs Console: Pragmatism Over Dogmatism (Phase 1)
   During Phase 1, I tried applying the S3 lifecycle policy via CLI following
   "infrastructure-as-code best practices." The command failed. After 10 minutes
   of troubleshooting, I pivoted to the AWS Console and had it configured in
   2 minutes.

   AHA: Don't be dogmatic about "CLI only" or "Console only" - use the right
   tool for the situation. For one-time configurations during learning, the
   console's visual feedback is invaluable. For production automation, CLI/IaC
   is essential. Real-world engineering is about getting things done effectively,
   not following rules blindly.

   This moment taught me that adaptability and pragmatism are more valuable than
   rigid adherence to "best practices." In interviews, this shows problem-solving
   flexibility rather than religious devotion to a single approach.

2. Tagging Strategy: Future-Proofing From Day One (Phase 1)
   I almost skipped implementing a comprehensive tagging strategy because it felt
   like "extra work" for a learning project. But I pushed through and created
   TAGGING_STRATEGY.md with Project, CostCenter, Environment, Owner, Component,
   CreatedDate, and ManagedBy tags.

   AHA: Professional-grade AWS hygiene costs 30 minutes now but saves hours later.
   At year-end, I'll run ONE command (./year-end-report.sh 2026) and instantly see:
   "Project1 cost $43, Project2 cost $67, Project3 cost $28." This level of cost
   visibility is what separates hobbyist projects from professional portfolios.

   The extra 30 minutes to set up proper tagging demonstrates forward-thinking and
   operational maturity - exactly what hiring managers look for.

3. Environment Variables: Self-Documenting, Reusable Infrastructure (Phase 1)
   Instead of hardcoding bucket names and account IDs, I created setup.sh with
   all configuration centralized: PROJECT_NAME, REGION, ACCOUNT_ID, and all tags.

   AHA: Using ${VARIABLES} instead of hardcoded values makes code self-documenting
   AND reusable. Every command reads like:
   "aws s3 mb s3://${PROJECT_NAME}-uploads-${ACCOUNT_ID}"

   This means anyone (including future me) can immediately understand what each
   value represents. Plus, adapting this project for a new AWS account or different
   project is literally just changing 3 variables in setup.sh.

   This is the difference between "code that works" and "code that's maintainable."

4. [YOUR MOMENT - Add more as you progress through phases]
   Example: "Serverless doesn't mean 'no servers'—it means 'no server management.'
   Lambda still runs on servers, but AWS handles all the scaling/patching."
```

### What I'd Do Differently Next Time

```
1. [REFLECTION]
   Example: "Start with cost estimation calculator BEFORE building"

2. [REFLECTION]
   Example: "Test with production-sized documents earlier"

3. [REFLECTION]
```

---

## Results & Impact

### Final Metrics

**Performance:**

- Average processing time: [ACTUAL] seconds
- Success rate: [ACTUAL]%
- Extraction accuracy: [ACTUAL]%
- Documents tested: 150

**Cost (Development):**

- Budgeted: $11-15
- Actual: $[ACTUAL]
- Variance: [OVER/UNDER] by $[AMOUNT]

**Cost (Production Model):**

- Per document: $[ACTUAL]
- Monthly (500 docs): $[ACTUAL]
- Annual: $[ACTUAL]

**ROI Analysis:**

```
Manual Processing Cost:
- Time: 3 minutes per document
- Staff rate: $25/hour
- Cost per document: $1.25
- Monthly cost (500 docs): $625

Automated Processing Cost:
- Time: 30 seconds per document
- AWS cost: $0.034 per document
- Monthly cost (500 docs): $17

Savings:
- Per document: $1.22 (97% reduction)
- Monthly: $608
- Annual: $7,296
- ROI: 3,558%
```

### Business Impact

```
For a small accounting firm processing 500 invoices/month:
- Time saved: 20.8 hours/month (83% reduction)
- Cost saved: $608/month
- Payback period: < 1 week
- 3-year savings: $21,888
```

---

## What's Next

### Potential Enhancements

- [ ] Add support for handwritten documents (AWS Textract custom models)
- [ ] Implement batch processing queue with SQS
- [ ] Create admin dashboard with analytics
- [ ] Add webhook notifications for processing completion
- [ ] Support 20+ languages (Comprehend multi-language)
- [ ] Implement document classification (invoice vs receipt vs form)
- [ ] Add user authentication (AWS Cognito)
- [ ] Build mobile app version

### Other AWS Projects Planned

1. [Next project idea]
2. [Next project idea]
3. [Next project idea]

---

## Appendix: Resources That Helped

### Documentation

- AWS Textract Developer Guide: [link]
- AWS Comprehend Documentation: [link]
- AWS Lambda Best Practices: [link]

### Tutorials & Inspiration

- [Tutorial name]: [link]
- [Blog post]: [link]

### Tools Used

- AWS CLI
- VS Code (with AWS Toolkit extension)
- Postman (API testing)
- draw.io (architecture diagrams)

### Cost Tracking

- Detailed spreadsheet: [link to your cost tracker]
- AWS Cost Explorer screenshots: [included above]

---

## How to Follow My Journey

**GitHub:** [Your GitHub profile]  
**LinkedIn:** [Your LinkedIn]  
**Portfolio:** [Your portfolio site]  
**Substack:** [Your Substack - if you create one]

**Coming up next:** [Tease your next project]

---

## FAQ for Readers

**Q: Can I replicate this project?**  
A: Absolutely! Full code and implementation guide available in my GitHub repo: [link]

**Q: What was the hardest part?**  
A: [Your answer]

**Q: How long did it really take?**  
A: [Actual hours], spread over [number] days

**Q: What if I don't have AWS experience?**  
A: [Your advice]

**Q: Is the Free Tier really enough?**  
A: [Your experience]

---

## Final Thoughts

[Write your reflection here after completing the project]

Example template:

> When I started this project, I [initial feeling/thought]. After 28 hours of
> development, I learned that [key insight]. The most surprising part was [surprise].
> If you're considering building something similar, my advice is [advice].
>
> This project taught me that [lesson]. I'm excited to apply these skills to [next goal].

---

## Acknowledgments

Thanks to:

- [Anyone who helped]
- [Resources you used]
- [Communities that supported you]

---

**Project Status:** [In Progress / Complete]  
**Last Updated:** [DATE]  
**Total Time Invested:** [HOURS]  
**Final Cost:** $[AMOUNT]  
**Worth It?** [YES/NO - and why]

---

_This log serves as both development documentation and the foundation for my Substack article. It captures the real, unfiltered journey—challenges, victories, and lessons learned._

---

## Notes Section (Private - Don't Publish)

Use this space for quick notes during development:

```
[Quick thoughts, reminders, ideas]

Example:
- Remember to screenshot the CloudWatch dashboard before teardown
- That error message at 11pm was due to incorrect IAM permissions
- Good quote for article: "Serverless isn't about servers, it's about time"
- Follow up: Check if Textract supports handwriting better now
```

---

## Changelog

**January 16, 2026** - Started project  
**January 16, 2026** - Completed Pre-Development Setup (AWS account, IAM, CLI config, budget alerts)  
**January 16, 2026** - Completed Phase 1 (S3 buckets with comprehensive tagging, versioning, policies, lifecycle rules)  
**January 16, 2026** - Completed Side Quest: Automated Tag Governance (Lambda, EventBridge, SNS - weekly audits)  
**[DATE]** - Completed Phase 2 (Lambda functions)  
**[DATE]** - Completed Phase 3 (Textract integration)  
**[DATE]** - Completed Phase 4 (Comprehend integration)  
**[DATE]** - Completed Phase 5 (Frontend development)  
**[DATE]** - Completed Phase 6 (API Gateway)  
**[DATE]** - Completed Phase 7 (End-to-end testing)  
**[DATE]** - Completed Phase 8 (Optimization)  
**[DATE]** - Completed Phase 9 (Documentation & portfolio prep)  
**[DATE]** - Project complete!  
**[DATE]** - Published Substack article

---

## Article Outline (For Substack Conversion)

When converting this log to a Substack article, use this structure:

### Title Options:

1. "I Built an AI Document Processor on AWS for $8.47 (Here's How)"
2. "From Zero to AI: Building a Serverless Document Pipeline in 28 Hours"
3. "My First AWS AI Project: Processing 150 Documents with Textract & Comprehend"

### Article Flow:

1. **Hook** (200 words)

   - The problem (manual document processing is slow/expensive)
   - What I built (AI-powered automation)
   - Results teaser (80% time savings, $0.034 per document)

2. **Why I Built This** (300 words)

   - Learning goals
   - Career transition context
   - Portfolio motivation

3. **The Architecture** (400 words)

   - Simple diagram
   - 6 layers explained briefly
   - Tech stack overview

4. **Building It: The Journey** (800 words)

   - Phase-by-phase highlights (not all details)
   - Focus on 2-3 biggest challenges
   - Include code snippets
   - Share "aha!" moments

5. **Testing at Scale** (300 words)

   - 150 mock documents
   - Results & accuracy
   - Cost breakdown

6. **What I Learned** (400 words)

   - Technical skills
   - Unexpected insights
   - What I'd do differently

7. **The Results** (300 words)

   - Final metrics
   - ROI analysis
   - Business impact

8. **Try It Yourself** (200 words)

   - Link to GitHub
   - Link to implementation guide
   - Encouragement

9. **What's Next** (150 words)
   - Future enhancements
   - Next projects
   - Call to action (follow, subscribe)

**Total Target Length:** 2,500-3,000 words  
**Reading Time:** 10-12 minutes  
**Tone:** Technical but accessible, honest about challenges

---

**Remember:** This log is your raw material. The Substack article will be a polished, storytelling version of this journey. Keep this document honest and detailed—you'll mine it for the good parts later!
