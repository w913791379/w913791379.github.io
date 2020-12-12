// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 常數

const [width, height] = [window.innerWidth, window.innerHeight]
const radius = Math.min(width, height) / 2.2
const [center_x, center_y] = [width / 2, height / 2]

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 產生控制

const datGuiTools = {
    lineCount: 20,
    groupCount: 1,
    speed: 30,
    totalGap: 180,
    LColor1: [255, 255, 255, 1],
    LColor2: [0, 0, 0, 1],
    PColor1: [255, 128, 0, 1],
    PColor2: [255, 255, 200, 1],
}

const gui = new dat.GUI()
const controllerArr = []
controllerArr.push(gui.add(datGuiTools, 'lineCount', 1, 60, 1))
controllerArr.push(gui.add(datGuiTools, 'groupCount', 1, 10, 1))
controllerArr.push(gui.add(datGuiTools, 'speed', 0, 60))
controllerArr.push(gui.add(datGuiTools, 'totalGap', 0, 720, 1))

controllerArr.push(gui.addColor(datGuiTools, 'LColor1'))
controllerArr.push(gui.addColor(datGuiTools, 'LColor2'))
controllerArr.push(gui.addColor(datGuiTools, 'PColor1'))
controllerArr.push(gui.addColor(datGuiTools, 'PColor2'))

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

function getGap() {
    return datGuiTools.totalGap / datGuiTools.lineCount
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 繪畫

function setup() {
    // 拿到全螢幕
    createCanvas(width, height) // 建立畫布 createCanvas( 【寬度】, 【高度】 )
}

let value = 0

function draw() {

    background(0)
    let lineCount = datGuiTools.lineCount
    value += datGuiTools.speed / 60

    for (let i = 0; i < lineCount; i++) {
        printLine(180 / lineCount * i)
    }
    for (let i = 0; i < lineCount; i++) {
        let gap = getGap()
        let group = datGuiTools.groupCount
        printLinePoint(
            180 / lineCount * i,
            sin(Math.PI * 2 / group * (i % group) + Math.PI / 180 * (value + i * gap))

            //sin(Math.PI / 180 * map2range(value + i * gap, 360, 0))
            //map2range(value + i * gap, 100, -100) / 100
            //sin(Math.PI * 2 / 3 * (i % 3) + Math.PI / 180 * (value + i * gap))
        )
    }
}

// function map2range(value, max, min) {
//     let length = max - min
//     let remaining = value % (length * 2)
//     if (remaining < length) {
//         return min + remaining
//     }
//     return max + length - remaining
// }

function printLine(theta) {
    // theta 0 ~ 180
    let color1 = datGuiTools.LColor1
    let color2 = datGuiTools.LColor2
    let color = mixColor(color1, color2, theta / 180)
    stroke(rgbaFromArr(color))
    strokeWeight(1)
    line(center_x - cos(Math.PI / 180 * theta) * radius,
        center_y - sin(Math.PI / 180 * theta) * radius,
        center_x + cos(Math.PI / 180 * theta) * radius,
        center_y + sin(Math.PI / 180 * theta) * radius,
    )
}

function printLinePoint(theta, percent) {
    // theta 0 ~ 180
    // percent -1 ~ 1
    let color1 = datGuiTools.PColor1
    let color2 = datGuiTools.PColor2
    let color = mixColor(color1, color2, 1 - (percent + 1) / 2)
    stroke(rgbaFromArr(color))
    strokeWeight(10)
    point(center_x + cos(Math.PI / 180 * theta) * percent * radius,
        center_y + sin(Math.PI / 180 * theta) * percent * radius)
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 事件

// controllerArr.forEach(controller => {
//     controller.onChange(() => {
//         console.log('onChange')
//     })
// })