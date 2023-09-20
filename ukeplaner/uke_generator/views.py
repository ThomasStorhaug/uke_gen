from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.

class Ukeplan_view(TemplateView):
    template_name = "uke_generator/uke_generator.html"