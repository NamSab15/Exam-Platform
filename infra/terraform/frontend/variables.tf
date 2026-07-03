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

variable "acr_name" {
  type        = string
  description = "The name of the Azure Container Registry (must be globally unique, alphanumeric only)"
  default     = "acrxebiaexamshared"
}

variable "container_app_environment_name" {
  type        = string
  description = "The name of the Azure Container App Environment"
  default     = "cae-xebia-exam-shared"
}

variable "container_app_name" {
  type        = string
  description = "The name of the Azure Container App"
  default     = "ca-xebia-exam-frontend"
}
