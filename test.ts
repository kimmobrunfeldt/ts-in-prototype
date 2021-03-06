import axios from 'axios';
import express from 'express';

// The example uses __proto__ which is defined for all objects
// just to demonstrate the issue. In normal prototypal inheritance,
// it could be much more likely to have some more normal names overlapping
// the namespaces.
// For example `.main` or similar attribute could be defined in prototype
// and it would interfere with 'in' check.
 
export type StyleKeyType =
  | '__proto__'
  | 'stroke'
  | 'effect'
  | 'grid'
  | 'text'
  | 'background';

export type StylesObject = {
  [key in StyleKeyType]: Record<key, string>;
}[StyleKeyType];


export interface Data {
  styles: StylesObject;
}

function runServer() {
  const app = express();
  app.get('/', (req: express.Request, res: express.Response) => {
    console.log('Got request, responding with data');

    const data: Data = {
      "styles": {
        "stroke": "white"
      }
    }
    res.json(data);
  });
  const server = app.listen(9000);
  return server;
}

function printIsProto(proto: string): void {
  console.log('This is actually object', proto);
}

async function main() {
  const server = runServer();
  const data = (await axios.get('http://localhost:9000')).data as Data;
  
  // Issue example here
  //
  // If you change this to a proper check: data.styles.hasOwnProperty('__proto__')
  // Typescript doesn't accept the check
  
  if (data.styles && ('__proto__' in data.styles)) {
    printIsProto(data.styles.__proto__);
  } else {
    console.log('no prototype')
  }

  server.close();
}

main();
