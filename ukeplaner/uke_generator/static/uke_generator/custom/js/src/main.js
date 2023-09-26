import { Schedule } from './schedule_object';

const schedule = new Schedule(course_subjects)

function newModalListGroup() {
    var e = document.createElement("ul");
    e.setAttribute("class", "list-group");
    e.setAttribute("id", "modal-list-group");
    return e
}

function prepareModal(element) {
    const modal_text_div = document.getElementById("specifyPeriodModalContent");

    const element_id = element.id;
    const modal_period_input = document.getElementById("modal-active-period");
    const modal_body = document.getElementById("specifyPeriodModalContent");

    modal_period_input.value = element_id;

    const subjects = schedule.get_available_subjects();

    if (!!document.getElementById("modal-list-group")) {
        document.getElementById("modal-list-group").remove();
    }
    const new_list_group = newModalListGroup();

    for (let subject of subjects) {
        var new_input = document.createElement("li");
        new_input.innerText = subject;
        new_input.setAttribute("class", "list-group-item")
        new_list_group.appendChild(new_input);
    }
    modal_body.appendChild(new_list_group);
}

function setSelectedCourse(course) {
    const button = document.getElementById("course_dropdown_button");
    button.innerHTML = course;
    schedule.set_course(course)
}

window.set_selected_course = setSelectedCourse;
window.prepare_modal = prepareModal;