/*const memoryApp =*/ (function() {
    //global variables goes here
    let clickedArray = [];
    let interval;
    let started = false;
    let time = 0;
    let ready = true;
    let numCompleted = 0;

    //run function here
    randomAnswers()


    //function definition
    //secondary functions:
    function randomAnswers() {
        fetch('https://cristiamportfolioapis.herokuapp.com/memory/')
        .then(response => response.json())
        .then(data =>{ 
            setUp(data)
        })
        .catch(err => console.log(err))
        
    }


    function reveal(cell) {
        cell.style.backgroundColor = '#CCC';
        cell.firstChild.style.display = 'block';
        cell.clicked = true;
    }

    function hide(cell) {
        cell.style.backgroundColor = '#282c34';
        cell.firstChild.style.display = 'none';
        cell.clicked = false;
    }

    function complete(cell) {
        cell.style.backgroundColor = '#007E33';
        cell.completed = true;
        cell.firstChild.style.display = 'block';


        numCompleted++;
    }
 

    function startTime() {
        if (started === false) {
            started = true;
            interval = setInterval(function() {
                time++;
                document.getElementById("timer").innerHTML = "Time Elapsed: " + time;
            }, 1000)
        }
    }



    //main function:
    function setUp(answers) {
        console.log(answers)
        const memoryTable = document.querySelector('#container');
        const container = document.querySelector('#container');
        const growBox = document.querySelector('#grow-box');
        const info = document.querySelector('#info');
        for (let i = 0; i < answers.length; i++) {

            let cell = document.createElement('div');
            let img = document.createElement('img')

            cell.className = 'card'
            cell.completed = false;
            cell.clicked = false;
            cell.value = answers[i].value
            img.setAttribute('src', answers[i].pic)
            cell.appendChild(img)
            

            cell.addEventListener('mouseenter', function() {
                if (this.completed === false && this.clicked === false) {
                    this.style.backgroundColor = 'white';
                }
            })

            cell.addEventListener('mouseleave', function() {
                if (this.completed === false && this.clicked === false) {
                    this.style.backgroundColor = '#282c34';
                }
            })

            cell.addEventListener('click', function() {
                if (ready === false) {
                    return;
                }

                startTime();

                if (this.completed === false && this.clicked === false) {
                    clickedArray.push(this);
                    reveal(this);
                }

                if (clickedArray.length === 2) {
                    if(clickedArray[0].value === clickedArray[1].value){
                        complete(clickedArray[0]);
                        complete(clickedArray[1]);

                        clickedArray = [];
                        document.querySelector('#App').style.backgroundColor = "#00C851";

                        setTimeout(function(){
                            return document.querySelector('#App').style.backgroundColor = "#282c34";
                        }, 500)

                        if (numCompleted === 20) {
                            const title = document.createElement('h1');
                            const secTitle = document.createElement('h2');
                            const message = document.createElement('p');
                            const mainImg = document.createElement('img');
                            mainImg.setAttribute('src', answers[0].pic);
                            mainImg.setAttribute('class', 'main-img')
                            mainImg.style.display = 'block';
                            title.innerHTML = `You won in ${time} seconds`;
                            secTitle.innerHTML = 'Did you know?';
                            message.innerHTML = answers[0].fact;
                            
                            
                            clearInterval(interval)
                            
                            info.appendChild(title)
                            info.appendChild(secTitle)
                            info.appendChild(message)
                            info.appendChild(mainImg)
                            container.style.animationPlayState = 'running';
                            container.addEventListener('animationend', ()=>{
                                container.style.display = 'none';
                                
                                growBox.style.display = 'grid';
                                growBox.style.animationPlayState = 'running';
                                growBox.addEventListener('animationend', ()=>{
                                    
                                    info.style.display = 'flex';
                                    info.style.animationPlayState = 'running';
                                })
                            })
                            
                        }
                    }
                    else {
                        ready = false;
                        document.getElementById("App").style.backgroundColor= "#FF4444";
                        setTimeout(function(){
                            hide(clickedArray[0]);
                            hide(clickedArray[1]);
    
                            clickedArray = [];
    
                            ready = true;
                            document.getElementById("App").style.backgroundColor = "#282c34";
                        }, 500);
                    }
                }
            })

            memoryTable.appendChild(cell)

               
        }
        document.addEventListener('keydown', function(event) {
            if(event.key > 0 && event.key < 10) {
                grid[event.key - 1].click();
            }
        });

        document.getElementById("restart").addEventListener('click', function() {
            location.reload();
        });
    }
}());