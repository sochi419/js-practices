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
    const input = fs.readFileSync("/dev/stdin", "utf8");
    const lines = input.toString().split("\r\n");
    const firstLine = lines[0].split(/\n/)[0];
    const metaDatas = [
      ".",
      "?",
      "*",
      "/",
      "+",
      "$",
      "-",
      "|",
      "{ or }",
      "( or ) ",
      "[ or ] ",
    ];
    let metaCount = 0;

    metaDatas.forEach((metaData) => {
      if (firstLine.indexOf(metaData) !== -1) {
        metaCount += 1;
      }
    });

    if (metaCount >= 1) {
      console.log("使用できない文字が含まれています。");
    } else {
      fs.writeFileSync(`${firstLine}.txt`, input);
    }
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
      if (file.search(/.txt/) !== -1) {
        memo.push(file);
      }
    }
  }
  return memo;
};

if (argv.l) {
  new List().printFiles();
} else if (argv.r) {
  new Reference().printFile();
} else if (argv.d) {
  new Delete().deleteFile();
} else {
  new Add().addFile();
}
