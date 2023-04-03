const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const { Select } = require("enquirer");

class Memo {
  listFiles() {
    fs.readdir(".", (err, files) => {
      const memo = pickMemo(files);
      printFirstLine(memo);
    });
  }

  referFile() {
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

  addFile() {
    const input = fs.readFileSync("/dev/stdin", "utf8");

    const maxIndexJSON = fs.readFileSync("./max-index.json", "utf-8");
    const maxIndexValue = JSON.parse(maxIndexJSON).max_index;
    const newMaxIndex = { max_index: maxIndexValue + 1 };
    const newMaxIndexJSON = JSON.stringify(newMaxIndex);

    fs.writeFileSync(`./max-index.json`, newMaxIndexJSON);
    fs.writeFileSync(`memo_${newMaxIndex.max_index}.txt`, input);
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
  const MEMO_FILE_REGEXP = /^memo_\d+\.txt$/;

  for (let file of files) {
    if (fs.statSync(file).isFile() && MEMO_FILE_REGEXP.test(file)) {
      memo.push(file);
    }
  }
  return memo;
};

if (argv.l) {
  new Memo().listFiles();
} else if (argv.r) {
  new Memo().referFile();
} else if (argv.d) {
  new Memo().deleteFile();
} else {
  new Memo().addFile();
}
