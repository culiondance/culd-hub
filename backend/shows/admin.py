from django.contrib import admin
from django.conf import settings
from shows.models import Show, Round, Member, Contact, Role


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
        "day_of_week",
        "date",
        "rate",
        "paid",
        "formatted_time",
        "lions",
        "performer_count",
        "rounds",
        "address",
        "notes",
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


admin.site.register(Show, ShowAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(Contact)
admin.site.register(Role)
