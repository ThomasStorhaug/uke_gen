import { Schedule } from "./schedule_object";

$(document).ready(function() {
    const schedule = new Schedule(course_subjects);

    function setTeacher(subject, teacher) {
        schedule.set_teacher(subject, teacher);
    }

    function populateTeacherInput() {
        const subjects = schedule.get_available_subjects();
        const input_container = $("#teacher-container");

        input_container.empty();

        for (let subject of subjects) {
            // Input group setup
            var new_input_group = "<div class='input-group'></div>";

            var txt_input = `<input type='text' id='teacher-input${subject}' class='form-control'>`
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
            new_inp.attr({type: "radio", "id": `modal-subject-${subject}`, name: "modal-subject-select", value: subject}).addClass("btn-check");
            if (subj == current_period.subject) {
                new_inp.attr("checked");
            }

            let new_lbl = $("<label></label>").attr("for", `modal_-subject-${subject}`).addClass("btn").text(subbject);

            modal_container.append(new_inp).append(new_lbl);

            if (!schedule.course_is_chosen) {
                new_inp.attr("disabled");
            }
        }


    }
});