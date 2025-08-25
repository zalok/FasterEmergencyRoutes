from abc import ABC, abstractmethod
from typing import List
from domain.entities import Emergency, EmergencyVehicle, Location, Route

class MapServicePort(ABC):
    @abstractmethod
    def get_route(self, start: Location, end: Location) -> Route:
        pass
    
    @abstractmethod
    def get_traffic_data(self, location: Location) -> float:
        pass

class EmergencyRepositoryPort(ABC):
    @abstractmethod
    def get_active_emergencies(self) -> List[Emergency]:
        pass
    
    @abstractmethod
    def get_emergency_by_id(self, emergency_id: str) -> Emergency:
        pass

class VehicleRepositoryPort(ABC):
    @abstractmethod
    def get_available_vehicles(self, vehicle_type: str = None) -> List[EmergencyVehicle]:
        pass
    
    @abstractmethod
    def update_vehicle_status(self, vehicle_id: str, available: bool) -> bool:
        pass

class RouteOptimizerPort(ABC):
    @abstractmethod
    def find_optimal_route(self, emergency: Emergency, available_vehicles: List[EmergencyVehicle]) -> Route:
        pass