import requests
import time

base_url = 'http://localhost:8000'

endpoints_get = [
    '/',
    '/lightControlStatus/1',
    '/lightControlValue/1',
    '/lightControlAutomatic/1',
    '/waterConsumToday/1',
    '/waterConsumAverage/1',
    '/waterConsumWeek/1',
    '/electricityConsumToday/1',
    '/electricityConsumMonth/1',
    '/electricityConsumWeek/1',
    '/ElectricityConsum/1',
]
endpoints_put = [
    '/lightScheduleModifier/1',
    '/lightControlPower/1',
    '/login/1'
]

# Function to make API calls and measure the execution time
def make_api_calls():
    for endpoint in endpoints_get:
        url = base_url + endpoint
        response = requests.get(url) 
    for endpoint in endpoints_put:
        url = base_url + endpoint
        if(endpoint == '/login/1'):
            data = {"user":"a","password":"a"}
        elif(endpoint == '/lightScheduleModifier/1'):
            data = {"start_hour":"10:00","end_hour":"13:00"}
        else:
            data = {"percentage":"40"}

        response = requests.put(url, json=data)  


num_iterations = 1000

# Perform the API calls and measure the execution time
start_time = time.time()
for _ in range(num_iterations):
    make_api_calls()
end_time = time.time()

total_time = end_time - start_time

print(f'Total time: {total_time} seconds')
print(f'Time per iteration: {total_time/num_iterations} seconds')
