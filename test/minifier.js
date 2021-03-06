/* globals describe: false, it: false */
'use strict';
const expect = require('chai').expect;

const minifier = require('../minifier');

describe('minifier', () => {
    it('removes whitespace', done => {
        const inputHtml = `
<component>
  <title>Super Title</title>
  <text>Awesome Text</text>
</component>
`;

        const expectedOutput = `
<component><title>Super Title</title><text>Awesome Text</text></component>
`;

        minifier(inputHtml)
            .then(minifiedHtml => {
                expect(minifiedHtml).to.equal(expectedOutput);
                done();
            })
            .catch(done);
    });

    it('combines style tags and places them in <head>', (done) => {
        const inputHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Rebelmail Code Challenge</title>
    <style>
      h1 {
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <h1>Hello world</h1>
    <p><span>Lorem ipsum</span> dolor sit amet, consectetur adipisicing
    elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua.</p>
    <style>
      span {
        font-family: monospace;
      }
    </style>
  </body>
  </html>
`;

        const expectedOutput = `
<!DOCTYPE html>
<html><head><title>Rebelmail Code Challenge</title><style>h1 {font-family: monospace;}span {font-family: monospace;}</style></head><body><h1>Hello world</h1><p><span>Lorem ipsum</span> dolor sit amet, consectetur adipisicing
    elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua.</p></body></html>
`;

        minifier(inputHtml)
            .then(minifiedHtml => {
                expect(minifiedHtml).to.equal(expectedOutput);
                done();
            })
            .catch(done);
    });

    describe('strategy optimizeClassNames', () => {
        it('optimizes ids and class names', done => {
            const inputHtml = `
<html><head><style>body {background-color: #FFF;}#title {padding: 20px;}.red {color: red;}.white {color: white;}.lead {font-weight: bold;}</style></head><body><h1 id="title" class="red">RED AT YOUR SERVICE</h1><p class="white lead">But this is white.</p></body></html>
`;

            const expectedOutput = `
<html><head><style>body {background-color: #FFF;}#A {padding: 20px;}.A {color: red;}.B {color: white;}.C {font-weight: bold;}</style></head><body><h1 id="A" class="A">RED AT YOUR SERVICE</h1><p class="B C">But this is white.</p></body></html>
`;

            const opts = {
                optimizeClassNames: true
            };

            minifier(inputHtml, opts)
                .then(minifiedHtml => {
                    expect(minifiedHtml).to.equal(expectedOutput);
                    done();
                })
                .catch(done);
        });
    });

    describe('strategy removeUnusedClasses', () => {
        it('removes unused CSS classes from styles and elements', (done) => {
            const inputHtml = `
<html><head><style>.red {color: red;} .lead {font-weight: 900;}</style></head><body><p class="white lead">But this is white and bold.</p><p class="white">But this is just white.</p></body></html>
`;

            const expectedOutput = `
<html><head><style>.lead{font-weight:900;}</style></head><body><p class="lead">But this is white and bold.</p><p>But this is just white.</p></body></html>
`;

            const opts = {
                removeUnusedClasses: true
            };

            minifier(inputHtml, opts)
                .then(minifiedHtml => {
                    expect(minifiedHtml).to.equal(expectedOutput);
                    done();
                })
                .catch(done);
        });
    });

    describe('strategy useShortHex', () => {
        it('replaces HEX with its shorthand (#FFFFFF => #FFF)', (done) => {
            const inputHtml = `
  <html><head><style>.red {color: #ff0000;}.white {color: #ffffff;}.tan{color:#ededed}</style></head><body></body></html>
  `;

            const expectedOutput = `
  <html><head><style>.red {color: #f00;}.white {color: #fff;}.tan{color:#ededed}</style></head><body></body></html>
  `;

            const opts = {
                useShortHex: true
            };

            minifier(inputHtml, opts)
                .then(minifiedHtml => {
                    expect(minifiedHtml).to.equal(expectedOutput);
                    done();
                })
                .catch(done);
        });
    });
});
