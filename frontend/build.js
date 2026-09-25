const fs = require("fs");
const path = require("path");

const root = __dirname;
const output = path.join(root, "www");

function copy(source, destination) {
    fs.cpSync(
        path.join(root, source),
        path.join(output, destination),
        { recursive: true }
    );
}

if (fs.existsSync(output)) {
    fs.rmSync(output, { recursive: true, force: true });
}

fs.mkdirSync(output, { recursive: true });

copy("index.html", "index.html");
copy("css", "css");
copy("js", "js");
copy("assets", "assets");

console.log("✅ LifeOS AI frontend built successfully into www/");