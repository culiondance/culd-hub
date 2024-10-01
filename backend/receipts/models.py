from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import time

def get_upload_name(instance, filename):
    id = instance.user.id
    unixtime = time.mktime(instance.date.timetuple())
    return "user_{0}/{1}-{2}".format(id,filename,unixtime)

class Receipt(models.Model):
    receipt = models.ImageField(upload_to=get_upload_name)
