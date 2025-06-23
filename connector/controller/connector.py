import json
from odoo import http
from odoo.http import request, Session
import logging
import requests

_logger = logging.getLogger(__name__)


def send_telegram_message(chat_id, text):
    token = "<TOKEN_HERE>"
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    try:
        resp = requests.post(url, json=payload)
        _logger.info("Telegram API response: %s", resp.text)
        resp.raise_for_status()
    except Exception as e:
        _logger.error("Failed to send Telegram message: %s", e)


class TelegramWebhook(http.Controller):

    def _do_telegram_login(self, email, password, chat_id):
        if not email or not password or not chat_id:
            return {"status": "error", "message": "Missing credentials"}
        user = request.env["res.users"].sudo().search([("login", "=", email)], limit=1)
        if not user:
            return {"status": "error", "message": "User not found"}
        try:

            if not (email and password):
                return {"success": False, "error": "Missing required parameters."},
            # Authenticate
            if email and password:
                credential = {
                    "type": "password",
                    "login": email,
                    "password": password,
                }
            Session.authenticate(request.session, request.session.db, credential)
        except Exception:
            return {"status": "error", "message": "Invalid password"}
        user.sudo().write({"telegram_chat_id": str(chat_id)})
        return {"status": "success", "message": "Telegram linked successfully"}

    # @http.route("/telegram/login", type="json", auth="public", csrf=False)
    # def telegram_login(self, **kwargs):
    #     email = kwargs.get("email")
    #     password = kwargs.get("password")
    #     chat_id = kwargs.get("chat_id")
    #     return self._do_telegram_login(email, password, chat_id)

    @http.route(
        "/telegram/webhook", type="json", methods=["POST"], auth="public", csrf=False
    )
    def telegram_webhook(self, **kwargs):
        data = request.get_json_data()
        _logger.info("Telegram webhook received: %s", data)

        message = data.get("message")
        if not message:
            return {"ok": False, "error": "No message"}

        chat_id = message.get("chat", {}).get("id")
        text = message.get("text", "").strip()
        _logger.info("Received message from chat_id %s: %s", chat_id, text)

        if not chat_id or not text:
            return {"ok": False, "error": "Missing chat_id or text"}

        if text.lower() == "/start":
            send_telegram_message(
                chat_id,
                "👋 Welcome! Please send your email and password separated by a comma (e.g., user@email.com,password)",
            )
            return {"ok": True}

        # Always treat the message as credentials
        try:
            email, password = [x.strip() for x in text.split(",", 1)]
        except Exception:
            send_telegram_message(
                chat_id, "⚠️ Please send your credentials as: email,password"
            )
            return {"ok": True}

        result = self._do_telegram_login(email, password, chat_id)
        if result["status"] == "success":
            send_telegram_message(
                chat_id,
                "✅ Login successful! You can now use /tasks or /done.",
            )
        else:
            send_telegram_message(
                chat_id,
                f"❌ Login failed: {result['message']}\nTry again or send /start to restart.",
            )
        return {"ok": True}
