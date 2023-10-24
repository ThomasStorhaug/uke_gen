import json
import os
from typing import Any

from django.shortcuts import render
from django.views.generic import TemplateView

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create your views here.

class Ukeplan_view(TemplateView):
    template_name = "uke_generator/uke_generator.html"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super(Ukeplan_view, self).get_context_data(**kwargs)

        json_file_path = os.path.join(BASE_DIR, "subjects.json")
        color_file_path = os.path.join(BASE_DIR, "colors.json")

        with open(json_file_path, "r", encoding="UTF-8") as file:
            course_subjects = json.load(file)

        with open(color_file_path, "r", encoding="UTF-8") as cfile:
            color_objs = json.load(cfile)

        courses =  []

        for course in course_subjects:
            if course != "Fellesfag vg1":
                courses.append(course)

        context["courses"] = courses

        context["course_subjects"] = json.dumps(course_subjects)
        context["color_data"] = json.dumps(color_objs)
        context["palettes"] = color_objs
        context["cell_content"] = [
            {
                "identifier": "subject",
                "name": "Fag"
            },
            {
                "identifier": "teacher",
                "name": "Lærer"
            },
            {
                "identifier": "room",
                "name": "Rom"
            },
        ]

        return context
    
