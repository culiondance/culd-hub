import graphene
from decimal import Decimal

class DecimalScalar(graphene.Scalar):
    """Custom GraphQL scalar to handle Decimal objects for reimbursement amount"""

    @staticmethod
    def serialize(dec: Decimal):
        # Convert Decimal to string for JSON serialization
        return str(dec)

    @staticmethod
    def parse_literal(node):
        # Parse input literals (from query)
        if isinstance(node.value, str):
            return Decimal(node.value)
        elif isinstance(node.value, (int, float)):
            return Decimal(str(node.value))
        return None

    @staticmethod
    def parse_value(value):
        # Parse input variables
        return Decimal(str(value))
