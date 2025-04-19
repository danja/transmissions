```javascript
// src/processors/text/Escaper.js
/**
 * @class Escaper
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Escapes string characters
 *
 * #### __*Input*__
 * * **`message.content`** - default field for input/output
 * * **`message.*`** - input/output field defined in settings
 *
 * #### __*Output*__
 * * **`message.content`** - default field for input/output
 * * **`message.*`** - input/output field defined in settings
 *
 * #### __*Behavior*__
 * * retrieve input field from message
 * * replace characters according to rules determined by format
 * * place output field in message
 *
 * #### __*Settings*__
 * * **`format`** - SPARQL, Turtle... [default : 'SPARQL']
 * * **`inputField`** - field in message to use as input [default : 'content']
 * * **`outputField`** - field in message to use as output
 *
 * #### __*Side Effects*__
 * * none
 *
 * #### __*References*__
 * * tests : TBD
 * * docs : TBD
 *
 * #### __*TODO*__
 * * create code
 * * create tests
 * * create docs
 */
 ```
