const fs = require('node:fs');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');
const js = fs.readFileSync('src/app.js', 'utf8');

assert.match(html, /拍下今天，预测趋势/);
assert.match(html, /今日缺口/);
assert.match(html, /趋势分析/);
assert.match(css, /camera-frame/);
assert.match(css, /confidence-pill/);
assert.match(js, /const meals =/);
assert.match(js, /adjustmentFactor/);

console.log('Smoke checks passed for CalorieLens MVP prototype.');
