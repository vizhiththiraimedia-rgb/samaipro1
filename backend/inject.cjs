const fs = require('fs');
let content = fs.readFileSync('routers/telegram_bot.py', 'utf8');

const importStatement = "from automations.news_processor import process_news_link\nfrom fastapi import BackgroundTasks\n";
if (!content.includes('process_news_link')) {
    content = content.replace('from database import get_db', importStatement + 'from database import get_db');
}

const hookStr = "    elif text.startswith(\"http\"):\n        background_tasks.add_task(process_news_link, text, chat_id)\n        send_telegram_message(chat_id, \"? Link received! Placed in queue for processing...\")\n";

if (!content.includes('elif text.startswith("http")')) {
    content = content.replace('    else:\n        send_telegram_message(chat_id, "Unknown command', hookStr + '    else:\n        send_telegram_message(chat_id, "Unknown command');
}

if (!content.includes('background_tasks: BackgroundTasks')) {
    content = content.replace('async def telegram_webhook(request: Request, db: Session = Depends(get_db)):', 'async def telegram_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):');
}

fs.writeFileSync('routers/telegram_bot.py', content, 'utf8');
console.log('Injected background task into telegram_bot.py');
