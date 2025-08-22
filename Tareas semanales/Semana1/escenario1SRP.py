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

# --- Main ---
if __name__ == "__main__":
    # cargar datos
    data = DataSource().get_data()
    
    # formatear
    text = Formatter().format(data)
    
    # guardar en archivo
    FileOutput().save(text)
    
    # mostrar en consola
    ConsoleOutput().show(text)