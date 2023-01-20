const express = require('express')
const { exec } = require("child_process");
const fs = require('fs');
const crypto = require('crypto');

const app = express()
const port = 3000
const dirPrefix = "kmpgdT9Q1CSwy4R6"
const htmlTemplateFiles = ["/css/asyncapi.min.css","/css/global.min.css","/index.html","/js/asyncapi-ui.min.js"]

const getVersionHash = async function(url){
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
          if (response.statusCode < 200 || response.statusCode > 299) {
             reject(new Error('Failed to load page, status code: ' + response.statusCode));
           }
          const body = [];
          response.on('data', (chunk) => body.push(chunk));
          response.on('end', () => resolve( crypto.createHash('md5').update(body.join('')).digest("hex")));
        });
        request.on('error', (err) => reject(err))
    })
}

app.get('/asyncapi/file', (req, res) => {
    let id = req.query.id
    let versionHash = req.query.version
    let file = req.query.file

    if (!id || !versionHash || !file){
        res.status(400);
        res.json({ error: 'validation.params.required'})
        return
    }

    let cachingKey = dirPrefix + id + versionHash
    let outputDir = '/app/' + cachingKey;
    let filePath = outputDir + file
    console.log('Loading file from ' + filePath)

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404);
            res.json({ error: 'file.notFound'})
            return;
        }

        res.status(200);
        res.json({ id: id, version: versionHash, file: file, body: data})
    });
});

app.post('/asyncapi', (req, res) => {
    let src = req.query.src

    if (!src){
        res.status(400);
        res.json({ error: 'validation.params.required'})
        return
    }

    getVersionHash(src).then(versionHash => {
        console.log('Current file version = ' + versionHash)
        let id = crypto.createHash('md5').update(src).digest("hex")
        let cachingKey = dirPrefix + id + versionHash
        let outputDir = '/app/' + cachingKey;

        console.log('Storing output under = ' + outputDir)
        let command = "ag " + src + " @asyncapi/html-template  -o " + cachingKey

        if (fs.existsSync(outputDir)) {
            res.status(200);
            res.json({ id: id, version: versionHash, files: htmlTemplateFiles})
            return
        }

        exec(command, (error, stdout, stderr) => {
                if (error) {
                    res.status(500);
                    res.json({ error: 'execution.error', message: error })
                    return;
                }
                if (stderr) {
                    res.status(500);
                    res.json({ error: 'execution.error', message: stderr })
                    return;
                }

                res.status(200);
                res.json({ id: id, version: versionHash, files: htmlTemplateFiles})
            });

    }).catch((err) => {
        res.status(500);
        res.json({ error: 'execution.error.version', message: err })
    });
})

process.on('SIGINT', function() {
    console.log("Shutting down. Ciao 👋")
    process.exit();
});

app.listen(port, () => {
  console.log("AsyncAPI Generator has started on port " + port + " 🚀")
})