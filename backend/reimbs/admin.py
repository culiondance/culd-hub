from django.contrib import admin
from reimbs.models import Reimbursement


@admin.action(description="Mark a Reimbursement Request as Completed")
def mark_complete(modeladmin, request, queryset):
    for reimb in queryset:
        reimb.mark_completed()


class ReimbursementAdmin(admin.ModelAdmin):
    list_display = [
        "completed",
        "date",
        "member",
        "show",
        "amount",
        #"receipts",
    ]

    actions = [mark_complete]



#admin.site.register(Reimbursement)
#admin.site.unregister(Reimbursement)
admin.site.register(Reimbursement)
