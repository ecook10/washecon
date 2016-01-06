
from django.db import models
from django.contrib.contenttypes.models import ContentType



class Category(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', null=True, blank=True)
    # parent = models.CharField(max_length=200)

    def __str__(self):
        parent = Category.objects.get(id=self.parent.id)
        return self.name + "<--" + parent.name

    def get_nested_list(self, depth=0):
        final = []
        cats = self.category_set.exclude(name='ROOT').order_by('id')

        if len(cats) != 0:
            for i, c in enumerate(cats):
                final.append({'id': c.id, 'name': c.name, 'depth': depth})
                final.extend(c.get_nested_list(depth+1))

        return final





class Series(models.Model):
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=10)
    category = models.ForeignKey(Category, null=True)
    source = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.name





# class Code(models.Model):
#     name = models.CharField(max_length=100)
#     code = models.CharField(max_length=5)
#     type = models.CharField(max_length=50)
#
#     def __str__(self):
#         return self.name + ' - ' + self.code




class SeriesParameter(models.Model):
    series = models.ForeignKey(Series)
    key = models.CharField(max_length=100)
    value = models.CharField(max_length=250, blank=True)
    rank = models.IntegerField(default=1000)

    def __str__(self):
        return self.key + '=' + self.value + ' - ' + self.series.name





class UserOption(models.Model):
    param = models.OneToOneField(SeriesParameter)
    name = models.CharField(max_length=50)
    method = models.CharField(max_length=50)


    def __str__(self):
        return self.param.key + '=[' + self.method + '] - ' + self.param.series.name


    def get_template_name(self):
        return 'regionaldata/options/' + self.method + '.html'


    def get_series(self):
        return self.param.series

    get_series.short_description = 'Series'




class OptionParameter(models.Model):
    option = models.ForeignKey(UserOption)
    text = models.CharField(max_length=200)
    value = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.option.name + ': ' + self.text + '=' +self.value + ' - ' + self.option.param.series.name




#
# class Tag(models.Model):
#     name = models.CharField(max_length=50)
#     dataset = models.CharField(max_length=100)
#
#     def __str__(self):
#         return self.name
#
#
#
#
# class Label(models.Model):
#     value = models.CharField(max_length=200)
#     text = models.CharField(max_length=200)
#     tag = models.ForeignKey(Tag, null=True)
#
#     def __str__(self):
#         return self.text + ' - ' + self.value + ': ' + self.tag.name
#
#
#
#
# class Option(models.Model):
#     name = models.CharField(max_length=50)
#     series = models.ForeignKey(Series, null=True)
#     tag = models.ForeignKey(Tag, null=True)
#     form_type = models.CharField(max_length=50)
#
#
#     def __str__(self):
#         return self.name + ' - ' + self.series.name
#
#     def get_template_name(self):
#         return 'regionaldata/options/' + self.form_type + '.html'
#


