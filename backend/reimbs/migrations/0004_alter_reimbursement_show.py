# Generated by Django 4.1.2 on 2024-09-30 22:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0012_alter_show_rate'),
        ('reimbs', '0003_reimbursement_receipts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reimbursement',
            name='show',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='show', to='shows.show'),
        ),
    ]