var program = require('commander')
var express = require('express')
var app = express()

program
  .version('1.0.0', '-v, --version')
  .option('-i, --interval [value]', 'set time interval for log', 1000)
  .option('-t, --time [value]', 'set working time for time-log', 10000)
  .parse(process.argv)

var tempTime = program.time
var tempSwitch = false

function printLog () {
  let date = Date.now()
  tempTime = tempTime - program.interval
  console.log(date)

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(date), program.interval)
  })
}

app.get('/', function (req, res, next) {
  if (tempSwitch) {
    res.send('Сейчас уже запущено логирование. Повторите попытку через ' + (tempTime / 1000) + 'сек.')
    return
  }

  const makeRequest = async () => {
    console.log('Запускаем логирование')
    tempSwitch = true
    while (tempTime > 0) {
      var lastLog = await printLog()
    }
    // Обнуляем
    tempSwitch = false
    tempTime = program.time

    let answer = 'Время последнего лога: ' + lastLog
    console.log(answer)
    res.send(answer)
  }

  makeRequest()
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
