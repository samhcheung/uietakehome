let sampledata = require('./sampledata.json');

let express = require('express')
let app = express()

app.use(express.static('src/public'))

app.get('/api/history/', function(req, res) {
  let datapackage;
  if(req.query.page % 1 === 0 && req.query.page >= 1) {
    datapackage = sampledata.slice(25 * req.query.page, 25 * req.query.page + 25 )
  } else {
    datapackage = sampledata.slice(0,25)
  }
  res.status(200).send(datapackage);
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})