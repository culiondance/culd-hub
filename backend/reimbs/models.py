from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings

import time
import pathlib


def get_upload_name(instance, filename):
    id = instance.id
    extension = pathlib.Path(filename).suffix
    unixtime = time.time()
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
        from django.utils.html import mark_safe
        response = u''
        for receipt in self.get_receipts():
            response+= u'<img src="/receipts/%s"/height=75 width=75><br>' % mark_safe(str(receipt.image))
        return mark_safe(response)

    def get_receipts(self):
        receipt_list = self.receipt_list.receipts.all()
        return receipt_list

    reimb_receipts.short_description = 'Image'
    reimb_receipts.allow_tags = True

class ReceiptList(models.Model):
    reimb = models.OneToOneField(Reimbursement, on_delete=models.CASCADE, related_name="receipt_list", null=True)


class Receipt(models.Model):
    image = models.ImageField(upload_to=get_upload_name)
    collection = models.ForeignKey(ReceiptList, on_delete=models.CASCADE, related_name="receipts", null = True)


