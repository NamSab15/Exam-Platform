terraform {
  backend "azurerm" {
    resource_group_name  = "rg-xebia-tfstate"
    container_name       = "tfstate"
    key                  = "frontend/terraform.tfstate"
    # storage_account_name is provided dynamically via CLI backend-config or env var
  }
}
