// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 常數

const width = window.innerWidth
const height = window.innerHeight

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 產生控制

// 官網
// https://github.com/dataarts/dat.gui/blob/master/API.md

// 教學
// https://ithelp.ithome.com.tw/articles/10192142

const datGuiTools = {
    speed: 200,
    radius: 500,

    latitude_gap: 15,
    longitude_gap: 9,

    color: [0, 128, 255, 1], // RGB with alpha
    isOrbitControl: false,
    saveImage: () => {
        let now = new Date()
        save(`${now.getTime()}.jpg`)
    },
}

const gui = new dat.GUI()
gui.useLocalStorage = true
gui.remember(datGuiTools)

const controllerArr = []

controllerArr.push(gui.add(datGuiTools, 'speed', -400, 400, 1))
controllerArr.push(gui.add(datGuiTools, 'radius', 1, 1000, 1))
controllerArr.push(gui.add(datGuiTools, 'latitude_gap', 5, 90, 1))
controllerArr.push(gui.add(datGuiTools, 'longitude_gap', 5, 90, 1))

controllerArr.push(gui.add(datGuiTools, 'isOrbitControl'))
controllerArr.push(gui.add(datGuiTools, 'saveImage'))

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
    // 拿到全螢幕
    createCanvas(width, height, WEBGL)
}

let angle = 0
function draw() {
    background(230)
    if (datGuiTools.isOrbitControl) {
        orbitControl()
    }
    normalMaterial()

    // 視角向 +z
    translate(0, 0, -width * 1.1)
    // rotateX(frameCount * 0.002)
    // rotateY(frameCount * 0.002)
    rotateX(PI / 6)
    rotateY(PI / 6)
    angle += datGuiTools.speed / 50000
    rotateZ(angle)

    let radius = datGuiTools.radius
    let latitude_gap = datGuiTools.latitude_gap
    let longitude_gap = datGuiTools.longitude_gap

    box(5, 5, radius * 2.5)
    box(5, radius * 2.5, 5)

    let latitude_value = -90
    while (latitude_value <= 90) {

        let longitude_value = 0
        while (longitude_value < 360) {

            let latitude_angle = latitude_value * PI / 180
            let longitude_angle = longitude_value * PI / 180

            push()

            translate(
                radius * cos(latitude_angle) * cos(longitude_angle),
                radius * cos(latitude_angle) * sin(longitude_angle),
                radius * sin(latitude_angle),
            )

            sphere(10)

            pop()

            longitude_value += longitude_gap
        }

        latitude_value += latitude_gap
    }
}

// ====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====.====
// 事件

controllerArr.forEach(controller => {
    controller.onChange(() => {
        console.log('onChange')
    })
})