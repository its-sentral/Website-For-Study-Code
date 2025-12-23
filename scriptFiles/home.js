let params = new URLSearchParams(window.location.search);
let accountUsername = params.get("user");
let isSliding = false;
let isSpinning = false;
const spinDuration = 1000; // fail safe in case spin function bugged

const accountName = document.getElementById("username");
accountName.textContent = accountUsername;
const sliderContainer = document.getElementById('detailBox');
const slider = document.getElementById('slider');
const wheel = document.getElementById('wheel');
let idx = -1;
let rotation = 0;



let courses;
fetch("/data/course/courseList.json")
    .then(response => response.json())  // parse JSON
    .then(data => {
        if (data) {
            courses = data;
        }

        else {
            courses = null;
        }
    })
    .catch(error => console.error("Error loading JSON:", error));








function moveSlider(flag = false, event = null) {
    if (isSliding) return;
    isSliding = true;
    let old = rotation;

    setTimeout(() => {
        let move = false;
        if (!flag && event) {
            const rect = sliderContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;

            const clickX = event.clientX;

            const dx = clickX - centerX;

            console.log(dx);
            if (dx <= -300) { rotation++; move = true; }
            else if (dx >= 300) { rotation--; move = true; }
        }

        if (move)
            slider.style.transform = `perspective(1400px) rotateX(-9deg) rotateY(${rotation * (360 / 5)}deg)` ;

        setTimeout(() => { isSliding = false; }, 50);
    }, 300);
}

sliderContainer.addEventListener('click', (e) => moveSlider(false, e));

// ------------------------------------------ Wheel functionality --------------------------------------------

function spinWheel(auto = false, e = null) {
    if (isSpinning) return;
    isSpinning = true;

    wheel.style.opacity = 1;
    setTimeout(() => {
        let deg;
        let flag = false;

        if (!auto && e) {
            // normal click mode
            const rect = wheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const clickX = e.clientX;
            const clickY = e.clientY;

            const dx = clickX - centerX;
            const dy = clickY - centerY;

            deg = Math.atan2(dy, dx) * (180 / Math.PI);
            deg = (deg + 360) % 360;

            if (deg > 270 && deg < 300) {
                flag = true;
                idx++;
            }
            else if (deg > 60 && deg < 90) {
                flag = true;
                idx--;
            }
                
        } else {
            // have this to set default since it call idx - 1 but we want idx 0 at start
            idx++;
        }

        let tmp = 3 - ((((idx - 1) % 3) + 3) % 3);
        let courseIdx = ((idx % courses.length) + courses.length) % courses.length;
        if (flag || auto)
            updateCourseBox(courseIdx);


        let imgIdx = wheel.querySelector(`img:nth-child(${tmp})`);
        imgIdx.src = courses[courseIdx].CourseDisplay.Logo;

        wheel.style.transform = `rotate(${(idx * 120) + 30}deg)`;

        // fade back in
        setTimeout(() => {
            wheel.style.opacity = 1;
        }, spinDuration - 200);

        setTimeout(() => { isSpinning = false; }, spinDuration + 50);
    }, 400);
}

// click mode
wheel.addEventListener('click', (e) => spinWheel(false, e));

// auto run on page load
window.addEventListener('DOMContentLoaded', () => {
    spinWheel(true);
    moveSlider(true);
});

// transition end fallback
wheel.addEventListener('transitionend', (e) => {
    if (e.propertyName === "transform") {
        isSpinning = false;
    }
});

function updateCourseBox(courseIdx) {
    let courseDetail = courses[((courseIdx % courses.length) + courses.length) % courses.length];

    const courseBoxObj = document.getElementById("courseBox");
    const courseNameObj = document.getElementById("courseName");
    const courseDescObj = document.getElementById("courseDescription");

    courseBoxObj.style.opacity = 0;

    setTimeout(() => {
        courseNameObj.textContent = courseDetail.CourseName;
        courseDescObj.textContent = courseDetail.CourseDescription;

        courseBoxObj.style.background = courseDetail.CourseDisplay.backgroundColor;
        courseBoxObj.style.color = courseDetail.CourseDisplay.textColor
        courseBoxObj.style.opacity = 1;
        courseBoxObj.style.transform = "translate(0%, 0%)";
    }, 250);
}


function beginCourse() {
    let courseIdx = ((idx % courses.length) + courses.length) % courses.length;
    window.location.href = "courses.html?user=" + encodeURIComponent(accountUsername) + "&courseName=" + encodeURIComponent(courses[courseIdx].CourseName) + "&courseId=" + encodeURIComponent(courses[courseIdx].CourseId);
}



// ---------------------- contact part ---------------------------
const blocks = document.querySelectorAll('.contact-block');

// for each element that hold this class do check
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0,
    rootMargin: "0px 0px -20% 0px" // appear a bit before entering, disappear before leaving
});

blocks.forEach(block => observer.observe(block));