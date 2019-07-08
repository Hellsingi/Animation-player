let board = document.querySelector('#canvas'); //board for render elements
let animationBoard = document.querySelector('.screen'); ///board for animation
let framesBoard = document.querySelector('#frames'); ///board for render frames
let addBtnFrame = document.querySelector('.btn_new_frame');
let btnFpsChange = document.querySelectorAll('.btn');
let sliderFpsChange = document.querySelector('#range');
let currFpsScreen = document.querySelector('.currFpsValue');
let currentFrame = 0;
let currentFps = 2;
let timer; //var for setInterval
let count = 0; //for setInterval
let func = null;
let framesArr = []; //array with frames
framesArr.push(defaultElementData());

//init tools btns
let bucketTool = document.querySelector('.bucket');
let colorTool = document.querySelector('.colorful');
let transformTool = document.querySelector('.transform');

//flags. can use only one button
let toolFlags = [false, false, false, false];

//just variables for color data
let arrayColors = ['#008000', '#ffffff'];

///init colors btns
let currColorTool = document.querySelector('.curr');
let prevColorTool = document.querySelector('.prev');
let chooseColor = document.querySelector('#chooseColor'); ///input type color
let labelForColor = document.querySelector('.colorful');
let colorBoard = document.querySelectorAll('.color');
let colorHtml = document.querySelector('.colors');

/////////////////////////RENDER FUNCTIONAL/////////////////////////////////
function renderElem() {
    stopAnimation();

    if (framesArr.length === 0) {
        board.innerHTML = '';
        framesBoard.innerHTML = '';
        animationBoard.innerHTML = '';
        framesArr.push(defaultElementData());
        currentFrame = 0;

        framesArr.forEach((item, index) => createElementForFrames(item, index));

        createElementColor(arrayColors[0], arrayColors[1]);

        framesArr[currentFrame].forEach(item =>
            createElement(item.id, item.color, item.form, func)
        );

        framesArr.forEach((item, index) => createAnimation(item, index));

        renderBtn();
        animationStart();
    } else {
        if (framesArr.length > 3) {
            board.innerHTML = '';
            framesBoard.innerHTML = '';
            animationBoard.innerHTML = '';

            framesArr.forEach((item, index) => createElementForFrames(item, index));

            createElementColor(arrayColors[0], arrayColors[1]);

            framesArr[currentFrame].forEach(item =>
                createElement(item.id, item.color, item.form, func)
            );

            framesArr.forEach((item, index) => createAnimation(item, index));

            animationStart();
        } else {
            board.innerHTML = '';
            framesBoard.innerHTML = '';
            animationBoard.innerHTML = '';

            framesArr.forEach((item, index) => createElementForFrames(item, index));

            createElementColor(arrayColors[0], arrayColors[1]);

            framesArr[currentFrame].forEach(item =>
                createElement(item.id, item.color, item.form, func)
            );

            framesArr.forEach((item, index) => createAnimation(item, index));

            renderBtn();
            animationStart();
        }
    }
}

function renderBtn() {
    let btn = document.createElement('button');
    btn.setAttribute('class', 'btn_new_frame');
    btn.onclick = addFrames;

    let icon = document.createElement('i');
    icon.setAttribute('class', 'fas fa-plus');
    btn.appendChild(icon);

    let span = document.createElement('span');
    span.textContent = 'Add new frame';
    btn.appendChild(span);

    framesBoard.appendChild(btn);
}

function createElement(id, color, form, func) {
    //creating elements for render
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'element');
    mainDiv.setAttribute('id', id);
    mainDiv.style.cssText = `
        width: 30%;
        height: 30%;
        background-color: ${color};
        border-radius: ${form}%`;
    board.appendChild(mainDiv);
    mainDiv.onclick = func;
}

function createElementForFrames(frame, index) {
    //creating element for frames

    let superMainDiv = document.createElement('div');
    superMainDiv.setAttribute('class', 'frame');
    superMainDiv.setAttribute('id', index);
    frame.forEach(item => createFromFrames(superMainDiv, item.id, item.color, item.form));
    superMainDiv.onclick = frameClickFunc;

    let idFrame = document.createElement('div');
    idFrame.textContent = +superMainDiv.id + 1;
    idFrame.setAttribute('class', 'frame_tool');
    superMainDiv.appendChild(idFrame);

    let deleteframe = document.createElement('div');
    deleteframe.innerHTML = `<i class="fas fa-trash-alt" />`;
    deleteframe.setAttribute('class', 'frame_tool frame_delete');
    deleteframe.onclick = function() {
        framesArr.splice(index, 1);
        renderElem();
    };
    superMainDiv.appendChild(deleteframe);

    let copyFrame = document.createElement('div');
    copyFrame.innerHTML = `<i class="far fa-copy"></i>`;
    copyFrame.setAttribute('class', 'frame_tool frame_copy');
    copyFrame.onclick = function() {
        stopAnimation();
        if (framesArr.length > 3) {
            alert('Reached a high number of frames.');
        } else {
            framesArr.splice(index + 1, 0, copyArrFunc(framesArr[index]));
            renderElem();
        }
    };
    superMainDiv.appendChild(copyFrame);
    ///Choosing Active frame
    if (superMainDiv.id === currentFrame) {
        superMainDiv.classList.add('frame_active');
    }

    framesBoard.appendChild(superMainDiv);
}

function createFromFrames(board, id, color, form) {
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'frame_element');
    mainDiv.setAttribute('id', id);
    mainDiv.style.cssText = `
        background-color: ${color};
        border-radius: ${form}%`;
    board.appendChild(mainDiv);
}

function createElementColor(curr, prev) {
    colorHtml.style.display = 'block';
    colorBoard.forEach(item => (item.innerHTML = ''));
    //creating colors for render
    ///for current color
    let currDiv = document.createElement('div');
    currDiv.setAttribute('class', 'circle');
    currDiv.style.backgroundColor = curr;
    currColorTool.appendChild(currDiv);
    ///for previous color
    let prevDiv = document.createElement('div');
    prevDiv.setAttribute('class', 'circle');
    prevDiv.style.backgroundColor = prev;
    prevColorTool.appendChild(prevDiv);
}

function createAnimation(frame, index) {
    let superMainDiv = document.createElement('div');
    superMainDiv.setAttribute('class', 'frame_animation');
    superMainDiv.setAttribute('id', index);
    frame.forEach(item => createAnimationFrames(superMainDiv, item.id, item.color, item.form));
    animationBoard.appendChild(superMainDiv);
}

function createAnimationFrames(board, id, color, form) {
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'frame_element_animation');
    mainDiv.setAttribute('id', id);
    mainDiv.style.cssText = `
        background-color: ${color};
        border-radius: ${form}%`;
    board.appendChild(mainDiv);
}

//////////////////////////// ANIMATION FUNCTIOMAL //////////////////////
function animationStart() {
    timer = setInterval(animationFrame, 1000 / currentFps);
}

function stopAnimation() {
    clearInterval(timer);
}

function animationFrame() {
    if (count < framesArr.length) {
        console.log(count);
        console.log(framesArr.length);
        if (count > 0) {
            animationBoard.children[count - 1].style.display = 'none';
            animationBoard.children[count].style.display = 'flex';
            count++;
        } else {
            animationBoard.children[count].style.display = 'flex';
            count++;
        }
    } else {
        animationBoard.childNodes.forEach((item, index) => {
            if (index !== 0) {
                item.style.display = 'none';
            }
        });
        count = 0;
    }
}

///////////////////////// TOOLS FUNCTIONAL ////////////////////////
function sliderChangeFunc() {
    stopAnimation();
    currentFps = sliderFpsChange.value;
    currFpsScreen.textContent = currentFps;
    animationStart();
}

function fpsChange(e) {
    stopAnimation();
    currentFps = e.target.dataset.fps;
    sliderFpsChange.value = currentFps;
    currFpsScreen.textContent = currentFps;
    animationStart();
}

function addFrames() {
    stopAnimation();
    if (framesArr.length > 2) {
        alert('Reached a high number of frames.');
        framesArr.push(defaultElementData());
        renderElem();
    } else {
        framesArr.push(defaultElementData());
        renderElem();
    }
}

function frameClickFunc(e) {
    if (e.target.className == 'frame') {
        currentFrame = +e.target.id;
        renderElem();
    }
}

function defaultElementData() {
    let arr = [];
    for (let i = 0; i < 9; i++) {
        let obj = {
            id: i,
            color: i % 2 !== 0 ? '#bdbdbd' : '#cccccc',
            form: 0
        };
        arr.push(obj);
    }
    return arr;
}

function copyArrFunc(oldArr) {
    let arr = [];
    for (let i = 0; i < oldArr.length; i++) {
        let obj = {
            id: oldArr[i].id,
            color: oldArr[i].color,
            form: oldArr[i].form
        };
        arr.push(obj);
    }
    return arr;
}

function colorToolFunc() {
    //COLOR BUTTON
    console.log(toolFlags);
    if (toolFlags[1] == true || toolFlags[2] == true || toolFlags[0] == true) {
        alert('Two tools included, select one');
        return;
    }
    console.log('color on');
    arrayColors[1] = arrayColors[0];
    arrayColors[0] = chooseColor.value;
    renderElem();
}

function bucketToolFunc() {
    //BUCKET BUTTON
    if (toolFlags[1] == true || toolFlags[2] == true || toolFlags[3] == true) {
        alert('Two tools included, select one');
        return;
    }

    toolFlags[0] ? (toolFlags[0] = false) : (toolFlags[0] = true);
    function bucketFuncForElem(e) {
        framesArr[currentFrame][e.target.id].color = arrayColors[0];
        func = bucketFuncForElem;
        renderElem();
    }

    if (toolFlags[0]) {
        bucketTool.style.backgroundColor = '#ebebeb';
        func = bucketFuncForElem;
        renderElem();
        console.log('Bucket tool --- on');
    }

    if (!toolFlags[0]) {
        bucketTool.removeAttribute('style');
        func = null;
        renderElem();
        console.log('Bucket tool --- off');
    }
}

function transformToolFunc() {
    //TRANSFORM BUTTON
    if (toolFlags[0] == true || toolFlags[2] == true || toolFlags[3] == true) {
        alert('Two tools included, select one');
        return;
    }
    toolFlags[1] ? (toolFlags[1] = false) : (toolFlags[1] = true);

    function transformToolFuncForElem(e) {
        if (framesArr[currentFrame][e.target.id].form == 0) {
            framesArr[currentFrame][e.target.id].form = 50;
        } else {
            framesArr[currentFrame][e.target.id].form = 0;
        }
        func = transformToolFuncForElem;
        renderElem();
    }

    if (toolFlags[1]) {
        transformTool.style.backgroundColor = '#ebebeb';
        func = transformToolFuncForElem;
        renderElem();
        console.log('Transform tool --- on');
    }

    if (!toolFlags[1]) {
        transformTool.removeAttribute('style');
        func = null;
        renderElem();
        console.log('Transform tool --- off');
    }
}

////////////////////Tools Buttons/////////////////////////////
btnFpsChange.forEach(item => (item.onclick = fpsChange));
sliderFpsChange.onchange = sliderChangeFunc;
bucketTool.onclick = bucketToolFunc;
transformTool.onclick = transformToolFunc;
colorTool.onclick = () => chooseColor.click();
chooseColor.onchange = colorToolFunc;

////////////////////Colors Buttons//////////////////////////
prevColorTool.onclick = () => {
    if (toolFlags[0]) {
        alert('Two tools included, select one');
        return;
    }
    arrayColors[0] = arrayColors[1];
    renderElem();
};
/////////////////////START APP/////////////////////////////
renderElem();