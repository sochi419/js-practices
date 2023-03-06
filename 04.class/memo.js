const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const { Select } = require("enquirer");

class List {
  printFiles() {
    fs.readdir(".", (err, files) => {
      const memo = pickMemo(files);
      printFirstLine(memo);
    });
  }
}

class Reference {
  printFile() {
    fs.readdir(".", async (err, files) => {
      const memo = pickMemo(files);

      const prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: memo,
      });

      const memoTitle = await prompt.run();
      console.log(fs.readFileSync(memoTitle, "utf8"));
    });
  }
}

class Delete {
  deleteFile() {
    fs.readdir(".", async (err, files) => {
      const memo = pickMemo(files);
      printFirstLine(memo);

      const prompt = new Select({
        name: "file",
        message: "Choose file",
        choices: memo,
      });

      const memoTitle = await prompt.run();
      fs.unlink(memoTitle, () => {});
    });
  }
}

class Add {
  addFile() {
    const input = require("fs").readFileSync("/dev/stdin", "utf8");
    const lines = input.toString().split("\r\n");
    const firstLine = lines[0].split(/\n/)[0];

    fs.writeFileSync(`${firstLine}.txt`, input);
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

const pickMemo = (files) => {
  const memo = [];
  for (let file of files) {
    if (fs.statSync(file).isFile()) {
      const fileName = file.split(".");
      if (fileName[1] === "txt") {
        memo.push(file);
      }
    }
  }
  return memo;
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
