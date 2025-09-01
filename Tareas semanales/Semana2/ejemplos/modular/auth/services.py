from auth.models import User
from database.connection import db

class AuthService:
    @staticmethod
    def register_user(username, email, password):
        if User.query.filter_by(username=username).first():
            return None, "El usuario ya existe"
        
        if User.query.filter_by(email=email).first():
            return None, "El email ya está registrado"
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user, "Usuario registrado exitosamente"
    
    @staticmethod
    def authenticate_user(username, password):
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            return user, "Login exitoso"
        
        return None, "Credenciales inválidas"
    
    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)