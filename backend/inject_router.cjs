const fs = require('fs');
let c = fs.readFileSync('main.py', 'utf8');

if (!c.includes('from routers import (\\n    auth, chat, project, api_provider, pdf_translate, coding, voice, media, image,\\n    agents, learning, api_proxy, lead_gen, crypto, auto_integrator, ai_intelligence,\\n    translate, social_news, flutter_build, telegram_bot, knowledge, orchestrator,\\n    multimodel, security as security_router, permissions as permissions_router,\\n    validation as validation_router, analytics as analytics_router,\\n    gateway as gateway_router, sam_ai as sam_ai_router,\\n    secrets as secrets_router, developer\\n)')) {
    
    // Add import
    c = c.replace('secrets as secrets_router\\n)', 'secrets as secrets_router, developer\\n)');
    
    // Add to list
    c = c.replace('gateway_router.router, sam_ai_router.router, secrets_router.router\\n]', 'gateway_router.router, sam_ai_router.router, secrets_router.router, developer.router\\n]');
    
    fs.writeFileSync('main.py', c);
    console.log('Injected developer router');
} else {
    console.log('Already injected');
}
