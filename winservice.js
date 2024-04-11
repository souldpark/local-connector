var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'Local Connector',
    description: 'Interface between the computer and the SoludPark website',
    script: 'main.js',
    env: [{
        name: "NODE_EXTRA_CA_CERTS",
        value: "rootCA.pem"
    }],
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});


if (process.argv[2] == "install") {
    svc.on('install', function () {
        svc.start();
    });

    svc.install();
}

if (process.argv[2] == "uninstall") {
    svc.stop();
    svc.on('uninstall', function () {
        console.log('Uninstall complete.');
    });

    svc.uninstall();
}