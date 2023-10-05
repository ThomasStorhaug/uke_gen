export class Schedule {
    constructor(course_data) {
        this.course_data = course_data;
        this.course = "";
        this.course_is_chosen = false;
        this.available_subjects = this.course_data["Fellesfag vg1"] // array
        this.teachers = {};
        for (let subject of this.available_subjects) {
            this.teachers[subject] = "";
        }
        // schedule = [day1, day2, ...]; day = [period1, period2, ...]
        this.schedule = []
        for (let i = 0; i < 5; i++) {
            var day = [];
            for (let j = 0; j < 8; j++) {
                day.push({teacher: "", subject: "", room: "", color: "", double: false});
            }
            this.schedule.push(day);
        }
        // variable used to prepare a period for change, keeps track of where modal was opened from
        this.prepared_period = {day: "", period: ""};
        
        this.text_order = ["subject", "teacher", "room"];

    }

    set_text_order(order) {
        this.text_order = order;
    }

    prepare_period(day, period) {
        this.prepared_period.day = day-1;
        this.prepared_period.period = period-1;
    }

    get_prepared_period() {
        return {day: this.prepared_period.day -1, period: this.prepared_period.period -1}
    }

    set_course(course) {
        this.course = course;
        this.set_available_subjects(course);
        this.set_teachers();
        if (!this.course_is_chosen) {
            this.course_is_chosen = true;
        }
    }

    set_available_subjects(course) {
        this.available_subjects = this.course_data["Fellesfag vg1"].concat(this.course_data[course]);
    }

    set_teachers() {
        let new_teacher_obj = {}
        for (let subj in this.teachers) {
            if (this.available_subjects.includes(subj)) {
                new_teacher_obj[subj] = this.teachers[subj];
            } else {
                new_teacher_obj[subj] = "";
            }
        }
        this.teachers = new_teacher_obj;
    }

    set_teacher(subject, teacher) {
        if (this.available_subjects.includes(subject)) {
            this.teachers[subject] = teacher;
        } else {
            console.log("Error: Trying to set a teacher in a subject not in course!")
        }
    }

    get_available_subjects() {
        return this.available_subjects
    }

    set_period(day, period, period_info) {
        this.schedule[day-1][period-1] = period_info;
    }

    get_period(day, period) {
        return this.schedule[day-1][period-1]
    }

    get_schedule() {
        return this.schedule
    }
}