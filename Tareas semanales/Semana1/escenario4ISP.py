"""
# ANTES (ISP)
from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self) -> None: ...
    @abstractmethod
    def eat(self) -> None: ...
    @abstractmethod
    def attend_meeting(self) -> None: ...

class Robot(Worker):
    def work(self) -> None:
        print("Produciendo")
    def eat(self) -> None:
        raise NotImplementedError("Un robot no come")
    def attend_meeting(self) -> None:
        print("¿Tiene sentido que un robot asista?")

if __name__ == "__main__":
    Robot().eat()  # explota/absurdo
# Se viola la clase robot dandole metodos innecesarios
# toda clase heredada de worker lo obliga a trabajar, comer y asistir juntas
# pero un robot no tendría que comer ni asistir a juntas necesariamente
"""
# solución: simplemente cada clase implementa lo que corresponde
# y el código sigue siendo flexible ya que si agregamos otra clase  podría implementar solo workable y eatable (Un interno)
from abc import ABC, abstractmethod

# --- Contratos pequeños ---
class Workable(ABC):
    print()
    @abstractmethod
    def work(self) -> None:
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self) -> None:
        pass

class Attendee(ABC):
    @abstractmethod
    def attend_meeting(self) -> None:
        pass

# --- Implementaciones ---
class Human(Workable, Eatable, Attendee):
    def work(self) -> None:
        print("H. Trabajando")
    def eat(self) -> None:
        print("H. Comiendo")
    def attend_meeting(self) -> None:
        print("H. Asistiendo a reunión")

class Robot(Workable):
    def work(self) -> None:
        print("R. Produciendo")
    # no necesita eat ni attend_meeting

# --- Main ---
if __name__ == "__main__":
    human = Human()
    human.work()
    human.eat()
    human.attend_meeting()

    robot = Robot()
    robot.work()