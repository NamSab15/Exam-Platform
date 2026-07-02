#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Default values
RESOURCE_GROUP_NAME="rg-xebia-tfstate"
LOCATION="eastasia"
CONTAINER_NAME="tfstate"

# Check if storage account name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <unique-storage-account-name>"
    echo "Example: $0 xebiatfstate"
    exit 1
fi

STORAGE_ACCOUNT_NAME="$1"

# Validate storage account name: 3-24 characters, lowercase alphanumeric only
if [[ ! "$STORAGE_ACCOUNT_NAME" =~ ^[a-z0-9]{3,24}$ ]]; then
    echo "Error: Storage account name must be between 3 and 24 characters, lowercase alphanumeric only."
    exit 1
fi

echo "============================================="
echo "Bootstrapping Azure Resources for TF State"
echo "Resource Group:  $RESOURCE_GROUP_NAME"
echo "Location:        $LOCATION"
echo "Storage Account: $STORAGE_ACCOUNT_NAME"
echo "Container:       $CONTAINER_NAME"
echo "============================================="

# Create Resource Group
echo "Creating resource group '$RESOURCE_GROUP_NAME' in '$LOCATION'..."
az group create --name "$RESOURCE_GROUP_NAME" --location "$LOCATION" --output table

# Create Storage Account
echo "Creating storage account '$STORAGE_ACCOUNT_NAME'..."
az storage account create \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$STORAGE_ACCOUNT_NAME" \
    --sku Standard_LRS \
    --encryption-services blob \
    --location "$LOCATION" \
    --output table

# Create Storage Container
echo "Creating storage container '$CONTAINER_NAME'..."
az storage container create \
    --name "$CONTAINER_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --auth-mode login \
    --output table

echo "============================================="
echo "Success! Bootstrap completed."
echo "Paste the following backend block into your Terraform config:"
echo ""
cat <<EOF
terraform {
  backend "azurerm" {
    resource_group_name  = "$RESOURCE_GROUP_NAME"
    storage_account_name = "$STORAGE_ACCOUNT_NAME"
    container_name       = "$CONTAINER_NAME"
    key                  = "frontend/terraform.tfstate"
  }
}
EOF
echo "============================================="
