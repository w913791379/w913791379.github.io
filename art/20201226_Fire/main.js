// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 常數

const width = window.innerWidth
const height = window.innerHeight

// 渲染的速度極差 無法很大
const demo_w = Math.min(350, width)
const demo_h = Math.min(250, height)

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 產生控制

// 官網
// https://github.com/dataarts/dat.gui/blob/master/API.md

// 教學
// https://ithelp.ithome.com.tw/articles/10192142

const datGuiTools = {
    title: 'title',
    bottomFireHeight: 1,
    weakenSpeed: 50,
    flowSpeed: 40,
    fireColor1: [0, 0, 0, 1],
    fireColor2: [255, 255, 255, 1],
    saveImage: () => {
        let now = new Date()
        save(`${now.getTime()}.jpg`)
    },
}

const gui = new dat.GUI()
gui.useLocalStorage = true
gui.remember(datGuiTools)

const controllerArr = []

controllerArr.push(gui.add(datGuiTools, 'title'))

controllerArr.push(gui.add(datGuiTools, 'bottomFireHeight', 0, 50, 1))
controllerArr.push(gui.add(datGuiTools, 'weakenSpeed', 0, 100, 1))
controllerArr.push(gui.add(datGuiTools, 'flowSpeed', 0, 100, 1))

controllerArr.push(gui.addColor(datGuiTools, 'fireColor1'))
controllerArr.push(gui.addColor(datGuiTools, 'fireColor2'))

controllerArr.push(gui.add(datGuiTools, 'saveImage'))

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 轉換控制

function rgbaFromKey(key) {
    let color = datGuiTools[key]
    return rgbaFromArr(color)
}

function rgbaFromArr(arr) {
    let fixInt = [Math.floor(arr[0]), Math.floor(arr[1]), Math.floor(arr[2]), arr[3]]
    return `rgba(${fixInt.join()})`
}

function mixColor(color1, color2, percent) {
    // color1, color2: number arr
    // percent: 0 ~ 1
    return color1.map((value, index) => (value * percent + color2[index] * (1 - percent)))
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 繪畫

// 參考範例

// 有老師的
// https://editor.p5js.org/codingtrain/sketches/NaXdkoVI
// https://thecodingtrain.com/CodingChallenges/103-fire-effect.html
// https://www.youtube.com/watch?app=desktop&v=X0kjv0MozuY

// 一般亂做的
// https://www.openprocessing.org/sketch/591266/

// 火的顏色
// https://kknews.cc/zh-tw/science/4xap5gq.html


let current_image
let last_image
let color_image

let noise_image

function setup() {
    // 拿到全螢幕
    createCanvas(width, height) // 建立畫布 createCanvas( 【寬度】, 【高度】 )

    // 畫圖用
    pixelDensity(1)
    last_image = createGraphics(demo_w, demo_h)
    current_image = createGraphics(demo_w, demo_h)
    color_image = createGraphics(demo_w, demo_h)

    noise_image = createImage(demo_w, demo_h)

    frameRate(30)
}

let y_start = 0.0

function update_noise() {
    noise_image.loadPixels()

    let x_off = 0.0; // Start xoff at 0
    let scale_noise = 0.03

    // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
    for (let x = 0; x < demo_w; x++) {
        x_off += scale_noise // Increment xoff
        let y_off = y_start // For every xoff, start yoff at 0

        for (let y = 0; y < demo_h; y++) {
            y_off += scale_noise // Increment yoff

            // Calculate noise and scale by 255
            let n = noise(x_off, y_off)
            let bright = pow(n, 3) * 255

            // Try using this line instead
            // let bright = random(0, 255) // 沒有連貫性 導致遞減速率詭異

            // Set each pixel onscreen to a grayscale value
            let index = (x + y * demo_w) * 4
            noise_image.pixels[index] = bright
            noise_image.pixels[index + 1] = bright
            noise_image.pixels[index + 2] = bright
            noise_image.pixels[index + 3] = 255
        }
    }

    noise_image.updatePixels()
    y_start += datGuiTools.flowSpeed / 1000
}

function bottom_fire(rows) {

    last_image.loadPixels()
    for (let x = 0; x < demo_w; x++) {
        for (let j = 0; j < rows; j++) {
            let y = demo_h - (j + 1)
            let index = (x + y * demo_w) * 4
            last_image.pixels[index] = 255
            last_image.pixels[index + 1] = 255
            last_image.pixels[index + 2] = 255
            last_image.pixels[index + 3] = 255
        }
    }
    last_image.updatePixels()
}

function point_fire(x, y, w, h) {
    last_image.fill(255)
    last_image.noStroke()
    last_image.ellipse(x, y, w, h)
}

function getImageBufferIndex(x, y, w) {
    // console.log(x, y, w)
    return (x + y * w) * 4
}

function inRangeFix(min, max, value) {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}

function updateAll() {

    // 新增火源

    bottom_fire(datGuiTools.bottomFireHeight)
    point_fire(demo_w / 2, demo_h / 2, 10, 20) // 橢圓形狀不太好

    update_noise()

    background(0)

    last_image.loadPixels()
    current_image.loadPixels()
    color_image.loadPixels()

    let color1 = datGuiTools.fireColor1
    let color2 = datGuiTools.fireColor2
    for (let x = 0; x < demo_w; x++) {
        for (let y = 0; y < demo_h; y++) {
            let index0 = getImageBufferIndex(inRangeFix(0, demo_w, x + 0), inRangeFix(0, demo_h, y + 0), demo_w)
            let index1 = getImageBufferIndex(inRangeFix(0, demo_w, x + 1), inRangeFix(0, demo_h, y + 0), demo_w)
            let index2 = getImageBufferIndex(inRangeFix(0, demo_w, x - 1), inRangeFix(0, demo_h, y + 0), demo_w)
            let index3 = getImageBufferIndex(inRangeFix(0, demo_w, x + 0), inRangeFix(0, demo_h, y + 1), demo_w)
            let index4 = getImageBufferIndex(inRangeFix(0, demo_w, x + 0), inRangeFix(0, demo_h, y - 1), demo_w)

            // Because we are using only gray colors, the value of the color
            // components are the same, and we can use that as brightness.
            let c1 = last_image.pixels[index1]
            let c2 = last_image.pixels[index2]
            let c3 = last_image.pixels[index3]
            let c4 = last_image.pixels[index4]

            let c5 = noise_image.pixels[index0]
            let newC = c1 + c2 + c3 + c4
            newC = newC * 0.25 - c5 * datGuiTools.weakenSpeed / 100 // noise 是拿來遞減的
            newC = Math.max(newC, 0)

            current_image.pixels[index4] = newC
            current_image.pixels[index4 + 1] = newC
            current_image.pixels[index4 + 2] = newC
            current_image.pixels[index4 + 3] = 255

            let color = mixColor(color1, color2, newC / 255.0)
            color_image.pixels[index4] = newC * color[0] / 255
            color_image.pixels[index4 + 1] = newC * color[1] / 255
            color_image.pixels[index4 + 2] = newC * color[2] / 255
            color_image.pixels[index4 + 3] = 255
        }
    }
    current_image.updatePixels()
    color_image.updatePixels()

    // Swap
    let temp = last_image
    last_image = current_image
    current_image = temp
}

function draw() {
    updateAll()
    // image(color_image, 0, 0)
    // image(noise_image, demo_w, 0)
    image(color_image, (width - demo_w) / 2, (height - demo_h) / 2)
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 事件

let onChangeCall = debounce(() => {
    console.log('debounce onChange')
    // loop()
}, 250)

controllerArr.forEach(controller => {
    controller.onChange(() => {
        console.log('onChange')
        onChangeCall()
    })
})

function debounce(func, delay = 250) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            func.apply(context, args)
        }, delay);
    }
}