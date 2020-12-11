// 官網
// https://github.com/dataarts/dat.gui/blob/master/API.md

// 教學
// https://ithelp.ithome.com.tw/articles/10192142

const datGuiTools = {
    radius: 10,
    color: [0, 128, 255, 1], // RGB with alpha
}

const gui = new dat.GUI()
gui.add(datGuiTools, 'radius', 3, 30)
gui.addColor(datGuiTools, 'color')

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

function rgbaFromDatGuiTools() {
    let color = datGuiTools.color
    let fixInt = [Math.floor(color[0]), Math.floor(color[1]), Math.floor(color[2]), color[3]]
    return `rgba(${fixInt.join()})`
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====

function setup() {
    // 拿到全螢幕
    createCanvas(window.innerWidth, window.innerHeight); // 建立畫布 createCanvas( 【寬度】, 【高度】 )
}

function draw() {
    if (mouseIsPressed) { // 按住滑鼠左/右鍵時
        fill(rgbaFromDatGuiTools())
        strokeWeight(0); // 外框寬度
        let radius = datGuiTools.radius
        ellipse(mouseX, mouseY, radius, radius); // 繪製圓圈 ellipse( 【x軸】, 【y軸】, 【寬度】, 【高度】 )
    }
}