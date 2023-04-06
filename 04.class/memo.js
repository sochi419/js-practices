const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const { Select } = require("enquirer");

class Memo {
  constructor(files) {
    const memo = [];
    const MEMO_FILE_REGEXP = /^memo_\d+\.txt$/;

    for (let file of files) {
      if (fs.statSync(file).isFile() && MEMO_FILE_REGEXP.test(file)) {
        memo.push(file);
      }
    }
    this.memo = memo;
  }
}

class FirstLine {
  constructor(file) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.toString().split("\r\n");
    const firstLine = lines[0].split(/\n/)[0];

    this.firstLine = firstLine;
  }
}

if (argv.l) {
  fs.readdir(".", (err, files) => {
    const memos = new Memo(files)["memo"];

    memos.forEach((memo) => {
      const firstLine = new FirstLine(memo)["firstLine"];
      console.log(firstLine);
    });
  });
} else if (argv.r) {
  fs.readdir(".", async (err, files) => {
    const memos = new Memo(files)["memo"];

    const prompt = new Select({
      name: "file",
      message: "Choose file",
      choices: memos,
    });

    const memoTitle = await prompt.run();
    console.log(fs.readFileSync(memoTitle, "utf8"));
  });
} else if (argv.d) {
  fs.readdir(".", async (err, files) => {
    const memos = new Memo(files)["memo"];
    memos.forEach((memo) => {
      const firstLine = new FirstLine(memo)["firstLine"];
      console.log(firstLine);
    });

    const prompt = new Select({
      name: "file",
      message: "Choose file",
      choices: memos,
    });

    const memoTitle = await prompt.run();
    fs.unlink(memoTitle, () => {});
  });
} else {
  const input = fs.readFileSync("/dev/stdin", "utf8");

  const maxIndexJSON = fs.readFileSync("./max-index.json", "utf-8");
  const maxIndexValue = JSON.parse(maxIndexJSON).max_index;
  const newMaxIndex = { max_index: maxIndexValue + 1 };
  const newMaxIndexJSON = JSON.stringify(newMaxIndex);

  fs.writeFileSync(`./max-index.json`, newMaxIndexJSON);
  fs.writeFileSync(`memo_${newMaxIndex.max_index}.txt`, input);
}
