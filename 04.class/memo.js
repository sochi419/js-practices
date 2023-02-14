const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");

class List {
  constructor() {
    fs.readdir(".", (err, files) => {
      files.forEach((file) => {
        var text = fs.readFileSync(file, "utf8");
        var lines = text.toString().split("\r\n");
        var firstLine = lines[0].split(/\n/)[0];

        console.log(firstLine);
      });
    });
  }
}

class Reference {
  constructor() {
    const { Select } = require("enquirer");

    fs.readdir(".", (err, files) => {
      files.forEach((file) => {
        var text = fs.readFileSync(file, "utf8");
        var lines = text.toString().split("\r\n");
        var firstLine = lines[0].split(/\n/)[0];
        console.log(firstLine);
      });
      let prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: files,
      });

      prompt
        .run()
        .then((answer) => console.log(fs.readFileSync(answer, "utf8")))
        .catch(console.error);
    });
  }
}

class Delete {
  constructor() {
    const { Select } = require("enquirer");

    fs.readdir(".", (err, files) => {
      files.forEach((file) => {
        var text = fs.readFileSync(file, "utf8");
        var lines = text.toString().split("\r\n");
        var firstLine = lines[0].split(/\n/)[0];
        console.log(firstLine);
      });
      var prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: files,
      });

      prompt.run().then((answer) => fs.unlink(answer, (error) => {}));
    });
  }
}

class Add {
  constructor() {
    let input = require("fs").readFileSync("/dev/stdin", "utf8");
    console.log(input);

    fs.writeFileSync(`${input}.txt`, input);
  }
}

if (argv.l) {
  new List();
}

if (argv.r) {
  new Reference();
}

if (argv.d) {
  new Delete();
}

if (argv.a) {
  new Add();
}
