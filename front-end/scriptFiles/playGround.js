let params = new URLSearchParams(window.location.search);
let accountUsername = params.get("user");
let courseId = params.get("languageId");


const navBar = document.getElementById("navBar");
const mainArea = document.getElementById("mainArea");
const result = document.getElementById("result");
const navBtn = document.getElementById("navToggleButton");
const courseLinks = document.getElementById("courseLink");
const langSelector = document.getElementById("langId");


let langID = {
    "Rust":108,
    "Python":109,
    "C++":105
}



// ----------------------- Code Mirror ------------------------

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


let courses;
fetch("/data/course/courseList.json")
    .then(response => response.json())  // parse JSON
    .then(data => {
        if (data) {
            courses = data;
            loadCoursesData();
        }

        else {
            courses = null;
        }
    })
    .catch(error => console.error("Error loading JSON:", error));



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
    for (let i = 0; i < courses.length; i++) {
        // ------------- btn for hyperLink ------------
        const btn = document.createElement("button");

        btn.classList.add("courseButtonStyle");
        btn.textContent = courses[i].CourseName;

        btn.addEventListener("click", () => {
            location.href = "/static/pages/courses.html?user="
                + encodeURIComponent(accountUsername)
                + "&courseName=" + encodeURIComponent(courses[i].CourseName)
                + "&courseId=" + encodeURIComponent(courses[i].CourseId);
        });

        courseLinks.appendChild(btn);


        // -------------- option for lang selector ---------------
        const opt = document.createElement("option");
        opt.value = courses[i].CourseId;
        opt.textContent = courses[i].CourseName;

        langSelector.add(opt);
    }
}


function goHome() {
    window.location.href = "/home.html?user=" + encodeURIComponent(accountUsername);
}


async function run() {
    let btn = document.getElementsByClassName("runBtn");
    btn.disabled = true;
    const code = editor.getValue();
    console.log(code);
    console.log(langID[langSelector.options[langSelector.selectedIndex].text]);
    try {
        const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',}
        ,body: JSON.stringify({
                langID: langID[langSelector.options[langSelector.selectedIndex].text],
                srcCode: code
            })
        });

        if (!response.ok) {
            result.textContent = 'HTTP error! status: ' + response.status;
            btn.disabled = false;
            throw new Error('HTTP error! status: ' + response.status);
        }

        const data = await response.json();
        
        if (data['id'] == 0){
            result.textContent = 'Compile error! \nError Discription: ' + data['error'];
            btn.disabled = false;
        }
        else{
            result.textContent = data['output'];
            btn.disabled = false;
        }
        console.log(data);
        btn.disabled = false;

    } catch (error) {
        console.error('Fetch error:', error);
    }
}






navEnable();