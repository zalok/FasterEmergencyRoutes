from dataclasses import dataclass
from typing import List

@dataclass
class Location:
    latitude: float
    longitude: float
    address: str = ""

@dataclass
class EmergencyVehicle:
    id: str
    current_location: Location
    type: str  # ambulance, fire_truck, police_car
    available: bool = True

@dataclass
class TypeEmergency:
    id: str
    location: Location
    emergency_type: str  # medical, fire, crime
    priority: int  # 1 (highest) to 5 (lowest)
    description: str = ""

@dataclass
class Route:
    vehicle: EmergencyVehicle
    emergency: TypeEmergency
    path: List[Location]
    estimated_time: float  # in minutes
    distance: float  # in kilometers