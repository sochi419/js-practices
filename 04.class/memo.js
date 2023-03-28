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

    fs.readdir(".", (err, files) => {
      const memos = pickMemo(files);
      const indexs = [];

      for (let memo of memos) {
        if (memo.search(/memo_/) !== -1) {
          indexs.push(Number(memo.split(/memo_/)[1].split(/.txt/)[0])); // ディレクトリ内のメモの連番を,indexsに入れる処理
        }
      }

      const maxIndex = Math.max.apply(null, indexs);

      if (indexs.length === 0) {
        fs.writeFileSync(`memo_1.txt`, input);
      } else {
        fs.writeFileSync(`memo_${maxIndex + 1}.txt`, input);
      }
    });
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
  new List().printFiles();
} else if (argv.r) {
  new Reference().printFile();
} else if (argv.d) {
  new Delete().deleteFile();
} else {
  new Add().addFile();
}
