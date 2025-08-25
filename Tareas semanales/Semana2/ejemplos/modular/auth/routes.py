from flask import Blueprint, request
from auth.controllers import AuthController

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['GET'])
def login():
    return AuthController.login()

@auth_bp.route('/login', methods=['POST'])
def login_post():
    return AuthController.login_post()

@auth_bp.route('/register', methods=['GET'])
def register():
    return AuthController.register()

@auth_bp.route('/register', methods=['POST'])
def register_post():
    return AuthController.register_post()

@auth_bp.route('/dashboard', methods=['GET'])
def dashboard():
    return AuthController.dashboard()

@auth_bp.route('/logout', methods=['GET'])
def logout():
    return AuthController.logout()