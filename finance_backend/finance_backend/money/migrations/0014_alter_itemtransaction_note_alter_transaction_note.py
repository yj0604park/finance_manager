# Generated by Django 5.2 on 2025-05-05 08:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("money", "0013_alter_retailer_category_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemtransaction",
            name="note",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="transaction",
            name="note",
            field=models.TextField(blank=True, default=""),
        ),
    ]
