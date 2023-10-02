from typing import Any
from django.shortcuts import render
from django.views.generic import TemplateView
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create your views here.

class Ukeplan_view(TemplateView):
    template_name = "uke_generator/uke_generator.html"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super(Ukeplan_view, self).get_context_data(**kwargs)

        json_file_path = os.path.join(BASE_DIR, "subjects.json")

        with open(json_file_path, "r", encoding="UTF-8") as file:
            course_subjects = json.load(file)

        courses =  []

        for course in course_subjects:
            if course != "Fellesfag vg1":
                courses.append(course)

        context["courses"] = courses

        context["course_subjects"] = json.dumps(course_subjects)

        return context
    
