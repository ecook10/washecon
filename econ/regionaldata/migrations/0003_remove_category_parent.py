# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-06 03:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('regionaldata', '0002_delete_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='parent',
        ),
    ]
