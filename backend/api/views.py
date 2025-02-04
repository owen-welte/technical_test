from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from dotenv import load_dotenv
from openai import OpenAI
import json
import os

load_dotenv()


class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "Aucun fichier trouvé"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            file_content = json.load(file)
            base_dir = os.path.dirname(os.path.abspath(__file__))
            files_dir = os.path.join(base_dir, 'files')
            file_path = os.path.join(files_dir, 'calendar.json')
            os.makedirs(files_dir, exist_ok=True)
            with open(file_path, 'w', encoding="utf-8") as f:
                json.dump(file_content, f, indent=4, ensure_ascii=False)  # UTF-8
            return Response({"message": "Fichier JSON uploadé et sauvegardé avec succès!"}, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return Response({"error": "Le fichier n'est pas un JSON valide"}, status=status.HTTP_400_BAD_REQUEST)


class TimetableView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            files_dir = os.path.join(base_dir, 'files')
            file_path = os.path.join(files_dir, 'calendar.json')

            with open(file_path, 'r', encoding="utf-8") as file:
                timetable_data = json.load(file)

            return Response(timetable_data, status=status.HTTP_200_OK)

        except FileNotFoundError:
            return Response({"error": "Fichier JSON non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteCalendarView(APIView):
    def delete(self, request, *args, **kwargs):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        files_dir = os.path.join(base_dir, 'files')
        file_path = os.path.join(files_dir, 'calendar.json')

        if os.path.exists(file_path):
            os.remove(file_path)
            return Response({"message": "Le calendrier a été supprimé avec succès."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Aucun calendrier trouvé."}, status=status.HTTP_404_NOT_FOUND)


def load_calendar():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    files_dir = os.path.join(base_dir, 'files')
    file_path = os.path.join(files_dir, 'calendar.json')

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            calendar_data = json.load(file)
        return calendar_data
    except FileNotFoundError:
        return {"error": "calendar.json not found"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format in calendar.json"}


def summarize_schedule(calendar):
    events = calendar.get("schedule", [])
    if not events:
        return "Aucun cours enregistré, prépare-toi à une semaine de repos... ou d'angoisse existentielle."
    
    summary = []
    for event in events:
        day = event.get("day", "un jour inconnu")
        courses = event.get("courses", [])
        for course in courses:
            subject = course.get("name", "une matière mystérieuse")
            start_time = course.get("start_time", "une heure étrange")
            deadline = "deadline imminente" if course.get("rendu", False) else "pas de deadline"
            event_text = f"{subject} le {day} à {start_time} ({deadline})"
            summary.append(event_text)
    
    return " | ".join(summary)


class GenerateHoroscopeView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

            calendar_data = load_calendar()
            if "error" in calendar_data:
                return Response({"error": calendar_data["error"]}, status=status.HTTP_400_BAD_REQUEST)

            schedule_summary = summarize_schedule(calendar_data)

            sign = request.GET.get("sign", "").strip().capitalize()
            sign_text = f"Ton signe astrologique est {sign}. " if sign else ""

            prompt = (
                f"Tu es un astrologue farfelu. Donne une prédiction absurde et humoristique pour un étudiant ayant l'emploi du temps suivant : {schedule_summary}. "
                f"{sign_text}Ta prédiction doit être en français, courte, improbable, et inclure des éléments surnaturels ou des conseils absurdes. Moins de 200 caracteres."
            )

            messages = [
                {"role": "system", "content": "Tu es un astrologue loufoque qui prédit l'avenir des étudiants avec des prédictions absurdes."},
                {"role": "user", "content": prompt}
            ]

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=200,
                temperature=0.7
            )

            generated_text = response.choices[0].message.content.strip()
            return Response({"horoscope": generated_text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
