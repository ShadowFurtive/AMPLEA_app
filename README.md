# EUROPEAN PROJECT SEMESTER
## _SMART ADJUSTABLE ERGONOMIC FURNITURE - APP AND SENSORS PART_

[![N|Solid](https://www.isep.ipp.pt/img/logo_20230106.png)](https://www.isep.ipp.pt/)

![N|Solid](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Erasmus%2B_Logo.svg/1280px-Erasmus%2B_Logo.svg.png)

European project semester at Instituto Superior de engenharia de Porto. 
- Autor: Team 1 EPS
- Fecha: 16/06/2023
![N|Solid](https://www.eps2023-wiki1.dee.isep.ipp.pt/lib/exe/fetch.php?cache=&w=800&h=412&tok=0723fa&media=logo_team_1.png)
## Features

- App made by [jQuery](https://jquery.com/) and [Node.js (nodejs.org)](https://nodejs.org/en)
- Use of [Arduino](https://www.arduino.cc/) to develope the functionalities of the sensors
- Use of [GITHUB](https://github.com/)
- .md created with [StackEdit](https://stackedit.io/app#)

## Project
### Wiki
For much more information on the project, please click on the following [Link (ipp.pt)](https://www.eps2023-wiki1.dee.isep.ipp.pt/doku.php?id=report). This link contains the full project report, together with UML diagrams, flowcharts, component diagrams and class diagrams.
### Deploy the project
To deploy the project, only the backend server needs to be generated. To do this, node.js must be installed in order to run the node server. 

To run the node server, just run the following line in a terminal:
```sh

node component_server.js

```
The component_server.js can be found in the path /backend.

Once the server is started, you can open the search.html and start browsing for the app. To be able to use the app correctly, you must click "F12" in the browser and select the mobile view, as the website is designed for mobile use.
### Dataset
The dataset is located in /backend/data.json. There you can see which users are created or you can create a user if you wish. In addition, the data sent by the sensors or the modifications made from the APP will be saved in the aforementioned file. 

While using the app, can be seen the API calls in the terminal open for node.js server. 

### Arduino
The arduino code is commented and with references to the pages where it has been obtained, so that, in case you need to replicate the circuit, you can implement it without any problem.
In addition, in wikipedia you can find all the schematics and important comments on the implementation of the electrical system.

IMPORTANT: To make work the program, the ESP-32 must be connected to internet. There are some params defined in the top of the file that need to get fill with the corresponding values
```c
 
const  char* ssid = "test";
const  char* password = "aloha123";

```
Also, there is another important point to check. In case that there is the need that the ESP-32 ends http.request to the localhost (as is the case in this project), the correct ip needs to be defined. In this case, the correct ip is the one obtained after performing the next command in the windows cmd console:
```sh

ipconfig

```
Once the IP is set, it must be defined in the URL to make the API calls.
```c

// IMPORTANT -> cmd ip config
String serverName = "http://XXX.XXX.XX.XXX:8000/updateData/1";

```
Once these is defined, in the serial monitor with the correct baud, it can been seen as it connect to Wi-Fi and start sending http.request (of course, the sensors must be connected to the correct pins).
