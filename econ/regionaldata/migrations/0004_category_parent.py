# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-06 03:26
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('regionaldata', '0003_remove_category_parent'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='regionaldata.Category'),
        ),
    ]