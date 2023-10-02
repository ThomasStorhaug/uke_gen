import { Schedule } from './schedule_object';

const schedule = new Schedule(course_subjects)

function setTeacher(subject, teacher) {
    schedule.set_teacher(subject, teacher);
    console.log(schedule.teachers);
}

function populateTeacherInput() {
    const subjects = schedule.get_available_subjects();
    const input_container = document.getElementById("teacher-container")

    while (input_container.hasChildNodes()) {
        input_container.removeChild(input_container.firstChild);
    }

    for (let subject of subjects) {
        // Input group setup
        var new_input_group = document.createElement("div");
        new_input_group.setAttribute("class", "input-group");

        // creating elements: label\n [input|button]
        var new_input = document.createElement("input");
        var new_label = document.createElement("label");
        var new_btn = document.createElement("button");

        // add attributes to new input, 
        // and event listener that removes validation checkmark on change
        new_input.setAttribute("type", "text");
        new_input.setAttribute("id", "teacher-input-" + subject);
        new_input.setAttribute("class", "form-control");
        new_input.addEventListener("change", function() {
            let inp = document.getElementById(`teacher-input-${subject}`);
            if (inp.classList.contains("is-valid")) {
                inp.classList.remove("is-valid");
            }
        })

        // add attributes to label
        new_label.setAttribute("for", "teacher-input-" + subject);
        new_label.innerText = subject;

        // add attributes to button, and event listener that adds the input
        // value and gives the input a validation checkmark
        new_btn.setAttribute("class", "btn btn-outline-secondary");
        new_btn.setAttribute("type", "button");
        new_btn.setAttribute("id", `add-teacher-to-${subject}`);
        new_btn.addEventListener("click", function() {
            let inp = document.getElementById(`teacher-input-${subject}`);
            inp.classList.add("is-valid");
            setTeacher(subject, inp.value);
        })
        new_btn.innerText = "Legg til";
        
        new_input_group.appendChild(new_input);
        new_input_group.appendChild(new_btn);

        input_container.appendChild(new_label);
        input_container.appendChild(new_input_group);
    }
}

function prepareModal(element) {

    const element_id = element.id;
    const modal_period_input = document.getElementById("modal-active-period");
    const modal_body = document.getElementById("modal_course_container");

    var day = Number(element_id.substr(4,1));
    var period = Number(element_id.substr(1, 1));

    modal_period_input.value = element_id;

    const subjects = schedule.get_available_subjects();
    const current_period = schedule.get_period(day, period);

    while (modal_body.hasChildNodes()) {
        modal_body.removeChild(modal_body.firstChild);
    }


    for (let subject of subjects) {
        var new_inp = document.createElement("input");
        new_inp.setAttribute("type", "radio");
        new_inp.setAttribute("id", "modal_subject_" + subject);
        new_inp.setAttribute("class", "btn-check");
        new_inp.setAttribute("name", "modal_subject_select");
        new_inp.setAttribute("value", subject);
        if (subject == current_period.subject) {
            new_inp.setAttribute("checked", "true");
        }

        var new_lbl = document.createElement("label");
        new_lbl.setAttribute("class", "btn");
        new_lbl.setAttribute("for", "modal_subject_" + subject);
        new_lbl.innerText = subject;

        modal_body.appendChild(new_inp);
        modal_body.appendChild(new_lbl);
    }


}

function setSelectedCourse(course) {

    schedule.set_course(course);
    populateTeacherInput();
}

function updateSchedule(day, period, double) {
    // get values from modal
    let room = document.getElementById("modal_room_input").value;
    let subject_radio_checked = document.querySelector("input[name='modal_subject_select']:checked");
    if (subject_radio_checked) {
        var selected_subj = subject_radio_checked.value;
    } else {
        var selected_subj = "";
    }

    // get teacher from schedule object
    var teacher = schedule.teachers[selected_subj];

    // create period object to send to period attribute of schedule object
    var period_info = {
        teacher: teacher,
        subject: selected_subj,
        room: room
    }

    // update schedule object
    schedule.set_period(day, period, period_info);

    // update DOM schedule
    let obj_info = schedule.get_period(day, period);
    let cell_text = [obj_info.subject, obj_info.room, obj_info.teacher]
    let inner_text = ""
    for (let txt of cell_text) {
        if (txt) {
            inner_text = inner_text.concat(`${txt}\n`);
        }
    }
    let cell_btn = document.getElementById(`p${period}_d${day}`)
    let table_cell = cell_btn.parentElement;
    cell_btn.innerText = inner_text;

    // if its double, add rowspan attr and remove cell
    if (double) {
        let row = table_cell.parentElement;
        if (row.classList.contains("schedule-preview__first-row")) {
            table_cell.setAttribute("rowspan", "2");
            table_cell.classList.remove("schedule-preview__period--first");
            table_cell.classList.add("schedule-preview__period--double");
            document.getElementById(`p${period + 1}_d${day}`).parentElement.remove();
        }
    }

    // if its not double, check if cell is missing and add it if it is.
}

function debug(string) {
    console.log(string);
}
// event listeners

var course_select =  document.getElementById("course-select");

course_select.addEventListener("change", function() {
    setSelectedCourse(course_select.options[course_select.selectedIndex].value);
});

const update_schedule_btn = document.getElementById("modal_update_schedule_btn");
update_schedule_btn.addEventListener("click", function() {
    let hidden_inp = document.getElementById("modal-active-period").value;
    let day = Number(hidden_inp.substr(4, 1));
    let period = Number(hidden_inp.substr(1, 1));
    let is_double = document.getElementById("period-is-double").checked;
    updateSchedule(day, period, is_double);
})


window.set_selected_course = setSelectedCourse;
window.prepare_modal = prepareModal;