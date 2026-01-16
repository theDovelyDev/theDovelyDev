# AWS Resource Tagging Strategy

cat > TAGGING_STRATEGY.md << 'EOF'

# AWS Resource Tagging Strategy

## 🎯 Purpose

This tagging strategy enables:

- **Cost tracking** across multiple projects in one AWS account
- **Resource organization** (find all resources for a specific project)
- **Year-end cost analysis** (which project cost how much?)
- **Automation** (identify resources for backup, cleanup, etc.)

---

## 📋 Standard Tags (Apply to ALL resources)

| Tag Key       | Required?   | Format                 | Example                   | Purpose                        |
| ------------- | ----------- | ---------------------- | ------------------------- | ------------------------------ |
| `Project`     | ✅ Yes      | lowercase-with-hyphens | `doc-processing-pipeline` | Group all resources by project |
| `CostCenter`  | ✅ Yes      | ProjectN               | `Project1`                | Cost allocation bucket         |
| `Environment` | ✅ Yes      | dev/staging/prod       | `dev`                     | Separate dev/test/prod costs   |
| `Owner`       | ⚠️ Optional | FirstLast or username  | `JohnDoe`                 | Who manages this resource      |
| `CreatedDate` | ✅ Yes      | YYYY-MM-DD             | `2026-01-16`              | Track resource age             |
| `ManagedBy`   | ✅ Yes      | tool-name              | `manual`                  | How is it managed              |
| `Component`   | ✅ Yes      | descriptive-name       | `uploads`                 | Specific resource function     |

---

## 🏗️ Project Naming Convention

**Format:** `{descriptive-name}-pipeline` or `{descriptive-name}-app`

**Examples:**

- ✅ `doc-processing-pipeline`
- ✅ `image-classification-app`
- ✅ `sentiment-analysis-api`
- ❌ `project1` (not descriptive)
- ❌ `my-aws-project` (too generic)

---

## 💰 Cost Center Naming Convention

**Format:** `ProjectN` where N = 1, 2, 3, etc.

**Why this format?**

- Simple and predictable
- Easy to remember
- Works well in cost reports
- Consistent across all projects

**Example mapping:**

- Project 1 (Document Processing) → `Project1`
- Project 2 (Image Classifier) → `Project2`
- Project 3 (Sentiment Analysis) → `Project3`

---

## 📊 Current Projects

### Project 1: Intelligent Document Processing Pipeline

- **Project Tag:** `doc-processing-pipeline`
- **CostCenter:** `Project1`
- **Start Date:** January 16, 2026
- **Environment:** `dev`
- **Services Used:** S3, Lambda, Textract, Comprehend, API Gateway, CloudWatch
- **Description:** AI-powered document extraction and analysis system
- **Estimated Monthly Cost:** $17 (500 documents)

### Project 2: [Your Next Project]

- **Project Tag:** `[project-name-here]`
- **CostCenter:** `Project2`
- **Start Date:** TBD
- **Environment:** `dev`
- **Services Used:** TBD
- **Description:** TBD
- **Estimated Monthly Cost:** TBD

### Project 3: [Future Project]

- **Project Tag:** `[project-name-here]`
- **CostCenter:** `Project3`
- **Start Date:** TBD
- **Environment:** `dev`
- **Services Used:** TBD
- **Description:** TBD
- **Estimated Monthly Cost:** TBD

---

## 🔧 Component Tag Examples

Use the `Component` tag to identify specific resource types within a project:

| Resource Type       | Component Value | Example Resource                           |
| ------------------- | --------------- | ------------------------------------------ |
| S3 upload bucket    | `uploads`       | doc-processing-demo-uploads-123456789012   |
| S3 processed bucket | `processed`     | doc-processing-demo-processed-123456789012 |
| S3 frontend bucket  | `frontend`      | doc-processing-demo-frontend-123456789012  |
| Lambda processor    | `processing`    | DocumentProcessor                          |
| Lambda API handler  | `api`           | APIUploadHandler                           |
| API Gateway         | `api`           | DocumentProcessingAPI                      |
| CloudWatch logs     | `monitoring`    | /aws/lambda/DocumentProcessor              |

---

## 🚀 How to Apply Tags

### S3 Buckets

```bash
aws s3api put-bucket-tagging \
  --bucket ${PROJECT_NAME}-uploads-${ACCOUNT_ID} \
  --tagging "TagSet=[
    {Key=Project,Value=${PROJECT_TAG}},
    {Key=CostCenter,Value=${COST_CENTER}},
    {Key=Environment,Value=${ENVIRONMENT}},
    {Key=Owner,Value=${OWNER}},
    {Key=Component,Value=uploads},
    {Key=CreatedDate,Value=${CREATED_DATE}},
    {Key=ManagedBy,Value=${MANAGED_BY}}
  ]"
```

### Lambda Functions

```bash
aws lambda create-function \
  --function-name DocumentProcessor \
  --tags Project=${PROJECT_TAG},CostCenter=${COST_CENTER},Environment=${ENVIRONMENT},Owner=${OWNER},Component=processing,CreatedDate=${CREATED_DATE},ManagedBy=${MANAGED_BY} \
  # ... other parameters
```

### API Gateway

```bash
aws apigateway create-rest-api \
  --name "DocumentProcessingAPI" \
  --tags Project=${PROJECT_TAG},CostCenter=${COST_CENTER},Environment=${ENVIRONMENT},Owner=${OWNER},Component=api,CreatedDate=${CREATED_DATE},ManagedBy=${MANAGED_BY}
```

---

## 📈 Cost Analysis Queries

### Monthly Cost by Project

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=Project
```

### Monthly Cost by CostCenter

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=CostCenter
```

### Year-End Summary

```bash
# Use the provided script
./year-end-report.sh 2026

# Output example:
# Project1: $204.50
# Project2: $387.25
# Project3: $156.80
# Total: $748.55
```

---

## ⚠️ IMPORTANT: Activate Cost Allocation Tags

Tags won't appear in cost reports until activated!

**Steps:**

1. Go to AWS Console → Billing Dashboard
2. Click "Cost Allocation Tags" (left sidebar)
3. Find your custom tags: `Project`, `CostCenter`, `Environment`, `Owner`, `Component`
4. Select them and click **"Activate"**
5. Wait 24 hours for activation

**Note:** This step MUST be done in the console - cannot be done via CLI

---

## ✅ Tag Validation Checklist

Before creating any AWS resource, verify:

- [ ] Have you loaded your environment? `source setup.sh`
- [ ] Does your resource include the `Project` tag?
- [ ] Does your resource include the `CostCenter` tag?
- [ ] Does your resource include the `Environment` tag?
- [ ] Does your resource include the `Component` tag?
- [ ] Does your resource include the `CreatedDate` tag?
- [ ] Does your resource include the `ManagedBy` tag?
- [ ] Have you added an `Owner` tag if applicable?

**Use the helper script:**

```bash
# Tag any resource after creation
./tag-resource.sh <resource-arn> <component-name>
```

---

## 🎓 Tagging Best Practices

### ✅ DO:

- Tag EVERY resource you create
- Use consistent tag keys across all resources
- Use descriptive, meaningful tag values
- Document your tagging strategy (this file!)
- Activate cost allocation tags in AWS Billing
- Review tags quarterly to ensure compliance

### ❌ DON'T:

- Create resources without tags
- Use different spellings/cases for tag keys (Project vs project)
- Use spaces in tag values (use hyphens: `doc-processing` not `doc processing`)
- Forget to activate cost allocation tags
- Delete tags from existing resources

---

## 🔍 Audit Your Tags

Check which resources are missing tags:

```bash
# List all resources without a Project tag
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values= \
  --region ${REGION}

# Count untagged resources
aws resourcegroupstaggingapi get-resources \
  --region ${REGION} \
  | jq '[.ResourceTagMappingList[] | select(.Tags | length == 0)] | length'
```

---

## 📚 Additional Resources

- AWS Tagging Best Practices: https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html
- AWS Cost Allocation Tags: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html
- Resource Groups Tagging API: https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/Welcome.html

---

## 🎯 Success Metrics

At the end of 2026, you should be able to:

- ✅ Generate a year-end cost report in < 5 minutes
- ✅ See exact costs for each project (Project1, Project2, Project3)
- ✅ Identify which AWS services cost the most per project
- ✅ Track cost trends month-over-month
- ✅ Make data-driven decisions about project continuation

**Your Future Self Will Thank You!** 🙏
