from abc import ABC, abstractmethod
"""
# ANTES (OCP)
class PaymentProcessor:
    def process(self, payment_type: str, amount: float):
        if payment_type == "cash":
            print(f"Efectivo: {amount}")
        elif payment_type == "card":
            print(f"Tarjeta: {amount}")
        elif payment_type == "transfer":
            print(f"Transferencia: {amount}")
        else:
            raise ValueError("Tipo no soportado")

if __name__ == "__main__":
    PaymentProcessor().process("card", 100.0)
# Viola OCP Porque cada vez que se agrega un nuevo método de pago,
# se debe modificar la clase PaymentProcessor.
"""
# Se utiliza polimorfismo para cumplir con el principio de abierto/cerrado (OCP).
# La clase PaymentProcessor puede trabajar con cualquier método de pago que implemente la interfaz PaymentMethod,
# sin necesidad de modificar su código al agregar nuevos métodos de pago.
# --- Interfaz ---
class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount: float):
        pass

# --- Implementaciones ---
class CashPayment(PaymentMethod):
    def pay(self, amount: float):
        print(f"Efectivo: {amount}")

class CardPayment(PaymentMethod):
    def pay(self, amount: float):
        print(f"Tarjeta: {amount}")

class TransferPayment(PaymentMethod):
    def pay(self, amount: float):
        print(f"Transferencia: {amount}")

# --- Procesador ---
class PaymentProcessor:
    def __init__(self, method: PaymentMethod):
        self.method = method

    def process(self, amount: float):
        self.method.pay(amount)

# --- Main ---
if __name__ == "__main__":
    # Ejemplo con tarjeta
    processor = PaymentProcessor(CardPayment())
    processor.process(100.0)

    # Ejemplo con efectivo
    processor = PaymentProcessor(CashPayment())
    processor.process(50.0)

    # Ejemplo con transferencia
    processor = PaymentProcessor(TransferPayment())
    processor.process(200.0)