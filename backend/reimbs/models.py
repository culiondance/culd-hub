from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings

import time

def get_upload_name(instance, filename):
    id = instance.user.id
    unixtime = time.mktime(instance.date.timetuple())
    return "user_{0}/{1}-{2}".format(id,filename,unixtime)


class Reimbursement(models.Model):

    member = models.ForeignKey("shows.Member", on_delete=models.CASCADE, related_name="reimbs", null = True)

    show = models.ForeignKey(
        "shows.Show", related_name="show", on_delete=models.CASCADE, null=True
    )

    amount = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    date = models.DateField(verbose_name="date filled out", auto_now_add=True)
    
    description = models.TextField(null = True)

    receipts = ArrayField(models.ImageField(upload_to=get_upload_name), null= True)

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

    def my_receipts(self):
        # TODO: normalize
        return(self.receipts)



