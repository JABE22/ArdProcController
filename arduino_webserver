/*
 -----------------------------------
 Created by:
 Jarno Matarmaa
 15.7.2018
 Tampere

 Arduino with Ethernet Shield

 IP Camera and LED light controller
 Automat and manual via web browser
 -----------------------------------
 */

#include <Ethernet.h>
#include <LiquidCrystal.h>

// Controlled pins on Arduino boards
const int led = A1;                       // OUTPUT led light pin
const int cam = A2;                       // OUTPUT ip camera alarm trigger pin
const int autoTriggerPin = A5;            // INPUT pin for listener
// Variables
const int triggerMinValue = 800;          // For A5 input pin value listener
const int bottomRowSecondStartIndex = 8;  // For writing LCD bottom row right side
boolean automat = true;                   // For checking if automat ON or OFF
boolean manChangedAuto = true;            // For system listener method
int currentValue;                         // For system listener pin (A5) value
int lastValue = 0;                        // For system listener pin (A5) last value

// LCD display objects
const int rs = 7, en = 6, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

// Internet connection settings
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };   // Physical mac address
byte ip[] = { 192, 168, 1, 50 };                       // IP in LAN ("192.168.1.50")
byte gateway[] = { 192, 168, 1, 1 };                   // Internet access via router
byte subnet[] = { 255, 255, 255, 0 };                  // Subnet mask
EthernetServer server(80);                             // Server port

String readString;

void setup() {

  // Setting pins mode
  pinMode(led, OUTPUT);
  pinMode(cam, OUTPUT);
  pinMode(autoTriggerPin, INPUT);
  
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("KUIVURI-IPKamera");
  
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    // wait for serial port to connect. Needed for Leonardo only
  }
  
  // Start the Ethernet connection and the server:
  Ethernet.begin(mac, ip, gateway, subnet);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());

  // Print IP address to device LCD screen
  lcd.setCursor(0, 1);
  lcd.print("IP");
  lcd.setCursor(3, 1);
  lcd.print(Ethernet.localIP());
  delay(1000);
  
  // Print control status to screen, default manual
  if (automat) {
    clearLcdBottomRow(bottomRowSecondStartIndex);
    writeLcdBottomRow(0, "Automat");
  } else {
    clearLcdBottomRow(bottomRowSecondStartIndex);
    writeLcdBottomRow(0, "Manual");
  }
}

void loop() { 

  // Checks arduino trigger pin value (A5) if automat ON
  if (automat) {
    systemListener(triggerMinValue);
  }
  
  // Create a client connection
  EthernetClient client = server.available();

  if (client) {
    while (client.connected()) {   
      if (client.available()) {
        char c = client.read();
      
        // Read char by char HTTP request
        if (readString.length() < 100) {
          // Store characters to string
          readString += c;
          Serial.print(c);
        }
      
        // If HTTP request has ended
        if (c == '\n') {  
          Serial.println(readString); // print to serial monitor for debuging
          client.println("<HTML>");
          client.println("<HEAD>");
          client.println("<link rel='stylesheet' type='text/css'");
          client.println("href='https://people.uta.fi/~jm428264/arduino/tyylifile.css' />");
          client.println("<meta charset=\"UTF-8\">");
          client.println("<TITLE>KUIVURIN KAMERA</TITLE>");
          client.println("</HEAD>");
          client.println("<BODY>");
          // Header elements
          client.println("<div class=\"site-branding\">");
          client.println("<div class=\"site-branding-logo\">");
          client.println("<img src=\"https://people.uta.fi/~jm428264/arduino/arduino_logo.png\"></div>");
          client.println("</div><br /><div class=\"site-branding-text\">");
          client.println("<H1 id=\"site-title\">KUIVURIN PROSESSIVALVONTA</H1>");
          client.println("</div>");
          // Subheader, page description
          client.println("<br />");
          client.println("<br />");
          client.println("<hr />");
          client.println("<header><H2>Kontrollerin etäkäyttö</H2></header><br />");
          // Button elements
          client.println("<div class=\"site-buttons\">");
          client.println("<H3>LED valaisimen ja kameran hallinta</H3>");
          client.println("<br />");
          client.println("<a href=\"/?button1on\">LED ON</a>");
          client.println("<a href=\"/?button1off\">LED OFF</a><br />");   
          client.println("<br />");     
          client.println("<a href=\"/?button2on\">CAM ON</a>");
          client.println("<a href=\"/?button2off\">CAM OFF</a><br />");
          client.println("<br />");     
          client.println("<a href=\"/?button3on\">AUTO</a>");
          client.println("<a href=\"/?button3off\">MANU</a><br />");
          client.println("<br />");
          // Auto-manual switch status element
          if (automat) {
            client.println("<f1 type='text'>AUTO ON</f1><br /><br />");
          } else {
            client.println("<f2 type='text'>AUTO OFF</f2><br /><br />");
          }
          // Iframe responsive container
          client.println("</div><div class=\"resp-container\">");
          client.println("<iframe src=\"https://people.uta.fi/~jm428264/arduino/silence.webm\"></iframe>");
          client.println("</div><br />");
          // Footer
          // client.println("<div class=\"footer\"><footer>Created by Jarno Matarmaa -JAMA Softwares 2018®-</footer></div>");
          client.println("<br />");
          client.println("</BODY>");
          client.println("</HTML>");

          // Give the web browser time to receive the data
          delay(1);
          
          // Stopping client
          client.stop();
         
          // Controls the Arduino if you press the buttons
          if (!automat) {
            ledSwitchListener();
            camSwitchListener();
          }
          autoManualSwitchListener();
          // Clearing string for next read
          readString = ""; 
        }
      }
    }
  } 
}

/** 
 * For LED and IP camera auto control. Listener for A2 pin.
 */
void systemListener(int triggerMinValue) {
  
  currentValue = analogRead(autoTriggerPin);
  Serial.println(currentValue); // For debugging

  if (isTriggerStatusChanged(lastValue, currentValue) || manChangedAuto) {
    // If changed, we do something, otherwise not
    if (currentValue > triggerMinValue) {
      writeLcdBottomRow(bottomRowSecondStartIndex, "Alarm=1");
      analogWrite(A1, 255);
      analogWrite(A2, 255);
    } else {
      writeLcdBottomRow(bottomRowSecondStartIndex, "Alarm=0");
      analogWrite(A2, 0);
      analogWrite(A1, 0);
    }
  }
  lastValue = currentValue;
  manChangedAuto = false;
}

/**
 * Checks if trigger pin status has changed.
 */
boolean isTriggerStatusChanged(int lastValue, int currentValue) {
  if (lastValue < triggerMinValue && currentValue > triggerMinValue) {
    // Trigger status changed OFF->>ON
    return true;
  } else if (lastValue > triggerMinValue && currentValue < triggerMinValue) {
    // Trigger status changed ON->>OFF
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if auto or manual button pressed on web control page.
 */
void autoManualSwitchListener() {
  // Auto or manual switching
  if (readString.indexOf("?button3on") > 0) {
    automat = true;
    manChangedAuto = true;
    writeLcdBottomRow(0, "Automat");
  }
  if (readString.indexOf("?button3off") > 0) {
    automat = false;
    manChangedAuto = false;
    writeLcdBottomRow(0, "Manual");
  }
}

/**
 * Checks if led on or off button pressed on web control page.
 */
void ledSwitchListener() {
  // LED control buttons
  if (readString.indexOf("?button1on") > 0) {
    setLed(1);
  }
  if (readString.indexOf("?button1off") > 0) {
    setLed(0);
  }
}

/**
 * Checks if camera alarm on or off button pressed on web control page.
 */
void camSwitchListener() {
  // Camera control buttons
  if (readString.indexOf("?button2on") > 0) {
    setCam(1);
  }
  if (readString.indexOf("?button2off") > 0) {
    setCam(0);
  }
}

/**
 * Clears ldc screen bottom row from start index given as parameter.
 */
void clearLcdBottomRow(int startIndex) {
  // Clears eight bottom row sign starting from method parameter value
  int endIndex = startIndex + 8;
  lcd.setCursor(startIndex, 1);
  
  for (int i = 0; i < endIndex; ++i) {
    lcd.write(' ');
  }
}

/**
 * Writes lcd bottom row from start index by text given as parameter.
 */
void writeLcdBottomRow(int startIndex, String text) {
  clearLcdBottomRow(startIndex);
  lcd.setCursor(startIndex, 1);
  lcd.print(text);
}

/**
 * Writes whole lcd bottom row by text given as parameter.
 */
void writeLcdBottomRowWhole(String text) {
  lcd.setCursor(0, 1);
  for (int i = 0; i < 16; ++i) {
    lcd.write(' ');
  }
  lcd.setCursor(0, 1);
  lcd.print(text);
}

/**
 * Sets camera status depending given parameter (1 or 0).
 */
void setCam(int camStatus) {
  if (camStatus == 1) {
    analogWrite(cam, 255);
    writeLcdBottomRow(bottomRowSecondStartIndex, "Cam ON");
  } else if (camStatus == 0) {
    analogWrite(cam, 0);
    writeLcdBottomRow(bottomRowSecondStartIndex, "Cam OFF");
  }
}

/**
 * Sets led status depending given parameter (1 or 0).
 */
void setLed(int ledStatus) {
  if (ledStatus == 1) {
    analogWrite(led, 255);
    writeLcdBottomRow(bottomRowSecondStartIndex, "Led ON");
  } else if (ledStatus == 0) {
    analogWrite(led, 0);
    writeLcdBottomRow(bottomRowSecondStartIndex, "Led OFF");
  }
}
