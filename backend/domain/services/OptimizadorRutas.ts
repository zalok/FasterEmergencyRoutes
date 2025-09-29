import { Ruta } from "../entities/Ruta";

export class OptimizadorRutas {
  static elegirMejor(rutas: Ruta[]): Ruta {
    // Ejemplo: elegir por menor tiempo
    return rutas.reduce((prev, curr) =>
      curr.tiempo < prev.tiempo ? curr : prev
    );
  }
}
