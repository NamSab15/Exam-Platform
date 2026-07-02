resource "azurerm_resource_group" "app" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_static_web_app" "frontend" {
  name                = var.swa_name
  resource_group_name = azurerm_resource_group.app.name
  location            = azurerm_resource_group.app.location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_tier
}
