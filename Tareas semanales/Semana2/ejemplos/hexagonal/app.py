from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # Ruta de bienvenida
    @app.route('/')
    def home():
        return {
            "message": "Sistema de Optimización de Rutas de Emergencia",
            "endpoints": {
                "get_route": "/api/emergency/routes/<emergency_id>",
                "get_all_routes": "/api/emergency/routes",
                "get_available_vehicles": "/api/emergency/vehicles/available?type=<vehicle_type>"
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)