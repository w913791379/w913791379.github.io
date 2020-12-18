const length = 28;
const cube_length = 20;
const [width, height] = [length * cube_length, length * cube_length]

let draw_buffer = undefined

function setup() {
    // 拿到全螢幕
    createCanvas(width, height) // 建立畫布 createCanvas( 【寬度】, 【高度】 )
}

function draw() {

    background(0)
    if (draw_buffer) {
        // console.log(draw_buffer.values)
        for (let x = 0; x < 28; x++) {
            for (let y = 0; y < 28; y++) {
                let value = draw_buffer.values[x * 28 + y]
                value = ((value * 0.5) + 0.5) * 255
                // console.log(value)
                fill(value)
                rect(
                    x * cube_length,
                    y * cube_length,
                    cube_length,
                    cube_length,
                )
            }
        }
        noLoop() // 停止畫面更新
    }
}

async function run() {

    const model = await tf.loadLayersModel('model.json').catch(e => {
        console.log(e)
    })
    // console.log(model)

    let xs = tf.randomNormal([1, 100])
    // xs.print()

    let preds = model.predict(xs)
    preds = preds.reshape([28, 28])
    // preds.print()

    let buffer = await preds.buffer()
    draw_buffer = buffer
    loop()
}
run()

const datGuiTools = {
    generate: run,
}

const gui = new dat.GUI()
gui.add(datGuiTools, 'generate')