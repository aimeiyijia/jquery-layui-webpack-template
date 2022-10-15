const path = require("path")
require('@/views/test/index.html')


// testIframe.setAttribute("src", resolve('/views/test/index.html'))

const iframe = document.createElement('iframe')
iframe.src = 'index.html'
document.body.appendChild(iframe)
