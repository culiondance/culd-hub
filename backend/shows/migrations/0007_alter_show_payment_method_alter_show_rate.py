# Generated by Django 4.1 on 2023-01-21 16:37

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shows", "0006_show_payment_method_show_rate_alter_show_notes"),
    ]

    operations = [
        migrations.AlterField(
            model_name="show",
            name="payment_method",
            field=models.PositiveSmallIntegerField(
                blank=True,
                choices=[(0, "Cash"), (1, "Venmo"), (2, "PayPal"), (3, "Check")],
                default=None,
                null=True,
                verbose_name="payment method",
            ),
        ),
        migrations.AlterField(
            model_name="show",
            name="rate",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=10,
                null=True,
                verbose_name="rate",
            ),
        ),
    ]
