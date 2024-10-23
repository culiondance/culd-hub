import graphene
from graphene import Scalar
from graphene_django import DjangoObjectType
from graphene_django.utils import camelize

from common.exceptions import WrongUsage
from shows.models import Member, Show, Round, Contact, Role
from users.models import User
from reimbs.models import Reimbursement, Receipt, ReceiptList


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "phone", "member")


class MemberType(DjangoObjectType):
    class Meta:
        model = Member
        fields = (
            "id",
            "user",
            "position",
            "school",
            "class_year",
            "performed_shows",
            "pointed_shows",
        )
        convert_choices_to_enum = False


class ShowType(DjangoObjectType):
    class Meta:
        model = Show
        fields = (
            "id",
            "name",
            "date",
            "time",
            "rounds",
            "address",
            "lions",
            "point",
            "contact",
            "performers",
            "is_campus",
            "is_out_of_city",
            "priority",
            "status",
            "notes",
        )
        convert_choices_to_enum = False

    is_open = graphene.Boolean()
    is_pending = graphene.Boolean()

    def resolve_is_open(self, info):
        return self.is_open()  # noqa

    def resolve_is_pending(self, info):
        return self.pending  # noqa

class ReimbursementType(DjangoObjectType):
    class Meta:
        model = Reimbursement
        fields = ("id", "member", "show", "amount", "date", "completed", "receipts", "description")

class ReceiptListType(DjangoObjectType):
    class Meta:
        model = ReceiptList
        fields = ("id","receipts", "reimb")

class ReceiptType(DjangoObjectType):
    class Meta:
        model = Receipt
        fields = ("id","image", "collection")

class RoundType(DjangoObjectType):
    class Meta:
        model = Round
        fields = ("id", "show", "time")


class ContactType(DjangoObjectType):
    class Meta:
        model = Contact
        fields = ("id", "first_name", "last_name", "phone", "email")


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        fields = ("id", "show", "performer", "role")


class ExpectedErrorType(Scalar):
    @staticmethod
    def serialize(errors):
        if isinstance(errors, dict):
            if errors.get("__all__", False):
                errors["non_field_errors"] = errors.pop("__all__")
            return camelize(errors)
        elif isinstance(errors, list):
            return {"nonFieldErrors": errors}
        raise WrongUsage("`errors` must be list or dict!")
