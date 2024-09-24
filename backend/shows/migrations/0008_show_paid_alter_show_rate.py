# Generated by Django 4.1.2 on 2024-08-19 21:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shows", "0007_alter_show_payment_method_alter_show_rate"),
    ]

    operations = [
        migrations.AddField(
            model_name="show",
            name="paid",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="show",
            name="rate",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=10,
                null=True,
                verbose_name="Show Fee",
            ),
        ),
    ]