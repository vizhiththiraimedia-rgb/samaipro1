#!/usr/bin/env python3
"""
SAM AI - Service Deployment Generator

Generates standalone PHP service sites from the template for each service
in the API registry. Run this script to create a new service site.

Usage:
    python generate_service_site.py <service_slug> [--api-key KEY] [--domain DOMAIN]

Example:
    python generate_service_site.py newsflash-pro --api-key sk-samai-xxx
"""

import os
import sys
import json
import shutil
import argparse
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECTS_DIR = SCRIPT_DIR.parent  # samai-projects/
TEMPLATE_DIR = PROJECTS_DIR / "templates" / "php-template"
REGISTRY_PATH = PROJECTS_DIR / "api_registry.json"
SERVICES_DIR = PROJECTS_DIR  # services are siblings of deployment/
DEPLOYMENT_DIR = PROJECTS_DIR / "deployment" / "cpanel"


def load_registry():
    with open(REGISTRY_PATH, "r") as f:
        return json.load(f)


def generate_htaccess(service_slug):
    return f"""# SAM AI - {service_slug} .htaccess
Options -Indexes
RewriteEngine On

# Pretty URLs
RewriteCond %{{REQUEST_FILENAME}} !-f
RewriteCond %{{REQUEST_FILENAME}} !-d
RewriteRule ^([^\\.]+)$ $1.php [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\\.(env|ini|conf|sql)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
"""


def generate_cpanel_config(service_slug, service_name):
    return f"""# cPanel Configuration for {service_name} ({service_slug})
# Deploy this site by:
# 1. Creating a subdomain or addon domain in cPanel
# 2. Pointing the document root to the service directory
# 3. Copying all files from the generated directory
#
# Domain: {service_slug}.sam.ai
# Document Root: /home/samaiuser/samai-projects/{service_slug}/public_html
# PHP Version: 8.2+
#
# Required PHP extensions: curl, mbstring, openssl, json
# Required environment variables:
#   SAMAI_API_BASE=https://samai.com
#   SAMAI_SERVICE_KEY=sk-samai-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
"""


def generate_service_site(service_slug, api_key=None, domain=None):
    """Generate a standalone PHP service site from the template."""
    registry = load_registry()
    services = registry.get("services", {})

    if service_slug not in services:
        # Try matching by slug
        matched = None
        for key, info in services.items():
            if info.get("service_slug") == service_slug:
                matched = info
                break
        if not matched:
            print(f"ERROR: Service '{service_slug}' not found in api_registry.json")
            print(f"Available services: {', '.join(s.get('service_slug', k) for k, s in services.items())}")
            return None

        service_info = matched
    else:
        service_info = services[service_slug]

    service_name = service_info["service_name"]
    description = service_info["description"]
    theme_color = service_info.get("theme_color", "#3b82f6")
    theme_hover = theme_color.replace("#", "#").replace("0", "0", 1) if theme_color.startswith("#") else theme_color

    # Calculate hover color (slightly darker)
    if theme_color.startswith("#") and len(theme_color) == 7:
        try:
            r = int(theme_color[1:3], 16)
            g = int(theme_color[3:5], 16)
            b = int(theme_color[5:7], 16)
            theme_hover = f"#{max(0, r-20):02x}{max(0, g-20):02x}{max(0, b-20):02x}"
        except ValueError:
            theme_hover = theme_color
    else:
        theme_hover = theme_color

    # Generate config.php
    config_content = f"""<?php
// =========================================================================
// SAM AI - Service Configuration: {service_name}
// Auto-generated: {datetime.now().isoformat()}
// =========================================================================

define('ENVIRONMENT', 'production');
define('SAMAI_API_BASE', 'https://samai.com');
define('SERVICE_NAME', '{service_name}');
define('SERVICE_SLUG', '{service_info["service_slug"]}');
define('SERVICE_KEY', '{api_key or "REPLACE_WITH_API_KEY"}');
define('SERVICE_ENDPOINT_PREFIX', '{service_info["endpoint_prefix"]}');

// Theme
define('THEME_COLOR', '{theme_color}');
define('THEME_COLOR_HOVER', '{theme_hover}');

// Site Info
define('SITE_TITLE', '{service_name}');
define('SITE_TAGLINE', '{description}');
define('SITE_DOMAIN', '{domain or service_info["service_slug"] + ".sam.ai"}');

// Credit Costs (from api_registry.json)
"""
    for ep in service_info.get("endpoints", []):
        cost_name = f"CREDIT_COST_{ep['name'].upper()}"
        config_content += f"define('{cost_name}', {ep['cost_credits']});\n"

    config_content += f"""

// Session
session_start();

// API Client
require_once __DIR__ . '/includes/api-client.php';

$sam_config = [
    'api_base' => SAMAI_API_BASE,
    'service_key' => SERVICE_KEY,
    'jwt_token' => null,
];
$api = new SamAI_API_Client($sam_config);
$session = new SamAI_Session();

if ($session->isLoggedIn()) {{
    $api->setToken($session->getToken());
}}

function redirect($url) {{
    header("Location: " . $url);
    exit;
}}

function jsonResponse($data, $status = 200) {{
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}}

function formatCredits($credits) {{
    return number_format($credits);
}}
?>
"""

    # Create service directory
    service_dir = SERVICES_DIR / service_info["service_slug"]
    if service_dir.exists():
        print(f"WARNING: Directory {service_dir} already exists. Overwriting config only.")
    else:
        service_dir.mkdir(parents=True, exist_ok=True)

    # Copy template files
    if service_dir == TEMPLATE_DIR:
        print("ERROR: Cannot copy template to itself")
        return None

    # Copy all template files
    for item in TEMPLATE_DIR.iterdir():
        dest = service_dir / item.name
        if item.is_dir():
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)

    # Write service-specific config.php (overwrites template)
    with open(service_dir / "config.php", "w") as f:
        f.write(config_content)

    # Write .htaccess
    with open(service_dir / ".htaccess", "w") as f:
        f.write(generate_htaccess(service_info["service_slug"]))

    # Write cPanel config
    deploy_dir = DEPLOYMENT_DIR / service_info["service_slug"]
    deploy_dir.mkdir(parents=True, exist_ok=True)
    with open(deploy_dir / "cpanel_config.txt", "w") as f:
        f.write(generate_cpanel_config(service_info["service_slug"], service_name))
        f.write(f"API Key: {api_key or 'REPLACE_WITH_API_KEY'}\n")

    # Copy all template files to deployment package
    deploy_pkg = deploy_dir / "deploy_package"
    if deploy_pkg.exists():
        shutil.rmtree(deploy_pkg)
    shutil.copytree(service_dir, deploy_pkg)

    print(f"\n{'='*60}")
    print(f"Service site generated successfully!")
    print(f"{'='*60}")
    print(f"  Service:      {service_name}")
    print(f"  Slug:         {service_info['service_slug']}")
    print(f"  Directory:    {service_dir}")
    print(f"  API Key:      {api_key or 'REPLACE_WITH_API_KEY'}")
    print(f"  Domain:       {domain or service_info['service_slug'] + '.sam.ai'}")
    print(f"  Endpoints:    {len(service_info.get('endpoints', []))}")
    print(f"  Deploy Pack:  {deploy_pkg}")
    print(f"{'='*60}")

    return service_dir


def generate_all_sites(api_key_prefix="svc"):
    """Generate all service sites from the template."""
    registry = load_registry()
    services = registry.get("services", {})

    generated = []
    for key, info in services.items():
        api_key = f"{api_key_prefix}_{info['service_slug']}_{uuid.uuid4().hex[:12]}" if api_key_prefix else None
        domain = f"https://{info['service_slug']}.sam.ai"

        result = generate_service_site(
            info["service_slug"],
            api_key=api_key,
            domain=domain,
        )
        if result:
            generated.append(info["service_slug"])

    print(f"\n{'='*60}")
    print(f"Generated {len(generated)} service sites:")
    for slug in generated:
        print(f"  - {slug}")
    print(f"{'='*60}")


if __name__ == "__main__":
    import uuid

    parser = argparse.ArgumentParser(description="Generate SAM AI standalone service sites")
    parser.add_argument("slug", nargs="?", help="Service slug to generate (or 'all')")
    parser.add_argument("--api-key", help="API key for the service")
    parser.add_argument("--domain", help="Custom domain for the service")

    args = parser.parse_args()

    if not args.slug:
        print("Usage: python generate_service_site.py <service_slug|all> [--api-key KEY] [--domain DOMAIN]")
        print("\nExample: python generate_service_site.py newsflash-pro --api-key sk-samai-xxx")
        sys.exit(1)

    if args.slug == "all":
        generate_all_sites()
    else:
        result = generate_service_site(args.slug, args.api_key, args.domain)
        if not result:
            sys.exit(1)
