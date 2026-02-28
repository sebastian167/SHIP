import csv
import json
import os

csv_file = r"c:\Users\alvar\Downloads\ORD DL ShipAttributes  - 02-27-2026.csv"
output_file = r"C:\Users\alvar\OneDrive\Desktop\NLP 2300C\SHIPS\delta-fleet-master\src\data\ships.json"

ship_data = []

# Ensure directory exists
os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(csv_file, mode='r', encoding='utf-8') as f:
    # Skip the first two lines (checksum lines as seen in file)
    next(f)
    next(f)
    
    reader = csv.DictReader(f)
    for row in reader:
        ship = row.get("SHIP")
        ac_typ = row.get("AC_TYP")
        if ship and ac_typ:
            ship_data.append({
                "SHIP": ship,
                "AC_TYP": ac_typ
            })

with open(output_file, mode='w', encoding='utf-8') as f:
    json.dump(ship_data, f, indent=2)

print(f"Extracted {len(ship_data)} ships to {output_file}")
