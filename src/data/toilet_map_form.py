import json

def determine_type(name):
    
    if "親子" in name:
        return "親子廁所"
    elif any(keyword in name for keyword in ["混合廁所", "男女廁", "性別友善", "男女"]):
        return "性別友善廁所"
    elif any(keyword in name for keyword in ["男廁", "男"]):
        return "男廁"
    elif any(keyword in name for keyword in ["女廁", "女"]):
        return "女廁"
    elif any(keyword in name for keyword in ["無障礙", "殘障"]):
        return "無障礙廁所"
    else:
        return None


# Replace 'file1.json', 'file2.json', 'file3.json' with your actual file paths
file_paths = ['filtered_taipei.json', 'filtered_hsinchu.json', 'filtered_newtaipei.json', 'filtered_taoyuan.json']

combined_data = []

for file_path in file_paths:
    with open(file_path, 'r', encoding='utf-8') as file:
        json_data = json.load(file)
        for data in json_data:
            data["type"] = determine_type(data["name"])
            data["city"] = data["city"].replace("　", "")
            combined_data.append(data)
            #data.pop("type2", None)

# Save the combined data to a new file
with open('combined_output.json', 'w', encoding='utf-8') as output_file:
    json.dump(combined_data, output_file, ensure_ascii=False, indent=2)

print("Combined data saved to 'combined_output.json'")