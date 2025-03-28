# startes ved at køre "uvicorn pyServer:app"
import yaml
import xmltodict
from fastapi import FastAPI
import json

app = FastAPI()

@app.get("/json")
def get_json_data():
    with open("./Car/car.json", "r") as file:
        data = json.load(file)
        return data

@app.get("/txt")
def get_txt_data():
    data = {}
    with open("./Car/car.txt", "r", encoding="utf-8") as file:
        for line in file:
            key, value = line.strip().split("=", 1)  # Split by the first "="
            if key == "features":
                data[key] = value.split(", ")  # Convert features to a list
            else:
                data[key] = value
    return data

@app.get("/csv")
def get_csv_data():
    with open("./Car/car.csv", "r") as file:
        data = file.read()
        return data
    
@app.get("/yml")
def get_yml_data():
    with open("./Car/car.yml", "r") as file:
        data = yaml.safe_load(file)
        return data
    
@app.get("/xml")
def get_xml_data():
    with open("./Car/car.xml", "r") as file:
        data = xmltodict.parse(file.read())
        return data