from .views import FileUploadView, TimetableView, DeleteCalendarView, GenerateHoroscopeView
from django.urls import path

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('timetable/', TimetableView.as_view(), name='timetable'),
    path('delete-calendar/', DeleteCalendarView.as_view(), name='delete-calendar'),
    path('horoscope/', GenerateHoroscopeView.as_view(), name='generate-horoscope'),
]
