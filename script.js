/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
function prandomHash(i, min, max) {
    randomSeed(i * 200);
    if (max == undefined) {
        max = min;
        min = 0;
    }

    return random(1) * (max - min) + min;
}

function randomHash(i, min, max) {
    return prandomHash(prandomHash(i, max + min), min, max);
}

const MAX_R = { apple: 200, mountain: 30, football: 25 };
const MIN_R = { apple: 20, mountain: 10, football: 20 };

const MAX_C = { apple: 15, mountain: 20, football: 10 };
const MIN_C = { apple: 0, mountain: 3, football: 0 };

function p4_inspirations() {
    return [
        { name: "football", assetUrl: "./assets/football.png" },
        { name: "mountain", assetUrl: "./assets/mountain.png" }

    ];
}

function p4_initialize(inspiration) {
    resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
    if (inspiration.name.indexOf("apple") != -1) {
        return {
            type: "apple",
            r_range: { max: 100, min: 20 },
            opa_range: { min: 128, max: 255 },
            intervals: 5,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            c_range: { min: 0, max: 10 }
        };
    }

    if (inspiration.name.indexOf("football") != -1) {
        return {
            type: "football",
            r_range: { max: 100, min: 20 },
            opa_range: { min: 128, max: 255 },
            intervals: 3,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            c_range: { min: 0, max: 10 }
        };
    }

    if (inspiration.name.indexOf("mountain") != -1) {
        return {
            type: "mountain",
            r_range: { max: 100, min: 5 },
            opa_range: { min: 128, max: 255 },
            intervals: 4,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            c_range: { min: 1, max: 10 }
        };
    }
}

function p4_render(design, inspiration) {
    push();
    background(255);
    noStroke();

    scale(0.25);
    let iw = inspiration.image.width / design.intervals;
    let ih = inspiration.image.height / design.intervals;
    let [x, y] = [0, 0];

    for (let i = 0; i < design.intervals; i++) {

        y = 0;
        for (let j = 0; j < design.intervals; j++) {

            for (let n = 0; n < 10; n++) {
                let sx = random(x + design.sample_x.min * iw, x + design.sample_x.max * iw);
                let sy = random(y + design.sample_y.min * ih, y + design.sample_x.max * ih);

                let px_color = inspiration.image.get(sx, sy);
                px_color[3] = random(design.opa_range.min, design.opa_range.max);
                fill(px_color);
                circle(random(x, x + iw), random(y, y + ih), random(design.r_range.min, design.r_range.max));
            }
            y += ih;
        }
        x += iw;
    }
    pop();
}

// Yanked from Adam Smith's slides...
function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}



const INIT_INTERVALS = 8;

function gen_mut_param(param, mn, mx, rate) {
    let i = mut(param.min, mn, param.max, rate);
    let j = mut(param.max, param.min, mx, rate);
    param.max = max(i, j);
    param.min = min(i, j);
    return param;
}
//mutate changes inspirations design values
function p4_mutate(design, inspiration, rate) {
    design.r_range = gen_mut_param(design.r_range, MIN_R[design.type], MAX_R[design.type], rate);


    design.opa_range = gen_mut_param(design.opa_range, 0, 255, rate);

    design.intervals = floor(mut(design.intervals, 2, 20, rate));
    design.sample_x = gen_mut_param(design.sample_x, 0, 1, rate);
    design.sample_y = gen_mut_param(design.sample_y, 0, 1, rate);

    design.c_range = gen_mut_param(design.c_range, MIN_C[design.type], MAX_C[design.type], rate);
}