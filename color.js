function getColor(img, x, y) {
    return img.ucharPtr(x, y)
}

function colorDistance(colorList) {
    if (colorList.length < 2) {
        return 0
    }
    let d = 0
    for (let i = 0; i < colorList.length - 1; i++) {
        d += distance(colorList[i], colorList[i + 1]);
    }

    return d / (colorList.length - 1)
}

function distance(color1, color2) {
    return (color1[0] - color2[0]) * (color1[0] - color2[0]) +
        (color1[1] - color2[1]) * (color1[1] - color2[1]) +
        (color1[2] - color2[2]) * (color1[2] - color2[2])
}

function getColorList(img, point, expand) {
    let list = []
    let ux = point.x - expand
    let uy = point.y - expand
    for (let x = 0; x < 2 * expand + 1; x++) {
        for (let y = 0; y < 2 * expand + 1; y++) {
            list.push(getColor(img, ux + x, uy + y))
        }
    }
    return list

}

// 移动坐标
function up(point) {
    point.x -= 1;
    return point
}

function down(point) {
    point.x += 1;
    return point
}

function left(point) {
    point.y -= 1;
    return point
}

function right(point) {
    point.y += 1;
    return point
}