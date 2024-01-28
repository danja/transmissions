// import * as fs from 'fs'

import { Injectable } from '../di/Injectable.js';

export class Source extends Injectable {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    read(sourceID) {
        return "hello"
    }
    /*
  read(sourceID) {
      return this.readFile(sourceID)
  }

  readFile(filename) {
      let text = fs.readFileSync(filename, 'utf8')
      return text;
  }
  */
}




