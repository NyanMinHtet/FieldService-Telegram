from odoo import _, api, fields, models

class ResUsers(models.Model):
    _inherit = 'res.users'

    telegram_chat_id = fields.Char(
        string='Telegram Chat ID',
        help='Telegram chat ID for the user to receive notifications.',
        required=False,
        readonly=False,
        default=False,
        copy=False,
        index=True)
