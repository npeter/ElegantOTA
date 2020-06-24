const { gzip } = require('@gfx/zopfli');
const FS = require('fs');
const path = require('path');

const BUNDLE_JS = FS.readFileSync(path.resolve(__dirname, './dist/js/app.js'));

const HTML = `
<!DOCTYPE html>
<html lang=en>

<head>
    <meta charset=utf-8>
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width,initial-scale=1">
    <link rel=icon href=/favicon.ico> <title>ElegantOTA</title>
    <script data-name="BMC-Widget" async src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="6QGVpSj" data-description="Support me on Buy me a coffee!" data-message="You can always support my work by buying me a coffee!" data-color="#FF813F" data-position="right" data-x_margin="24" data-y_margin="24"></script>
</head>

<body style="overflow: hidden;">
    <noscript>
        <strong>We're sorry but ElegantOTA doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id=app></div>
    <script defer>${BUNDLE_JS}</script>
</body>
</html>
`;

gzip(HTML, { numiterations: 15 }, (err, output) => {
  if (err) {
    return console.error(err);
  }

  const FILE = `const uint32_t ELEGANT_HTML_SIZE = ${output.length};
const uint8_t ELEGANT_HTML[] PROGMEM = { ${output} };`;

  FS.writeFileSync(path.resolve(__dirname, '../src/elegantWebpage.h'), FILE);
  console.log(`[COMPRESS] Compressed Build Files to elegantWebpage.h: ${output.length} Bytes`);
});
