const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const { Select } = require("enquirer");

const MEMO_FILE_REGEXP = /^memo_\d+\.txt$/;

class MemoRepository {
  getMemos() {
    const memos = [];
    const files = fs.readdirSync(".");
    for (let file of files) {
      if (fs.statSync(file).isFile() && MEMO_FILE_REGEXP.test(file)) {
        memos.push(file);
      }
    }
    return memos;
  }
}

class Memo {
  constructor(file) {
    this.text = fs.readFileSync(file, "utf8");
  }

  getFirstLine() {
    const lines = this.text.split(/\r?\n/);
    return lines[0];
  }
}

class MemoApp {
  constructor() {
    this.memo = new MemoRepository();
  }

  listMemos() {
    const memos = this.memo.getMemos();
    for (let memo of memos) {
      const firstLine = new Memo(memo).getFirstLine();
      console.log(firstLine);
    }
  }

  readMemo() {
    const memos = this.memo.getMemos();

    const prompt = new Select({
      name: "file",
      message: "Choose file",
      choices: memos,
    });

    prompt.run().then(async (memoTitle) => {
      console.log(fs.readFileSync(memoTitle, "utf8"));
    });
  }

  deleteMemo() {
    const memos = this.memo.getMemos();
    for (let memo of memos) {
      const firstLine = new Memo(memo).getFirstLine();
      console.log(firstLine);
    }

    const prompt = new Select({
      name: "file",
      message: "Choose file",
      choices: memos,
    });

    prompt.run().then(async (memoTitle) => {
      fs.unlink(memoTitle, () => {});
    });
  }

  addMemo() {
    const input = fs.readFileSync("/dev/stdin", "utf8");

    const maxIndexJSON = fs.readFileSync("./max-index.json", "utf-8");
    const maxIndexValue = JSON.parse(maxIndexJSON).max_index;
    const newMaxIndex = { max_index: maxIndexValue + 1 };
    const newMaxIndexJSON = JSON.stringify(newMaxIndex);

    fs.writeFileSync(`./max-index.json`, newMaxIndexJSON);
    fs.writeFileSync(`memo_${newMaxIndex.max_index}.txt`, input);
  }

  runCommand() {
    if (argv.l) {
      this.listMemos();
    } else if (argv.r) {
      this.readMemo();
    } else if (argv.d) {
      this.deleteMemo();
    } else {
      this.addMemo();
    }
  }
}

const memoApp = new MemoApp();
memoApp.runCommand();
