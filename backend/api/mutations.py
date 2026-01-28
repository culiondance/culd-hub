import graphene

from shows.models import Show, Member, Role, Reimbursement
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


class SubmitReimbursementMutation(graphene.Mutation):
    """Submit a reimbursement request for a performance"""
    reimbursement = graphene.Field(ReimbursementType)
    success = graphene.Boolean()
   
    
    class Arguments:
        show_id = graphene.ID(required=True)
        photo_url = graphene.String(required=True)  # URL of uploaded photo
        notes = graphene.String()
        payment_method = graphene.String(required=True)  # "venmo" or "zelle"
        amount = graphene.Decimal(required=True)
    
    @classmethod
    def mutate(cls, root, info, show_id, photo_url, notes, payment_method, amount):
        user = info.context.user
        show = Show.objects.get(pk=show_id)
        
        # Fetch payment username based on method
        if payment_method == "venmo":
            payment_username = user.venmo_username
        elif payment_method == "zelle":
            payment_username = user.zelle_username
        else:
            return cls(
                success=False,
                errors={"payment_method": "Invalid payment method"}
            )
        
        # Create reimbursement record with denormalized fields
        reimbursement = Reimbursement(
            show=show,
            user=user,
            user_first_name=user.first_name,
            user_last_name=user.last_name,
            show_date=show.date,
            show_name=show.name,
            photo_url=photo_url,
            notes=notes,
            payment_method=payment_method,
            payment_username=payment_username,
            amount=amount,
        )
        reimbursement.save()
        
        return cls(success=True, reimbursement=reimbursement)