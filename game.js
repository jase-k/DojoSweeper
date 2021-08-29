// opportunities for improvement: 
// Let the user pick the difficulty. (e.g. easy has 10% ninjas, medium has 20% and hard has 30% ninjas)
// let the user pic the table size ( columns and rows)
//add timer to site


var dojoDiv = document.querySelector("#the-dojo");
var gameStatus = 'active' //can be 'active' 'lost' or 'won'
var numOfNinjas = 10;
var rows = 10;
var columns = 10;
var difficulty = 'easy'
var score = 0

//Random Dojo Array: Start with a random number
var gameGrid = []


function emptyGrid(x, y){
  var array = []
  for(var i = 0; i < x; i++){
    array.push([])
    for(var j = 0; j < y; j++){
      array[i].push(0)
    }
  }
  return array
}

//run ChangeGrid based on the Number of Ninjas
function createGrid(num, badIndexes){ //add num variable to recreate difficulty. 
  console.log("Number of Ninjas on the Map: "+ num)
  for(var i = 0; i<num; i++){
     changeGrid(badIndexes);
  }
}


//Add if spot is one of the bad indexes, change grid again
function changeGrid(badIndexes){
  var spot = createNinja();
  var matchedIndex = false; 

  //checks to see if any badIndexes match the spot
  badIndexes.forEach(idx =>{
    if(idx.i == spot.y && idx.j == spot.x){
      matchedIndex = true
    }
  })
  
  if(gameGrid[spot.y][spot.x] == 0 && !matchedIndex){
    gameGrid[spot.y][spot.x] = 1;
  }
  else{
    changeGrid(badIndexes)
  }
  console.log(`coordinates of ninja: ${spot.y} ${spot.x}`)
}

function createNinja(){
  var spot = {}
  spot.x = Math.floor(Math.random() * columns)
  spot.y = Math.floor(Math.random() * rows)

  return spot; 
}
    
// Creates the rows of buttons for this game
function render(gameBoard) {
  var result = "";
  for(var i=0; i<gameBoard.length; i++) {
    result += '<div class="row">'
    for(var j=0; j<gameBoard[i].length; j++) {
      result += `<button class="tatami" oncontextmenu="addFlag(this)" onclick="search(${i}, ${j}, this)"></button>`;
    }
    result += '</div>'
  }
  return result;
}
    
// TODO - Make this function tell us how many ninjas are hiding 
//        under the adjacent (all sides and corners) squares.
//        Use i and j as the indexes to check gameBoard.
function checkWin(){
  if(gameStatus == 'lost'){
    removeButtonFunctions()
    showNinjas();
  } 
  else{
    var found = document.querySelectorAll('.found').length;
    var total = document.querySelectorAll('.tatami').length;

    if(found+numOfNinjas == total){ //checks to see if all buttons are found (besides the ninjas) then sets game status to won.
      var newDiv = document.createElement("DIV")

      dojoDiv.appendChild(newDiv).innerHTML = `<h2>You win!</  h2><button onclick="location.reload()">restart</button>`;
      gameStatus = 'won'

      removeButtonFunctions();
      showNinjas();
    };

    
  }
}

function removeContextMenu(divs){
  divs.forEach(div => {
    div.addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } )
  })
  console.log("div elements: ", divs)
}



//removes all Click events from the game board buttons
function removeButtonFunctions(){ 
  document.querySelectorAll('.tatami').forEach(element =>{
    element.onclick = null
  })
}

//Show's all the ninja's locations: 
 function showNinjas(){
   // insert image of ninja in each of the locations
  var indexes = findNinjas();
  var buttons = document.querySelectorAll('.tatami')

  indexes.forEach(idx => {
    buttons[idx].innerHTML = '<img src="./images/ninja.png" alt="ninja" class="ninja">'
  })
}


function findNinjas(){
  var indexes = [];
  // Create an array of locations of the ninjas from gameGrid
  for(var i = 0; i < gameGrid.length; i++){
    for(var j = 0; j < gameGrid[i].length; j++){
      if(gameGrid[i][j] == 1){
        indexes.push(i*columns + j)
      }
    }
  }
  console.log("Locations of Ninjas"+ indexes)
  return indexes
}    

//checks for ninja's nearby. Counts the number of ninjas and changs the inner HTML to number of nearby. IF click a ninja, end game and show restart button. //add class of 'found'
function search(i, j, element) {
  console.log({i, j});

  if(score == 0){ 
    populateNinjas(i , j); //Adds Ninjas to the New Grid
  }

  var number = getSurroundingSum(i, j);

  if(number == 0 && gameGrid[i][j] == 0){ //find surroundings if 0 and not a ninja
    expandFound(i,j)
  }

  if(gameGrid[i][j] == 1){
    element.innerHTML = '<img src="./images/ninja.png" alt="ninja" class="ninja">'
    console.log("You hit a Ninja")
    gameStatus = 'lost';

    var newDiv = document.createElement("DIV")
    dojoDiv.appendChild(newDiv).innerHTML = `<h2>You Lose!</h2><button onclick="location.reload()">Start Over</button> <button onclick="startGame()"> Retry </button>`;
  }else{
    element.innerHTML = number 
  }
  // add '.found' class to clicked element to indicate which elements have been found. If found for the first time, add 1 to Score 
  if(!element.classList.contains("found")){ 
    element.classList.add("found")
    if(gameGrid[i][j] == 0){//checks if selection is a ninja 
      score++
      document.querySelector('.score').innerHTML = score;
    }
  }

  checkWin() 
}

function addFlag(element){
  element.innerHTML = '<img src="./images/flag.png" alt="flag" class="ninja">'
}

function setColumns(element){
  columns = element.value
  console.log("Chosen Columns: "+ columns)
}

function setRows(element){
  rows = element.value
  console.log("Chosen Rows: "+ rows)
}

function setDifficulty(element){
  difficulty = element.value
  console.log("Chosen Difficulty: "+ difficulty)
}

function populateNinjas(i, j){
 //Change amount of squares to ninjas based on difficulty
  if(difficulty == 'easy'){
    numOfNinjas = Math.round((rows * columns)*.10)
  }
  else if(difficulty == 'Novice'){
    numOfNinjas = Math.round((rows * columns)*.20)
  }
  else{
    numOfNinjas = Math.round((rows * columns)*.30)
  }

  var badIndexes = getSurrounding(i, j)

 //runs the function to add the ninjas in the grid.
  createGrid(numOfNinjas, badIndexes);
}

//Starts Game: 
function startGame(){
  //Renders Game Board based on Options Selected by User
  //Create Array of 0's based on the Columns and Rows
  gameGrid = emptyGrid(rows, columns)
  gameStatus = 'active'
  //resets score to zero: 
  score = 0 
  document.querySelector('.score').innerHTML = score;

  // adds the rows of buttons into <div id="the-dojo"></div> 
  dojoDiv.innerHTML = render(gameGrid);  
  
  //Removes the context menu from right clicks
  removeContextMenu(document.querySelectorAll('.tatami'))
  
  //Removes Start Options from HTML
  var startOptions = document.querySelector('#startOptions')
  if(startOptions){
    startOptions.remove()
  }   
}

function displayGridOptions(){
  var rows = document.querySelector('#rows')
  var columns = document.querySelector('#columns')
  
  for(var i= 10; i < 31; i++){
    rows.innerHTML += `<option value="${i}">${i}</option>`
  }

  for(var i= 10; i < 31; i++){
    columns.innerHTML += `<option value=${i}>${i}</option>`
  }
}
displayGridOptions();

//When click on a 0 expand the surrounding buttons and mark as found"
function expandFound(i, j){
  var indexes = [];
  var gameButtons = document.querySelectorAll('.tatami')
  
  // Builds array of indexes used to select elements from grid
  for(var a = i-1; a <= i+1 && a < rows; a++){
    if(a >= 0){
      for(var b = j-1; b <= j+1 && b < columns; b++){
        if(!(a == i && b == j) && b >= 0){
          console.log(gameGrid[a][b])
          indexes.push(a*gameGrid[b].length + b)
        }
      }
    }
  }
  console.log("Indexes around a zero: " + indexes)
  
  // iterates through the array and adds the new class and innerhtml. If not found, starts the expandFound function again. 
  for(var i = 0; i < indexes.length; i++){
    findTile(indexes[i])
  }
}

//finds a tile reveals number
function findTile(index){
  var gameButtons = document.querySelectorAll('.tatami')

  if(!gameButtons[index].classList.contains("found")){ 
    var box = gameButtons[index]
    box.classList.add("found")

    var num = getSurroundingSum(Math.floor(index/rows), index%columns);
    box.innerHTML = num;
    
    //if num == 0 perform find surroundings again from that index
    if(num == 0){
      expandFound(Math.floor(index/rows), index%columns)
    }

    score++;  
    document.querySelector('.score').innerHTML = score;
    checkWin() 
  }
}

// calculates the surrounding button sum of ninjas 
function getSurrounding(i, j){
    var number = 0; 
    var spots = []

    for(var a = i-1; a <= i+1 && a < rows; a++){
      if(a >= 0){
        for(var b = j-1; b <= j+1 && b < columns; b++){
          if(!(a == i && b == j) && b >= 0){
            console.log(gameGrid[a][b])
            number += gameGrid[a][b]
            spots.push({
              i : a, 
              j : b
            })
          }
        }
      }
    }
    return spots
}

function getSurroundingSum(i, j){
  var spots = getSurrounding(i, j);
  console.log("Sounding Tile Coordinates: " + JSON.stringify(spots))
  var sum = 0; 
  
  spots.forEach(spot =>{
    sum += gameGrid[spot.i][spot.j]
    console.log("new sum: " + sum)
    return sum
  })
  return sum
}

/////Get the first click to be a 0
//Populate the grid with ninjas after first click
  //based on score (if score is zero populate )
  //save the indexes that can't have ninjas based on click


