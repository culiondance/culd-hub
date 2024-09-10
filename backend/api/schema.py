import json

import graphene
import graphql_jwt
from django.dispatch import receiver
from graphql_jwt.decorators import login_required, staff_member_required
from graphql_jwt.refresh_token.signals import refresh_token_rotated

from shows.models import Member, Show, Role
from users.models import User
from .mutations import (
    CreateRoleMutation,
    DeleteRoleMutation,
    LogoutUserMutation,
    SendPasswordResetEmailMutation,
    ResetPasswordMutation,
    RegisterMutation,
    UpdateProfileMutation,
    UpdatePasswordMutation,
)
from .types import UserType, MemberType, ShowType, ReimbursementType


@receiver(refresh_token_rotated)
def revoke_refresh_token(sender, request, refresh_token, **kwargs):
    refresh_token.revoke(request)


def tuple_to_json(tuple_dict):
    return json.dumps(dict((k, v) for k, v in tuple_dict))


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    members = graphene.List(MemberType)
    shows = graphene.List(ShowType)
    me = graphene.Field(UserType)
    reimbs = graphene.List(ReimbursementType)
    my_reimbs = graphene.List(ReimbursementType, user = graphene.String())

    school_choices = graphene.String()
    class_year_choices = graphene.String()
    position_choices = graphene.String()
    show_priority_choices = graphene.String()
    show_status_choices = graphene.String()
    performance_role_choices = graphene.String()

    @staticmethod
    @staff_member_required
    def resolve_users(root, info, **kwargs):
        return User.objects.all()

    @staticmethod
    @login_required
    def resolve_members(root, info, **kwargs):
        return Member.objects.all()

    @staticmethod
    def resolve_shows(root, info, **kwargs):
        return Show.objects.filter(status__gt=Show.STATUSES.draft)

    @staticmethod
    @login_required
    def resolve_me(root, info, **kwargs):
        return User.objects.get(pk=info.context.user.pk)

    @staticmethod
    def resolve_school_choices(root, info, **kwargs):
        return tuple_to_json(Member.SCHOOLS)

    @staticmethod
    def resolve_class_year_choices(root, info, **kwargs):
        return tuple_to_json(Member.CLASS_YEARS)

    @staticmethod
    def resolve_position_choices(root, info, **kwargs):
        return tuple_to_json(Member.POSITIONS)

    @staticmethod
    def resolve_show_priority_choices(root, info, **kwargs):
        return tuple_to_json(Show.PRIORITIES)

    @staticmethod
    def resolve_show_status_choices(root, info, **kwargs):
        return tuple_to_json(Show.STATUSES)

    @staticmethod
    def resolve_performance_role_choices(root, info, **kwargs):
        return tuple_to_json(Role.ROLES)


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()

    register = RegisterMutation.Field()
    create_role = CreateRoleMutation.Field()
    delete_role = DeleteRoleMutation.Field()
    update_profile = UpdateProfileMutation.Field()
    update_password = UpdatePasswordMutation.Field()

    logout_user = LogoutUserMutation.Field()
    send_password_reset_email = SendPasswordResetEmailMutation.Field()
    reset_password = ResetPasswordMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)  # noqa
