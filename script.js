const mainContainerEL = document.getElementsByTagName('main')[0]
const applicationSectionELs = Array.from(mainContainerEL.children)
const funcionalityChangerButtonELs = Array.from(document.querySelectorAll('[data-js="change-funcionality"] button'))
const actualFuncionalityRowEL = document.querySelectorAll('[data-js="change-funcionality"] > div')[1]
const [handOfTheSecondsEL, handOfTheMinutesEL, handOfTheHoursEL] = document.querySelectorAll('[data-js="pointer-clock"] > span')
const [clockHoursEL, , clockMinutesEL, ,clockSecondsEL] = document.querySelectorAll('[data-js="digital-clock"] > span')

const valueStorerEL = document.querySelector('[data-js="value-storer"]')
const tooltipEL = document.getElementsByClassName('tooltip')[0]
const cronometerDisplayEL = document.querySelector('[data-js="cronometer-display"]')
const [cronometerHoursEL, , cronometerMinutesEL, , cronometerSecondsEL, cronometerDecimalsEL] = 
    Array.from(document.querySelectorAll('[data-js="cronometer-display"] > span'))
const [cronometerStarterEL, cronometerStopperEL, cronometerContinuerEL, cronometerRestarterEL, cronometerReseterEL] = 
    Array.from(document.querySelectorAll('.cronometer-actions-container button'))
const cronometerDivButtonWrapperEL = document.querySelector('.cronometer-actions-container > div')
const storedValuesEL = document.getElementsByClassName('stored-values')[0]
const storedValuesContainerEL = storedValuesEL.parentElement

const [timerHoursEL, timerMinutesEL, timerSecondsEL] = 
    Array.from(document.querySelectorAll('.timer-wrapper-container > div > input'))
const timerInputsArray = [timerSecondsEL, timerMinutesEL, timerHoursEL]
const [timerStarterEL, timerStopperEL, timerContinuerEL, timerRestarterEL, timerReseterEL] =
    Array.from(document.querySelectorAll('[data-js="timer-actions-container"] button'))
const timerDivButtonWrapperEL = document.querySelector('.timer-actions-container > div')

let clockTimeout = null     // These variables will allow to clear the timeouts/intervals.
let clockInterval = null

let cronometerTimeout = null
let cronometerInterval = null
let timeoutToReactiveTooltip = null

let timerInterval = null
let globalTimerValue = null
let timerStoredTimes = ['00', '00', '00']   // It allows return to a previous value if the current value of a input is invalid

let globalButtonIndex = 0
let timesClickedOnButton0 = 0
let globalTotalTurns = 0


function setFuncionalityRowWidth() {
    const buttonWidth = funcionalityChangerButtonELs[0].getBoundingClientRect().width
    actualFuncionalityRowEL.style.width = buttonWidth + 'px'
}

setFuncionalityRowWidth()


function highlitSelectedFuncionality(buttonIndex=0) {
    funcionalityChangerButtonELs.forEach(buttonEL => {
        buttonEL.classList.remove('element-highlighter')
        buttonEL.children[0].classList.remove('fill-color-changer')
    })

    funcionalityChangerButtonELs[buttonIndex].classList.add('element-highlighter')
    funcionalityChangerButtonELs[buttonIndex].children[0].classList.add('fill-color-changer')
}

highlitSelectedFuncionality()


function changeFuncionalityRowPosition(buttonIndex) {
    const rowWidth = actualFuncionalityRowEL.getBoundingClientRect().width

    actualFuncionalityRowEL.style.left = `${rowWidth * buttonIndex}px`
}


function slideToFuncionality(buttonIndex) {
    applicationSectionELs.forEach(sectionEL => {
        sectionEL.classList.remove('display-flex')
    })

    applicationSectionELs[buttonIndex].classList.add('display-flex')
}


function changeFuncionality(buttonIndex) {
    globalButtonIndex = buttonIndex

    buttonIndex === 1 ? timesClickedOnButton0 = 0 : timesClickedOnButton0 += 1

    highlitSelectedFuncionality(buttonIndex)
    changeFuncionalityRowPosition(buttonIndex)
    slideToFuncionality(buttonIndex)

    if (buttonIndex) {
        timesClickedOnButton0 = 0
        clearTimeout(clockTimeout)
        clockInterval ? clearTimeout(clockInterval) : null

        clockTimeout = null
        clockInterval = null
    }
    else if (!clockTimeout) {
        initClock()
    }
}


function updateHandsPosition(totalSeconds, totalMinutes, totalHours) {
    handOfTheSecondsEL.style.webkitTransform = `translateY(-50%) rotate(${totalSeconds * 6 -90}deg)`
    handOfTheSecondsEL.style.msTransform = `translateY(-50%) rotate(${totalSeconds * 6 -90}deg)`
    handOfTheSecondsEL.style.mozTransform = `translateY(-50%) rotate(${totalSeconds * 6 -90}deg)`
    handOfTheSecondsEL.style.oTransform = `translateY(-50%) rotate(${totalSeconds * 6 -90}deg)`
    handOfTheSecondsEL.style.transform = `translateY(-50%) rotate(${totalSeconds * 6 -90}deg)`

    handOfTheMinutesEL.style.webkitTransform = `translateY(-50%) rotate(${(totalMinutes * 6) + (6 / 60 * totalSeconds) -90}deg)`
    handOfTheMinutesEL.style.msTransform = `translateY(-50%) rotate(${(totalMinutes * 6) + (6 / 60 * totalSeconds) -90}deg)`
    handOfTheMinutesEL.style.mozTransform = `translateY(-50%) rotate(${(totalMinutes * 6) + (6 / 60 * totalSeconds) -90}deg)`
    handOfTheMinutesEL.style.oTransform = `translateY(-50%) rotate(${(totalMinutes * 6) + (6 / 60 * totalSeconds) -90}deg)`
    handOfTheMinutesEL.style.transform = `translateY(-50%) rotate(${(totalMinutes * 6) + (6 / 60 * totalSeconds) -90}deg)`

    handOfTheHoursEL.style.webkitTransform = `translateY(-50%) rotate(${(totalHours * 30) + (30 / 60 * totalMinutes) -90}deg)`
    handOfTheHoursEL.style.msTransform = `translateY(-50%) rotate(${(totalHours * 30) + (30 / 60 * totalMinutes) -90}deg)`
    handOfTheHoursEL.style.mozTransform = `translateY(-50%) rotate(${(totalHours * 30) + (30 / 60 * totalMinutes) -90}deg)`
    handOfTheHoursEL.style.oTransform = `translateY(-50%) rotate(${(totalHours * 30) + (30 / 60 * totalMinutes) -90}deg)`
    handOfTheHoursEL.style.transform = `translateY(-50%) rotate(${(totalHours * 30) + (30 / 60 * totalMinutes) -90}deg)`

}

function fillFields(computerTime) {
    clockHoursEL.innerText = `0${computerTime.getHours()}`.slice(-2)
    clockMinutesEL.innerText = `0${computerTime.getMinutes()}`.slice(-2)
    clockSecondsEL.innerText = `0${computerTime.getSeconds()}`.slice(-2)
}


function updateClockTime() {
    let currentSecond = clockSecondsEL.innerText
    let currentMinute = clockMinutesEL.innerText
    let currentHour = clockHoursEL.innerText

    clockSecondsEL.innerText = `0${++currentSecond}`.slice(-2)
    
    if (currentSecond === 60) {
        clockMinutesEL.innerText = `0${++currentMinute}`.slice(-2)

        clockSecondsEL.innerText = '00'
    }
    if (currentMinute === 60) {
        clockHoursEL.innerText = `0${++currentHour}`.slice(-2)
        clockMinutesEL.innerText = '00'
    }
    if (currentHour === 24) {
        clockHoursEL.innerText = '00'
    }

    currentSecond = clockSecondsEL.innerText
    currentMinute = clockMinutesEL.innerText
    currentHour = clockHoursEL.innerText

    updateHandsPosition(currentSecond, currentMinute, currentHour)
}

function initClock() {
    const computerTime = new Date()
    const timeToUpdateFirstSecond = 1000 - computerTime.getMilliseconds()

    updateHandsPosition(computerTime.getSeconds(), computerTime.getMinutes(), computerTime.getHours())
    fillFields(computerTime)

    clockTimeout = setTimeout(() => {
        updateClockTime()

        clockInterval = setInterval(updateClockTime, 1000)
    }, timeToUpdateFirstSecond)   // Increment one second in the specifc time.
}

initClock()



function storeValue() {
    const cronometerContent = cronometerDisplayEL.innerText

    clearTimeout(timeoutToReactiveTooltip)
    tooltipEL.classList.add('disabled-element')
    timeoutToReactiveTooltip = setTimeout(() => tooltipEL.classList.remove('disabled-element'), 800)

    if ((cronometerInterval || cronometerTimeout) || cronometerContent !== '00:00:0000') {
        globalTotalTurns++
        storedValuesEL.innerHTML += 
        `<div>
            <span style="margin-right: 4px">${globalTotalTurns}° valor</span> 
            <span>${cronometerContent.slice(0, cronometerContent.length-2)} <span class="small-number">${cronometerContent.slice(-2)}</span> </span> 
        </div>`
    }
}


function toggleClasses(dataCollections, classes, firstClassMaxRange) {
    dataCollections.forEach((dataCollection, index) => {
        const isCollectionInRange = index <= firstClassMaxRange
        const addClass = dataCollection[1] === 'add'

        if (isCollectionInRange) {
            addClass ?
            dataCollection[0].classList.add(classes[0]) :
            dataCollection[0].classList.remove(classes[0])
        }

        else {
            addClass ?
            dataCollection[0].classList.add(classes[1]) :
            dataCollection[0].classList.remove(classes[1])
        }
    })
}


function updateCronometer() {
    let cronometerDecimals = Number(cronometerDecimalsEL.innerText)
    let cronometerSeconds = cronometerSecondsEL.innerText
    let cronometerMinutes = cronometerMinutesEL.innerText
    let cronometerHours = cronometerHoursEL.innerText

    cronometerDecimalsEL.innerText = `0${++cronometerDecimals}`.slice(-2)

    if(cronometerDecimals === 100) {
        cronometerDecimalsEL.innerText = '00'
        cronometerSecondsEL.innerText = `0${++cronometerSeconds}`.slice(-2)
    }
    if (cronometerSeconds === 60) {
        cronometerSecondsEL.innerText = '00'
        cronometerMinutesEL.innerText = `0${++cronometerMinutes}`.slice(-2)
    }
    if (cronometerMinutes === 60) {
        cronometerMinutesEL.innerText = '00'
        cronometerMinutesEL.innerText = `0${++cronometerHours}`.slice(-2)
    }
}


function startCronometer(calculateDifference=false) {
    const dataColections = 
        [ [cronometerStopperEL, 'remove'], [cronometerStarterEL, 'add'], [cronometerDivButtonWrapperEL, 'add'], [storedValuesContainerEL, 'add'] ]

    toggleClasses(dataColections, ['disabled-element', 'reduce-margin'], '2')

    if (calculateDifference && !cronometerTimeout) {    // it won't allow to create multiples timeouts/intervals.
        const difference = 10 - cronometerDecimalsEL.innerText.slice(1)
        
        cronometerTimeout = setTimeout(() => {
            updateCronometer()
            
            cronometerInterval = setInterval(updateCronometer, 10)
        } , difference)
    }

    else if (!cronometerInterval) {
        cronometerInterval = setInterval(updateCronometer, 10)
    }
}


function stopCronometer() {
    const dataCollections = 
        [ [cronometerStopperEL, 'add'], [cronometerDivButtonWrapperEL, 'remove'], [storedValuesContainerEL, 'remove'] ]

    toggleClasses(dataCollections, ['disabled-element', 'reduce-margin'], '1')

    clearTimeout(cronometerTimeout)
    clearInterval(cronometerInterval)
    cronometerTimeout = null
    cronometerInterval = null
}


function resetCronometer(activeCronometerStarterButton=false) {
    clearTimeout(cronometerTimeout)
    clearInterval(cronometerInterval)
    cronometerTimeout = null
    cronometerInterval = null

    cronometerDecimalsEL.innerText = '00'
    cronometerSecondsEL.innerText = '00'
    cronometerMinutesEL.innerText = '00'
    cronometerHoursEL.innerText = '00'

    if (activeCronometerStarterButton) {
        cronometerStarterEL.classList.remove('disabled-element')
    }
    else {
        cronometerStopperEL.classList.add('disabled-element')
    }

    const dataCollections = [ [cronometerDivButtonWrapperEL, 'add'], [storedValuesContainerEL, 'add'] ]

    toggleClasses(dataCollections, ['disabled-element', 'reduce-margin'], '0')

    globalTotalTurns = 0
    storedValuesEL.innerHTML = ''
}


function restartCronometer() {
    resetCronometer(false)
    startCronometer()
}



function handleInput(event, index) {
    const inputEL = event.target
    const inputContent = inputEL.value
    const isNegative = inputContent < 0
    const isGreaterThan60 = inputContent > 60
    const isANumber = (+inputContent) || '00'.includes(inputContent) ? true : false

    if (index === 2 && isANumber) {     // Allows to insert bigger values in the hour's input.
        timerStoredTimes[index] = inputEL.value
        return
    }
    else if (index === 2) {
        inputEL.value = timerStoredTimes[index]
        timerStoredTimes[index] = inputEL.value
        return
    }

    if (inputContent.length > 2 || isNegative || isGreaterThan60 || !isANumber) {
        inputEL.value = timerStoredTimes[index]
    }

    timerStoredTimes[index] = inputEL.value
}


function updateTimer() {
    let timerSeconds = timerSecondsEL.value
    let timerMinutes = timerMinutesEL.value
    let timerHours = timerHoursEL.value

    timerSecondsEL.value = `0${--timerSeconds}`.slice(-2)

    if (timerSeconds === -1) {
        timerMinutesEL.value = `0${--timerMinutes}`.slice(-2)
        timerSecondsEL.value = '59'
    }

    if (timerMinutes === -1) {
        timerHoursEL.value = timerHours > 99 ? --timerHours : `0${--timerHours}`.slice(-2)
        timerMinutesEL.value = '59'
    }

    if (timerSeconds + timerMinutes + timerHours == 0) {
        const dataCollections = [ [timerStarterEL, 'remove'], [timerStopperEL, 'add'] ]

        clearInterval(timerInterval)
        toggleClasses(dataCollections, ['disabled-element'], '1')
        return
    }
}

function parseAndStoreInputsValues() {
    timerInputsArray.forEach((inputEL, index) => {
        const inputContent = inputEL.value
        const inputLength = inputContent.length
    
        inputEL.value = inputLength < 2 ? '00'.slice(-(2 - inputLength)) + inputContent : inputContent

        if (index === 2 && parseInt(inputContent, 10) > 9) {    // Removes leanding zeros from hour's input
            inputEL.value = parseInt(inputContent, 10)
        }
    })

    globalTimerValue = [timerHoursEL.value, timerMinutesEL.value, timerSecondsEL.value]
}


function startTimer() {
    if (timerSecondsEL.value + timerMinutesEL.value + timerHoursEL.value != 0) {
        const dataCollections = 
            [ [timerStarterEL, 'add'], [timerStopperEL, 'remove'], [timerDivButtonWrapperEL, 'add'] ]

        toggleClasses(dataCollections, ['disabled-element'], '2')

        if (!timerInterval) {
            timerInterval = setInterval(updateTimer, 1000)
        }
    }
}


function stopTimer() {
    const dataCollections = 
        [ [timerStopperEL, 'add'], [timerDivButtonWrapperEL, 'remove']]

    toggleClasses(dataCollections, ['disabled-element'], '1')

    clearInterval(timerInterval)
    timerInterval = null
}


function resetTimer(activeTimerStarterButton) {
    clearInterval(timerInterval)
    timerInterval = null

    timerSecondsEL.value = globalTimerValue[2]
    timerMinutesEL.value = globalTimerValue[1]
    timerHoursEL.value = globalTimerValue[0]

    timerDivButtonWrapperEL.classList.add('disabled-element')

    if(activeTimerStarterButton) {
        timerStarterEL.classList.remove('disabled-element')
    }
    else {
        timerStopperEL.classList.remove('disabled-element')
    }
}


function restartTimer() {
    resetTimer(true)
    startTimer(true)
}


valueStorerEL.addEventListener('click', storeValue)

funcionalityChangerButtonELs.forEach((buttonEL, buttonIndex) => {
    buttonEL.addEventListener('click', () => changeFuncionality(buttonIndex))
})


cronometerStarterEL.addEventListener('click', () => startCronometer(false))

cronometerStopperEL.addEventListener('click', stopCronometer)

cronometerContinuerEL.addEventListener('click', () => startCronometer(true))

cronometerReseterEL.addEventListener('click', () => resetCronometer(true))

cronometerRestarterEL.addEventListener('click', restartCronometer)


timerInputsArray.forEach((inputEL, index) => 
    inputEL.addEventListener('input', () => handleInput(event, index)))

timerStarterEL.addEventListener('click', () => {
    parseAndStoreInputsValues()
    startTimer()
})

timerStopperEL.addEventListener('click', stopTimer)

timerContinuerEL.addEventListener('click', startTimer)

timerReseterEL.addEventListener('click', () => resetTimer(true))

timerRestarterEL.addEventListener('click', restartTimer)


window.addEventListener('resize', () => {
    changeFuncionalityRowPosition(globalButtonIndex)
    slideToFuncionality(globalButtonIndex)
})
