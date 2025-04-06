import sys
import matplotlib.pyplot as plt
import requests
import os
import json
import numpy as np

API_URL = "http://187.33.149.132:3000/api/mongo/games/user/"

def generate_stats(USER_EMAIL):
    print(f"Generando estadísticas para: {USER_EMAIL}")

    # Obtener datos del backend
    response = requests.get(f"{API_URL}{USER_EMAIL}")
    games = response.json() if response.status_code == 200 else []

    if not games:
        print("No se encontraron datos de partidas para el usuario.")
        return

    # Extraer datos
    play_times = [game["play_time"] for game in games]
    enemies_defeated = [game["enemies_defeated"] for game in games] if games else []
    bullets_used = [game["bullets_used"] for game in games] if games else []
    num_games = min(len(enemies_defeated), len(bullets_used))
    labels = [f"Partida {i+1}" for i in range(num_games)]
    x = np.arange(num_games)

    enemies_avg = sum(enemies_defeated) / len(enemies_defeated) if enemies_defeated else 0

    def create_pie_chart(value, title, filename):
        if not enemies_defeated or max(enemies_defeated) == 0:
            print(f"No se puede generar el gráfico de tarta: {title}")
            return
        
        resto = max(enemies_defeated) - value if max(enemies_defeated) > value else 0
        plt.figure(figsize=(6, 6))
        plt.pie([value, resto], labels=["Media", "Resto"], autopct='%1.1f%%', colors=["green", "gray"])
        plt.title(title)
        plt.savefig(filename)
        plt.close()

    def create_bar_chart(data1, label1, data2, label2, title, filename, color1, color2):
        plt.figure(figsize=(8, 5))
        width = 0.4
        plt.bar(x - width/2, data1[:num_games], width, label=label1, color=color1)
        plt.bar(x + width/2, data2[:num_games], width, label=label2, color=color2)
        plt.xticks(x, labels, rotation=45)
        plt.ylabel("Cantidad")
        plt.title(title)
        plt.legend()
        plt.tight_layout()
        plt.savefig(filename)
        plt.close()

    def create_line_chart(data, title, ylabel, filename, color):
        plt.figure(figsize=(8, 5))
        plt.plot(labels, data[:num_games], marker='o', linestyle='-', color=color)
        plt.xticks(rotation=45)
        plt.ylabel(ylabel)
        plt.title(title)
        plt.tight_layout()
        plt.savefig(filename)
        plt.close()

    # Generar gráficos
    create_pie_chart(enemies_avg, "Media de Enemigos Derrotados por Partida", "graf1_enemies_avg.png")
    create_bar_chart(bullets_used, "Balas Usadas", enemies_defeated, "Enemigos Derrotados", "Balas Usadas vs Enemigos Derrotados", "graf2_bullets_vs_enemies.png", "red", "green")
    create_line_chart(bullets_used, "Balas Usadas por Partida", "Balas Usadas", "graf3_bullets_used.png", "blue")

    print("Gráficos generados exitosamente.")

# Si el script se ejecuta desde la terminal
if __name__ == "__main__":
    if len(sys.argv) > 1:
        generate_stats(sys.argv[1])
    else:
        print("Error: No se proporcionó un email como argumento")
