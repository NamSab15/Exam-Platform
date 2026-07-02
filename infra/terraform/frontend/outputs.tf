output "swa_default_hostname" {
  value       = azurerm_static_web_app.frontend.default_host_name
  description = "The default host name of the Azure Static Web App"
}

output "swa_api_key" {
  value       = azurerm_static_web_app.frontend.api_key
  description = "The API key (deployment token) for the Static Web App"
  sensitive   = true
}

output "resource_group_name" {
  value       = azurerm_resource_group.app.name
  description = "The name of the resource group containing the Static Web App"
}
