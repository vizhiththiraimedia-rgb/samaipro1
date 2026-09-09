import json
import os

registry_path = r"C:\Users\ASUS\Desktop\xampp\htdocs\samai\samai-projects\api_registry.json"

with open(registry_path, 'r') as f:
    data = json.load(f)

data["services"]["webdev_lk"] = {
  "service_name": "WebDev LK",
  "service_slug": "webdev-lk",
  "description": "AI Website Builder and Generator",
  "module": "web_builder",
  "endpoint_prefix": "/web-builder",
  "theme_color": "#4f46e5",
  "cost_tier": "premium",
  "endpoints": [
    {
      "name": "generate_site",
      "method": "POST",
      "path": "/web-builder/generate",
      "cost_credits": 10,
      "description": "Generate website from description",
      "params": { "prompt": "required", "language": "optional,default=en" }
    }
  ]
}

with open(registry_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Added webdev_lk to registry")
