const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const paymentWebAppUrl = process.env.PAYMENT_WEB_APP_URL || 'https://gtopay.com/payment';
const loginWebAppUrl = process.env.LOGIN_WEB_APP_URL || 'https://gtopay.com/login';
const downloadWebAppUrl = process.env.DOWNLOAD_WEB_APP_URL || 'https://gtopay.com/download';

// Keep-alive server
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

function startKeepAlive() {
    app.listen(port, () => {
        console.log(`Keep-alive server running on port ${port}`);
    });
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const replyMarkup = {
        keyboard: [
            [
                { text: '💳 Open GTOPay', web_app: { url: paymentWebAppUrl } },
                { text: '🔐 Login/Sign Up', web_app: { url: loginWebAppUrl } }
            ],
            [
                { text: '⬇️ Download GTOPay', web_app: { url: downloadWebAppUrl } }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };

    bot.sendMessage(chatId, 'Welcome to GTOPay Bot! Choose an option:', {
        reply_markup: replyMarkup
    });
});

bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});

// Start the keep-alive server and then the bot
startKeepAlive();
console.log('Telegram bot started...');