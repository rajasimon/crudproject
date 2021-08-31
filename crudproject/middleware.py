from django.urls import resolve
from django.db.utils import IntegrityError

from crudproject.core.models import RequestLog


def request_user_pk_log_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        current_url = resolve(request.path_info).url_name

        if current_url == "users_pk":
            current_user_pk = resolve(request.path_info).kwargs["pk"]

            request_type = "GET"
            if request.method == "GET":
                request_type = 1
            elif request.method == "POST":
                request_type = 2
            elif request.method == "PUT":
                request_type = 3
            elif request.method == "DELETE":
                request_type = 4

            try:
                RequestLog.objects.create(
                    user_id=current_user_pk, request_type=request_type
                )
            except IntegrityError:
                print("FOREIGN KEY constraint failed")

        return response

    return middleware
