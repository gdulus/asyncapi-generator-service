const express = require('express')
const { exec } = require("child_process");
const fs = require('fs');

const app = express()
const port = 3000

process.on('SIGINT', function() {
    console.log("Shutting down. Ciao 👋")
    process.exit();
});


app.get('/generator/index-page', (req, res) => {
    var src = req.query.src
    var id = req.query.id

    if (!src || !id){
        res.status(400);
        res.json({ status: 'errors', code: 'validation.failed'})
        return
    }

    var resultDir = "asynaAPI-" + id
    var command = "ag " + src + " @asyncapi/html-template  -o " + resultDir

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500);
            res.json({ status: 'errors', code: 'cmd.error', result: error })
            return;
        }
        if (stderr) {
            res.status(500);
            res.json({ status: 'errors', code: 'cmd.error', result: stderr })
            return;
        }

        var outputDir = '/app/' + resultDir;

        fs.readFile(outputDir + '/index.html', 'utf8', (err, data) => {
          if (err) {
            res.status(500);
            res.json({ status: 'errors', code: 'fileRead.error', result: err })
            return;
          }
          fs.rmSync(outputDir, { recursive: true, force: true });
          res.status(200);
          res.json({ status: 'success', result: data })
        });

    });
})

app.listen(port, () => {
  console.log("AsyncAPI Generator has started on port " + port + " 🚀")
})