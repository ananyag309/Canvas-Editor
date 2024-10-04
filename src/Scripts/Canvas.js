class SnapSortsClass {
    constructor(textVal, canvasFont, color, x, y) {
        this.textVal = textVal;
        this.canvasFont = canvasFont;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}

let mainCanvas = document.getElementById('mainCanvas');
let myCanvas = mainCanvas.getContext("2d");
let textSize = document.getElementById('textSize');
let colorPicker = document.getElementById('colorPicker');
let userForm = document.getElementById('userForm');
let undo = document.getElementById('undoButton');
let redo = document.getElementById('redoButton');

// Initialize variables
let fontName = "Arial";
let fontSize = 20;
let defaultColor = "#000000";
let isBold = false;
let isItalic = false;
let posX = 50;
let posY = 50;

let SnapSorts = [];
let textElements = [];
let index = 0;

// Function to add text element to the array
function addTextElement(text, font, color, x, y) {
    textElements.push({ text, font, color, x, y });
}

// Function to render all text elements on the canvas
function renderAllElements() {
    // Clear the canvas before re-drawing
    myCanvas.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    // Render each text element
    textElements.forEach((element) => {
        myCanvas.font = element.font;
        myCanvas.fillStyle = element.color;
        myCanvas.fillText(element.text, element.x, element.y);
    });
}

// Update canvas when the form is submitted
let updateCanvas = (text, tSize, color, x, y) => {
    fontSize = tSize;
    defaultColor = color;
    let canvasFont = `${isBold ? "bold " : ""}${isItalic ? "italic " : ""}${fontSize}px ${fontName}`;

    if (textElements.length > 0) {
        textElements[textElements.length - 1] = { text, font: canvasFont, color, x, y };
    } else {
        addTextElement(text, canvasFont, color, x, y);
    }

    renderAllElements();
    localStorage.setItem("pos-x", x);
    localStorage.setItem("pos-y", y);
    localStorage.setItem("font-size", fontSize);
    localStorage.setItem("font-color", defaultColor);
};

// Form submit event
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let textVal = e.target.textData.value;
    let textSize = parseInt(e.target.tSize.value);
    let color = e.target.colorPicker.value;
    updateCanvas(textVal, textSize, color, posX, posY);
    SnapSorts.push(new SnapSortsClass(textVal, `${fontSize}px ${fontName}`, color, posX, posY));
    index++;
});

// Undo & Redo functionality
undo.addEventListener('click', () => {
    if (index <= 0) return;
    index--;
    let previousElement = SnapSorts[index];
    updateCanvas(previousElement.textVal, fontSize, previousElement.color, previousElement.x, previousElement.y);
});

redo.addEventListener('click', () => {
    if (index >= SnapSorts.length - 1) return;
    index++;
    let nextElement = SnapSorts[index];
    updateCanvas(nextElement.textVal, fontSize, nextElement.color, nextElement.x, nextElement.y);
});

// Bold & Italic toggle
document.getElementById('bold').addEventListener('click', (e) => {
    e.preventDefault();
    isBold = !isBold;
    updateCanvas(textElements[textElements.length - 1].text, fontSize, defaultColor, posX, posY);
});

document.getElementById('italic').addEventListener('click', (e) => {
    e.preventDefault();
    isItalic = !isItalic;
    updateCanvas(textElements[textElements.length - 1].text, fontSize, defaultColor, posX, posY);
});

// Color picker input event
colorPicker.addEventListener('input', () => {
    defaultColor = colorPicker.value;
    updateCanvas(textElements[textElements.length - 1].text, fontSize, defaultColor, posX, posY);
});

// Capitalize and Lowercase functions
document.getElementById('capital').addEventListener('click', () => {
    textElements[textElements.length - 1].text = textElements[textElements.length - 1].text.toUpperCase();
    renderAllElements();
});

document.getElementById('small').addEventListener('click', () => {
    textElements[textElements.length - 1].text = textElements[textElements.length - 1].text.toLowerCase();
    renderAllElements();
});

// Clear button functionality
document.getElementById('clear').addEventListener('click', (e) => {
    e.preventDefault();
    myCanvas.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    textElements = [];
    SnapSorts = [];
    index = 0;
});

// PDF Download functionality
document.getElementById('download').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = mainCanvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("canvas.pdf");
});

// GSAP animations
window.onload = function () {
    gsap.from(".btn", {
        duration: 1,
        y: -50,
        opacity: 0,
        stagger: 0.2,
        ease: "bounce"
    });

    gsap.from("#mainCanvas", {
        duration: 2,
        scale: 0.5,
        opacity: 0,
        ease: "elastic.out(1, 0.3)"
    });
};
