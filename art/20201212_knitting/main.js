// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 常數

const width = window.innerWidth
const height = window.innerHeight
const color_x1 = 'color_x1'
const color_x2 = 'color_x2'
const color_y1 = 'color_y1'
const color_y2 = 'color_y2'

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 產生控制

const datGuiTools = {
    width: 30,
    lightMode: true,
    [color_x1]: [0, 128, 60, 1],
    [color_x2]: [110, 180, 50, 1],
    [color_y1]: [195, 35, 100, 1],
    [color_y2]: [60, 0, 128, 1],
}

const gui = new dat.GUI()
const controllerArr = []
controllerArr.push(gui.add(datGuiTools, 'width', 1, 100))
controllerArr.push(gui.add(datGuiTools, 'lightMode'))
controllerArr.push(gui.addColor(datGuiTools, color_x1))
controllerArr.push(gui.addColor(datGuiTools, color_x2))
controllerArr.push(gui.addColor(datGuiTools, color_y1))
controllerArr.push(gui.addColor(datGuiTools, color_y2))

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 轉換控制

function rgbaFromKey(key) {
    let color = datGuiTools[key]
    let fixInt = [Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2]), color[3]]
    return `rgba(${fixInt.join()})`
}



// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 繪畫

function setup() {
    createCanvas(width, height)

    // https://p5js.org/reference/#/p5/noLoop
    noStroke() // 不劃邊框
}

function draw() {

    let line_width = datGuiTools.width
    let lightMode = datGuiTools.lightMode

    // https://p5js.org/reference/#/p5/blendMode
    blendMode(lightMode ? LIGHTEST : MULTIPLY)

    clear()

    // 直
    for (let idx = 0; idx - 1 < width / line_width; idx++) {
        let key = (idx % 2 == 0) ? color_x1 : color_x2
        fill(rgbaFromKey(key))
        rect(idx * line_width,
            0,
            line_width,
            height,
        )
    }

    // // 橫
    for (let idx = 0; idx - 1 < height / line_width; idx++) {
        let key = (idx % 2 == 0) ? color_y1 : color_y2
        fill(rgbaFromKey(key))
        rect(0,
            idx * line_width,
            width,
            line_width,
        )
    }

    noLoop() // 停止畫面更新
}

controllerArr.forEach(controller => {
    controller.onChange(() => {
        loop()
    })
})
