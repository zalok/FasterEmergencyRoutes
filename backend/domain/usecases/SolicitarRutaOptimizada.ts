import { IRutaRepository } from "../../application/ports/IRutaRepository";
import { IApiRutas } from "../../application/ports/IApiRutas";
import { Ruta } from "../entities/Ruta";
import { OptimizadorRutas } from "../services/OptimizadorRutas";

export class SolicitarRutaOptimizada {
  constructor(
    private rutaRepository: IRutaRepository,
    private apiRutas: IApiRutas
  ) {}

  async ejecutar(origen: string, destino: string): Promise<Ruta> {
    const rutas = await this.apiRutas.obtenerRutas(origen, destino);
    const mejorRuta = OptimizadorRutas.elegirMejor(rutas);

    await this.rutaRepository.guardar(mejorRuta);
    return mejorRuta;
  }
}
