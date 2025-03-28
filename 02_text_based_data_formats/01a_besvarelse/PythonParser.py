import os
import json
import yaml
import xmltodict

#file_path = "Car/car.csv"
#file_path = "Car/car.xml"
#file_path = "Car/car.yml"
#file_path = "Car/car.txt"
file_path = "Car/car.json"

#file_path = "Library/library.csv"
#file_path = "Library/library.xml"
#file_path = "Library/library.yml"
#file_path = "Library/library.txt"
#file_path = "Library/library.json"


def txt_parser(filename):
    data = {}
    with open(filename, "r", encoding="utf-8") as file:
        for line in file:
            key, value = line.strip().split("=", 1)  # Split by the first "="
            if key == "features":
                data[key] = value.split(", ")  # Convert features to a list
            else:
                data[key] = value
    print(data)



def get_file_type(file_path):
    return os.path.splitext(file_path)[1].lower()

# Example usage
file_type = get_file_type(file_path)
print(file_type)

if(file_type == ".json"):
    with open(file_path, "r") as file:
        data = json.load(file)
        json_string = json.dumps(data, indent=4)
        print(json_string)
elif(file_type == ".txt"):
    txt_parser(file_path)
elif(file_type == ".csv"):
    with open(file_path, "r") as file:
        data = file.read()
        print(data)
elif(file_type == ".yml" or file_type == ".yaml"):
    with open(file_path, "r") as file:
        data = yaml.safe_load(file)
        yaml_string = yaml.dump(data)
        print(yaml_string)
elif(file_type == ".xml"):
    with open(file_path, "r") as file:
        data = xmltodict.parse(file.read())
        print(data)
else:
    print("Unsupported file type.")

