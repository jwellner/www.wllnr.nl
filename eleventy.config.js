import * as sass from 'sass';
import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import * as cheerio from 'cheerio';
import { minify } from 'html-minifier-terser';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const isProduction = process.env.NODE_ENV === 'production';

let compiledCss = '';
let compiledJs = '';

export default function ( eleventyConfig ) {
  eleventyConfig.addWatchTarget( 'src/js' );
  eleventyConfig.addWatchTarget( 'src/scss' );
  eleventyConfig.addWatchTarget( 'layouts' );
  eleventyConfig.addWatchTarget( 'packages/term-core' );

  eleventyConfig.addPassthroughCopy( { 'public/assets': 'assets' } );

  eleventyConfig.on( 'eleventy.before', async () => {
    const result = sass.compile( path.join( __dirname, 'src/scss/index.scss' ), {
      style: 'compressed',
      loadPaths: [ path.join( __dirname, 'node_modules/normalize-css' ) ],
    } );
    compiledCss = result.css;

    const bundle = await rollup( {
      input: path.join( __dirname, 'src/js/main.js' ),
      plugins: [
        resolve( { browser: true, preferBuiltins: false } ),
        terser(),
      ],
    } );
    const { output } = await bundle.generate( {
      format: 'umd',
      name: 'main',
    } );
    compiledJs = output[ 0 ].code;
    await bundle.close();
  } );

  eleventyConfig.on( 'eleventy.after', async ( { dir } ) => {
    const cssPath = path.join( dir.output, 'css/index.css' );
    const jsPath = path.join( dir.output, 'assets/js/main.bundle.js' );
    fs.mkdirSync( path.dirname( cssPath ), { recursive: true } );
    fs.mkdirSync( path.dirname( jsPath ), { recursive: true } );
    fs.writeFileSync( cssPath, compiledCss );
    fs.writeFileSync( jsPath, compiledJs );
  } );

  eleventyConfig.addTransform( 'inline-assets', async function ( content, outputPath ) {
    if ( !outputPath || !outputPath.endsWith( '.html' ) ) {
      return content;
    }

    const $ = cheerio.load( content );

    $( 'link[rel="stylesheet"][inline]' ).each( function () {
      $( this ).replaceWith( `<style>${ compiledCss }</style>` );
    } );

    $( 'script[src][inline]' ).each( function () {
      $( this ).replaceWith( `<script>${ compiledJs }</script>` );
    } );

    let html = $.html();

    if ( isProduction ) {
      html = await minify( html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      } );
    }

    return html;
  } );

  return {
    dir: {
      input: 'src/content',
      includes: '../../layouts',
      layouts: '../../layouts',
      data: '_data',
      output: 'build',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: [ 'md', 'njk', 'html' ],
  };
}
