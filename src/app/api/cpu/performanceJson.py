import subprocess
import json
import re

def run_adb_command(command):
    """Run an ADB command and return the output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def get_memory_info():
    """Get numeric memory usage from dumpsys meminfo."""
    output = run_adb_command("adb shell dumpsys meminfo")
    memory_info = {}

    total_match = re.search(r'Total RAM:\s+(\d.*)', output)
    free_match = re.search(r'Free RAM:\s+(\d.*)', output)
    used_match = re.search(r'Used RAM:\s+(\d.*)', output)

    if total_match:
        memory_info["total"] = total_match.group(1).split("K")[0].strip()
    if free_match:
        memory_info["free"] = free_match.group(1).split("K")[0].strip()
    if used_match:
        memory_info["used"] = used_match.group(1).split("K")[0].strip()
    
    return memory_info

def get_temperature_info():
    """Get device temperature in Celsius from dumpsys battery."""
    output = run_adb_command("adb shell dumpsys battery | grep temperature")
    temperature_value = int(output.split(":")[1].strip())
    temperature_celsius = temperature_value / 10.0  # Convert from tenths of a degree Celsius to Celsius
    
    return temperature_celsius

def get_device_performance():
    """Collect all device performance data into a dictionary."""
    data = {
        "memory": get_memory_info(),
        "temperature": get_temperature_info()
    }
    
    return data

def main():
    """Main function to collect data and save it to a JSON file."""
    performance_data = get_device_performance()
    
    # Print the data to console
    print(json.dumps(performance_data, indent=4))
    
    # Save the data to a JSON file
    with open("device_performance.json", "w") as json_file:
        json.dump(performance_data, json_file, indent=4)

if __name__ == "__main__":
    main()
