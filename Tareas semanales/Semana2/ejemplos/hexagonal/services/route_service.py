from domain.ports import EmergencyRepositoryPort, VehicleRepositoryPort, RouteOptimizerPort
from domain.entities import Route, Emergency

class RouteService:
    def __init__(
        self, 
        emergency_repository: EmergencyRepositoryPort,
        vehicle_repository: VehicleRepositoryPort,
        route_optimizer: RouteOptimizerPort
    ):
        self.emergency_repository = emergency_repository
        self.vehicle_repository = vehicle_repository
        self.route_optimizer = route_optimizer
    
    def get_optimal_route_for_emergency(self, emergency_id: str) -> Route:
        # Obtener la emergencia
        emergency = self.emergency_repository.get_emergency_by_id(emergency_id)
        
        if not emergency:
            raise ValueError(f"Emergency with id {emergency_id} not found")
        
        # Obtener vehículos disponibles del tipo adecuado
        vehicle_type = self._get_vehicle_type_for_emergency(emergency.emergency_type)
        available_vehicles = self.vehicle_repository.get_available_vehicles(vehicle_type)
        
        if not available_vehicles:
            # Si no hay vehículos del tipo específico, intentar con cualquier tipo
            available_vehicles = self.vehicle_repository.get_available_vehicles()
        
        if not available_vehicles:
            raise Exception("No available vehicles")
        
        # Encontrar la ruta óptima
        optimal_route = self.route_optimizer.find_optimal_route(emergency, available_vehicles)
        
        # Marcar vehículo como no disponible
        self.vehicle_repository.update_vehicle_status(optimal_route.vehicle.id, False)
        
        return optimal_route
    
    def _get_vehicle_type_for_emergency(self, emergency_type: str) -> str:
        mapping = {
            "medical": "ambulance",
            "fire": "fire_truck",
            "crime": "police_car"
        }
        return mapping.get(emergency_type)
    
    def get_all_active_emergencies_with_routes(self) -> list:
        emergencies = self.emergency_repository.get_active_emergencies()
        result = []
        
        for emergency in emergencies:
            try:
                route = self.get_optimal_route_for_emergency(emergency.id)
                result.append({
                    "emergency": emergency,
                    "route": route
                })
            except Exception as e:
                result.append({
                    "emergency": emergency,
                    "error": str(e)
                })
        
        return result