from django.forms import ModelForm
from reimbs.models import Reimbursement

class ReimbursementForm(ModelForm):
    class Meta:
        model = Reimbursement
        fields = ['member', 'show', 'amount', 'description', 'receipts']
