const cheerio = require('cheerio');
const path = require('path');

function inlineJs() {
  return function(files, metalsmith, done) {
    const fileKeys = Object.keys(files);

    fileKeys.forEach((file) => {
      if (!file.endsWith('.html')) return;

      const data = files[file];
      const $ = cheerio.load(data.contents.toString());

      $('script[src][inline]').each(function() {
        const src = $(this).attr('src');
        if (!src) return;

        // Resolve the JS file path relative to the HTML file
        const jsPath = path.join(path.dirname(file), src);
        const jsFile = files[jsPath] || files[src];
        if (!jsFile) return;

        const jsContent = jsFile.contents.toString();
        $(this).replaceWith(`<script>${jsContent}</script>`);
      });

      data.contents = Buffer.from($.html());
    });

    done();
  };
}

module.exports = inlineJs;
