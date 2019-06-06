document.write("Hello, Webpack1")
import './styles/test.css'
import './styles/index.less'

console.log('start..')

const img = require('./assert/logo.png')

const imaEl = document.createElement('img')
imaEl.src = img


document.body.appendChild(imaEl)

class Prosen {
    constructor() {
        this.name = 'zhangsan'
    }

    static sayName() {
        console.log('xiaoming')
    }
}

Prosen.sayName()
