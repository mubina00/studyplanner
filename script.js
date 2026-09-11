let currentUser =
    localStorage.getItem("studyFlowCurrentUser") ;

let assignments = [] ;

let currentFilter = "all" ;

let editingIndex = -1 ;

let calendarDate = new Date() ;

let users =
    JSON.parse(localStorage.getItem("studyFlowUsers")) || [] ;



/* Load assignments for current user */

if (currentUser) {

    assignments =
        JSON.parse(
            localStorage.getItem(
                "studyFlowAssignments_" + currentUser
            )
        ) || [] ;

}



/* Login and signup */

function showSignup() {

    let loginBox =
        document.querySelector(".login-box") ;


    loginBox.innerHTML = `

        <h1>StudyFlow</h1>

        <p>Create your account</p>

        <form id="signupForm">

            <input
                type="email"
                id="signupEmail"
                placeholder="Email"
                required
            >

            <input
                type="password"
                id="signupPassword"
                placeholder="Password"
                required
            >

            <button type="submit">
                Create Account
            </button>

        </form>

        <p class="signup-text">

            Already have an account?

            <a href="#" onclick="showLogin()">
                Log in
            </a>

        </p>

    ` ;


    document
        .getElementById("signupForm")
        .addEventListener("submit", createAccount) ;

}



function showLogin() {

    let loginBox =
        document.querySelector(".login-box") ;


    loginBox.innerHTML = `

        <h1>StudyFlow</h1>

        <p>Stay organized. Stay ahead.</p>

        <form id="loginForm">

            <input
                type="email"
                id="email"
                placeholder="Email"
                required
            >

            <input
                type="password"
                id="password"
                placeholder="Password"
                required
            >

            <button type="submit">
                Log In
            </button>

        </form>

        <p class="signup-text">

            Don't have an account?

            <a href="#" onclick="showSignup()">
                Create one
            </a>

        </p>

    ` ;


    document
        .getElementById("loginForm")
        .addEventListener("submit", login) ;

}



function createAccount(event) {

    event.preventDefault() ;


    let email =
        document.getElementById("signupEmail").value ;


    let password =
        document.getElementById("signupPassword").value ;


    let existingUser =
        users.find(function(user) {

            return user.email === email ;

        }) ;


    if (existingUser) {

        alert(
            "An account with this email already exists."
        ) ;

        return ;

    }


    let newUser = {

        email: email,
        password: password

    } ;


    users.push(newUser) ;


    localStorage.setItem(
        "studyFlowUsers",
        JSON.stringify(users)
    ) ;


    alert("Account created successfully!") ;


    showLogin() ;

}



function login(event) {

    event.preventDefault() ;


    let email =
        document.getElementById("email").value ;


    let password =
        document.getElementById("password").value ;


    let user =
        users.find(function(user) {

            return user.email === email &&
                   user.password === password ;

        }) ;


    if (user) {

        localStorage.setItem(
            "studyFlowCurrentUser",
            email
        ) ;


        window.location.href = "index.html" ;

    } else {

        alert("Incorrect email or password.") ;

    }

}



function logout() {

    localStorage.removeItem(
        "studyFlowCurrentUser"
    ) ;


    window.location.href = "login.html" ;

}



/* Add or edit assignment */

function addAssignment(event) {

    event.preventDefault() ;


    let assignmentName =
        document.getElementById("assignmentName").value ;


    let className =
        document.getElementById("className").value ;


    let dueDate =
        document.getElementById("dueDate").value ;


    let priority =
        document.getElementById("priority").value ;


    let assignment = {

        name: assignmentName,
        className: className,
        dueDate: dueDate,
        priority: priority,
        completed: false

    } ;


    if (editingIndex === -1) {

        assignments.push(assignment) ;

    } else {

        assignment.completed =
            assignments[editingIndex].completed ;


        assignments[editingIndex] =
            assignment ;


        editingIndex = -1 ;


        document.getElementById(
            "assignmentButton"
        ).textContent = "Add Assignment" ;


        document.getElementById(
            "formTitle"
        ).textContent = "Add Assignment" ;

    }


    saveAssignments() ;


    document
        .getElementById("assignmentForm")
        .reset() ;


    displayAssignments() ;

}



/* Edit assignment */

function editAssignment(index) {

    let assignment =
        assignments[index] ;


    document.getElementById(
        "assignmentName"
    ).value = assignment.name ;


    document.getElementById(
        "className"
    ).value = assignment.className ;


    document.getElementById(
        "dueDate"
    ).value = assignment.dueDate ;


    document.getElementById(
        "priority"
    ).value = assignment.priority ;


    editingIndex = index ;


    document.getElementById(
        "assignmentButton"
    ).textContent = "Save Changes" ;


    document.getElementById(
        "formTitle"
    ).textContent = "Edit Assignment" ;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    }) ;

}



/* Save assignments */

function saveAssignments() {

    if (!currentUser) {

        return ;

    }


    localStorage.setItem(
        "studyFlowAssignments_" + currentUser,
        JSON.stringify(assignments)
    ) ;

}



/* Display assignments */

function displayAssignments() {

    let assignmentList =
        document.getElementById("assignmentList") ;


    if (!assignmentList) {

        return ;

    }


    assignmentList.innerHTML = "" ;


    let searchInput =
        document.getElementById("searchInput") ;


    let searchText =
        searchInput ?
        searchInput.value.toLowerCase() :
        "" ;


    let filteredAssignments =
        assignments.filter(function(assignment) {


            if (
                currentFilter === "active" &&
                assignment.completed === true
            ) {

                return false ;

            }


            if (
                currentFilter === "completed" &&
                assignment.completed === false
            ) {

                return false ;

            }


            let searchMatch =
                assignment.name.toLowerCase().includes(searchText) ||
                assignment.className.toLowerCase().includes(searchText) ;


            return searchMatch ;

        }) ;


    let sortType =
        document.getElementById("sortSelect") ?
        document.getElementById("sortSelect").value :
        "dueDate" ;


    if (sortType === "dueDate") {

        filteredAssignments.sort(function(a, b) {

            return a.dueDate.localeCompare(b.dueDate) ;

        }) ;

    }


    if (sortType === "name") {

        filteredAssignments.sort(function(a, b) {

            return a.name.localeCompare(b.name) ;

        }) ;

    }


    if (sortType === "priority") {

        let priorityOrder = {

            High: 1,
            Medium: 2,
            Low: 3

        } ;


        filteredAssignments.sort(function(a, b) {

            return priorityOrder[a.priority] -
                   priorityOrder[b.priority] ;

        }) ;

    }


    if (filteredAssignments.length === 0) {

        assignmentList.innerHTML =
            '<p class="empty-message">No assignments to show.</p>' ;

    } else {

        filteredAssignments.forEach(function(assignment) {

            let originalIndex =
                assignments.indexOf(assignment) ;


            let card =
                document.createElement("div") ;


            card.className =
                "assignment-card" ;


            if (assignment.completed) {

                card.classList.add("completed") ;

            }


            let dueStatus =
                getDueStatus(assignment.dueDate) ;


            let dueText =
                dueStatus.text ;


            let dueClass =
                dueStatus.className ;


            card.innerHTML = `

                <div class="assignment-info">

                    <h3>${assignment.name}</h3>

                    <p>
                        Class: ${assignment.className}
                    </p>

                    <p>
                        Due: ${formatDate(assignment.dueDate)}
                    </p>

                    <p class="${dueClass}">
                        ${dueText}
                    </p>

                    <p class="priority ${assignment.priority.toLowerCase()}">
                        ${assignment.priority} Priority
                    </p>

                </div>


                <div class="assignment-actions">

                    <button
                        class="complete-button"
                        onclick="completeAssignment(${originalIndex})">

                        ${assignment.completed ? "Undo" : "Complete"}

                    </button>


                    <button
                        class="edit-button"
                        onclick="editAssignment(${originalIndex})">

                        Edit

                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteAssignment(${originalIndex})">

                        Delete

                    </button>

                </div>

            ` ;


            assignmentList.appendChild(card) ;

        }) ;

    }


    updateStats() ;

    displayCalendar() ;

}



/* Complete assignment */

function completeAssignment(index) {

    assignments[index].completed =
        !assignments[index].completed ;


    saveAssignments() ;


    displayAssignments() ;

}



/* Delete assignment */

function deleteAssignment(index) {

    assignments.splice(index, 1) ;


    saveAssignments() ;


    displayAssignments() ;

}



/* Filter assignments */

function filterAssignments(filter) {

    currentFilter =
        filter ;


    displayAssignments() ;

}



/* Search */

function searchAssignments() {

    displayAssignments() ;

}



/* Dashboard statistics */

function updateStats() {

    let activeAssignments =
        assignments.filter(function(assignment) {

            return assignment.completed === false ;

        }) ;


    let completedAssignments =
        assignments.filter(function(assignment) {

            return assignment.completed === true ;

        }) ;


    document.getElementById(
        "totalCount"
    ).textContent = assignments.length ;


    document.getElementById(
        "activeCount"
    ).textContent = activeAssignments.length ;


    document.getElementById(
        "completedCount"
    ).textContent = completedAssignments.length ;


    document.getElementById(
        "remainingCount"
    ).textContent = activeAssignments.length ;

}



/* Date formatting */

function formatDate(dateString) {

    let date =
        new Date(dateString + "T00:00:00") ;


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    ) ;

}



/* Due date status */

function getDueStatus(dateString) {

    let today =
        new Date() ;


    today.setHours(
        0,
        0,
        0,
        0
    ) ;


    let dueDate =
        new Date(dateString + "T00:00:00") ;


    let difference =
        Math.round(
            (dueDate - today) /
            (1000 * 60 * 60 * 24)
        ) ;


    if (difference < 0) {

        return {
            text: "Overdue",
            className: "due-today"
        } ;

    }


    if (difference === 0) {

        return {
            text: "Due today",
            className: "due-today"
        } ;

    }


    if (difference === 1) {

        return {
            text: "Due tomorrow",
            className: "due-soon"
        } ;

    }


    if (difference <= 3) {

        return {
            text: "Due soon",
            className: "due-soon"
        } ;

    }


    return {
        text: "Upcoming",
        className: ""
    } ;

}



/* Calendar */

function displayCalendar() {

    let calendarDays =
        document.getElementById("calendarDays") ;


    let calendarTitle =
        document.getElementById("calendarTitle") ;


    if (!calendarDays || !calendarTitle) {

        return ;

    }


    let year =
        calendarDate.getFullYear() ;


    let month =
        calendarDate.getMonth() ;


    let firstDay =
        new Date(year, month, 1).getDay() ;


    let daysInMonth =
        new Date(year, month + 1, 0).getDate() ;


    let monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ) ;


    calendarTitle.textContent =
        monthName ;


    calendarDays.innerHTML = "" ;


    for (
        let i = 0 ;
        i < firstDay ;
        i++
    ) {

        let emptyDay =
            document.createElement("div") ;


        emptyDay.className =
            "calendar-day" ;


        calendarDays.appendChild(emptyDay) ;

    }


    for (
        let day = 1 ;
        day <= daysInMonth ;
        day++
    ) {

        let dayElement =
            document.createElement("div") ;


        dayElement.className =
            "calendar-day" ;


        let dayNumber =
            document.createElement("div") ;


        dayNumber.className =
            "calendar-day-number" ;


        dayNumber.textContent =
            day ;


        dayElement.appendChild(dayNumber) ;


        let currentDay =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0") ;


        let today =
            new Date() ;


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add("today") ;

        }


        let dayAssignments =
            assignments.filter(function(assignment) {

                return assignment.dueDate === currentDay ;

            }) ;


        dayAssignments.forEach(function(assignment) {

            let assignmentElement =
                document.createElement("div") ;


            assignmentElement.className =
                "calendar-assignment" ;


            if (assignment.completed) {

                assignmentElement.classList.add(
                    "completed-calendar"
                ) ;

            }


            assignmentElement.textContent =
                assignment.name ;


            dayElement.appendChild(
                assignmentElement
            ) ;

        }) ;


        calendarDays.appendChild(dayElement) ;

    }

}



/* Change calendar month */

function changeMonth(amount) {

    calendarDate.setMonth(
        calendarDate.getMonth() + amount
    ) ;


    displayCalendar() ;

}



/* Login page */

if (
    document.getElementById("loginForm")
) {

    document
        .getElementById("loginForm")
        .addEventListener(
            "submit",
            login
        ) ;

}



/* Assignment page */

if (
    document.getElementById("assignmentForm")
) {

    document
        .getElementById("assignmentForm")
        .addEventListener(
            "submit",
            addAssignment
        ) ;


    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            searchAssignments
        ) ;


    document
        .getElementById("sortSelect")
        .addEventListener(
            "change",
            displayAssignments
        ) ;


    displayAssignments() ;

}