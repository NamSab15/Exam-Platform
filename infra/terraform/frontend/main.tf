resource "azurerm_resource_group" "app" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "log-xebia-exam-shared"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.app.name
  location            = azurerm_resource_group.app.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_container_app_environment" "environment" {
  name                       = var.container_app_environment_name
  location                   = azurerm_resource_group.app.location
  resource_group_name        = azurerm_resource_group.app.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}

resource "azurerm_container_app" "frontend" {
  name                         = var.container_app_name
  container_app_environment_id = azurerm_container_app_environment.environment.id
  resource_group_name          = azurerm_resource_group.app.name
  revision_mode                = "Single"

  template {
    container {
      name   = "frontend"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = "0.25"
      memory = "0.5Gi"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  lifecycle {
    ignore_changes = [
      template[0].container[0].image
    ]
  }
}
