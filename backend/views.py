import os
from django.conf import settings
from django.urls import reverse
from django.views import generic
from django.views.decorators.http import require_POST
from jfu.http import upload_receive, UploadResponse, JFUResponse

from receipts.models import Receipt

@require_POST
def upload( request ):
    files = upload_receive( request )
    basenames = []

    for file in files:
        instance = Receipt( file = file )
        instance.save()
        basenames.append(os.path.basename(instance.file.path))

    file_dict = {
        'names' : basenames,
        'size' : file.size,

        'url': settings.MEDIA_URL + basenames,
        'thumbnailUrl': settings.MEDIA_URL + basenames,

        'deleteUrl': reverse('jfu_delete', kwargs = { 'pk': instance.pk }),
        'deleteType': 'POST',
    }

    return UploadResponse( request, file_dict )


@require_POST
def upload_delete( request, pk ):
    success = True
    try:
        instance = Receipt.objects.get( pk = pk )
        os.unlink( instance.file.path )
        instance.delete()
    except Receipt.DoesNotExist:
        success = False

    return JFUResponse( request, success )
