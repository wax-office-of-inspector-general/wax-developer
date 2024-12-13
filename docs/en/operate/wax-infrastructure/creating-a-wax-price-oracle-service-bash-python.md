---
title: Creating a WAX Price Oracle Service via Bash or Python Script
original: https://bountyblok.medium.com/creating-a-wax-price-oracle-service-via-bash-or-python-script-fd0ab41ea255
---

# Creating a WAX Price Oracle Service via Bash or Python Script

## Introduction
At bountyblok, we’ve tackled the challenge of creating a reliable WAX Price Oracle service, and we want to share our journey with you. In this article, we’ll walk you through how we used Bash and Python scripts to fetch cryptocurrency prices and push them to the WAX blockchain. We’ll start with a quick and straightforward solution, then dive into advanced features like secure wallet password handling, failure alerts, and API redundancy. Ensuring that these prices are accurately published on-chain is crucial for apps and exchanges, and we’ll show you how we made it happen.

## Part 1: The Quick And Dirty

### Bash Script to Fetch Prices and Push Transactions

Here’s a basic Bash script to get you started:

```
#!/bin/bash

# Variables
ENDPOINT_URL="https://wax.eu.eosamsterdam.net"
ACTOR="your_actor_name"         # eg: bountyblokbp
PERMISSION="your_permission"    # eg: oracle
WALLET_PASSWORD="your_wallet_password"  # cleos wallet password, for more secure solutions scroll below
API_URL="https://min-api.cryptocompare.com/data/price?fsym=WAXP&tsyms=BTC,USD,ETH,EOS,USDT,USDC"

# Check if the wallet is locked
# Cleos will spam an error that wallet is unlocked and annoy the logs, so only unlock if there is no way to list keys
WALLET_STATUS=$(cleos wallet list | grep -c '\*')
if [[ $WALLET_STATUS -eq 0 ]]; then
  # Unlock the wallet
  UNLOCK_RESULT=$(cleos wallet unlock --password $WALLET_PASSWORD 2>&1)
  if [[ "$UNLOCK_RESULT" == *"Error"* && "$UNLOCK_RESULT" != *"Already unlocked"* ]]; then
    echo "Failed to unlock wallet: $UNLOCK_RESULT"
    exit 1
  fi
fi

# Fetch prices from API
RESPONSE=$(curl -s $API_URL)
echo "API Response: $RESPONSE"

# Parse the JSON response and calculate values
WAXPUSD=$(echo $RESPONSE | jq -r '.USD')
WAXPBTC=$(echo $RESPONSE | jq -r '.BTC')
WAXPETH=$(echo $RESPONSE | jq -r '.ETH')
WAXPEOS=$(echo $RESPONSE | jq -r '.EOS')
USDT=$(echo $RESPONSE | jq -r '.USDT')
USDC=$(echo $RESPONSE | jq -r '.USDC')

# Check if values are valid
if [[ -z "$WAXPUSD" || -z "$WAXPBTC" || -z "$WAXPETH" || -z "$WAXPEOS" || -z "$USDT" || -z "$USDC" ]]; then
  echo "Error: One or more fetched values are empty"
  exit 1
fi

# Convert scientific notation to decimal
WAXPBTC_DEC=$(printf "%.10f" $WAXPBTC)
WAXPETH_DEC=$(printf "%.10f" $WAXPETH)

# Calculate additional values with more precision
WAXPUSD_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPUSD * 10000" | bc))
WAXPBTC_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPBTC_DEC * 100000000" | bc))
WAXPETH_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPETH_DEC * 100000000" | bc))
WAXPEOS_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPEOS * 1000000" | bc))
USDTUSD_VALUE=$(printf "%.0f" $(echo "scale=10; $USDT / $WAXPUSD * 10000" | bc))
USDCUSD_VALUE=$(printf "%.0f" $(echo "scale=10; $USDC / $WAXPUSD * 10000" | bc))

# Debug: print calculated values
echo "Calculated Values: WAXPUSD_VALUE=$WAXPUSD_VALUE WAXPBTC_VALUE=$WAXPBTC_VALUE WAXPBTC_DEC=$WAXPBTC_DEC WAXPETH_VALUE=$WAXPETH_VALUE WAXPETH_DEC=$WAXPETH_DEC WAXPEOS_VALUE=$WAXPEOS_VALUE USDTUSD=$USDTUSD USDCUSD=$USDCUSD"

# Create quotes array
QUOTES=$(jq -c -n \
  --argjson waxpusd "$WAXPUSD_VALUE" \
  --argjson waxpbtc "$WAXPBTC_VALUE" \
  --argjson waxpeth "$WAXPETH_VALUE" \
  --argjson waxpeos "$WAXPEOS_VALUE" \
  --argjson usdtusd "$USDTUSD_VALUE" \
  --argjson usdcusd "$USDCUSD_VALUE" \
  '[
    {"pair": "waxpusd", "value": $waxpusd},
    {"pair": "waxpbtc", "value": $waxpbtc},
    {"pair": "waxpeth", "value": $waxpeth},
    {"pair": "waxpeos", "value": $waxpeos},
    {"pair": "usdtusd", "value": $usdtusd},
    {"pair": "usdcusd", "value": $usdcusd}
  ]')

# Create transaction JSON
TX_JSON=$(jq -c -n \
  --arg actor "$ACTOR" \
  --arg permission "$PERMISSION" \
  --argjson quotes "$QUOTES" \
  '{
    "actions": [{
      "account": "delphioracle",
      "name": "write",
      "authorization": [{
        "actor": $actor,
        "permission": $permission
      }],
      "data": {
        "owner": $actor,
        "quotes": $quotes
      }
    }]
  }')

# Write the JSON to a file
echo "$TX_JSON" > tx.json

# Print the JSON to the console for debugging
echo "Transaction JSON: $(cat tx.json)"

# Push the transaction using cleos
cleos -u $ENDPOINT_URL push transaction tx.json -p $ACTOR@$PERMISSION

# Clean up
rm tx.json
```

## Setting Up Cron Job

To schedule the script using cron, simply open the crontab editor with this command: crontab -e and add the script to a cron job to run every minute:

```
* * * * * /home/ubuntu/oracleemailwaxfinal.sh 2>&1 | while IFS= read -r line; do echo "$(date): $line"; done >> /home/ubuntu/oracleemailwaxfinal.sh.log
```

You can also use `awk` to add timestamp in logs via crontab but we had some issues with it so we use a more raw approach.

## Part 2: The Extra “Advanced” Features

### Securely Handling Wallet Passwords

Instead of hardcoding the wallet password, use an encrypted file to store the password and decrypt it when needed. This ensures that the password is not stored in plain text within the script or cron job.

### Encrypting the Wallet Password

Encrypt the password and store it in a file:

```
echo "your_wallet_password" | openssl enc -aes-256-cbc -salt -pbkdf2 -out wallet_password.enc
```

You will be prompted to enter an encryption password. This password will be used to decrypt the wallet password.

The full code below will demonstrate the encrypted password will be decrypted and used within the bash and python scripts.

### Adding Alerts for Failures

To set up alerts for various failures, you can use Twilio for SMS and SendGrid or AWS SES for email alerts.

### Setting Up Twilio SMS, SendGrid Email and AWS SES Alerts

Install either of the 3 packages below you plan to use

```
pip install twilio
pip install sendgrid
pip install boto3
```

### Bash Script with Encrypted Password, Redundant Endpoints, and Alerts

Here’s the updated Bash script with Twilio SMS and SendGrid email alerts:

```
#!/bin/bash

# Variables

# Several endpoints - you can add or change these
ENDPOINTS=("https://wax.eu.eosamsterdam.net" "https://api.waxsweden.org" "https://wax.eosusa.io" "https://wax.eosphere.io")
ACTOR="your_actor_name"         # eg: bountyblokbp

PERMISSION="your_permission"    # eg: oracle
PASSWORD_FILE="path/to/wallet_password.enc"
ENCRYPTION_PASSWORD="your_encryption_password"  # Set the encryption password

API_URL="https://min-api.cryptocompare.com/data/price?fsym=WAXP&tsyms=BTC,USD,ETH,EOS,USDT,USDC"

TWILIO_SID="your_twilio_sid"  # Set your Twilio SID
TWILIO_AUTH="your_twilio_auth_token"  # Set your Twilio Auth Token
TWILIO_FROM="your_twilio_phone_number"  # Set your Twilio phone number
TWILIO_TO="your_phone_number"  # Set the recipient phone number

SENDGRID_API_KEY="your_sendgrid_api_key"  # Set your SendGrid API key
SENDGRID_FROM="your_email@example.com"  # Set the sender email address
SENDGRID_TO="recipient_email@example.com"  # Set the recipient email address

# Function to send SMS alert
send_sms_alert() {
  MESSAGE=$1
  curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_SID/Messages.json \
  --data-urlencode "Body=$MESSAGE" \
  --data-urlencode "From=$TWILIO_FROM" \
  --data-urlencode "To=$TWILIO_TO" \
  -u $TWILIO_SID:$TWILIO_AUTH
}

# Function to send email alert via SendGrid
send_email_alert_sendgrid() {
  MESSAGE=$1
  curl -X POST https://api.sendgrid.com/v3/mail/send \
    -H "Authorization: Bearer $SENDGRID_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "personalizations": [{
        "to": [{"email": "'$SENDGRID_TO'"}],
        "subject": "WAX Oracle Alert"
      }],
      "from": {"email": "'$SENDGRID_FROM'"},
      "content": [{
        "type": "text/plain",
        "value": "'"$MESSAGE"'"
      }]
    }'
}

# Function to send email alert via AWS SES
send_email_alert_ses() {
  MESSAGE=$1
  aws ses send-email \
    --from "$SENDGRID_FROM" \
    --destination "ToAddresses=$SENDGRID_TO" \
    --message "Subject={Data=WAX Oracle Alert},Body={Text={Data=$MESSAGE}}"
}

# Decrypt the wallet password
WALLET_PASSWORD=$(openssl enc -aes-256-cbc -d -pbkdf2 -in $PASSWORD_FILE -pass pass:$ENCRYPTION_PASSWORD)

if [[ -z "$WALLET_PASSWORD" ]]; then
  send_sms_alert "Error: Failed to decrypt wallet password"
  send_email_alert_sendgrid "Error: Failed to decrypt wallet password"
  exit 1
fi

# Check if the wallet is locked
WALLET_STATUS=$(cleos wallet list | grep -c '\*')
if [[ $WALLET_STATUS -eq 0 ]]; then
  # Unlock the wallet
  UNLOCK_RESULT=$(cleos wallet unlock --password $WALLET_PASSWORD 2>&1)
  if [[ "$UNLOCK_RESULT" == *"Error"* && "$UNLOCK_RESULT" != *"Already unlocked"* ]]; then
    send_sms_alert "Failed to unlock wallet: $UNLOCK_RESULT"
    send_email_alert_sendgrid "Failed to unlock wallet: $UNLOCK_RESULT"
    exit 1
  fi
fi

# Fetch prices from API
# Send an alert if the API had an issue
# TODO: Add additional Price APIs for more redunancy
RESPONSE=$(curl -s $API_URL)
if [[ -z "$RESPONSE" ]]; then
  send_sms_alert "Error: Failed to fetch prices from API"
  send_email_alert_sendgrid "Error: Failed to fetch prices from API"
  exit 1
fi

echo "API Response: $RESPONSE"

# Parse the JSON response and calculate values
WAXPUSD=$(echo $RESPONSE | jq -r '.USD')
WAXPBTC=$(echo $RESPONSE | jq -r '.BTC')
WAXPETH=$(echo $RESPONSE | jq -r '.ETH')
WAXPEOS=$(echo $RESPONSE | jq -r '.EOS')
USDT=$(echo $RESPONSE | jq -r '.USDT')
USDC=$(echo $RESPONSE | jq -r '.USDC')

# Check if values are valid
if [[ -z "$WAXPUSD" || -z "$WAXPBTC" || -z "$WAXPETH" || -z "$WAXPEOS" || -z "$USDT" || -z "$USDC" ]]; then
  send_sms_alert "Error: One or more fetched values are empty"
  send_email_alert_sendgrid "Error: One or more fetched values are empty"
  exit 1
fi

# Convert scientific notation to decimal
WAXPBTC_DEC=$(printf "%.10f" $WAXPBTC)
WAXPETH_DEC=$(printf "%.10f" $WAXPETH)

# Calculate additional values with more precision
WAXPUSD_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPUSD * 10000" | bc))
WAXPBTC_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPBTC_DEC * 100000000" | bc))
WAXPETH_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPETH_DEC * 100000000" | bc))
WAXPEOS_VALUE=$(printf "%.0f" $(echo "scale=10; $WAXPEOS * 1000000" | bc))
USDTUSD=$(printf "%.0f" $(echo "scale=10; $USDT / $WAXPUSD * 10000" | bc))
USDCUSD=$(printf "%.0f" $(echo "scale=10; $USDC / $WAXPUSD * 10000" | bc))

# Debug: print calculated values
echo "Calculated Values: WAXPUSD_VALUE=$WAXPUSD_VALUE WAXPBTC_VALUE=$WAXPBTC_VALUE WAXPBTC_DEC=$WAXPBTC_DEC WAXPETH_VALUE=$WAXPETH_VALUE WAXPETH_DEC=$WAXPETH_DEC WAXPEOS_VALUE=$WAXPEOS_VALUE USDTUSD=$USDTUSD USDCUSD=$USDCUSD"

# Create quotes array
QUOTES=$(jq -c -n \
  --argjson waxpusd "$WAXPUSD_VALUE" \
  --argjson waxpbtc "$WAXPBTC_VALUE" \
  --argjson waxpeth "$WAXPETH_VALUE" \
  --argjson waxpeos "$WAXPEOS_VALUE" \
  --argjson usdtusd "$USDTUSD" \
  --argjson usdcusd "$USDCUSD" \
  '[
    {"pair": "waxpusd", "value": $waxpusd},
    {"pair": "waxpbtc", "value": $waxpbtc},
    {"pair": "waxpeth", "value": $waxpeth},
    {"pair": "waxpeos", "value": $waxpeos},
    {"pair": "usdtusd", "value": $usdtusd},
    {"pair": "usdcusd", "value": $usdcusd}
  ]')

# Create transaction JSON
TX_JSON=$(jq -c -n \
  --arg actor "$ACTOR" \
  --arg permission "$PERMISSION" \
  --argjson quotes "$QUOTES" \
  '{
    "actions": [{
      "account": "delphioracle",
      "name": "write",
      "authorization": [{
        "actor": $actor,
        "permission": $permission
      }],
      "data": {
        "owner": $actor,
        "quotes": $quotes
      }
    }]
  }')

# Write the JSON to a file
echo "$TX_JSON" > tx.json

# Print the JSON to the console for debugging
echo "Transaction JSON: $(cat tx.json)"

# Try to push the transaction using each endpoint until successful
for ENDPOINT in "${ENDPOINTS[@]}"; do
  cleos -u $ENDPOINT push transaction tx.json -p $ACTOR@$PERMISSION && break
done

# Clean up
rm tx.json
```

### Python Script with Encrypted Password, Redundant Endpoints, and Alerts

Here’s the updated Python script with Twilio SMS and SendGrid email alerts:

```
import os
import subprocess
import requests
import json
from twilio.rest import Client
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import boto3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Function to decrypt the wallet password
def decrypt_wallet_password(encrypted_file, encryption_password):
    try:
        result = subprocess.run(
            ['openssl', 'enc', '-aes-256-cbc', '-d', '-pbkdf2', '-in', encrypted_file, '-pass', f'pass:{encryption_password}'],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Failed to decrypt wallet password: {e.stderr}")
        send_alert("Failed to decrypt wallet password.")
        exit(1)

# Function to send SMS alert via Twilio
def send_sms_alert(message):
    client = Client(os.getenv('TWILIO_SID'), os.getenv('TWILIO_AUTH'))
    client.messages.create(
        body=message,
        from_=os.getenv('TWILIO_FROM'),
        to=os.getenv('TWILIO_TO')
    )

# Function to send email alert via SendGrid
def send_email_alert_sendgrid(message):
    email = Mail(
        from_email=os.getenv('SENDGRID_FROM'),
        to_emails=os.getenv('SENDGRID_TO'),
        subject='WAX Oracle Alert',
        plain_text_content=message)
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        sg.send(email)
    except Exception as e:
        print(f"Failed to send email alert via SendGrid: {e}")

# Function to send email alert via AWS SES
def send_email_alert_ses(message):
    client = boto3.client('ses')
    try:
        client.send_email(
            Source=os.getenv('SENDGRID_FROM'),
            Destination={'ToAddresses': [os.getenv('SENDGRID_TO')]},
            Message={
                'Subject': {'Data': 'WAX Oracle Alert'},
                'Body': {'Text': {'Data': message}}
            }
        )
    except Exception as e:
        print(f"Failed to send email alert via SES: {e}")



# Function to send alert (choose the method you prefer)
def send_alert(message):
    send_sms_alert(message)
    send_email_alert_sendgrid(message)
    send_email_alert_ses(message)

# Configuration
ENDPOINTS = ["https://wax.eu.eosamsterdam.net", "https://api.waxsweden.org", "https://wax.eosusa.io", "https://wax.eosphere.io"]
ACTOR = "your_actor_name"
PERMISSION = "your_permission"
API_URL = "https://min-api.cryptocompare.com/data/price?fsym=WAXP&tsyms=BTC,USD,ETH,EOS,USDT,USDC"
ENCRYPTED_PASSWORD_FILE = "path/to/your/wallet_password.enc"
ENCRYPTION_PASSWORD = os.getenv('ENCRYPTION_PASSWORD')

if ENCRYPTION_PASSWORD is None:
    print("Error: ENCRYPTION_PASSWORD environment variable is not set")
    send_alert("ENCRYPTION_PASSWORD environment variable is not set")
    exit(1)

WALLET_PASSWORD = decrypt_wallet_password(ENCRYPTED_PASSWORD_FILE, ENCRYPTION_PASSWORD)

# Check if the wallet is locked
try:
    wallet_list = subprocess.run(['cleos', 'wallet', 'list'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    if '*' not in wallet_list.stdout:
        # Unlock the wallet
        result = subprocess.run(['cleos', 'wallet', 'unlock', '--password', WALLET_PASSWORD], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
except subprocess.CalledProcessError as e:
    if "Already unlocked" not in e.stderr:
        print(f"Failed to unlock wallet: {e.stderr}")
        send_alert(f"Failed to unlock wallet: {e.stderr}")
        exit(1)

# Fetch prices from API
try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()
except requests.RequestException as e:
    print(f"Failed to fetch prices from API: {e}")
    send_alert("API is down or not returning data.")
    exit(1)

print(f"API Response: {data}")

# Parse the JSON response and calculate values
try:
    WAXPUSD = data['USD']
    WAXPBTC = data['BTC']
    WAXPETH = data['ETH']
    WAXPEOS = data['EOS']
    USDT = data['USDT']
    USDC = data['USDC']
except KeyError as e:
    print(f"Missing key in API response: {e}")
    send_alert("Missing key in API response.")
    exit(1)

print(f"Fetched Values: WAXPUSD={WAXPUSD} WAXPBTC={WAXPBTC} WAXPETH={WAXPETH} WAXPEOS={WAXPEOS} USDT={USDT} USDC={USDC}")

# Check if values are valid
if not all([WAXPUSD, WAXPBTC, WAXPETH, WAXPEOS, USDT, USDC]):
    print("Error: One or more fetched values are empty")
    send_alert("One or more fetched values are empty.")
    exit(1)

# Convert scientific notation to decimal
WAXPBTC_DEC = float(WAXPBTC)
WAXPETH_DEC = float(WAXPETH)

# Calculate additional values
WAXPUSD_VALUE = int(WAXPUSD * 10000)
WAXPBTC_VALUE = int(WAXPBTC_DEC * 100000000)
WAXPETH_VALUE = int(WAXPETH_DEC * 100000000)
WAXPEOS_VALUE = int(WAXPEOS * 1000000)
USDTUSD = int((USDT / WAXPUSD) * 10000)
USDCUSD = int((USDC / WAXPUSD) * 10000)

print(f"Calculated Values: WAXPUSD_VALUE={WAXPUSD_VALUE} WAXPBTC_VALUE={WAXPBTC_VALUE} WAXPBTC_DEC={WAXPBTC_DEC} WAXPETH_VALUE={WAXPETH_VALUE} WAXPETH_DEC={WAXPETH_DEC} WAXPEOS_VALUE={WAXPEOS_VALUE} USDTUSD={USDTUSD} USDCUSD={USDCUSD}")

# Create quotes array
quotes = [
    {"pair": "waxpusd", "value": WAXPUSD_VALUE},
    {"pair": "waxpbtc", "value": WAXPBTC_VALUE},
    {"pair": "waxpeth", "value": WAXPETH_VALUE},
    {"pair": "waxpeos", "value": WAXPEOS_VALUE},
    {"pair": "usdtusd", "value": USDTUSD},
    {"pair": "usdcusd", "value": USDCUSD},
]

# Create transaction JSON
tx_json = {
    "actions": [{
        "account": "delphioracle",
        "name": "write",
        "authorization": [{
            "actor": ACTOR,
            "permission": PERMISSION
        }],
        "data": {
            "owner": ACTOR,
            "quotes": quotes
        }
    }]
}

# Write the JSON to a file
with open('tx.json', 'w') as f:
    json.dump(tx_json, f, separators=(',', ':'))

# Print the JSON to the console for debugging
print("Transaction JSON: ", json.dumps(tx_json, separators=(',', ':')))

# Try to push the transaction using each endpoint until successful
for endpoint in ENDPOINTS:
    try:
        subprocess.run(['cleos', '-u', endpoint, 'push', 'transaction', 'tx.json', '-p', f'{ACTOR}@{PERMISSION}'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        break
    except subprocess.CalledProcessError as e:
        print(f"Failed to push transaction using endpoint {endpoint}: {e.stderr}")
        continue

# Clean up
os.remove('tx.json')
```

Note: You can streamline your setup by moving the variables into a .env file. This approach not only keeps your code cleaner but also allows other services to reuse these variables easily. For your Python script, you can use the `python-dotenv` package to load the variables from the .env file effortlessly.

```
pip install python-dotenv
```

```
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Retrieve environment variables
endpoints = os.getenv('ENDPOINTS').split(',')
actor = os.getenv('ACTOR')
permission = os.getenv('PERMISSION')
password_file = os.getenv('PASSWORD_FILE')
encryption_password = os.getenv('ENCRYPTION_PASSWORD')
api_url = os.getenv('API_URL')
twilio_sid = os.getenv('TWILIO_SID')
twilio_auth = os.getenv('TWILIO_AUTH')
twilio_from = os.getenv('TWILIO_FROM')
twilio_to = os.getenv('TWILIO_TO')
sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
sendgrid_from = os.getenv('SENDGRID_FROM')
sendgrid_to = os.getenv('SENDGRID_TO')

# Example usage
print(f"Sending from: {twilio_from} to {twilio_to}")
```

### Setting Up Cron Job

Add the bash .sh script to a cron job to run every minute:

```
* * * * * ENCRYPTION_PASSWORD="your_encryption_password" /path/to/your/script.sh 2>&1 | while IFS= read -r line; do echo "$(date): $line"; done >> /path/to/your/logfile.log
```

### Python Script Cron Job

Add the Python script to a cron job to run every minute:

```
* * * * * ENCRYPTION_PASSWORD="your_encryption_password" /usr/bin/python3 /path/to/your/script.py 2>&1 | while IFS= read -r line; do echo "$(date): $line"; done >> /path/to/your/logfile.log
```

By following these steps, you can securely handle the wallet password without hardcoding it in the script or cron job, and ensure it is only decrypted at runtime. Additionally, the scripts handle redundant endpoints to ensure the transaction is pushed even if one of the endpoints is down.

## BUT, IS MY ORACLE EVEN WORKING?

### Adding Integrity Check for Oracle on WAX Mainnet

To further ensure the integrity of your oracle and verify that the `write` actions are being published correctly on the WAX Mainnet, you can use a script that queries the blockchain directly. This approach helps confirm that the oracle is functioning as expected and hasn't hung by checking for recent transactions directly on-chain.

Here is an example script that uses the WAX hyperion v2 to fetch and verify actions for a specific smart contract and action. This script is particularly useful for monitoring the `delphioracle` contract to ensure that the `write` actions by the BP are occurring within the expected timeframe.

In this example we want to know if there have been any `write` actions in the last 30 minutes.

```
#!/bin/bash

# Define variables
ACTOR="your_account" # eg. bountyblokbp
CONTRACT="delphioracle"
ACTION="write"
WAX_API_ENDPOINT="https://api.wax.alohaeos.com/v2/history/get_actions"
TIME_WINDOW=1800 # Time window in seconds (30 minutes)

# Get the current timestamp in seconds
CURRENT_TIMESTAMP=$(date +%s)

# Fetch the latest actions for the delphioracle contract
RESPONSE=$(curl -s -G --data-urlencode "account=$ACTOR" --data-urlencode "filter=$CONTRACT:$ACTION" --data-urlencode "sort=desc" --data-urlencode "limit=1000" $WAX_API_ENDPOINT)

# Print fetched actions for debugging
echo "Fetched actions: $RESPONSE"

# Check if the write action was performed in the last 30 minutes
ACTION_FOUND=$(echo $RESPONSE | jq -r --argjson CURRENT_TIMESTAMP "$CURRENT_TIMESTAMP" '
  .actions[] | select(.act.account == "'$CONTRACT'" and .act.name == "'$ACTION'") |
  select((($CURRENT_TIMESTAMP - (.timestamp | sub("\\..*"; "") | strptime("%Y-%m-%dT%H:%M:%S") | mktime)) <= 1800)) |
  .trx_id
')

# Print the current timestamp for debugging
echo "Current timestamp: $CURRENT_TIMESTAMP"

# Output result
if [ -n "$ACTION_FOUND" ]; then
  echo "Write action found: $ACTION_FOUND"
else
  echo "No write action found by $ACTOR in the last 30 minutes"
  # send_email()
  # send_sms()
fi
```

### Benefits

- **Direct On-Chain Verification**: This script provides a direct way to verify that the write actions are being published on-chain, ensuring that the oracle is functioning correctly.
- **Extended Time Window**: By checking within the last 30 minutes, the script ensures that even if there are many transactions, it will catch the relevant ones.
- **Added Integrity**: This method adds an additional layer of integrity to your oracle setup by providing real-time verification directly from the blockchain.

## Conclusion

By following this guide, you have created a WAX Price Oracle service using either a Bash or Python script. The service fetches cryptocurrency prices, securely handles wallet passwords, pushes transactions to the WAX blockchain, and sets up alerts for any failures. Scheduling these scripts using cron jobs ensures your service runs smoothly and reliably.

Additionally, to further ensure the integrity of your oracle and verify that the `write` actions are being published correctly on the WAX Mainnet, you can use the provided script that queries the blockchain directly. This approach helps confirm that the oracle is functioning as expected and hasn't hung by checking for recent transactions directly on-chain. This script uses the WAX history API to fetch and verify actions for the `delphioracle` smart contract, specifically targeting the `write` actions by the `bountyblokbp` actor within the last 30 minutes. This method adds an additional layer of integrity to your oracle setup by providing real-time verification directly from the blockchain.

 
