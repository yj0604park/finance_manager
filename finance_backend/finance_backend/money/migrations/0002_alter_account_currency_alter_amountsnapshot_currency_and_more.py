# Generated by Django 5.0.13 on 2025-03-16 22:15

import django.db.models.deletion
import django_choices_field.fields
import finance_backend.money.choices
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('money', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='currency',
            field=django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, default='USD', max_length=3),
        ),
        migrations.AlterField(
            model_name='amountsnapshot',
            name='currency',
            field=django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, default='USD', max_length=3),
        ),
        migrations.AlterField(
            model_name='salary',
            name='currency',
            field=django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, default='USD', max_length=3),
        ),
        migrations.AlterField(
            model_name='stock',
            name='currency',
            field=django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, default='USD', max_length=3),
        ),
        migrations.AlterField(
            model_name='w2',
            name='currency',
            field=django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, default='USD', max_length=3),
        ),
        migrations.CreateModel(
            name='Exchange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('from_amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('to_amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('from_currency', django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, max_length=3)),
                ('to_currency', django_choices_field.fields.TextChoicesField(choices=[('KRW', '원화'), ('USD', '달러')], choices_enum=finance_backend.money.choices.CurrencyType, max_length=3)),
                ('ratio_per_krw', models.DecimalField(blank=True, decimal_places=4, max_digits=10, null=True)),
                ('exchange_type', django_choices_field.fields.TextChoicesField(choices=[('ETC', '기타'), ('BANK', '은행'), ('WIREBARLEY', '와이어바알리'), ('CREDITCARD', '신용카드')], choices_enum=finance_backend.money.choices.ExchangeType, default='ETC', max_length=10)),
                ('from_transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exchange_from', to='money.transaction')),
                ('to_transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exchange_to', to='money.transaction')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
