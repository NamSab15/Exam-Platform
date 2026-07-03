output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "The login server for the Azure Container Registry"
}

output "acr_name" {
  value       = azurerm_container_registry.acr.name
  description = "The name of the Azure Container Registry"
}

output "container_app_fqdn" {
  value       = azurerm_container_app.frontend.ingress[0].fqdn
  description = "The fully qualified domain name of the Container App"
}

output "container_app_name" {
  value       = azurerm_container_app.frontend.name
  description = "The name of the Container App"
}

output "resource_group_name" {
  value       = azurerm_resource_group.app.name
  description = "The name of the resource group containing the application resources"
}
