/*
  Blink
  Turns on an LED on for one second, then off for one second, repeatedly.
 
  This example code is in the public domain.
 */
 
// Pin 13 has an LED connected on most Arduino boards.
// give it a name:
int led = 6;
int value = 0;
char inByte;

// the setup routine runs once when you press reset:
void setup() {                
  // initialize the digital pin as an output.
  pinMode(led, OUTPUT);  
  Serial.begin(9600);  
}

// the loop routine runs over and over again forever:
void loop() {  

  if(Serial.available() > 0)
  {  
    inByte = Serial.read();     
    if(inByte == 'R')
    {
      digitalWrite(led, HIGH);    
     } 
    if(inByte == 'S')
    { 
      digitalWrite(led, LOW);     
    }
      
  } 
  delay(10);
  
}
