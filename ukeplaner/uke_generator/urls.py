from django.urls import path

from . import views

urlpatterns = [
    path("", views.Ukeplan_view.as_view())
]