let calendar = (year, month) => {
  // 引数が無い場合、今日の日付を取得。
  if (process.argv.length == 2) {
    const today = new Date();
    year = today.getFullYear();
    month = today.getMonth() + 1;
  }

  const message = `      ${month}月${year}年`;
  console.log(message);
  console.log("日 月 火 水 木 金 土");

  // 月の初日の曜日を数字(0~6)で表す変数を定義
  const firstDayofWeek = new Date(year, month - 1, 1).getDay();

  // 月の末日を表す変数を定義
  const lastDayofMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDayofWeek; i++) {
    process.stdout.write("   ");
  }

  for (let DayofMonth = 1; DayofMonth <= lastDayofMonth; DayofMonth++) {
    // 日にちが一桁の場合は、間隔調整のためにスペースを設けるif文を記載
    if (DayofMonth <= 9) {
      process.stdout.write(` ${DayofMonth} `);
    } else {
      process.stdout.write(`${DayofMonth} `);
    }

    // 土曜日で改行するif文を記載
    let judgeSaturday = firstDayofWeek + DayofMonth;
    if (judgeSaturday % 7 == 0) {
      process.stdout.write("\n");
    }
  }
  console.log();
};

const argv = require("minimist")(process.argv.slice(2));
calendar(argv.y, argv.m);
