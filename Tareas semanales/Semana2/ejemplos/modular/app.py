from flask import Flask
from config import Config
from database.connection import init_db
from auth.routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Inicializar base de datos
    init_db(app)
    
    # Registrar blueprints
    app.register_blueprint(auth_bp)
    
    # Ruta principal
    @app.route('/')
    def index():
        return redirect('/auth/login')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)