import graphene

from django.db.models.functions import Now
from graphene_file_upload.scalars import Upload
from shows.models import Show, Member, Role
from users.models import User
from users.mixins import (
    SendPasswordResetEmailMixin,
    LogoutUserMixin,
    ResetPasswordMixin,
    RegisterMixin,
    UpdateProfileMixin,
    UpdatePasswordMixin,
)
from .bases import DynamicArgsMixin
from .types import RoleType, ReimbursementType

from reimbs.models import Reimbursement




class CreateRoleMutation(graphene.Mutation):
    role = graphene.Field(RoleType)

    class Arguments:
        show_id = graphene.ID(required=True)

    @staticmethod
    def mutate(root, info, show_id):
        role_instance = Role(
            show=Show.objects.get(pk=show_id),
            performer=Member.objects.get(pk=info.context.user.member.id),
        )
        role_instance.save()
        return CreateRoleMutation(role=role_instance)


class DeleteRoleMutation(graphene.Mutation):
    role = graphene.Field(RoleType)

    class Arguments:
        show_id = graphene.ID(required=True)

    @staticmethod
    def mutate(root, info, show_id):
        role_instance = Role.objects.get(
            show=Show.objects.get(pk=show_id),
            performer=Member.objects.get(pk=info.context.user.member.id),
        )
        role_instance.delete()
        return DeleteRoleMutation(role=role_instance)


class CompleteReimb(graphene.Mutation):
    reimb = graphene.Field(ReimbursementType)

    class Arguments:
        id = graphene.ID(required=True)

    @staticmethod
    def mutate(id):
        reimbursement = Reimbursement.objects.get(pk=id)
        reimbursement.mark_completed()
        reimbursement.save()
        return CompleteReimb(reimb=id)

class DeleteReimb(graphene.Mutation):
    reimb = graphene.Field(ReimbursementType)
    class Arguments:
        reimb_id = graphene.ID(required=True)

    @staticmethod
    def mutate(root, info, reimb_id):
        reimb=Reimbursement.objects.get(pk=reimb_id)
        reimb.delete()
        return DeleteReimb(reimb=reimb)

class SubmitReimb(graphene.Mutation):
    reimb = graphene.Field(ReimbursementType)

    class Arguments:
        receipts = graphene.List(Upload, required=False)
        show = graphene.ID(required = True)
        amount = graphene.Float(required = True)

    @staticmethod
    def mutate(self, info, receipts, show, amount):
        
        member=Member.objects.get(pk=info.context.user.member.id)
        show_object=Show.objects.get(pk=show)
        date = Now()

        reimb_instance = Reimbursement(
            receipts = receipts,
            show = show_object,
            amount = amount,
            member = member,
            date = date
        )
        reimb_instance.save()

        return SubmitReimb(reimb = reimb_instance)



class RegisterMutation(DynamicArgsMixin, RegisterMixin, graphene.Mutation):
    __doc__ = RegisterMixin.__doc__
    _required_args = ["email", "password1", "password2", "first_name", "last_name"]
    _args = ["phone"]


class UpdateProfileMutation(DynamicArgsMixin, UpdateProfileMixin, graphene.Mutation):
    __doc__ = UpdateProfileMixin.__doc__
    _args = ["first_name", "last_name", "email", "phone", "school", "class_year"]


class UpdatePasswordMutation(DynamicArgsMixin, UpdatePasswordMixin, graphene.Mutation):
    __doc__ = UpdatePasswordMixin.__doc__
    _args = ["old_password", "password"]


class LogoutUserMutation(LogoutUserMixin, graphene.Mutation):
    __doc__ = LogoutUserMixin.__doc__


class SendPasswordResetEmailMutation(
    DynamicArgsMixin, SendPasswordResetEmailMixin, graphene.Mutation
):
    __doc__ = SendPasswordResetEmailMixin.__doc__
    _required_args = {"email": "String"}


class ResetPasswordMutation(DynamicArgsMixin, ResetPasswordMixin, graphene.Mutation):
    __doc__ = ResetPasswordMixin.__doc__
    _required_args = {"user_id": "ID", "token": "String", "password": "String"}
