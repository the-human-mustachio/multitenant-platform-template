#!/bin/bash

function set() {
  # Print the export commands to be evaluated in the parent shell
  echo 'export AWS_ACCESS_KEY_ID="test"'
  echo 'export AWS_SECRET_ACCESS_KEY="test"'
  echo 'export AWS_DEFAULT_REGION="us-west-2"'
  echo 'export AWS_ENDPOINT_URL="http://localhost.localstack.cloud:4566"'
  echo 'echo "AWS credentials and endpoint set for LocalStack (**WARNING**: Not for production)"'
}

function unset() {
  # Print the unset commands to be evaluated in the parent shell
  echo 'unset AWS_ACCESS_KEY_ID'
  echo 'unset AWS_SECRET_ACCESS_KEY'
  echo 'unset AWS_DEFAULT_REGION'
  echo 'unset AWS_ENDPOINT_URL'
  echo 'echo "AWS credentials and endpoint unset"'
}

# Read the first argument, which is the function name
function_name="$1"

# Check if the function name is valid
if [[ "$function_name" == "set" || "$function_name" == "unset" ]]; then
  # Print the commands to be evaluated
  "$function_name"
else
  echo "Invalid function name. Please use 'set' or 'unset'."
fi
