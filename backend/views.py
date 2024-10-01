import os
from django.conf import settings
from django.urls import reverse
from django.views import generic
from django.views.decorators.http import require_POST

from receipts.models import Receipt

@require_POST
def upload( request ):
    

    return None


@require_POST
def upload_delete( request, pk ):
    return None

