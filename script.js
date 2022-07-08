/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
function randomise(i, min, max) {
    randomSeed(i * 200);
    if (max == undefined) {
        max = min;
        min = 0;
    }

    return random(1) * (max - min) + min;
}

function randomHash(i, min, max) {
    return randomise(randomise(i, max + min), min, max);
}

const MAX_R = { abstract: 200, football: 30, firefox: 25 };
const MIN_R = { abstract: 20, football: 10, firefox: 20 };

const MAX_C = { abstract: 100, football: 20, firefox: 10 };
const MIN_C = { abstract: 0, football: 3, firefox: 0 };

function p4_inspirations() {
    return [
        { name: "football", assetUrl: "./assets/football.png" },
        { name: "firefox", assetUrl: "./assets/firefox.png" },
        { name: "abstract", assetUrl: "./assets/abstract.png" }

    ];
}

function p4_initialize(inspiration) {
    resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
    if (inspiration.name.indexOf("abstract") != -1) {
        return {
            key: "abstract",
            length_range: { max: 100, min: 50 },
            opacity_range: { min: 128, max: 255 },
            intervals: 5,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            breadth_range: { min: 0, max: 10 }
        };
    }

    if (inspiration.name.indexOf("football") != -1) {
        return {
            key: "football",
            length_range: { max: 100, min: 20 },
            opacity_range: { min: 128, max: 255 },
            intervals: 3,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            breadth_range: { min: 0, max: 10 }
        };
    }

    if (inspiration.name.indexOf("firefox") != -1) {
        return {
            key: "firefox",
            length_range: { max: 100, min: 5 },
            opacity_range: { min: 128, max: 255 },
            intervals: 4,
            sample_x: { min: 0, max: 1 },
            sample_y: { min: 0, max: 1 },
            breadth_range: { min: 1, max: 10 }
        };
    }
}

function p4_render(design, inspiration) {
    push();
    background(255);
    noStroke();
    scale(0.25);

    //divide the image into grids
    let inspirationWidth = inspiration.image.width / design.intervals;
    let inspirationHeight = inspiration.image.height / design.intervals;
    let [x, y] = [0, 0];

    //horizontal grid
    for (let i = 0; i < design.intervals; i++) {

        y = 0;
        //vertical grid
        for (let j = 0; j < design.intervals; j++) {
            //inside the grid, fill rectangles
            for (let n = 0; n < 10; n++) {
                let sx = random(x + design.sample_x.min * inspirationWidth, x + design.sample_x.max * inspirationWidth);
                let sy = random(y + design.sample_y.min * inspirationHeight, y + design.sample_x.max * inspirationHeight);

                let pixel_color = inspiration.image.get(sx, sy);
                pixel_color[3] = random(design.opacity_range.min, design.opacity_range.max);
                fill(pixel_color);
                rect(random(x, x + inspirationWidth), random(y, y + inspirationHeight), random(design.length_range.min, design.length_range.max), random(design.length_range.min, design.length_range.max));
            }
            y += inspirationHeight;
        }
        x += inspirationWidth;
    }
    pop();
}

// Copied from Adam Smith's slides
function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}


const INIT_INTERVALS = 8;

function gen_mut_param(param, mn, mx, rate) {
    let i = mut(mn, param.min, param.max, rate);
    let j = mut(param.max, param.min, mx, rate);
    param.max = max(i, j);
    param.min = min(i, j);
    return param;
}
//mutate changes inspirations design values
function p4_mutate(design, inspiration, rate) {
    design.length_range = gen_mut_param(design.length_range, MIN_R[design.key], MAX_R[design.key], rate);


    design.opacity_range = gen_mut_param(design.opacity_range, 0, 255, rate);

    design.intervals = floor(mut(design.intervals, 2, 20, rate));
    design.sample_x = gen_mut_param(design.sample_x, 0, 1, rate);
    design.sample_y = gen_mut_param(design.sample_y, 0, 1, rate);

    design.breadth_range = gen_mut_param(design.breadth_range, MIN_C[design.key], MAX_C[design.key], rate);
}