# type: ignore
import json, werkzeug
from odoo import http
from odoo.http import request, Session
import jwt, datetime
import secrets

SECRET_KEY = secrets.token_urlsafe(32)

def _response(response_body, status_code=200):
    try:
        body = json.dumps(response_body)
    except Exception as e:
        body = json.dumps({
            "success": False,
            "message": f"Serialization error: {str(e)}"
        })
    headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Content-Length", str(len(body)))
    ]
    return werkzeug.wrappers.Response(body, headers=headers, status=status_code)

def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


class FieldServiceController(http.Controller):

    @http.route(
        "/api/auth/login", type="http", auth="none", methods=["POST"], csrf=False
    )
    def login(self):
        """
        Login method to authenticate user and return session information.
        """
        try:
            params = request.params
            username = params.get("username")
            password = params.get("password")

            if not (username and password):
                return _response(
                    {"success": False, "error": "Missing required parameters."},
                    status_code=400,
                )

            # Authenticate
            if username and password:
                credential = {
                    "type": "password",
                    "login": username,
                    "password": password,
                }

            Session.authenticate(request.session, request.session.db, credential)
            user = request.env.user
            jwt_token = generate_jwt(user.id)

            return _response(
                {
                    "success": True,
                    "message": "Successfully logged in.",
                    "jwt_token": jwt_token,
                    "user_id": user.id,
                    "user_name": user.name,
                    "company_id": user.company_id.id,
                    "company_name": user.company_id.name,
                    "image": user.image_1920 and user.image_1920.decode("utf-8") or "",
                },
                status_code=200,
            )
        except Exception as e:
            return _response(
                {
                    "success": False,
                    "error": str(e),
                }, status_code=401
            )

    @http.route('/api/my/tasks', type='json', auth='user', csrf=False, methods=['POST'])
    def get_my_tasks(self, **kwargs):
        try:
            current_user = request.env.user

            # Fetch FSM tasks assigned to the current user
            tasks = request.env['fsm.task'].sudo().search([
                ('user_id', '=', current_user.id)
            ])

            task_list = []
            for task in tasks:
                task_list.append({
                    'id': task.id,
                    'name': task.name,
                    'customer': task.partner_id.name,
                    'status': task.stage_id.name,
                    'scheduled_date': task.scheduled_date,
                    'location': task.location_id.name if task.location_id else '',
                    'description': task.description,
                })

            return {
                'count': len(task_list),
                'tasks': task_list
            }

        except Exception as e:
            return {'error': str(e)}
