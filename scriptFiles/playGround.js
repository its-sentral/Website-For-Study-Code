let params = new URLSearchParams(window.location.search);
let accountUsername = params.get("user");
let courseId = params.get("languageId");


const navBar = document.getElementById("navBar");
const mainArea = document.getElementById("mainArea");
const navBtn = document.getElementById("navToggleButton");
const courseLinks = document.getElementById("courseLink");
const langSelector = document.getElementById("langId");






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
            location.href = "/pages/courses.html?user="
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
    window.location.href = "home.html?user=" + encodeURIComponent(accountUsername);
}


function run() {
    
}






navEnable();