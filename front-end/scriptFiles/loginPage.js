

// -------------------------------------------  Background PART  ---------------------------------------------------------

const pre = document.getElementById("background");  // select background
const chars = ".,-~:;=!*#$@";                       // list of char

function spawnVerticalString() {                    // this function will spawn exactly 1 falling varticle line per 1 call
  pre.style.position = "relative";                  
  pre.style.overflow = "hidden";                    // if its off screen then hide it

  const x = Math.random() * pre.clientWidth;        // select a random point on X-Axis
  const length = Math.floor(Math.random() * 8) + 4; // random 4-12 char as its line length

  const container = document.createElement("div");  // container
  container.className = "char";
  container.style.position = "absolute";
  container.style.left = `${x}px`;
  container.style.top = `0px`;
  pre.appendChild(container);                       // append the empty container to screen

  let currentY = 0;                                 // set starting position on top
  const spans = [];                                 // array to collect all the symbol

  // create the vertical string
  for (let i = 0; i < length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];   // get random char from char list
    const span = document.createElement("div");                     //--------------
    span.textContent = char;                                        //      |
    span.style.position = "absolute";                               // set attribute
    span.style.bottom = `${currentY}px`;                            //      |
    span.style.color = "#0f0";                                    //--------------
    container.appendChild(span);                                    // append to container
    spans.push(span);                                               // push that char into array
    currentY += 20;                                                 // change Y-Axis
  }

  
  let pos = 0;                                                      // current y position 
  const fallSpeed = 2 + Math.random() * 2;                          // make each line have unique fall speed

  function animate() {                                              // function that deal with falling
    pos += fallSpeed;                                               // self explainatory
    container.style.top = `${pos}px`;                               // update the y position to match the pos variable

    // Randomly change some symbols each update
    for (let span of spans) {
      if (Math.random() < 0.05) {                                           // 5% chance per frame for each char to change
        span.textContent = chars[Math.floor(Math.random() * chars.length)]; // change that char to some random char
      }
    }

    if (pos > pre.clientHeight + currentY) {                        // if off screen
      container.remove();                                           // remove it
    } else {                                                        // else
      requestAnimationFrame(animate);                               // do another animation update
    }
  }

  animate();
}


setInterval(spawnVerticalString, 200);                              // spawn once every 0.2 second




// -----------------------------------------------  Button Response  -----------------------------------------------------

// this function set the foreground to be in login format
// by rewrite its innerHTML
function showLogin() {

    const fg = document.getElementById("foreground");
    fg.classList.add("rounded-square");


    // set login content
    fg.innerHTML = `
        <h1>Login</h1>
        

        <div style="width=60%; text-align: left; padding: 0 20%">

            <label class="my-text">Username:</label><br>
            <input id="username" type="text" placeholder="Username" class="my-form" /><br>

            <label class="my-text">Password:</label><br>
            <input id="password" type="password" placeholder="Password" class="my-form" /><br>
            
        </div>

        <label id="warning" style="color: red; font-size: 20px;"></label><br><br>


        <button class="my-button" onclick="backToNormal()">Back</button>
        <button class="my-button" onclick="loginSystem()">Login</button>
    `;

    fg.classList.add("active");
    fg.style.color = "#000000"
}


// this function set the foreground to be in register format
// by rewrite its innerHTML
function showRegister() {

    const fg = document.getElementById("foreground");
    fg.classList.add("rounded-square");
    
    // set Register content
    fg.innerHTML = `
        <h1>Register</h1>


        <div style="width=60%; text-align: left; padding: 0 20%">

            <label class="my-text">Username:</label><br>
            <input id="username" type="text" placeholder="Username" class="my-form" /><br>

            <label class="my-text">Password:</label><br>
            <input id="password" type="password" placeholder="Password" class="my-form" /><br>

            <label class="my-text">Confirm Password:</label><br>
            <input id="confirmPassword" type="password" placeholder="Confirm Password" class="my-form" /><br>

        </div>

        <label id="warning" style="color: red; font-size: 20px;"></label><br><br>


        <button class="my-button" onclick="backToNormal()">Back</button>
        <button class="my-button" onclick="registerSystem()">Register</button>
    `;

    fg.classList.add("active");
    fg.style.color = "#000000"
}


// this function set the foreground to be in default format
// by rewrite its innerHTML
function backToNormal() {
    const fg = document.getElementById("foreground");
    fg.style.color = "#ffffff"
    fg.classList.remove("rounded-square");
    fg.classList.remove("active");
    

    // restore original content
    fg.innerHTML = `
        <h1>Hello World!</h1>
        <button class="my-button" onclick="showLogin()">Login</button>
        <button class="my-button" onclick="showRegister()">Sign In</button>
    `;
}



function loginSystem() {
    const nameObj = document.getElementById("username");
    const passObj = document.getElementById("password");
    const warnObj = document.getElementById("warning");

    if (nameObj.value === "" || passObj.value === "") {
        warnObj.textContent = "*Please fill all the forms.";
        return;
    }

    fetch("http://127.0.0.1:8000/login", {
        method: "POST",                     //send over username and password for databse to check
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: nameObj.value,
            password: passObj.value
        })
    })
    .then(response => {
        if(!response.ok)  //check for response
        {
            return response.json().then(error => {throw error;});
        }
        return response.json();
    })
    .then(data => {
        console.log("Login Sucessful: ", data); //valid
        window.location.href = "/home.html?user=" + encodeURIComponent(nameObj.value);
    })
    .catch(error => {
        warnObj.textContent = error.detail;
    })
}


function registerSystem() 
{
    const nameObj = document.getElementById("username");
    const passObj = document.getElementById("password");
    const cPassObj = document.getElementById("confirmPassword");
    const warnObj = document.getElementById("warning");

    if (nameObj.value === "" || passObj.value === "" || cPassObj.value === "") {
        warnObj.textContent = "*Please fill all the forms.";
        return;
    }
    if (passObj.value !== cPassObj.value) {
        warnObj.textContent = "*Confirm Password doesn't match with Password.";
        return;
    }

    fetch("http://127.0.0.1:8000/register", {
        method: "POST",                         
        headers: { "Content-Type":"application/json"},
        body:JSON.stringify({              //post over the username and password to the database 
            username:nameObj.value,
            password:passObj.value
        })
    })
    .then(response => {  //check for response
        if(!response.ok)
        {
            return response.json().then(error => {throw error;});
        }
        return response.json
    })
    .then(data => { //response valid, send to homepage
        console.log("User registered:", data);
        window.location.href = "/home.html?user=" + encodeURIComponent(nameObj.value);
    })
    .catch(error => {
        warnObj.textContent = "Username already exist";
    })
    
}

