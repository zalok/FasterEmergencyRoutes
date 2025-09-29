import { Ruta } from "../../domain/entities/Ruta";

export interface IApiRutas {
  obtenerRutas(origen: string, destino: string): Promise<Ruta[]>;
}
