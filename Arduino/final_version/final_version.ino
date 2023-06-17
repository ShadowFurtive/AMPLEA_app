/* SparkFun TSL2561 library example sketch

This sketch shows how to use the SparkFunTSL2561
library to read the AMS/TAOS TSL2561
light sensor.

Product page: https://www.sparkfun.com/products/11824
Hook-up guide: https://learn.sparkfun.com/tutorials/getting-started-with-the-tsl2561-luminosity-sensor

Hardware connections:

3V3 to 3.3V
GND to GND

(WARNING: do not connect 3V3 to 5V
or the sensor will be damaged!)

You will also need to connect the I2C pins (SCL and SDA) to your Arduino.
The pins are different on different Arduinos:

                    SDA    SCL
Any Arduino         "SDA"  "SCL"
Uno, Redboard, Pro  A4     A5
Mega2560, Due       20     21
Leonardo            2      3

You do not need to connect the INT (interrupt) pin
for basic operation.

Operation:

Upload this sketch to your Arduino, and open the
Serial Monitor window to 9600 baud.

Have fun! -Your friends at SparkFun.

Our example code uses the "beerware" license.
You can do anything you like with this code.
No really, anything. If you find it useful,
buy me a beer someday.

V10 Mike Grusin, SparkFun Electronics 12/26/2013
Updated to Arduino 1.6.4 5/2015
*/

// Your sketch must #include this library, and the Wire library
// (Wire is a standard library included with Arduino):
// https://randomnerdtutorials.com/esp32-http-get-post-arduino/

#include <SparkFunTSL2561.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <Ethernet.h>

#include <PZEM004Tv30.h>


#if !defined(PZEM_RX_PIN) && !defined(PZEM_TX_PIN)
#define PZEM_RX_PIN 16
#define PZEM_TX_PIN 17
#endif

#if !defined(PZEM_SERIAL)
#define PZEM_SERIAL Serial2
#endif


#if defined(ESP32)
/*************************
 *  ESP32 initialization
 * ---------------------
 * 
 * The ESP32 HW Serial interface can be routed to any GPIO pin 
 * Here we initialize the PZEM on Serial2 with RX/TX pins 16 and 17
 */
PZEM004Tv30 pzem(PZEM_SERIAL, PZEM_RX_PIN, PZEM_TX_PIN);
#elif defined(ESP8266)
/*************************
 *  ESP8266 initialization
 * ---------------------
 * 
 * Not all Arduino boards come with multiple HW Serial ports.
 * Serial2 is for example available on the Arduino MEGA 2560 but not Arduino Uno!
 * The ESP32 HW Serial interface can be routed to any GPIO pin 
 * Here we initialize the PZEM on Serial2 with default pins
 */
//PZEM004Tv30 pzem(Serial1);
#else
/*************************
 *  Arduino initialization
 * ---------------------
 * 
 * Not all Arduino boards come with multiple HW Serial ports.
 * Serial2 is for example available on the Arduino MEGA 2560 but not Arduino Uno!
 * The ESP32 HW Serial interface can be routed to any GPIO pin 
 * Here we initialize the PZEM on Serial2 with default pins
 */
PZEM004Tv30 pzem(PZEM_SERIAL);
#endif

// Create an SFE_TSL2561 object, here called "light":

SFE_TSL2561 light;

// Global variables:

boolean gain;     // Gain setting, 0 = X1, 1 = X16;
unsigned int ms;  // Integration ("shutter") time in milliseconds

///

#define LED_BUILTIN 2
#define SENSOR  27

long currentMillis = 0;
long previousMillis = 0;
int interval = 1000;
boolean ledState = LOW;
float calibrationFactor = 4.5;
volatile byte pulseCount;
byte pulse1Sec = 0;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;
int oldFlowLValue=0;
float oldPowerValue=0.0;
///

const char* ssid = "test";
const char* password = "aloha123";

//Your Domain name with URL path or IP address with path
// IMPORTANT -> cmd ip config
String serverName = "http://192.168.43.216:8000/updateData/1";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;


void IRAM_ATTR pulseCounter()
{
  pulseCount++;
}


void setup()
{
  // Initialize the Serial port:
  oldFlowLValue=0;
  oldPowerValue=0.0;
  Serial.begin(9600);
  Serial.println("TSL2561 example sketch");

  // Initialize the SFE_TSL2561 library

  // You can pass nothing to light.begin() for the default I2C address (0x39),
  // or use one of the following presets if you have changed
  // the ADDR jumper on the board:
  
  // TSL2561_ADDR_0 address with '0' shorted on board (0x29)
  // TSL2561_ADDR   default address (0x39)
  // TSL2561_ADDR_1 address with '1' shorted on board (0x49)

  // For more information see the hookup guide at: https://learn.sparkfun.com/tutorials/getting-started-with-the-tsl2561-luminosity-sensor

  light.begin();

  // Get factory ID from sensor:
  // (Just for fun, you don't need to do this to operate the sensor)

  unsigned char ID;
  
  if (light.getID(ID))
  {
    Serial.print("Got factory ID: 0X");
    Serial.print(ID,HEX);
    Serial.println(", should be 0X5X");
  }
  // Most library commands will return true if communications was successful,
  // and false if there was a problem. You can ignore this returned value,
  // or check whether a command worked correctly and retrieve an error code:
  else
  {
    byte error = light.getError();
    printError(error);
  }

  // The light sensor has a default integration time of 402ms,
  // and a default gain of low (1X).
  
  // If you would like to change either of these, you can
  // do so using the setTiming() command.
  
  // If gain = false (0), device is set to low gain (1X)
  // If gain = high (1), device is set to high gain (16X)

  gain = 0;

  // If time = 0, integration will be 13.7ms
  // If time = 1, integration will be 101ms
  // If time = 2, integration will be 402ms
  // If time = 3, use manual start / stop to perform your own integration

  unsigned char time = 2;

  // setTiming() will set the third parameter (ms) to the
  // requested integration time in ms (this will be useful later):
  
  Serial.println("Set timing...");
  light.setTiming(gain,time,ms);

  // To start taking measurements, power up the sensor:
  
  Serial.println("Powerup...");
  light.setPowerUp();
  
  // The sensor will now gather light during the integration time.
  // After the specified time, you can retrieve the result from the sensor.
  // Once a measurement occurs, another integration period will start.

  
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(SENSOR, INPUT_PULLUP);

  pulseCount = 0;
  flowRate = 0.0;
  flowMilliLitres = 0;
  totalMilliLitres = 0;
  previousMillis = 0;

  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);


  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop()
{
  // Wait between measurements before retrieving the result
  // (You can also configure the sensor to issue an interrupt
  // when measurements are complete)
  
  // This sketch uses the TSL2561's built-in integration timer.
  // You can also perform your own manual integration timing
  // by setting "time" to 3 (manual) in setTiming(),
  // then performing a manualStart() and a manualStop() as in the below
  // commented statements:
  
    // ms = 1000;
    // light.manualStart();
    delay(2000);
    // light.manualStop();
    
    // Once integration is complete, we'll retrieve the data.
    
    // There are two light sensors on the device, one for visible light
    // and one for infrared. Both sensors are needed for lux calculations.
    
    // Retrieve the data from the device:
    currentMillis = millis();
    if (currentMillis - previousMillis > interval) {
      
      pulse1Sec = pulseCount;
      pulseCount = 0;

      // Because this loop may not complete in exactly 1 second intervals we calculate
      // the number of milliseconds that have passed since the last execution and use
      // that to scale the output. We also apply the calibrationFactor to scale the output
      // based on the number of pulses per second per units of measure (litres/minute in
      // this case) coming from the sensor.
      flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) / calibrationFactor;
      previousMillis = millis();

      // Divide the flow rate in litres/minute by 60 to determine how many litres have
      // passed through the sensor in this 1 second interval, then multiply by 1000 to
      // convert to millilitres.
      flowMilliLitres = (flowRate / 60) * 1000;

      // Add the millilitres passed in this second to the cumulative total
      totalMilliLitres += flowMilliLitres;
      
      // Print the flow rate for this second in litres / minute
      Serial.print("Flow rate: ");
      Serial.print(int(flowRate));  // Print the integer part of the variable

      Serial.print("L/min");
      Serial.print("\t");       // Print tab space
      int flowL= int(totalMilliLitres / 1000);
      if(flowL != oldFlowLValue){
        oldFlowLValue = flowL;
        sendPostRequest(flowL, 0);
      }
      // Print the cumulative total of litres flowed since starting
      Serial.print("Output Liquid Quantity: ");
      Serial.print(totalMilliLitres);
      Serial.print("mL / ");
      Serial.print(totalMilliLitres / 1000);
      Serial.println("L");
      Serial.print("\n");
    }
    
    /*-----------------------------------------------------------------------------------------------------------------------*/

    unsigned int data0, data1;
    
    if (light.getData(data0,data1))
    {
      // getData() returned true, communication was successful
      
      Serial.print("data0: ");
      Serial.print(data0);
      Serial.print(" data1: ");
      Serial.print(data1);
    
      // To calculate lux, pass all your settings and readings
      // to the getLux() function.
      
      // The getLux() function will return 1 if the calculation
      // was successful, or 0 if one or both of the sensors was
      // saturated (too much light). If this happens, you can
      // reduce the integration time and/or gain.
      // For more information see the hookup guide at: https://learn.sparkfun.com/tutorials/getting-started-with-the-tsl2561-luminosity-sensor
    
      double lux;    // Resulting lux value
      boolean good;  // True if neither sensor is saturated
      
      // Perform lux calculation:

      good = light.getLux(gain,ms,data0,data1,lux);
      
      // Print out the results:
    
      Serial.print(" lux: ");
      Serial.print(lux);
      if (good) Serial.println(" (good)"); else Serial.println(" (BAD)");
    }
    else
    {
      // getData() returned false because of an I2C error, inform the user.

      byte error = light.getError();
      printError(error);
    }


    /*-----------------------------------------------------------------------------------------------------------------------*/
    Serial.print("Custom Address:");
    Serial.println(pzem.readAddress(), HEX);

    // Read the data from the sensor
    float voltage = pzem.voltage();
    float current = pzem.current();
    float power = pzem.power();
    float energy = pzem.energy();
    float frequency = pzem.frequency();
    float pf = pzem.pf();

    if(energy != oldPowerValue && !isnan(voltage)){
        oldPowerValue = energy;
        sendPostRequestFloat(oldPowerValue, 1);
    }

    // Check if the data is valid
    if(isnan(voltage)){
        Serial.println("Error reading voltage");
    } else if (isnan(current)) {
        Serial.println("Error reading current");
    } else if (isnan(power)) {
        Serial.println("Error reading power");
    } else if (isnan(energy)) {
        Serial.println("Error reading energy");
    } else if (isnan(frequency)) {
        Serial.println("Error reading frequency");
    } else if (isnan(pf)) {
        Serial.println("Error reading power factor");
    } else {

        // Print the values to the Serial console
        Serial.print("Voltage: ");      Serial.print(voltage);      Serial.println("V");
        Serial.print("Current: ");      Serial.print(current);      Serial.println("A");
        Serial.print("Power: ");        Serial.print(power);        Serial.println("W");
        Serial.print("Energy: ");       Serial.print(energy,3);     Serial.println("kWh");
        Serial.print("Frequency: ");    Serial.print(frequency, 1); Serial.println("Hz");
        Serial.print("PF: ");           Serial.println(pf);

    }


    Serial.println();
  
  }

  void printError(byte error)
    // If there's an I2C error, this function will
    // print out an explanation.
  {
    Serial.print("I2C error: ");
    Serial.print(error,DEC);
    Serial.print(", ");
    
    switch(error)
    {
      case 0:
        Serial.println("success");
        break;
      case 1:
        Serial.println("data too long for transmit buffer");
        break;
      case 2:
        Serial.println("received NACK on address (disconnected?)");
        break;
      case 3:
        Serial.println("received NACK on data");
        break;
      case 4:
        Serial.println("other error");
        break;
      default:
        Serial.println("unknown error");
    }
  
}

void sendPostRequest(int data, int type) {
 if ((millis() - lastTime) > timerDelay) {
      //Check WiFi connection status
      if(WiFi.status()== WL_CONNECTED){
        WiFiClient client;
        HTTPClient http;
      
        // Your Domain name with URL path or IP address with path
        http.begin(client, serverName);
        
        // If you need Node-RED/server authentication, insert user and password below
        //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");
        std::string strData = std::to_string(data);
        std::string strType = std::to_string(type);
        std::string requestBody = "consum=" + strData + "&type=" + strType;

        http.addHeader("Content-Type", "application/x-www-form-urlencoded");
        int httpResponseCode = http.PUT(requestBody.c_str());
        
        // If you need an HTTP request with a content type: application/json, use the following:
        //http.addHeader("Content-Type", "application/json");
        //int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

        // If you need an HTTP request with a content type: text/plain
        //http.addHeader("Content-Type", "text/plain");
        //int httpResponseCode = http.POST("Hello, World!");
      
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
          
        // Free resources
        http.end();
      }
      else {
        Serial.println("WiFi Disconnected");
      }
      lastTime = millis();
    }
}

void sendPostRequestFloat(float data, int type) {
 if ((millis() - lastTime) > timerDelay) {
      //Check WiFi connection status
      if(WiFi.status()== WL_CONNECTED){
        WiFiClient client;
        HTTPClient http;
      
        // Your Domain name with URL path or IP address with path
        http.begin(client, serverName);
        
        // If you need Node-RED/server authentication, insert user and password below
        //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");
        std::string strData = std::to_string(data);
        std::string strType = std::to_string(type);
        std::string requestBody = "consum=" + strData + "&type=" + strType;

        http.addHeader("Content-Type", "application/x-www-form-urlencoded");
        int httpResponseCode = http.PUT(requestBody.c_str());
        
        // If you need an HTTP request with a content type: application/json, use the following:
        //http.addHeader("Content-Type", "application/json");
        //int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

        // If you need an HTTP request with a content type: text/plain
        //http.addHeader("Content-Type", "text/plain");
        //int httpResponseCode = http.POST("Hello, World!");
      
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
          
        // Free resources
        http.end();
      }
      else {
        Serial.println("WiFi Disconnected");
      }
      lastTime = millis();
    }
}








