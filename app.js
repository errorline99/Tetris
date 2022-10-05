


document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button') 
    const pauseBtn = document.querySelector("#start-pause") 
    const final = [10,11, 12, 13, 14, 15, 16, 17, 18, 19]
    let score = 0
    let timerId;
    let width = 10
    let nextRandom = 0
    const colors = ['blue','green','purple','orange','red',]
    
    
    //The tetrominoes

    const lTetromino =[ [1, width + 1, width * 2 + 1, 2],
    [width , width + 1 , width + 2 , width * 2 + 2  ],
    [1 , width + 1 , width * 2 , width * 2 + 1],
    [width, width * 2 , width * 2 + 1 , width * 2 + 2]
    ]


    const zTetromino =[ 
    [width * 2 , width + 1 , width * 2 + 1 , width + 2],
    [0 , width , width + 1 , width * 2 + 1],
    [width * 2 , width + 1 , width * 2 + 1 , width + 2],
    [0 , width , width + 1 , width * 2 + 1]
    ]


    const tTetromino = [
        [width, 1 , width + 1 , width + 2],
        [1 , width + 1 , width + 2 , width * 2 + 1 ],
        [width , width + 1 , width + 2 , width * 2 + 1],
        [width, 1 , width + 1 , width * 2 + 1]

    ]


    
    const oTetromino = [
        [0, 1 , width , width + 1],
        [0, 1 , width , width + 1],
        [0, 1 , width , width + 1],
        [0, 1 , width , width + 1]

    ]

    const iTetromino = [
        [1, width + 1 , width * 2 + 1, width * 3 + 1],
        [width, width + 1 , width + 2 , width + 3],
        [1, width + 1 , width * 2 + 1, width * 3 + 1 ],
        [width, width + 1 , width + 2 , width + 3]


    ]


    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    //currentposition is used in the draw function 
    let currentPosition = 4

    let currentRotation = 0
//randomly select a tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)

    let current =  theTetrominoes[random][currentRotation]
    

// draw the tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    draw()
    

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }
    


//freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //starting a falling tetromino
            random = nextRandom 
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            Flag()
        }
    }

    

    

    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        }

        else if (e.keyCode === 38) {
            rotate()
        }

        else if (e.keyCode === 39) {
            moveRight()
        }
        
        else if (e.keyCode === 40) {
            
        }

        
    }

    document.addEventListener('keyup', control)
    
    
    
    // move down fuction
    function moveDown(){
        undraw()
        currentPosition += width 
        draw()
        freeze()

        
            
    }


    //move the tetromino left, unless is at the edge or there is a bockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index ) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +1
        }

        draw()
    }
    
    
    //move the tetromino Right, unless is at the edge or there is a bockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition +index) % width === width -1)

        if(!isAtRightEdge) currentPosition +=1 

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }

        draw()
    }
    
    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }

        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //show up-next tetromino in mini grid-display
    const displaySqaures = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
    //the Tetromminoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],//l tetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],//z tetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2],//T tetromino
        [0, 1, displayWidth, displayWidth + 1],//o tetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1 ]//i tetromino
    ]

    //display the shape in the mini-grid display
    function displayShape(){
        //remove any trace of a tetromino form the entire grid
        displaySqaures.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySqaures[displayIndex + index].classList.add('tetromino')
        })
    }

    //add functionality to the button
    // timerId without a value will give  false
    // timerId with a value will give  true
    
    startBtn.addEventListener('click', ()=>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        }  else {
            timerId = setInterval(moveDown, 200)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    function addScore() {
        for(let i = 0; i < 199 ; i += width){
            const row = [i, i+1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML = score

                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                //bug: squareRemoved removes the original class taken divs
                
                const squareRemoved = squares.splice(i, width)
                //when squares is merged. the the removed squares go back to the begining of the array
                squares = squareRemoved.concat(squares)                
                squares.forEach(cell => grid.appendChild(cell))
                
            }
        }
        
    }

    function Flag(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
    
})





