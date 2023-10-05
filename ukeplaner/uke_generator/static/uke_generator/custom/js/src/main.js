import { Schedule } from './schedule_object';

$(document).ready(function() {
    const schedule = new Schedule(course_subjects)

    function updateSortOrder() {
        let order = [];

        for(let child of $("#sortable-text-order").children()) {
            if (!!child.id) {
                let description = child.id.split("-")[2];
                console.log(description)
                order.push(description);
            }
        }
        schedule.set_text_order(order);
    }

    function setTeacher(subject, teacher) {
        schedule.set_teacher(subject, teacher);
        console.log(schedule.teachers);
    }
    
    function populateTeacherInput() {
        const subjects = schedule.get_available_subjects();
        const input_container = $("#teacher-container");
    
        input_container.empty();
    
        for (let subject of subjects) {
            // Input group setup
            var new_input_group = $("<div></div>").addClass("input-group");
    
            var txt_input = $("<input></input>").addClass("form-control").attr("id", `#teacher-input-${subject}`);
            txt_input.change(function() {
                $(`#teacher-input${subject}`).removeClass("is-valid");
            });
    
            let label = $("<label></label>").attr("for", `teacher-input-${subject}`).text(subject);
    
            let btn = $("<button></button>").addClass("btn btn-outline-secondary").attr("type", "button").attr("id", `add-teacher-to${subject}`).click(function() {
                $(`#teacher-input-${subject}`).addClass("is-valid");
                let val = $(`#teacher-input-${subject}`).val();
                setTeacher(subject, val);
            }).text("Legg til");
    
            new_input_group.append(txt_input).append(btn);
            input_container.append(label).append(new_input_group);
        }
    }
    
    function prepareModal(period, day) {
        updateSortOrder();
        const modal_container = $("#modal-course-container");

        schedule.prepare_period(day, period);

        const subjects = schedule.get_available_subjects();
        const current_period = schedule.get_period(day, period);

        modal_container.empty();

        if (!schedule.course_is_chosen) {
            $("#period-is-double").attr("disabled");
            $("#modal-room-input").attr("disabled");
            $("#modal-update-schedule-btn").attr("disabled");

            let alert = $("<div></div>").addClass("alert alert-danger").attr("role", "alert").attr("id", "modal-alert").text("Du må velge linje først!");
            
            $("#modal-double-eriod-form").before(alert);

        } else {
            $("#period-is-double").removeAttr("disabled");
            $("#modal-room-input").removeAttr("disabled");
            $("#modal-update-schedule-btn").removeAttr("disabled");

            if($("#modal-alert")) {
                $("#modal-alert").remove();
            }
        }

        for (let subj of subjects) {
            let new_inp = $("<input>");
            new_inp.attr({type: "radio", "id": `modal-subject-${subj}`, name: "modal-subject-select", value: subj}).addClass("btn-check");
            if (subj == current_period.subject) {
                new_inp.attr("checked");
            }

            let new_lbl = $("<label></label>").attr("for", `modal-subject-${subj}`).addClass("btn").text(subj);

            modal_container.append(new_inp).append(new_lbl);

            if (!schedule.course_is_chosen) {
                new_inp.attr("disabled");
            }
        }
    }
    
    function setSelectedCourse(course) {
    
        schedule.set_course(course);
        populateTeacherInput();
    }
    // Break up into fundamentals
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
        let cell_btn = document.getElementById(`btn-p${period}-d${day}`)
        let table_cell = cell_btn.parentElement;
        cell_btn.innerText = inner_text;
    
        // if its double, add rowspan attr and remove cell
        let row = table_cell.parentElement;
        if (double) {
            if (row.classList.contains("schedule-preview__first-row")) {
                table_cell.setAttribute("rowspan", "2");
                table_cell.classList.remove("schedule-preview__period--first");
                table_cell.classList.add("schedule-preview__period--double");
                document.getElementById(`td-p${period + 1}-d${day}`).remove();
            }
        } 
    
    }
    
    // Add text to period
    function updatePeriodText() {
        let prepared_period = schedule.get_prepared_period();
        let order = schedule.text_order;
        let period_info = schedule.get_period(prepared_period.day, prepared_period.period);

        let table_btn = $(`#btn-p${prepared_period.period}-d${prepared_period.day}`);

        let is_empty = true;
        for (let item of order) {
            if (period_info[item] != "") {
                is_empty = false;
                table_btn.append($(`<p id="para-p${prepared_period.period}-d${prepared_period.day}>${item}</p>`));
            }
        }
        if (!is_empty) {
            $(`#btn-p${prepared_period.period}-d${prepared_period.day}`).remove();
        }
    }
    // Add color to period
    
    // Merge periods
    
    // Break up periods

    // update schedule table
    
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
        let prepared_period = schedule.prepared_period;
        let is_double = document.getElementById("period-is-double").checked;
        updateSchedule(prepared_period.day, prepared_period.period, is_double);
    })
    
    $("#sortable-text-order").sortable();
    for (let item of ["subject", "teacher", "room"]) {
        $(`#text-size-input-${item}`).change(function() {
            $(`#text-size-${item}`).text($(`#text-size-input-${item}`).val());
        });
    }
    
    window.set_selected_course = setSelectedCourse;
    window.prepare_modal = prepareModal;
});
