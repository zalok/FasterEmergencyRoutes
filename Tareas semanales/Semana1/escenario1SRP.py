from datetime import datetime
"""
# ANTES (SRP)
import json
from datetime import datetime

class ReportManager:
    def run_report(self):
        # cargar datos
        data = {"ventas": 1200, "fecha": str(datetime.now())}

        # formatear
        text = f"REPORTE: ventas={data['ventas']} fecha={data['fecha']}"

        # persistir
        with open("reporte.txt", "w", encoding="utf-8") as f:
            f.write(text)

        # presentar
        print(text)

if __name__ == "__main__":
    ReportManager().run_report()
# Viola SRP Porque la clase ReportManager tiene múltiples responsabilidades:
# cargar datos, formatear, persistir y presentar. Se debería dividir en varias clases.
"""
# Se divide la funcionalidad en varias clases, cada una con una única responsabilidad.
import json
from datetime import datetime

# --- Data Source ---
class DataSource:
    def get_data(self):
        return {"ventas": 1200, "fecha": str(datetime.now())}

# --- Formatter ---
class Formatter:
    def format(self, data):
        return f"REPORTE: ventas={data['ventas']} fecha={data['fecha']}"

# --- Outputs ---
class FileOutput:
    def save(self, text):
        with open("reporte.txt", "w", encoding="utf-8") as f:
            f.write(text)

class ConsoleOutput:
    def show(self, text):
        print(text)

# --- Service (orquestador) ---
class ReportService:
    def __init__(self, data_source, formatter, outputs):
        self.data_source = data_source
        self.formatter = formatter
        self.outputs = outputs

    def run_report(self):
        data = self.data_source.get_data()
        text = self.formatter.format(data)
        for output in self.outputs:
            # cada output puede decidir qué hacer con el texto
            if hasattr(output, "save"):
                output.save(text)
            if hasattr(output, "show"):
                output.show(text)

# --- Main ---
if __name__ == "__main__":
    data_source = DataSource()
    formatter = Formatter()
    outputs = [FileOutput(), ConsoleOutput()]

    service = ReportService(data_source, formatter, outputs)
    service.run_report()