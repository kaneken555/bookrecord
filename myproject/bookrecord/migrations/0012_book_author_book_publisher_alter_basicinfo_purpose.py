# Generated by Django 4.2.13 on 2024-08-13 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookrecord', '0011_alter_basicinfo_buy_reason'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='author',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='publisher',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='basicinfo',
            name='purpose',
            field=models.TextField(blank=True, null=True),
        ),
    ]
