# Generated by Django 5.1.6 on 2025-05-03 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_document_annotation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='file_type',
            field=models.CharField(max_length=255),
        ),
    ]
