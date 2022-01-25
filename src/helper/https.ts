import nodeHttps from 'https';

export default class {
  static post(url: string, json: any): Promise<any> {
    let { protocol, hostname, pathname } = new URL(url);
    console.assert(protocol === 'https:');

    let data = JSON.stringify(json);

    let options = {
      hostname,
      port: 443,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      let request = nodeHttps.request(options, response => {
        response.on('data', data => {
          let json = JSON.parse(data.toString());
          resolve(json);
        });

        response.on('error', error => {
          reject(error);
        });
      });

      request.write(data);
      request.end();
    });
  }
}