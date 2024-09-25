from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings


class Reimbursement(models.Model):

    member = models.ForeignKey("shows.Member", on_delete=models.CASCADE, related_name="reimbs", null = True)

    show = models.OneToOneField(
        "shows.Show", related_name="show", on_delete=models.CASCADE, null=True
    )

    amount = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=5)

    date = models.DateField(verbose_name="date filled out")

    #receipts = ArrayField(models.ImageField(upload_to="receipts/%Y-%m-%d"))

    completed = models.BooleanField(default=False, verbose_name="completed")
    

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if settings.ENABLE_SLACK_INTEGRATION:
            self.fetch_slack_user()

    def mark_completed(self):
        if not self.completed:
            #self.delete_receipts()
            self.completed = True
            super().save()
    '''
    def delete_receipts(self):
        for image in self.receipts:
            FileSystemStorage.delete(image.name)
    '''
