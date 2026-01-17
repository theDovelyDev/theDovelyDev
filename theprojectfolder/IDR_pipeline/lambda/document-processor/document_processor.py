import json
import boto3
import os
from datetime import datetime

s3_client = boto3.client('s3')
textract_client = boto3.client('textract')
comprehend_client = boto3.client('comprehend')

PROCESSED_BUCKET = os.environ.get('PROCESSED_BUCKET', '')

def lambda_handler(event, context):
    """
    Main handler for document processing
    Triggered by S3 upload event
    """
    try:
        # Get bucket and key from S3 event
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']
        
        print(f"Processing document: {key} from bucket: {bucket}")
        
        # Step 1: Extract text using Textract
        extracted_data = extract_text_from_document(bucket, key)
        
        # Step 2: Analyze text using Comprehend
        analysis_results = analyze_text(extracted_data['full_text'])
        
        # Step 3: Combine results
        final_result = {
            'document_name': key,
            'processed_at': datetime.now().isoformat(),
            'extraction': extracted_data,
            'analysis': analysis_results,
            'status': 'success'
        }
        
        # Step 4: Save results to processed bucket
        result_key = f"processed/{key.split('/')[-1]}.json"
        s3_client.put_object(
            Bucket=PROCESSED_BUCKET,
            Key=result_key,
            Body=json.dumps(final_result, indent=2),
            ContentType='application/json'
        )
        
        print(f"Successfully processed {key}")
        print(f"Results saved to: {result_key}")
        
        return {
            'statusCode': 200,
            'body': json.dumps(final_result)
        }
        
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def extract_text_from_document(bucket, key):
    """
    Extract text from document using AWS Textract
    Supports both synchronous and asynchronous processing
    """
    print(f"Starting Textract analysis on {key}")
    
    try:
        # Start document analysis
        response = textract_client.analyze_document(
            Document={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            },
            FeatureTypes=['TABLES', 'FORMS']
        )
        
        # Extract text blocks
        full_text = []
        key_value_pairs = {}
        tables = []
        
        for block in response['Blocks']:
            if block['BlockType'] == 'LINE':
                full_text.append(block['Text'])
            
            elif block['BlockType'] == 'KEY_VALUE_SET':
                if 'KEY' in block.get('EntityTypes', []):
                    key_text = extract_text_from_relationship(block, response['Blocks'])
                    value_text = extract_value_text(block, response['Blocks'])
                    if key_text and value_text:
                        key_value_pairs[key_text] = value_text
        
        return {
            'full_text': ' '.join(full_text),
            'key_value_pairs': key_value_pairs,
            'page_count': len(set(b.get('Page', 1) for b in response['Blocks'])),
            'extraction_confidence': calculate_average_confidence(response['Blocks'])
        }
    
    except Exception as e:
        print(f"Textract error: {str(e)}")
        return {
            'full_text': '',
            'key_value_pairs': {},
            'page_count': 0,
            'error': str(e)
        }


def extract_text_from_relationship(block, all_blocks):
    """Helper to extract text from relationships"""
    text = []
    if 'Relationships' in block:
        for relationship in block['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    child = next((b for b in all_blocks if b['Id'] == child_id), None)
                    if child and child['BlockType'] == 'WORD':
                        text.append(child['Text'])
    return ' '.join(text)


def extract_value_text(key_block, all_blocks):
    """Helper to extract value associated with key"""
    if 'Relationships' in key_block:
        for relationship in key_block['Relationships']:
            if relationship['Type'] == 'VALUE':
                for value_id in relationship['Ids']:
                    value_block = next((b for b in all_blocks if b['Id'] == value_id), None)
                    if value_block:
                        return extract_text_from_relationship(value_block, all_blocks)
    return None


def calculate_average_confidence(blocks):
    """Calculate average confidence score from Textract blocks"""
    confidences = [block.get('Confidence', 0) for block in blocks if 'Confidence' in block]
    return round(sum(confidences) / len(confidences), 2) if confidences else 0


def analyze_text(text):
    """
    Analyze text using AWS Comprehend
    Extracts entities, sentiment, and key phrases
    """
    if not text or len(text.strip()) < 3:
        return {'error': 'Text too short for analysis'}
    
    # Truncate if too long (Comprehend limit: 5000 bytes)
    text = text[:5000]
    
    results = {}
    
    try:
        # Detect entities (names, dates, amounts, etc.)
        entities_response = comprehend_client.detect_entities(
            Text=text,
            LanguageCode='en'
        )
        results['entities'] = [
            {
                'text': e['Text'],
                'type': e['Type'],
                'score': round(e['Score'], 2)
            }
            for e in entities_response['Entities']
        ]
        
        # Detect sentiment
        sentiment_response = comprehend_client.detect_sentiment(
            Text=text,
            LanguageCode='en'
        )
        results['sentiment'] = {
            'overall': sentiment_response['Sentiment'],
            'scores': {
                k: round(v, 2) 
                for k, v in sentiment_response['SentimentScore'].items()
            }
        }
        
        # Detect key phrases
        phrases_response = comprehend_client.detect_key_phrases(
            Text=text,
            LanguageCode='en'
        )
        results['key_phrases'] = [
            {
                'text': p['Text'],
                'score': round(p['Score'], 2)
            }
            for p in phrases_response['KeyPhrases'][:10]  # Top 10
        ]
        
    except Exception as e:
        results['error'] = str(e)
        print(f"Comprehend error: {str(e)}")
    
    return results
