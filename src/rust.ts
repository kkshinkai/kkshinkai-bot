import https from 'https';

export function runRust(code: string, callback: (output: string) => void) {
  let data = JSON.stringify({
    channel: "stable",
    code: `fn main() { ${code} }`,
    crateType: "bin",
    edition: "2018",
    mode: "debug",
    tests: false
  });

  let options = {
    hostname: 'play.rust-lang.org',
    port: 443,
    path: '/execute',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  let request = https.request(options, response => {
    response.on('data', data => {
      console.log(data.toString());

      let json = JSON.parse(data);

      console.log(json.stdout);
      console.log(json.stderr);

      let message = json.success ? json.stdout : json.stderr;
      if (message === "")
        message = "(empty)";

      callback(message);
    });
  })

  request.write(data);
  request.end();
};