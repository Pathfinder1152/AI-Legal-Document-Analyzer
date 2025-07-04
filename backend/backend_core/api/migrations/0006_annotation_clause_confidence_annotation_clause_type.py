# Generated by Django 5.1.6 on 2025-05-14 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_document_file_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='clause_confidence',
            field=models.FloatField(blank=True, help_text='Confidence score for clause type classification', null=True),
        ),
        migrations.AddField(
            model_name='annotation',
            name='clause_type',
            field=models.CharField(blank=True, help_text='LEDGAR clause type classification', max_length=50, null=True),
        ),
    ]
