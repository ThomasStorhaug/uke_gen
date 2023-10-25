(()=>{"use strict";class e{constructor(e){this.course_data=e,this.course="",this.course_is_chosen=!1,this.available_subjects=this.course_data["Fellesfag vg1"],this.teachers={};for(let e of this.available_subjects)this.teachers[e]="";this.schedule=[];for(let e=0;e<5;e++){var t=[];for(let e=0;e<8;e++)t.push({teacher:"",subject:"",room:"",color:"",double:!1});this.schedule.push(t)}this.prepared_period={day:"",period:""},this.text_order=["subject","teacher","room"],this.bold={teacher:!1,subject:!1,room:!1},this.italic={teacher:!1,subject:!1,room:!1},this.sizes={teacher:12,subject:12,room:12}}set_text_order(e){this.text_order=e}prepare_period(e,t){this.prepared_period.day=e-1,this.prepared_period.period=t-1}get_prepared_period(){return{day:this.prepared_period.day+1,period:this.prepared_period.period+1}}set_course(e){this.course=e,this.set_available_subjects(e),this.set_teachers(),this.course_is_chosen||(this.course_is_chosen=!0)}set_available_subjects(e){this.available_subjects=this.course_data["Fellesfag vg1"].concat(this.course_data[e])}set_teachers(){let e={};for(let t in this.teachers)this.available_subjects.includes(t)?e[t]=this.teachers[t]:e[t]="";this.teachers=e}set_teacher(e,t){this.available_subjects.includes(e)?this.teachers[e]=t:console.log("Error: Trying to set a teacher in a subject not in course!")}get_available_subjects(){return this.available_subjects}set_period(e,t,r){this.schedule[e-1][t-1]=r}get_period(e,t){return this.schedule[e-1][t-1]}get_schedule(){return this.schedule}set_double(e,t,r){this.schedule[e-1][t-1].double=r}}$(document).ready((function(){const t=new e(course_subjects);function r(){let e=[];for(let t of $("#sortable-text-order").children())if(t.id){let r=t.id.split("-")[2];e.push(r)}t.set_text_order(e)}function o(e,o){r();const a=$("#modal-course-container");t.prepare_period(o,e);const s=t.get_available_subjects(),i=t.get_period(o,e);if(a.empty(),i.double?$("#period-is-double").prop("checked",!0):$("#period-is-double").prop("checked",!1),$("#modal-alert")&&$("#modal-alert").remove(),t.course_is_chosen)$("#period-is-double").removeAttr("disabled"),$("#modal-room-input").removeAttr("disabled"),$("#modal-update-schedule-btn").removeAttr("disabled");else{$("#period-is-double").attr("disabled",!0),$("#modal-room-input").attr("disabled",!0),$("#modal-update-schedule-btn").attr("disabled",!0);let e=$("<div></div>").addClass("alert alert-danger").attr("role","alert").attr("id","modal-alert").text("Du må velge linje først!");$("#modal-double-period-form").before(e)}for(let e of s){let r=$("<input>");r.attr({type:"radio",id:`modal-subject-${e}`,name:"modal-subject-select",value:e}).addClass("btn-check"),r.click((function(){l()})),e==i.subject&&r.attr("checked",!0);let o=$("<label></label>").attr("for",`modal-subject-${e}`).addClass("btn").text(e);a.append(r).append(o),t.course_is_chosen||r.attr("disabled",!0)}}function a(e){t.set_course(e),function(){const e=t.get_available_subjects(),r=$("#teacher-container");r.empty();for(let t of e){console.log(`ading text input with id teacher-input-${t}`);var o=$("<input></input>").addClass("form-control").attr("id",`teacher-input-${t}`).attr("name",`teacher-input-${t}`).attr("type","text");o.change((function(){$(`#teacher-input-${t}`).addClass("is-valid"),s()})).focus((function(){$(`#teacher-input-${t}`).removeClass("is-valid")}));let e=$("<label></label>").attr("for",`teacher-input-${t}`).text(`${t}:`);r.append(e).append(o)}}()}function s(){for(let o of $("#teacher-container .input-group")){let a=o.id.split("-")[0];e=a,r=$(`#teacher-input-${a}`).val(),t.set_teacher(e,r)}var e,r}function i(){let e=$("#modal-room-input").val(),r="";for(let e of $("#modal-course-container").children("input"))e.checked&&(r=e.value);s();var o={subject:$("#bold-check-subject").prop("checked"),teacher:$("#bold-check-teacher").prop("checked"),room:$("#bold-check-room").prop("checked")},a={subject:$("#italic-check-subject").prop("checked"),teacher:$("#italic-check-teacher").prop("checked"),room:$("#italic-check-room").prop("checked")},i={subject:$("#text-size-input-subject").val(),teacher:$("#text-size-input-teacher").val(),room:$("#text-size-input-room").val()};t.bold=o,t.italic=a,t.sizes=i;let d=t.teachers[r];t.set_period(t.get_prepared_period().day,t.get_prepared_period().period,{room:e,teacher:d,subject:r})}function d(e,r){let o=t.text_order,a=t.get_period(r,e);var s={subject:"Fag",teacher:"Lærer",room:"Rom"};let i=$(`#btn-p${e}-d${r}`);i.empty();for(let e of o){if(""==a[e])var d=s[e];else d=a[e];var c=$("<p></p>").text(d).addClass("text-center");t.bold[e]?c.addClass("fw-bold"):c.removeClass("fw-bold"),t.italic[e]&&c.addClass("fst-italic"),i.append(c)}}function c(e=!1){var r=t.get_schedule();if(e)r.forEach((function(e,t){e.forEach((function(e,r){d(r+1,t+1)}))}));else{let e=t.get_prepared_period();d(e.period,e.day)}}function l(){i(),c(!0)}$("#teacher-collapse-btn").click((function(){$("#teacher-collapse-btn").toggleClass("fa-caret-up").toggleClass("fa-caret-down")}));var n=document.getElementById("course-select");n.addEventListener("change",(function(){a(n.options[n.selectedIndex].value)})),$("#modal-room-input").change((function(){l()})),$("#sortable-text-order").sortable({update:function(e,t){r(),l()},handle:".handle",cursor:"move"});for(let e of["subject","teacher","room"])$(`#text-size-input-${e}`).change((function(){$(`#text-size-${e}`).text($(`#text-size-input-${e}`).val())}));$("#modal-update-schedule-btn").click((function(){i(),c()})),$("#period-is-double").change((function(){let e=t.get_prepared_period();$(this).is(":checked")?function(e,r){let o=0;$(`#row-${e}`).hasClass("schedule-preview__first-row")?($(`#td-p${e+1}-d${r}`).remove(),o=0):($(`#td-p${e}-d${r}`).remove(),o=-1,t.prepare_period(r,e-1)),t.set_double(r,e+o,!0),$(`#td-p${e+o}-d${r}`).attr("rowspan","2")}(e.period,e.day):function(e,r){if($(`#row-${e}`).hasClass("schedule-preview__first-row"))var a=1;else a=-1;let s=$("<td></td>").addClass("schedule-preview__period").attr("id",`td-p${e+a}-d${r}`);if(function(e,t){let r=$("<button></button>").addClass("period-btn").attr("type","button").attr("data-bs-toggle","modal").attr("data-bs-target","#specifyPeriodModal");return r.click((function(){o(t,e)})),$("<p></p>").attr("id",`default-p${t}-d${e}`).text(`${t}. Time`).appendTo(r),r}(r,e+a).appendTo(s),1==r){let t=$(`#td-p${e+a}-d${r+1}`);s.insertBefore(t)}else{let t=$(`#td-p${e+a}-d${r-1}`);s.insertAfter(t)}t.set_double(r,e,!1),$(`#td-p${e}-d${r}`).removeAttr("rowspan")}(e.period,e.day),l()})),window.set_selected_course=a,window.prepare_modal=o,window.update_all=l}))})();