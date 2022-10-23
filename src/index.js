const path = require("path")
function resolve(dir) {
  return path.join(__dirname, "..", dir)
}
console.log(require('@/views/test/index.html'), '123')

const testIframe = document.querySelector("#testIframe")

console.log(testIframe, '23')

testIframe.setAttribute("src", "~@/views/test2/index.html")
