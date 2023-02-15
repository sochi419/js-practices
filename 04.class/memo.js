const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const { Select } = require("enquirer");

class List {
  printFiles() {
    fs.readdir(".", (err, files) => {
      printFirstLine(files);
    });
  }
}

class Reference {
  printFile() {
    fs.readdir(".", (err, files) => {
      printFirstLine(files);

      const prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: files,
      });

      prompt
        .run()
        .then((answer) => console.log(fs.readFileSync(answer, "utf8")));
    });
  }
}

class Delete {
  deleteFile() {
    fs.readdir(".", (err, files) => {
      printFirstLine(files);

      const prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: files,
      });

      prompt.run().then((answer) => fs.unlink(answer, (error) => {}));
    });
  }
}

class Add {
  addFile() {
    let input = require("fs").readFileSync("/dev/stdin", "utf8");
    console.log(input);

    fs.writeFileSync(`${input}.txt`, input);
  }
}

const printFirstLine = (files) => {
  files.forEach((file) => {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.toString().split("\r\n");
    const firstLine = lines[0].split(/\n/)[0];

    console.log(firstLine);
  });
};

if (argv.l) {
  new List().printFiles();
}

if (argv.r) {
  new Reference().printFile();
}

if (argv.d) {
  new Delete().deleteFile();
}

if (argv.a) {
  new Add().addFile();
}
