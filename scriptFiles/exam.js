let params = new URLSearchParams(window.location.search);
let accountUsername = params.get("user");
let courseId = params.get("languageId");
let questionId = params.get("id");


const navBar = document.getElementById("navBar");
const mainArea = document.getElementById("mainArea");
const navBtn = document.getElementById("navToggleButton");
const courseLinks = document.getElementById("courseLink");
const langSelector = document.getElementById("langId");
const probTitle = document.getElementById("problemTitle");
const probDetail = document.getElementById("problemDetail");
const resultLabel = document.getElementById("resultLabel");
const result = document.getElementById("result");
const resultDiv = document.getElementById("resultDiv");



// --------------------- Code Mirror ----------------------
let modeTxt = {
    "Rust" : "text/x-rustsrc",
    "Python" : "text/x-python",
    "C++" : "text/x-c++src"
};

langSelector.addEventListener("change", (e) => {
    editor.setOption("mode", modeTxt[langSelector.options[langSelector.selectedIndex].text]);
});

let myTextarea = document.getElementById("codeArea");
var editor = CodeMirror.fromTextArea(myTextarea, {
    mode: modeTxt["Python"],
    theme: "dracula",
    extraKeys: {"Ctrl-Space": "autocomplete"},

    lineNumbers: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    indentUnit: 4,
});




// ---------------------------- fetch course and problem --------------------------
let courses;
let courseName = null;
fetch("/data/course/courseList.json")
    .then(response => response.json())  // parse JSON
    .then(data => {
        if (data) {
            courses = data;
            loadCoursesData();
            fetchQuiz()
        }

        else {
            courses = null;
        }
    })
    .catch(error => console.error("Error loading JSON:", error));

let problem;
function fetchQuiz() {
    const path = "/data/quiz/" + courseName.toLowerCase() + ".json";
    fetch(path)
        .then(response => response.json())  // parse JSON
        .then(data => {
            if (data) {
                problem = data[questionId];
                getQuizData()
            }

            else {
                problem = null;
            }
        })
        .catch(error => console.error("Error loading JSON:", error));
}




// ------------------------------ Get Quiz Data Base On ID --------------------------------------
function getQuizData() {
    probTitle.textContent = problem.Title;
    probDetail.textContent = problem.Description;
}

// ------------------------------- navigation display && selector -------------------------------
function navEnable() {
    navBar.classList.add("navDisplay");
    mainArea.classList.add("navDisplay");
    navBtn.classList.add("navDisplay");
    navBtn.textContent = "<";
    navBtn.onclick = navDisable;
}

function navDisable() {
    navBar.classList.remove("navDisplay");
    mainArea.classList.remove("navDisplay");
    navBtn.classList.remove("navDisplay");
    navBtn.textContent = ">";
    navBtn.onclick = navEnable;
}


function loadCoursesData() {
    var idx = 0;
    for (let i = 0; i < courses.length; i++) {
        // -------------- option for lang selector ---------------
        const opt = document.createElement("option");
        opt.value = courses[i].CourseId;
        opt.textContent = courses[i].CourseName;

        langSelector.add(opt);
        if (courses[i].CourseId == courseId) {
            courseName = courses[i].CourseName
            idx = i;
        }
            
    }

    // ---------- Select lang Base on LangId -------------
    langSelector.selectedIndex = idx; 
}


function goLink(type) {
    if (!type) return;
    if (type == 'back')
        window.location.href = "courses.html?user=" + encodeURIComponent(accountUsername) + "&courseName=" + encodeURIComponent(courseName) + "&courseId=" + encodeURIComponent(courseId);
    else if (type == 'home')
        window.location.href = "home.html?user=" + encodeURIComponent(accountUsername);
    else if (type == 'playground')
        window.location.href = "playGround.html?user=" + encodeURIComponent(accountUsername) + "&languageId=" + encodeURIComponent(courseId);
    
}


function run() {
    
}


function checkAnswer() {
    let flagCorrect = false;
    if (problem.Result == result.value)
        flagCorrect = true
    
    if (flagCorrect) {
        resultDiv.style.backgroundColor = "rgb(48, 213, 50)";
        resultLabel.textContent = "Result Correct!!";
        
    }
    else {
        resultDiv.style.backgroundColor = "#ba2222ff";
        resultLabel.textContent = "Result Incorrect...";
    }
    resultLabel.style.color = "white";
}



navEnable();