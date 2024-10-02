from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from reimbs.models import Reimbursement
import time

def get_upload_name(instance, filename):
    id = instance.user.id
    unixtime = time.mktime(instance.date.timetuple())
    return "user_{0}/{1}-{2}".format(id,filename,unixtime)

class Receipt(models.Model):
    receipt = models.ImageField(upload_to=get_upload_name)
    source = models.ForeignKey(Reimbursement, on_delete=models.CASCADE,null=True, related_name="receipts")

    def assign_reimb(self, Reimbursement):
        self.source = Reimbursement

