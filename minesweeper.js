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
                createMap(width, height, cntOfMine);
                waitUserInput();
            });
        });
    });
}

const createMap = (width, height, cntOfMine) => {
    map = [];  // map 초기
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
                revealed: false,
                cntOfNeighbors: 0,
            })
        }
        map.push(row);
    }
}

// 게임 종료 시 일괄적으로 실행되는 함수
const gameEnd = () => {
    showOpenMap();
    rl.question("게임을 재시작하겠습니까?", function (line) {
        if (line === "Y") {
            createMap(width, height, cntOfMine);
            waitUserInput();
        }
    })
}

// 결과 map 을 보여주는 함수
const showOpenMap = () => {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let str = '';
        for (let j = 0; j < row.length; j++) {
            const cell = row[j].isMine ? "x" : "o";
            str += cell;
        }
        console.log(str);
    }
}

// 현재 map 을 보여주는 함수
const showMap = () => {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let str = '';
        for (let j = 0; j < row.length; j++) {
            const cell = row[j].revealed ? row[j].cntOfNeighbors : "o";
            str += cell
        }
        console.log(str);
    }
}

// 게임에서 패배했을 시 실행되는 함수
const gameOver = () => {
    gameEnd();
}

// 지뢰가 아닌 cell 선택 시 실행되는 함수
const revealMine = (x, y) => {
    const revealedCell = map[y][x];
    revealedCell.revealed = true;

    // 주변 8칸 탐색 (가장자리일 경우 고려)
    const neighbors = [];
    for (let i = Math.max(0, y - 1); i <= Math.min(height - 1, y + 1); i++) {
        for (let j = Math.max(0, x - 1); j <= Math.min(width - 1, x + 1); j++) {
            if (!map[i][j].revealed) neighbors.push(map[i][j]);  // 중심 cell 제외 + 무한루프 방지
        }
    }
    revealedCell.cntOfNeighbors = neighbors.filter(neighbor => neighbor.isMine === 1).length;

    // 주변 지뢰가 0개일 경우 주변 8칸 모두 열기
    if (revealedCell.cntOfNeighbors === 0) {
        for (let neighbor of neighbors) {
            revealMine(neighbor.x, neighbor.y);
        }
    }
}

// 게임에서 승리했는지 (지뢰 외의 모든 cell 을 다 열었는지) 판별하는 함수
const isWin = () => {
    let cntOfNotRevealed = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (!map[i][j].revealed) cntOfNotRevealed += 1;
        }
    }
    return cntOfNotRevealed === cntOfMine;
}

// 게임에서 승리했을 시 실행되는 함수
const gameWin = () => {
    gameEnd();
}

// cell 을 선택하는 함수
const waitUserInput = () => {
    showOpenMap()
    console.log(" ")
    showMap();
    rl.question('탐색할 좌표를 입력하세요.', (line) => {
        const [x, y] = line.split(',').map(e => parseInt(e));
        console.log(map[y][x]);
        if (map[y][x].isMine === 1) {
            console.log('game over');
            gameOver();
        } else {
            revealMine(x, y);
            if (isWin()) {
                gameWin();
            } else {
                waitUserInput()
            }
        }
    });
}
init();