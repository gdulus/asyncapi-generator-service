const express = require('express')
const { exec } = require("child_process");
const fs = require('fs');
var crypto = require('crypto');

const app = express()
const port = 3000

process.on('SIGINT', function() {
    console.log("Shutting down. Ciao 👋")
    process.exit();
});


app.get('/generator/index-page', (req, res) => {
    var src = req.query.src

    if (!src){
        res.status(400);
        res.json({ error: 'validation.src.notEmpty'})
        return
    }

    var id = crypto.createHash('md5').update(src).digest("hex")

    var resultDir = "asynaAPI-" + id
    var command = "ag " + src + " @asyncapi/html-template  -o " + resultDir

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500);
            res.json({ error: 'cmd.error', message: error })
            return;
        }
        if (stderr) {
            res.status(500);
            res.json({ error: 'cmd.error', message: stderr })
            return;
        }

        var outputDir = '/app/' + resultDir;

        fs.readFile(outputDir + '/index.html', 'utf8', (err, data) => {
          if (err) {
            res.status(500);
            res.json({ error: 'fileRead.error', message: err })
            return;
          }
          fs.rmSync(outputDir, { recursive: true, force: true });
          res.status(200);
          res.json({ id: id, result: data })
        });

    });
})

app.listen(port, () => {
  console.log("AsyncAPI Generator has started on port " + port + " 🚀")
})