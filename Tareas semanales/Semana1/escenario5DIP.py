"""
# ANTES (DIP)
class EmailSender:
    def send(self, to: str, msg: str) -> None:
        print(f"SMTP -> {to}: {msg}")

class OrderService:
    def __init__(self):
        self.email = EmailSender()  # dependencia rígida a un detalle

    def place_order(self, to: str, msg: str) -> None:
        # ... lógica de orden ...
        self.email.send(to, msg)

if __name__ == "__main__":
    OrderService().place_order("user@test.com", "Gracias por su compra")
# dificulta las pruebas porque cada vez que usamos un place order se manda un email real entonces para test está amarrado a mail sender
# entonces si queremos modificar algo siempre debemos tocar order services
# y eso arriesga errores
    
"""
from abc import ABC, abstractmethod

# --- Abstracción ---
class Notifier(ABC):
    @abstractmethod
    def send(self, to: str, msg: str) -> None:
        pass

# --- Implementaciones ---
class EmailSender(Notifier):
    def send(self, to: str, msg: str) -> None:
        print(f"SMTP -> {to}: {msg}")

class SmsSender(Notifier):
    def send(self, to: str, msg: str) -> None:
        print(f"SMS -> {to}: {msg}")

# --- Servicio ---
class OrderService:
    def __init__(self, notifier: Notifier):
        self.notifier = notifier

    def place_order(self, to: str, msg: str) -> None:
        # lógica de la orden...
        self.notifier.send(to, msg)

# --- Main ---
if __name__ == "__main__":
    email_service = EmailSender()
    order_service = OrderService(email_service)
    order_service.place_order("user@test.com", "Gracias por su compra")

    sms_service = SmsSender()
    order_service_sms = OrderService(sms_service)
    order_service_sms.place_order("123456789", "Gracias por su compra") 