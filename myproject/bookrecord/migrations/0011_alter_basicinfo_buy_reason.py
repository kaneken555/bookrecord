# Generated by Django 4.2.13 on 2024-06-16 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookrecord', '0010_interestedbook'),
    ]

    operations = [
        migrations.AlterField(
            model_name='basicinfo',
            name='buy_reason',
            field=models.TextField(blank=True, null=True),
        ),
    ]
