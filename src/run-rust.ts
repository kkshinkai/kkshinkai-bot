import https from './helper/https';

export default class {
  static async run(code: string)
    : Promise<{ success: true, stdout: string } |
              { success: false, stderr: string }> {
    let result = await https.post('https://play.rust-lang.org/execute', {
      channel: "stable",
      code: [
        "#![allow(dead_code)]",
        "#![allow(unused_imports)]",
        "fn main() {",
        code.split('\n').map(line => "    " + line).join('\n'),
        "}",
      ].join('\n'),
      crateType: "bin",
      edition: "2018",
      mode: "debug",
      tests: false
    });

    if (result.success) {
      return {
        success: true,
        stdout: result.stdout
      };
    } else {
      return {
        success: false,
        stderr: result.stderr
      };
    }
  }
}