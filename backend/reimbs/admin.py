from django.contrib import admin
from django.conf import settings
from reimbs.models import Reimbursment

class ReimbursementAdmin(admin.ModelAdmin):
    list_display = [
        "completed",
        "date",
        "user",
        "show",
        "amount",
        "receipts",
    ]

    actions = [mark_complete]

@admin.action(description="Mark a Reimbursement Request as Completed")
def mark_complete(modeladmin, request, queryset):
    for reimb in queryset:
        reimb.mark_completed()

admin.site.register(ReimbursementAdmin)
