let today = new Date();

let calendar = (year = today.getFullYear(), mon = today.getMonth() + 1) => {
  let msg = "      " + mon + "月" + year + "年";
  console.log(msg);
  console.log("日 月 火 水 木 金 土");

  // 月の初日の曜日を数字(0~6)で表す変数を定義
  let day = new Date(year, mon - 1, 1);
  let firstday = day.getDay();

  // 月の末日を表す変数を定義
  let date = new Date(year, mon, 0);
  let lastdate = date.getDate();

  for (let i = 0; i < firstday; i++) {
    process.stdout.write("   ");
  }

  let count = 1;
  while (count <= lastdate) {
    // 日にちが一桁の場合は、間隔調整のためにスペースを設けるif文を記載
    if (count <= 9) {
      process.stdout.write(" " + count + " ");
    } else {
      process.stdout.write(count + " ");
    }

    // 土曜日で改行するif文を記載
    let new_line = firstday + count;
    if (new_line % 7 == 0) {
      process.stdout.write("\n");
    }

    count = count + 1;
  }
};

let argv = require("minimist")(process.argv.slice(2));
calendar(argv["y"], argv["m"]);
console.log();
