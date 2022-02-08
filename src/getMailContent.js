const fetch = require("node-fetch");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const createMailHtml = require("./createMailHtml");

dayjs.extend(utc);
dayjs.extend(timezone);
const {
  fromDisplayText,
  fromDisplaySubText,
  user,
  to,
  weatherKey,
  locationId,
  tianXingKey,
  startDay,
  type,
} = require("./config");
async function getMailContent() {
  try {
    const weatherRes = await fetch(
      `https://devapi.qweather.com/v7/weather/3d?key=${weatherKey}&location=${locationId}`
    );
    const weatherData = await weatherRes.json();
    // 获取天气生活指数
    const lifeRes = await fetch(
      `https://devapi.qweather.com/v7/indices/1d?key=${weatherKey}&location=${locationId}&type=${type}`
    );
    const lifeData = await lifeRes.json();

    // 获取one一个文案及图片
    const oneRes = await fetch(
      `http://api.tianapi.com/txapi/one/index?key=${tianXingKey}`
    );
    const oneData = await oneRes.json();
    const { word, imgurl } = oneData.newslist[0];
    // 计算日期
    const workingDay = dayjs(dayjs().tz("Asia/Hong_kong")).diff(
      startDay,
      "days"
    );
    //
    const today = dayjs.utc().format("YYYY-MM-DD");
    const dateRes = await fetch(
      `http://api.tianapi.com/jiejiari/index?key=${tianXingKey}&date=${today}`
    );
    const dateData = await dateRes.json();
    const htmlStr = createMailHtml(
      weatherData,
      lifeData,
      word,
      imgurl,
      dateData,
      workingDay
    );
    return {
      from: `${fromDisplayText} ${user}`,
      to,
      subject: fromDisplaySubText,
      html: htmlStr,
    };
  } catch (e) {
    console.log(e);
  }
}
module.exports = getMailContent;
