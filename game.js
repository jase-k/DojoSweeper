// opportunities for improvement: 
// Let the user pick the difficulty. (e.g. easy has 10% ninjas, medium has 20% and hard has 30% ninjas)
// let the user pic the table size ( columns and rows)
//add timer to site


var dojoDiv = document.querySelector("#the-dojo");
var gameStatus = 'active' //can be 'active' 'lost' or 'won'
var numOfNinjas = 10;
var rows = 18;
var columns = 18;

//Random Dojo Array: Start with a random number
var randomDojo = []


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

//run ChangeGrid 10x to place ninjas
function createGrid(num){ //add num variable to recreate difficulty. 
  console.log("Number of Ninjas on the Map: "+ num)
  for(var i = 0; i<num; i++){
     changeGrid();
  }
}



function changeGrid(){
  var spot = createNinja();
  
  if(randomDojo[spot.y][spot.x] == 0){
    randomDojo[spot.y][spot.x] = 1;
  }else{
    changeGrid()
  }
  console.log(`coordinates of ninja: ${spot}`)
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
  // Create an array of locations of the ninjas from randomDojo
  for(var i = 0; i < randomDojo.length; i++){
    for(var j = 0; j < randomDojo[i].length; j++){
      if(randomDojo[i][j] == 1){
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

  var number = getSurrounding(i, j);

  if(number == 0){ //find surroundings
    expandFound(i,j)
  }

  if(randomDojo[i][j] == 1){
    element.innerHTML = '<img src="./images/ninja.png" alt="ninja" class="ninja">'
    console.log("You hit a Ninja")
    gameStatus = 'lost';

    var newDiv = document.createElement("DIV")
    dojoDiv.appendChild(newDiv).innerHTML = `<h2>You Lose!</h2><button onclick="location.reload()">restart</button>`;
  }else{
    element.innerHTML = number
  }
// add '.found' class to clicked element to indicate which elements have been found. If found for the first time, add 1 to Score 
  if(!element.classList.contains("found")){ 
    element.classList.add("found")
    document.querySelector('.score').innerHTML++
    checkWin() 
  }
}

function addFlag(element){
  element.innerHTML = '<img src="./images/flag.png" alt="flag" class="ninja">'
}
// start the game
// message to greet a user of the game
var style="color:cyan;font-size:1.5rem;font-weight:bold;";
console.log("%c" + "IF YOU ARE A DOJO STUDENT...", style);
console.log("%c" + "GOOD LUCK THIS IS A CHALLENGE!", style);


//Starts Game: 
function startGame(){
  var difficulty = document.querySelector('#difficulty').value 
  console.log("Difficulty Level Chosen: " +difficulty)
  //Change Columns and rows based on user input
  rows = document.querySelector('#rows').value
  columns = document.querySelector('#columns').value

  //Renders Game Board based on Options Selected by User
  //Create Array of 0's based on the Columns and Rows
  randomDojo = emptyGrid(rows, columns)

  
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
  
  //runs the function to add the ninjas in the grid.
  createGrid(numOfNinjas);

  // adds the rows of buttons into <div id="the-dojo"></div> 
  dojoDiv.innerHTML = render(randomDojo);  
  
  //Removes the context menu from right clicks
  removeContextMenu(document.querySelectorAll('.tatami'))
  
  //Removes Start Options from HTML
  document.querySelector('#startOptions').remove() 
  
  // shows the dojo for debugging purposes
  console.table(randomDojo);
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
          console.log(randomDojo[a][b])
          indexes.push(a*randomDojo[b].length + b)
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

    var num = getSurrounding(Math.floor(index/rows), index%columns);
    box.innerHTML = num;
    
    //if num == 0 perform find surroundings again from that index
    if(num == 0){
      expandFound(Math.floor(index/rows), index%columns)
    }

    document.querySelector('.score').innerHTML++
    checkWin() 
  }
}

// calculates the surrounding button sum of ninjas 
function getSurrounding(i, j){
    var number = 0; 

    for(var a = i-1; a <= i+1 && a < rows; a++){
      if(a >= 0){
        for(var b = j-1; b <= j+1 && b < columns; b++){
          if(!(a == i && b == j) && b >= 0){
            console.log(randomDojo[a][b])
            number += randomDojo[a][b]
          }
        }
      }
    }
    return number
}
