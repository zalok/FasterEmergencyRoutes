import math
import random
from domain.ports import RouteOptimizerPort
from domain.entities import Emergency, EmergencyVehicle, Location, Route

class SimpleRouteOptimizer(RouteOptimizerPort):
    def find_optimal_route(self, emergency: Emergency, available_vehicles: List[EmergencyVehicle]) -> Route:
        # Algoritmo simple: elegir el vehículo más cercano
        closest_vehicle = None
        min_distance = float('inf')
        
        for vehicle in available_vehicles:
            distance = self._calculate_distance(
                vehicle.current_location, 
                emergency.location
            )
            
            if distance < min_distance:
                min_distance = distance
                closest_vehicle = vehicle
        
        # Generar una ruta simulada (en un caso real, usaríamos un servicio de mapas)
        path = self._generate_simulated_path(closest_vehicle.current_location, emergency.location)
        
        # Calcular tiempo estimado (simulado)
        estimated_time = self._estimate_time(min_distance)
        
        return Route(
            vehicle=closest_vehicle,
            emergency=emergency,
            path=path,
            estimated_time=estimated_time,
            distance=min_distance
        )
    
    def _calculate_distance(self, loc1: Location, loc2: Location) -> float:
        # Fórmula haversine simplificada para ejemplo
        lat_diff = abs(loc1.latitude - loc2.latitude)
        lon_diff = abs(loc1.longitude - loc2.longitude)
        return math.sqrt(lat_diff**2 + lon_diff**2) * 111  # Aproximación km
    
    def _generate_simulated_path(self, start: Location, end: Location) -> List[Location]:
        # Generar puntos intermedios simulados
        num_points = 3
        path = [start]
        
        for i in range(1, num_points + 1):
            fraction = i / (num_points + 1)
            lat = start.latitude + (end.latitude - start.latitude) * fraction
            lon = start.longitude + (end.longitude - start.longitude) * fraction
            path.append(Location(latitude=lat, longitude=lon))
        
        path.append(end)
        return path
    
    def _estimate_time(self, distance: float) -> float:
        # Tiempo estimado en minutos (considerando tráfico)
        base_speed = 60  # km/h
        traffic_factor = random.uniform(0.7, 1.3)  # Factor aleatorio de tráfico
        speed = base_speed * traffic_factor
        return (distance / speed) * 60  # Convertir a minutos