cafetsiere
==========

## Installation

1. Install Dependencies
    - Node.JS @ 10.x
    - Python 2.x or 3.x
        - pySerial
    - Bower ( `npm install -g bower` )
2. Run `npm install`
3. Run `bower install`
4. Copy config-example.js as config.js, changing values as needed
5. Run `node app.js`

Currently listens on port 3000 (to be eventually modified)

Note: Server will not function if connection to USB Arduino can not be established (currently looking in to catching that error)

--------------

Todo: will have to rescaffold the project eventually (Grunt config is meh, bower not well setup, etc.). I suggest doing this when adapting to Angular
