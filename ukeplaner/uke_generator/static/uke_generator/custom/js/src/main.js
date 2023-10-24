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
    /**
     * Returns a button element with all attributes, class and id for use in schedule preview table
     * @param {number} day mon = 1 etc
     * @param {number} period 1 - 8
     */
    function newTableButton(day, period) {
        let new_btn = $("<button></button>").addClass("period-btn").attr("type", "button").attr("data-bs-toggle", "modal").attr("data-bs-target", "#specifyPeriodModal");
        new_btn.click(function () {
            prepareModal(period, day);
        });
        let default_para = $("<p></p>").attr("id", `default-p${period}-d${day}`).text(`${period}. Time`).appendTo(new_btn)

        return new_btn
    }

    function populateTeacherInput() {
        const subjects = schedule.get_available_subjects();
        const input_container = $("#teacher-container");

        input_container.empty();

        for (let subject of subjects) {
            // Input group setup

            var txt_input = $("<input></input>").addClass("form-control").attr("id", `teacher-input-${subject}`).attr("name", `teacher-input-${subject}`).attr("type", "text");
            txt_input.change(function () {
                $(`#teacher-input-${subject}`).addClass("is-valid");
                updateTeachers();
            }).focus(function () {
                $(`#teacher-input-${subject}`).removeClass("is-valid");
            });

            let label = $("<label></label>").attr("for", `teacher-input-${subject}`).text(`${subject}:`);

            input_container.append(label).append(txt_input);
        }
    }

    function populateColorSelection() {
        const subjects = schedule.get_available_subjects();
        const input_container = $("#")

        for (let subject of subjects) {

        }
    }

    /**
     * Prepares the period information modal
     * @param {number} period period from 1 - 8
     * @param {number} day mon = 1 etc
     * 
     * Updates the schedule object and prepares sujects and double period checkbox
     */
    function prepareModal(period, day) {
        updateSortOrder();
        const modal_container = $("#modal-course-container");

        schedule.prepare_period(day, period);

        const subjects = schedule.get_available_subjects();
        const current_period = schedule.get_period(day, period);


        modal_container.empty();

        console.log(current_period.double)

        if (!current_period.double) {
            $("#period-is-double").prop("checked", false);
        } else {
            $("#period-is-double").prop("checked", true);
        }

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

    function updateTeachers() {
        for (let inp_grp of $("#teacher-container .input-group")) {
            let subj = inp_grp.id.split("-")[0];
            let teacher = $(`#teacher-input-${subj}`).val();
            console.log($(`#teacher-input-${subj}`).val())
            console.log(`setting ${teacher} as teacher for ${subj}`)
            setTeacher(subj, teacher);
        }
    }

    /**
     * Updates the schedule object with information from the modal and the menu
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

        // Get information from the menu

        updateTeachers();

        var bold = {
            subject: $("#bold-check-subject").prop("checked"),
            teacher: $("#bold-check-teacher").prop("checked"),
            room: $("#bold-check-room").prop("checked")
        }

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

        schedule.bold = bold
        schedule.italic = italic
        schedule.sizes = sizes

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

        var names = {
            subject: "Fag",
            teacher: "Lærer",
            room: "Rom"
        }

        let table_btn = $(`#btn-p${prepared_period.period}-d${prepared_period.day}`);

        table_btn.empty();

        for (let item of order) {
            console.log(`adding in ${item}`)
            if (period_info[item] == "") {
                var text = names[item];
            } else {
                var text = period_info[item];
            }
            var para = $("<p></p>").text(text).addClass("text-center");

            if (schedule.bold[item]) {
                para.addClass("fw-bold");
            } else {
                para.removeClass("fw-bold");
            }
            if (schedule.italic[item]) {
                para.addClass("fst-italic");
            }

            table_btn.append(para);
        }
    }
    // Add color to period

    // Merge periods
    /**
     * Merge cells regardless if the switch was checked on a first or second row period
     * @param {number} period The period, corresponds to the row number
     * @param {number} day Monday = 1 etc.
     */
    function mergePeriods(period, day) {
        let row = 0
        if ($(`#row-${period}`).hasClass("schedule-preview__first-row")) {
            $(`#td-p${period + 1}-d${day}`).remove();
            row = 0
        } else {
            $(`#td-p${period}-d${day}`).remove();
            row = -1
            schedule.prepare_period(day, period - 1);
        }
        schedule.set_double(day, period + row, true)
        $(`#td-p${period + row}-d${day}`).attr("rowspan", "2");
    }

    // Break up periods
    function separatePeriods(period, day) {
        console.log(`Trying to separate cells, called with parameters: day ${day}, period ${period}`)
        console.log(`The prepared period is: day ${schedule.get_prepared_period().day}, period ${schedule.get_prepared_period().period}`)
        if ($(`#row-${period}`).hasClass("schedule-preview__first-row")) {
            var row_num = 1;
        } else {
            var row_num = -1;
        }
        let new_cell = $("<td></td>").addClass("schedule-preview__period").attr("id", `td-p${period + row_num}-d${day}`);
        newTableButton(day, period + row_num).appendTo(new_cell);

        if (day == 1) {
            let adjoining = $(`#td-p${period + row_num}-d${day + 1}`);
            new_cell.insertBefore(adjoining);
        } else {
            let adjoining = $(`#td-p${period + row_num}-d${day - 1}`);
            new_cell.insertAfter(adjoining);
        }
        schedule.set_double(day, period, false);
        $(`#td-p${period}-d${day}`).removeAttr("rowspan");
    }
    // update schedule table
    /**
     * Updates the DOM elements of the table
     * @param {bolean} all If set to true the whole table will be updated, otherwise only the prepared period.  
     */
    function updateTable(all = false) {
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

    // change icon for the collapse button when its pressed:
    $("#teacher-collapse-btn").click(function () {
        $("#teacher-collapse-btn").toggleClass("fa-caret-up").toggleClass("fa-caret-down");
    })

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
    });

    $("#period-is-double").change(function () {
        let period = schedule.get_prepared_period()
        if ($(this).is(":checked")) {
            mergePeriods(period.period, period.day);
        } else {
            separatePeriods(period.period, period.day);
        }
    })

    window.set_selected_course = setSelectedCourse;
    window.prepare_modal = prepareModal;
});
