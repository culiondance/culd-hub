from django.contrib.postgres.fields import ArrayField 
from django.db import models
from django import FileSystemStorage

class Reimbursement(models.Model):

    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    show = models.OneToOneField(
        "shows.Show", related_name="show", on_delete=models.CASCADE, null=True
    )
    
    amount = models.DecimalField(
        null=True, blank=True, decimal_places=2, max_digits=5
    )

    date = models.DateField(verbose_name="date filled out")

    receipts = ArrayField(
        models.ImageField(upload_to="%Y-%m-%d")
    )

    completed = models.BooleanField(default=False, verbose_name="completed")
     
    def mark_completed(self):
        if not self.completed:
            self.delete_receipts()
            self.completed = True
            super().save()

    def delete_receipts(self):
        for image in self.receipts:
            FileSystemStorage.delete(image.name)

    
