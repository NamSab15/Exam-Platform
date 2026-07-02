variable "resource_group_name" {
  type        = string
  description = "The name of the resource group for application resources"
  default     = "rg-xebia-exam-prod"
}

variable "location" {
  type        = string
  description = "The Azure region to deploy resources"
  default     = "eastasia"
}

variable "swa_name" {
  type        = string
  description = "The name of the Azure Static Web App resource"
  default     = "swa-xebia-exam-frontend"
}

variable "swa_sku_tier" {
  type        = string
  description = "The SKU tier for the Static Web App"
  default     = "Free" # Free tier has $0/month cost
}
