# Generated by Django 4.2.13 on 2024-06-08 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookrecord', '0007_alter_postreadingsummary_registration_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postreadingsummary',
            name='registration_date',
            field=models.DateField(),
        ),
    ]
