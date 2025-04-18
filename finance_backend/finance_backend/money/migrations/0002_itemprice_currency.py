# Generated by Django 5.0.13 on 2025-03-24 07:15

import django_choices_field.fields
from django.db import migrations

import finance_backend.money.choices


class Migration(migrations.Migration):
    dependencies = [
        ("money", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="itemprice",
            name="currency",
            field=django_choices_field.fields.TextChoicesField(
                choices=[("KRW", "원화"), ("USD", "달러")],
                choices_enum=finance_backend.money.choices.CurrencyType,
                default="USD",
                max_length=3,
            ),
        ),
    ]
