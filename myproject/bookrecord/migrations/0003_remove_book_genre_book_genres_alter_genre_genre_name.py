# Generated by Django 4.2.13 on 2024-06-07 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookrecord', '0002_basicinfo_buy_reason_alter_genre_genre_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='genre',
        ),
        migrations.AddField(
            model_name='book',
            name='genres',
            field=models.ManyToManyField(to='bookrecord.genre'),
        ),
        migrations.AlterField(
            model_name='genre',
            name='genre_name',
            field=models.CharField(max_length=100),
        ),
    ]
