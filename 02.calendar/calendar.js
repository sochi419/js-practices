const calendar = (year, month) => {
  // 引数が無い場合、今日の日付を取得。
  if (!year || !month) {
    const today = new Date();
    year = today.getFullYear();
    month = today.getMonth() + 1;
  }

  console.log(`      ${month}月${year}年`);
  console.log("日 月 火 水 木 金 土");

  // 月の初日の曜日を数字(0~6)で表す変数を定義
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    process.stdout.write("   ");
  }

  // 月の末日を表す変数を定義
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  for (let dayOfMonth = 1; dayOfMonth <= lastDayOfMonth; dayOfMonth++) {
    // 日にちが一桁の場合は、間隔調整のためにスペースを設けるif文を記載
    if (dayOfMonth <= 9) {
      process.stdout.write(` ${dayOfMonth} `);
    } else {
      process.stdout.write(`${dayOfMonth} `);
    }

    // 土曜日で改行するif文を記載
    const judgeSaturday = firstDayOfWeek + dayOfMonth;
    if (judgeSaturday % 7 == 0) {
      process.stdout.write("\n");
    }
  }
  console.log();
};

const argv = require("minimist")(process.argv.slice(2));
calendar(argv.y, argv.m);
