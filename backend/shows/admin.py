from django.contrib import admin
from django.utils.html import format_html
from django.conf import settings
from shows.models import Show, Round, Member, Contact, Role, Reimbursement
import csv
from django.http import HttpResponse

class RoundInlineAdmin(admin.TabularInline):
    model = Round


class RoleInlineAdmin(admin.TabularInline):
    model = Role


@admin.action(description="Refresh show Slack channels")
def refresh_channels(modeladmin, request, queryset):
    if(settings.ENABLE_SLACK_INTEGRATION):
        for show in queryset:
            if show.has_slack_channel:
                show.channel.force_refresh()


@admin.action(description="Archive show Slack channels")
def archive_channels(modeladmin, request, queryset):
    if(settings.ENABLE_SLACK_INTEGRATION):
        for show in queryset:
            if show.has_slack_channel:
                show.channel.archive(rename=False)


class ShowAdmin(admin.ModelAdmin):
    @staticmethod
    def rounds(show):
        count = show.rounds.count()
        return count if count > 0 else None

    list_display = [
        "name",
        "status",
        "is_slack_channel_active",
        "priority",
        "day_of_week",
        "date",
        "formatted_time",
        "lions",
        "performer_count",
        "rounds",
        "address",
        "notes",
        "rate",
        "payment_method",
    ]
    if(not settings.ENABLE_SLACK_INTEGRATION):
        list_display.remove("is_slack_channel_active")
    empty_value_display = "TBD"

    inlines = [RoundInlineAdmin, RoleInlineAdmin]

    actions = [refresh_channels, archive_channels]


class MemberAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "position",
        "school",
        "class_year",
    ]


class MemberInlineAdmin(admin.TabularInline):
    model = Member

class ReimbursementAdmin(admin.ModelAdmin):
    list_display = [
        "show",
        "user",
        "amount",
        "payment_method",
        "created_at",
    ]

    list_filter = [
        "show",
        "user",
        "created_at",
    ]

    search_fields = ["user__email", "show__name"]

    readonly_fields = [
        "user_first_name",
        "user_last_name",
        "show_date",
        "show_name",
        "receipt_url",
    ]

    actions = ["download_reimbursements_csv"]

    def receipt_link(self, obj):
        if obj.receipt_url:
            return format_html(
                '<a href="{}" target="_blank">Open receipt</a>',
                obj.receipt_url,
            )
        return "—"

    receipt_link.short_description = "Receipt"

    def download_reimbursements_csv(self, request, queryset):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="reimbursements.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "Performance Name",
            "Performance Date",
            "First Name",
            "Last Name",
            "Payment Method",
            "Username",
            "Amount",
            "Receipt Link",
            "Notes",
            "Submitted",
        ])

        for r in queryset:
            writer.writerow([
                r.show_name,
                r.show_date,
                r.user_first_name,
                r.user_last_name,
                r.get_payment_method_display(),
                r.payment_username,
                r.amount,
                r.receipt_url,
                r.notes,
                r.created_at.strftime("%Y-%m-%d %H:%M"),
            ])

        return response


admin.site.register(Show, ShowAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(Contact)
admin.site.register(Role)
admin.site.register(Reimbursement, ReimbursementAdmin)
