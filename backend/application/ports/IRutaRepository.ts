import { Ruta } from "../../domain/entities/Ruta";

export interface IRutaRepository {
  guardar(ruta: Ruta): Promise<void>;
  obtenerPorId(id: string): Promise<Ruta | null>;
}
