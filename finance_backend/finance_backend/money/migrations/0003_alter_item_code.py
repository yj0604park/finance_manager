# Generated by Django 5.0.13 on 2025-03-24 09:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("money", "0002_itemprice_currency"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="code",
            field=models.CharField(default="", max_length=20),
        ),
    ]
