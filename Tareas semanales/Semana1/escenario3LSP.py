"""
# ANTES (LSP)
class Rectangle:
    def __init__(self):
        self._w = 0
        self._h = 0

    def set_width(self, w: int):
        self._w = w

    def set_height(self, h: int):
        self._h = h

    def area(self) -> int:
        return self._w * self._h

class Square(Rectangle):
    # forzar lados iguales rompe a clientes que esperan set_width/set_height independientes
    def set_width(self, w: int):
        self._w = w
        self._h = w

    def set_height(self, h: int):
        self._h = h
        self._w = h

def compute_area(rect: Rectangle) -> int:
    rect.set_width(5)
    rect.set_height(10)  # en Square esto cambia ambos lados
    return rect.area()

if __name__ == "__main__":
    print(compute_area(Rectangle()))  # 50
    print(compute_area(Square()))     # 100 (sorpresa)
# Viola LSP Porque Square no puede sustituir a Rectangle sin alterar el comportamiento esperado.
# Una solución es no hacer que Square herede de Rectangle.
# utilizamos una interfaz común Shape que ambas clases implementan.
"""
# Se utiliza una interfaz común Shape que ambas clases implementan.
# Entonces tanto Rectangle como Square pueden ser usadas indistintamente
# sin alterar el comportamiento esperado, cumpliendo así con LSP.
from abc import ABC, abstractmethod

# --- Abstracción ---
class Shape(ABC):
    @abstractmethod
    def area(self) -> int:
        pass

# --- Clases concretas ---
class Rectangle(Shape):
    def __init__(self, w: int, h: int):
        self._w = w
        self._h = h

    def area(self) -> int:
        return self._w * self._h

class Square(Shape):
    def __init__(self, side: int):
        self._side = side

    def area(self) -> int:
        return self._side * self._side

# --- Cliente ---
def compute_area(shape: Shape) -> int:
    return shape.area()

# --- Main ---
if __name__ == "__main__":
    print(compute_area(Rectangle(5, 10)))  # 50
    print(compute_area(Square(10)))        # 100