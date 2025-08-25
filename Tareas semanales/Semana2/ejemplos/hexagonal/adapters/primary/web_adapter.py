from flask import Blueprint, request, jsonify
from services.route_service import RouteService
from adapters.secondary.emergency_repository import InMemoryEmergencyRepository
from adapters.secondary.emergency_repository import InMemoryVehicleRepository
from adapters.secondary.route_optimizer import SimpleRouteOptimizer

# Crear instancias de los adaptadores
emergency_repository = InMemoryEmergencyRepository()
vehicle_repository = InMemoryVehicleRepository()
route_optimizer = SimpleRouteOptimizer()

# Crear servicio
route_service = RouteService(emergency_repository, vehicle_repository, route_optimizer)

# Crear blueprint de Flask
emergency_bp = Blueprint('emergency', __name__, url_prefix='/api/emergency')

@emergency_bp.route('/routes/<emergency_id>', methods=['GET'])
def get_route_for_emergency(emergency_id):
    try:
        route = route_service.get_optimal_route_for_emergency(emergency_id)
        return jsonify({
            "success": True,
            "route": {
                "vehicle_id": route.vehicle.id,
                "emergency_id": route.emergency.id,
                "estimated_time": route.estimated_time,
                "distance": route.distance,
                "path": [{"lat": loc.latitude, "lng": loc.longitude} for loc in route.path]
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 404

@emergency_bp.route('/routes', methods=['GET'])
def get_all_routes():
    try:
        results = route_service.get_all_active_emergencies_with_routes()
        
        response_data = []
        for result in results:
            if "route" in result:
                route = result["route"]
                response_data.append({
                    "emergency_id": result["emergency"].id,
                    "vehicle_id": route.vehicle.id,
                    "estimated_time": route.estimated_time,
                    "distance": route.distance
                })
            else:
                response_data.append({
                    "emergency_id": result["emergency"].id,
                    "error": result["error"]
                })
        
        return jsonify({
            "success": True,
            "routes": response_data
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@emergency_bp.route('/vehicles/available', methods=['GET'])
def get_available_vehicles():
    vehicle_type = request.args.get('type')
    vehicles = vehicle_repository.get_available_vehicles(vehicle_type)
    
    return jsonify({
        "success": True,
        "vehicles": [{
            "id": v.id,
            "type": v.type,
            "location": {"lat": v.current_location.latitude, "lng": v.current_location.longitude}
        } for v in vehicles]
    })