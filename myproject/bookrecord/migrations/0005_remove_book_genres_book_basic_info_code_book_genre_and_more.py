# Generated by Django 4.2.13 on 2024-06-07 22:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bookrecord', '0004_alter_genre_genre_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='genres',
        ),
        migrations.AddField(
            model_name='book',
            name='basic_info_code',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='bookrecord.basicinfo'),
        ),
        migrations.AddField(
            model_name='book',
            name='genre',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='bookrecord.genre'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='bookuser',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='UserInfo',
        ),
    ]
