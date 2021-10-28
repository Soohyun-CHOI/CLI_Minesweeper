const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let width, height, cntOfMine;
let map = [];

const init = () => {
    const askCntOfMine = () => {
        rl.question("지뢰 개수를 입력하세요.", function (line) {
            cntOfMine = parseInt(line);
            if (isNaN(cntOfMine)) {
                console.log("\n숫자를 입력해주세요.");
                askCntOfMine();
            } else if (cntOfMine < 0 || cntOfMine > width * height) {
                console.log(`\n0 이상 ${width * height} 이하의 숫자를 입력해주세요.`);
                askCntOfMine();
            } else {
                createMap(width, height, cntOfMine);
                waitUserInput();
            }
        });
    }
    const askHeight = () => {
        rl.question("세로 크기를 입력하세요.", function (line) {
            height = parseInt(line);
            if (isNaN(height)) {
                console.log("\n숫자를 입력해주세요.");
                askHeight();
            } else if (height < 0 || height > 30) {
                console.log("\n0 이상 30 이하의 숫자를 입력해주세요.");
                askHeight();
            } else askCntOfMine();
        });
    }
    rl.question("가로 크기를 입력하세요.", function (line) {
        width = parseInt(line);
        if (isNaN(width)) {
            console.log("\n숫자를 입력해주세요.");
            init();
        } else if (width < 0 || width > 5) {
            console.log("\n0 이상 5 이하의 숫자를 입력해주세요.");
            init();
        } else askHeight();
    });
}

const createMap = (width, height, cntOfMine) => {
    map = [];  // map 초기화
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

// 결과 map 을 보여주는 함수
const showOpenMap = () => {
    for (let i = 0; i < height; i++) {
        let str = "";
        for (let j = 0; j < width; j++) {
            const neighbors = getNeighbors(j, i);
            map[i][j].cntOfNeighbors = neighbors.filter(neighbor => neighbor.isMine === 1).length;
            const cell = map[i][j].isMine ? "x" : map[i][j].cntOfNeighbors;
            str += cell;
        }
        console.log(str);
    }
}

// 현재 map 을 보여주는 함수
const showMap = () => {
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        let str = "";
        for (let j = 0; j < row.length; j++) {
            const cell = row[j].revealed ? row[j].cntOfNeighbors : "o";
            str += cell;
        }
        console.log(str);
    }
}

// 게임 종료 후 재시작 함수
const handleTryAgain = () => {
    rl.question("게임을 재시작하겠습니까?", function (line) {
        if (line === "Y") {
            createMap(width, height, cntOfMine);
            waitUserInput();
        } else {
            handleTryAgain();
        }
    })
}

// 게임에서 패배했을 시 실행되는 함수
const gameOver = () => {
    showOpenMap();
    handleTryAgain();
}

// 주변 8칸 중 열리지 않은 칸 가져오기 (가장자리일 경우 고려)
const getNeighbors = (x, y) => {
    const neighbors = [];
    for (let i = Math.max(0, y - 1); i <= Math.min(height - 1, y + 1); i++) {
        for (let j = Math.max(0, x - 1); j <= Math.min(width - 1, x + 1); j++) {
            if (!map[i][j].revealed) neighbors.push(map[i][j]);  // 가운데 cell 제외 + 무한루프 방지
        }
    }
    return neighbors
}

// 지뢰가 아닌 cell 선택 시 실행되는 함수
const revealMine = (x, y) => {
    // init_x, init_y: 초기 좌표 (무한루프 방지)
    const revealedCell = map[y][x];
    revealedCell.revealed = true;

    const neighbors = getNeighbors(x, y);
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
    showOpenMap();
    handleTryAgain();
}

// cell 을 선택하는 함수
const waitUserInput = () => {
    showMap();
    rl.question('탐색할 좌표를 입력하세요.', (line) => {
        const [x, y] = line.split(',').map(e => parseInt(e));
        if (map[y][x].isMine === 1) {
            console.log("GAME OVER");
            gameOver();
        } else {
            revealMine(x, y);
            if (isWin()) {
                console.log("YOU WIN");
                gameWin();
            } else {
                waitUserInput()
            }
        }
    });
}
init();