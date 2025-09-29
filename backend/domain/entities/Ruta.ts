export class Ruta {
  constructor(
    public id: string,
    public origen: string,
    public destino: string,
    public distancia: number,
    public tiempo: number,
    public pasos: string[]
  ) {}
}
