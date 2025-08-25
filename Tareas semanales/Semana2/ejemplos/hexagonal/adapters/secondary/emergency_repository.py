from domain.ports import EmergencyRepositoryPort
from domain.entities import Emergency, Location

class InMemoryEmergencyRepository(EmergencyRepositoryPort):
    def __init__(self):
        self.emergencies = {
            "emergency_1": Emergency(
                id="emergency_1",
                location=Location(latitude=40.7128, longitude=-74.0060, address="123 Main St"),
                emergency_type="medical",
                priority=1,
                description="Heart attack patient"
            ),
            "emergency_2": Emergency(
                id="emergency_2",
                location=Location(latitude=40.7138, longitude=-74.0070, address="456 Oak Ave"),
                emergency_type="fire",
                priority=2,
                description="Small kitchen fire"
            )
        }
    
    def get_active_emergencies(self):
        return list(self.emergencies.values())
    
    def get_emergency_by_id(self, emergency_id: str):
        return self.emergencies.get(emergency_id)