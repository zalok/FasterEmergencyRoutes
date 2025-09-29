export class SolicitudRuta {
  constructor(
    public id: string,
    public origen: string,
    public destino: string,
    public fechaSolicitud: Date
  ) {}
}
