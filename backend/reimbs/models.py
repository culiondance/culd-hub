import re

from django.contrib.postgres.fields import ArrayField 

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext as _
from model_utils import Choices
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from slack.models import SlackUser, SlackChannel


from users.models import User
from shows.models import Show
class Reimbursement
     
    user = models.OneToOneField(
        User, related_name="member", on_delete=models.CASCADE, null=True
    )

    show = models.OneToOneField(
        Show, related_name="show", on_delete=models.CASCADE, null=True
    )
    
    amount = models.DecimalField(
        null=True, blank=True
    )

    date = models.DateField(verbose_name="date filled out")

    receipts = ArrayField(
        models.ImageField(upload_to="%Y-%m-%d")
    )

    completed = models.BooleanField(default=False, verbose_name="completed")
    
    
    def mark_completed(self):
        if !self.completed:
            self.delete_receipts()
            self.completed = true
            super().save()

    def delete_receipts(self):
        for image in self.receipts:
            FileSystemStorage.delete(image.name)

    
