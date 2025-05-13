import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from preprocessing.json_case_text import extract_and_clean_texts  # You'll build this

@csrf_exempt
def upload_document(request):
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]
        file_ext = uploaded_file.name.split('.')[-1].lower()
        allowed_ext = ["pdf", "docx", "rtf", "txt"]

        if file_ext not in allowed_ext:
            return JsonResponse({"error": "Unsupported file format."}, status=400)

        # Save uploaded file
        save_path = os.path.join(settings.MEDIA_ROOT, "uploads", uploaded_file.name)
        path = default_storage.save(save_path, ContentFile(uploaded_file.read()))

        try:
            # Returns dict with 'cases_txt_path', 'cases_vector_txt_path'
            output = extract_and_clean_texts(path)

            return JsonResponse({
                "status": "success",
                "original_file": uploaded_file.name,
                "text_paths": output
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
