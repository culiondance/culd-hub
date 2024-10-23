# Generated by Django 4.1.2 on 2024-10-10 13:50

from django.db import migrations, models
import django.db.models.deletion
import reimbs.models


class Migration(migrations.Migration):

    dependencies = [
        ('reimbs', '0008_alter_reimbursement_amount'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reimbursement',
            name='receipts',
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receipt', models.ImageField(upload_to=reimbs.models.get_upload_name)),
                ('reimb', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receipts', to='reimbs.reimbursement')),
            ],
        ),
    ]