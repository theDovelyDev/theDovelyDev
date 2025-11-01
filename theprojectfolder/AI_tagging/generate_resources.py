import pandas as pd
import random

# Sample data for AWS resources
resource_types = ["EC2", "S3", "RDS", "Lambda", "ECS", "DynamoDB", "CloudFront","CloudWatch"]
regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1",]
projects = ["SHIELD", "Hydra", "Starforce", "Avengers"]
owners = ["Banner", "Stark", "Murdock", "Danvers","Castle"]

data = []

print("🔄 Generating sample AWS resources...")

for i in range(1500):  # create 1500 resources
    resource = {
        "resource_id": f"res-{i+1:03d}",
        "resource_name": f"{random.choice(resource_types)}-{i+1}",
        "resource_type": random.choice(resource_types),
        "region": random.choice(regions),
        "metadata": f"Metadata info {i+1}",
        # Simulate missing tags
        "Environment": random.choice(["Dev", "Prod", "Test", None]),
        "Project": random.choice(projects + [None]),
        "Owner": random.choice(owners + [None])
    }
    data.append(resource)

# Convert to DataFrame
df = pd.DataFrame(data)

# Save to CSV
file_name = "aws_resources_sample.csv"
df.to_csv(file_name, index=False)

print(f"✅ Successfully generated {len(df)} AWS resource entries")
print(f"📂 CSV file saved as: {file_name}")
print("💡 Open it in Excel, VS Code, or Pandas to inspect your dataset.")
