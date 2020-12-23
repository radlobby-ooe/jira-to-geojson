const https = require('https');
const fs = require('fs');

let scriptGlobal = {};

let myArgs = process.argv.slice(2);

// main:

if (myArgs.length !== 1) {
    console.error("Tool to query jira for field info and write it to an output file (field id + name)");
    console.error("Usage: " + process.argv[1] + " outputfile");
} else {
    scriptGlobal.auth = process.env.JIRA_USER + ":" + process.env.JIRA_TOKEN;
    scriptGlobal.jiraSite = process.env.JIRA_SITE;
    scriptGlobal.outputFile = myArgs[0];

    // execute request -  we will receive result in callback function
    const options = {
        hostname: scriptGlobal.jiraSite,
        port: 443,
        path: '/rest/api/3/field',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        'auth': scriptGlobal.auth
    };

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`);

        let body = '';
        // append incoming junk data to result
        res.on('data', d => {
            body += d;
        });

        // we received everything!
        res.on('end', function () {
            // write result to output file
            fs.writeFileSync(scriptGlobal.outputFile, body, 'utf8');
            console.log("Wrote to " + scriptGlobal.outputFile + ": " + body.length + " bytes");
            //console.log("Wrote: "+body);
            console.log("=================");
        });
    });

    req.on('error', error => {
        console.error(error)
    });
    req.end();

}
