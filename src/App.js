import { useState,useEffect } from 'react';
import './App.css';
import blue from './images/blue.png'
import green from './images/green.png'
import yellow from './images/yellow.png'
import purple from './images/purple.png'
import red from './images/red.png'
import orange from './images/orange.png'
import brick from './images/brick.png'

const width = 8
const candies = [
  blue,
  green,
  orange,
  red,
  purple,
  yellow,
]

function App() {
  
  const [randomCandyColor,setRandomCandyColor] = useState([])
  const [draggedCandy, setDraggedCandy] = useState(null)
  const [droppedCandy, setdroppedCandy] = useState(null)


    function handleRowsOfThrees(){
      for (let i = 0; i < 62; i++){
        const rowOfThrees = [i, i+1, i+2]
        const decidedImg = randomCandyColor[i]
        const excludedList = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]

        if(excludedList.includes(i)) continue

        if(rowOfThrees.every(candy => randomCandyColor[candy] === decidedImg)){
          rowOfThrees.forEach(candy => randomCandyColor[candy] = brick)
          return true
        }
      }

    }

    function handleRowsOfFours(){
      for (let i = 0; i < 61; i++){
        const rowOfThrees = [i, i+1, i+2]
        const decidedImg = randomCandyColor[i]
        const excludedList = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]

        if(excludedList.includes(i)) continue

        if(rowOfThrees.every(candy => randomCandyColor[candy] === decidedImg)){
          rowOfThrees.forEach(candy => randomCandyColor[candy] = brick)
          return true
        }
      }
    }

    function handleColumnThrees(){
      for(let i = 0;i <= 47; i++){
        const columnThree = [i,i+width,i+width*2]
        const img = randomCandyColor[i]

        if(columnThree.every(candy => randomCandyColor[candy] === img )){
          columnThree.forEach(candy => randomCandyColor[candy]=brick)
          return true
        }
      }

    }


    function handleColumnFours(){
      for(let i = 0; i <= 39; i++){
        const columnOfFour = [i,i+width,i+width*2,i+width*3]
        const img = randomCandyColor[i]

        if(columnOfFour.every(candy => randomCandyColor[candy] === img )){
          columnOfFour.forEach(candy => randomCandyColor[candy]=brick)
          return true
        }
      }
    }

    function handleRefill(){
      for(let i = 0; i < 64 - width; i++){
        const refillArray = [0,1,2,3,4,5,6,7]

        if(refillArray.includes(i) && randomCandyColor[i] === brick){
          let randomNumber = Math.floor(Math.random() * candies.length)
          randomCandyColor[i] = candies[randomNumber]
        }

        if((randomCandyColor[i + width]) === brick){
          randomCandyColor[i + width] = randomCandyColor[i]
          randomCandyColor[i] = brick
        }
      }
    }

    function dragStart(e){
      setDraggedCandy(e.target)
    }
    
    function dragDrop(e){
      setdroppedCandy(e.target)
      console.log(droppedCandy);
    }

    function dragEnd(){
      const draggedCandyId = parseInt(draggedCandy.getAttribute('data-id'))
      const replacedCandyId = parseInt(droppedCandy.getAttribute('data-id'))

      randomCandyColor[draggedCandyId] = droppedCandy.getAttribute('src')
      randomCandyColor[replacedCandyId] =draggedCandy.getAttribute('src')

      const validDirection = [
        draggedCandyId + 1,
        draggedCandyId + width,
        draggedCandyId - width,
        draggedCandyId - 1
      ]

      const columnOfFour = handleColumnFours()
      const columnOfThrees = handleColumnThrees()
      const rowOfFour = handleRowsOfFours()
      const rowOfThree = handleRowsOfThrees()

      if(replacedCandyId && validDirection && (columnOfFour || columnOfThrees || rowOfThree|| rowOfFour)){
        setDraggedCandy(null)
        setdroppedCandy(null)
      }else{
        randomCandyColor[draggedCandyId] = draggedCandy.getAttribute('src')
        randomCandyColor[replacedCandyId] = droppedCandy.getAttribute('src')
        setRandomCandyColor([...randomCandyColor])
      }

    }

      
    function generateGrid(){
      const randomCandyArray = []
      for(let i = 0; i < width*width; i++){
        const randomIndex = Math.floor(Math.random() * candies.length)
        const randomCandies = candies[randomIndex]
        randomCandyArray.push(randomCandies)
        }
        setRandomCandyColor(randomCandyArray)
      }

      useEffect(()=>{
        generateGrid()
      },[])
    


    useEffect(()=>{
      const timer = setInterval(()=>{
        handleColumnFours()
        handleRowsOfFours()
        handleColumnThrees()
        handleRowsOfThrees()
        handleRefill()
        setRandomCandyColor([...randomCandyColor])
      },100)
      return () => clearInterval(timer)
    },[handleColumnFours,handleRowsOfFours,handleColumnThrees,handleRowsOfThrees, handleRefill,randomCandyColor])

  
  
  return (
    <div className='container'>
    <h1 className="title">Candy Crush</h1>
        <div className="gridBase">
        {randomCandyColor.map((randomCandy,index) => (
            <img key={index} className='img' src={randomCandy} alt='' 
              data-id={index}
              onDrop = {dragDrop}
              draggable = {true}
              onDragOver = {(e) => e.preventDefault()}
              onDragEnter = {(e) => e.preventDefault()}
              onDragLeave = {(e) => e.preventDefault()}
              onDragEnd = {dragEnd}
              onDragStart = {dragStart}
            /> 
        ))}
        </div>
    </div>
  );
  }
export default App;
