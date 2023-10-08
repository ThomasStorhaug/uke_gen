import { Schedule } from './schedule_object';

$(document).ready(function () {
    const schedule = new Schedule(course_subjects)

    function updateSortOrder() {
        let order = [];

        for (let child of $("#sortable-text-order").children()) {
            if (!!child.id) {
                let description = child.id.split("-")[2];
                order.push(description);
            }
        }
        schedule.set_text_order(order);
    }

    function setTeacher(subject, teacher) {
        schedule.set_teacher(subject, teacher);
    }

    function populateTeacherInput() {
        const subjects = schedule.get_available_subjects();
        const input_container = $("#teacher-container");

        input_container.empty();

        for (let subject of subjects) {
            // Input group setup
            var new_input_group = $("<div></div>").addClass("input-group");

            var txt_input = $("<input></input>").addClass("form-control").attr("id", `#teacher-input-${subject}`);
            txt_input.change(function () {
                $(`#teacher-input${subject}`).removeClass("is-valid");
            });

            let label = $("<label></label>").attr("for", `teacher-input-${subject}`).text(subject);

            let btn = $("<button></button>").addClass("btn btn-outline-secondary").attr("type", "button").attr("id", `add-teacher-to${subject}`).click(function () {
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
            $("#period-is-double").attr("disabled", true);
            $("#modal-room-input").attr("disabled", true);
            $("#modal-update-schedule-btn").attr("disabled", true);

            let alert = $("<div></div>").addClass("alert alert-danger").attr("role", "alert").attr("id", "modal-alert").text("Du må velge linje først!");

            $("#modal-double-period-form").before(alert);

        } else {
            $("#period-is-double").removeAttr("disabled");
            $("#modal-room-input").removeAttr("disabled");
            $("#modal-update-schedule-btn").removeAttr("disabled");

            if ($("#modal-alert")) {
                $("#modal-alert").remove();
            }
        }

        for (let subj of subjects) {
            let new_inp = $("<input>");
            new_inp.attr({ type: "radio", "id": `modal-subject-${subj}`, name: "modal-subject-select", value: subj }).addClass("btn-check");
            if (subj == current_period.subject) {
                new_inp.attr("checked", true);
            }

            let new_lbl = $("<label></label>").attr("for", `modal-subject-${subj}`).addClass("btn").text(subj);

            modal_container.append(new_inp).append(new_lbl);

            if (!schedule.course_is_chosen) {
                new_inp.attr("disabled", true);
            }
        }
    }

    function setSelectedCourse(course) {

        schedule.set_course(course);
        populateTeacherInput();
    }

    /**
     * Updates teh schedule object with information from the modal and the menu
     */
    function updateSchedule() {
        // Get information from modal inputs
        let room = $("#modal-room-input").val();
        let subject = "";
        // Find which subject is checked in the modal
        for (let child of $("#modal-course-container").children("input")) {
            if (child.checked) {
                subject = child.value;
            }
        }
        let teacher = schedule.teachers[subject];

        schedule.set_period(schedule.get_prepared_period().day, schedule.get_prepared_period().period, { room: room, teacher: teacher, subject: subject });
    }

    /**
     * Updates paragraph and text nodes of the given cells button element
     * @param {number} period Number representing the period of the given day, starts with 1
     * @param {number} day Number representing the day, 1 monday etc. 
     */
    function updatePeriodText(period, day) {
        // Get the order of paragraph nodes from the schedule object
        let order = schedule.text_order;
        // Get the period info from the schedule object
        let period_info = schedule.get_period(day, period);
        var prepared_period = schedule.get_prepared_period();

        // Get the type-info from the menu
        var bold = {
            subject: $("#bold-check-subject").prop("checked"),
            teacher: $("#bold-check-teacher").prop("checked"),
            room: $("#bold-check-room").prop("checked")
        }
        console.log(bold)
        var italic = {
            subject: $("#italic-check-subject").prop("checked"),
            teacher: $("#italic-check-teacher").prop("checked"),
            room: $("#italic-check-room").prop("checked")
        }

        var sizes = {
            subject: $("#text-size-input-subject").val(),
            teacher: $("#text-size-input-teacher").val(),
            room: $("#text-size-input-room").val()
        }

        var names = {
            subject: "Fag",
            teacher: "Lærer",
            room: "Rom"
        }

        let table_btn = $(`#btn-p${prepared_period.period}-d${prepared_period.day}`);

        table_btn.empty();

        for (let item of order) {
            if (period_info[item] == "") {
                var text = names[item];
            } else {
                var text = period_info[item];
            }
            var para = $("<p></p>").text(text).addClass("text-center");

            if (bold[item]) {
                para.addClass("fw-bold");
            } else {
                para.removeClass("fw-bold");
            }
            if (italic[item]) {
                para.addClass("fst-italic");
            }

            table_btn.append(para);
        }
    }
    // Add color to period

    // Merge periods
    function mergePeriods(period, day) {
        $(`#td-p${period}-d${day}`)
    }

    // Break up periods

    // update schedule table
    /**
     * Updates the DOM elements of the table
     * @param {bolean} all If set to true the whole table will be updated, otherwise only the prepared period.  
     */
    function updateTable(all = false) {
        console.log("Trying to update table")
        // get info from schedule object
        var table_inf = schedule.get_schedule()
        // update cell text
        if (!all) {
            let prepared_period = schedule.get_prepared_period();
            updatePeriodText(prepared_period.period, prepared_period.day)
        } else {
            table_inf.forEach(function (day, i) {
                day.forEach(function (_, j) {
                    updatePeriodText(j, i);
                });
            })
        }
        // add color based on subject
    }

    function debug(string) {
        console.log(string);
    }
    // event listeners

    var course_select = document.getElementById("course-select");

    course_select.addEventListener("change", function () {
        setSelectedCourse(course_select.options[course_select.selectedIndex].value);
    });

    $("#sortable-text-order").sortable();
    for (let item of ["subject", "teacher", "room"]) {
        $(`#text-size-input-${item}`).change(function () {
            $(`#text-size-${item}`).text($(`#text-size-input-${item}`).val());
        });
    }

    $("#modal-update-schedule-btn").click(function () {
        updateSchedule();
        updateTable();
    })

    window.set_selected_course = setSelectedCourse;
    window.prepare_modal = prepareModal;
});
