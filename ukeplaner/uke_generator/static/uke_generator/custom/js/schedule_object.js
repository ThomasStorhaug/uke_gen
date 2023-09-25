export class Schedule {
    constructor(course_data) {
        this.course_data = course_data
        this.course = ""
        this.available_subjects = []
    }

    set_course(course) {
        this.course = course
    }

    set_available_subjects(course) {
        this.available_subjects = this.course_data["Fellesfag vg1"] + this.course_data[course]
    }

    get_available_subjects() {
        return this.available_subjects
    }
}