/* globals */
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var LINE_WIDTH;
var RADIUS;

/**
 * draws the clock on the canvas: this function is meant to be called repetitively
 **/
function drawClock()
{
    // access the canvas & context
    var canvas = document.getElementById("clockCanvas");
    var context = canvas.getContext("2d");
    
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw hands
    drawHands(context);
    
    // draw hashes
    drawHashes(context);
    
    // draw outer circle
    drawOuterCircle(context);
}

/**
 * sets up the clock to redraw every second
 **/
function setup()
{
    // window.setInterval() will call the draw function every 1000 ms (1 sec)
    resize();
    drawClock();
    window.setInterval(drawClock, 1000);
}

/**
 * loads global variables
 **/
function loadVariables()
{
    CANVAS_WIDTH = document.getElementById("clockCanvas").width;
    CANVAS_HEIGHT = document.getElementById("clockCanvas").height;
    LINE_WIDTH = Math.floor(0.025 * CANVAS_WIDTH); //2.5% of the canvas width rounded down
    RADIUS = Math.floor(0.475 * CANVAS_WIDTH); // 47.5% of the canvas width, rounded down
}

/**
 * draws a line on the canvas
 * 
 * @param pointer to context
 * @param stroke style of the line
 * @param line width
 * @param starting x coordinate
 * @param starting y coordinate
 * @param ending x coordinate
 * @param ending y coordinate
 **/
function drawLine(context, strokeStyle, lineWidth, startX, startY, endX, endY)
{
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(startX, startY);
    context.strokeStyle = strokeStyle;
    context.lineTo(endX, endY);
    context.stroke();
}

/**
 * draws the hashes on the clock
 *
 * @param pointer to the context
 **/
function drawHashes(context)
{
    // translate the origin to the center of the canvas
    context.save();
    context.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    for(var i = 0; i < 60; i++)
    {
        // calculate the starting & ending points of the hashes
        var theta = (Math.PI * i) / 30.0;
        var startX = Math.floor((0.85 * RADIUS) * Math.cos(theta));
        var startY = Math.floor((-0.85 * RADIUS) * Math.sin(theta));
        var endX = Math.floor(RADIUS * Math.cos(theta));
        var endY = Math.floor(-RADIUS * Math.sin(theta));
        
        // set the line width to 25%, unless it's on the 5 minute mark
        var lineWidth = Math.floor(LINE_WIDTH / 4.0);
        if(i % 5 === 0)
        {
            lineWidth = LINE_WIDTH;
        }
        drawLine(context, "black", lineWidth, startX, startY, endX, endY);
    }
    context.restore();
}

/**
 * draw the hands on the clock
 * @param pointer to context
 **/
function drawHands(context)
{
    // move the origin (0, 0) to the center of the clock
    context.save();
    context.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // get the current time
    var now = new Date();
    var hour = now.getHours() + now.getMinutes() / 60.0; // we use a fractional hour to gradually move the hour hand
    var minute = now.getMinutes();
    var second = now.getSeconds();
    
    // calculates the end point of the hour hand
    var thetaHour = (Math.PI * hour) / 6.0;
    var xHour = Math.floor((-0.65 * RADIUS) * Math.cos(thetaHour + Math.PI / 2.0));
    var yHour = Math.floor((-0.65 * RADIUS) * Math.sin(thetaHour + Math.PI / 2.0));
    
    // calculate the end point of the minute hand
    var thetaMinute = (Math.PI * minute) / 30.0;
    var xMinute = Math.floor((-0.8 * RADIUS) * Math.cos(thetaMinute + Math.PI / 2.0));
    var yMinute = Math.floor((-0.8 * RADIUS) * Math.sin(thetaMinute + Math.PI / 2.0));
    
    // calculate the end point of the second hand
    var thetaSecond = (Math.PI * second) / 30.0;
    var xSecond = Math.floor((-0.8 * RADIUS) * Math.cos(thetaSecond + Math.PI / 2.0));
    var ySecond = Math.floor((-0.8 * RADIUS) * Math.sin(thetaSecond + Math.PI / 2.0));
    
    // draw the hands on the canvas
    drawLine(context, "black", LINE_WIDTH, 0, 0, xHour, yHour);
    drawLine(context, "black", LINE_WIDTH, 0, 0, xMinute, yMinute);
    drawLine(context, "red", LINE_WIDTH / 2.0, 0, 0, xSecond, ySecond);
    
    // undo the re-centering of the origin
    context.restore();
}

/**
 * draws the outer circle of the clock
 *
 * @param pointer to the context
 **/
function drawOuterCircle(context)
{
    context.moveTo(0, 0);
    context.strokeStyle = "blue";
    context.beginPath();
    context.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, RADIUS, 0.0, 2.0 * Math.PI);
    context.lineWidth = LINE_WIDTH;
    context.stroke();
}

/**
 * callback function for the resize event
 **/

function resize()
{
    // start with 95% viewport
    var newWidth = Math.floor(0.95 * window.innerWidth);
    var newHeight = Math.floor(0.95 * window.innerHeight);
    
    // make a square canvas using the smaller of the new width and height
    if (newWidth < newHeight)
    {
        newHeight = newWidth;
    }
    else
    {
      newWidth = newHeight;
    }
    
    // if the edges are odd decrease the size by one pixwl
    if (newWidth % 2 === 1)
    {
        newWidth--;
        newHeight--;
    }
    
    //resize the canvas & load variables
    var canvas = document.getElementById("clockCanvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    loadVariables();
}



