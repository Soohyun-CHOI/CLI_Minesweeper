const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let width, height, cntOfMine;
let map = [];
const init = () => {
    rl.question('가로 크기를 입력하세요.', function (line) {
        width = parseInt(line);
        rl.question('세로 크기를 입력하세요.', function (line) {
            height = parseInt(line);
            rl.question('지뢰 개수를 입력하세요.', function (line) {
                cntOfMine = parseInt(line);
                console.log(width, height, cntOfMine);
                const mineArray = new Array(width * height).fill(0);
                mineArray.forEach((e, i) => {
                    if (i < cntOfMine) mineArray[i] = 1;
                });

                for (let i = 0; i < height; i++) {
                    const row = [];
                    for (let j = 0; j < width; j++) {
                        const mineArrayIndex = parseInt(Math.random() * mineArray.length);
                        row.push({
                            x: j,
                            y: i,
                            isMine: mineArray.splice(mineArrayIndex, 1)[0],
                            covered: false,
                        })
                    }
                    map.push(row);
                }

                waitUserInput();
            });
        });
    });
}
// const showM
const showMap = () => {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let str = '';
        for (let j = 0; j < row.length; j++) {
            str += row[j].isMine;
        }

        console.log(str);
    }
}

const gameOver = () => {

}

const revealMine = () => {

}
const isWin = () => {

}
const gameWin = () => {

}
const waitUserInput = () => {
    showMap();
    rl.question('탐색할 좌표를 입력하세요.', (line) => {
        const [x, y] = line.split(',');
        console.log(map[y][x]);
        if (map[y][x].isMine === 1) {
            console.log('game over');
            gameOver();
        } else {
            revealMine();
            if (isWin()) {
                gameWin();
            } else {

            }
        }
    });
}
init();