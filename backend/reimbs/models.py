from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings

import time
import pathlib


def get_upload_name(instance, filename):
    reimb = instance.reimb
    id = reimb.member.id
    extension = pathlib.Path(filename).suffix
    unixtime = time.mktime(reimb.date.timetuple())
    return "user_{0}/{1}-{2}{3}".format(id,filename,unixtime, extension)



class Reimbursement(models.Model):

    member = models.ForeignKey("shows.Member", on_delete=models.CASCADE, related_name="reimbs", null = True)

    show = models.ForeignKey(
        "shows.Show", related_name="show", on_delete=models.CASCADE, null=True
    )

    amount = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    date = models.DateField(verbose_name="date filled out", auto_now_add=True)
    
    description = models.TextField(null = True)

    completed = models.BooleanField(default=False, verbose_name="completed")
    

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if settings.ENABLE_SLACK_INTEGRATION:
            self.fetch_slack_user()

    def mark_completed(self):
        if not self.completed:
            self.delete_receipts()
            self.completed = True
            super().save()
    
    def delete_receipts(self):
        print(self.receipts)

    def reimb_receipts(self):
        response = u''
        for receipt in self.receipts.all():
            response+= u'<img src="%s"/>' %receipt.receipt.path
        return response

    def get_receipts(self):
        receipt_list = self.receipts.all()
        if receipt_list is None:
            return None
        return receipt_list[0].receipts.all()


    reimb_receipts.short_description = 'Image'
    reimb_receipts.allow_tags = True

class ReceiptList(models.Model):
    reimb = models.ForeignKey(Reimbursement, on_delete=models.CASCADE, related_name="receipts")


class Receipt(models.Model):
    receipt = models.ImageField(upload_to=get_upload_name)
    Collection = models.ForeignKey(ReceiptList, on_delete=models.CASCADE, related_name="receipts")


