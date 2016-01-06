from django.contrib import admin
from .models import Category, Series, SeriesParameter, UserOption, OptionParameter



class OptionParamInline(admin.TabularInline):
    model = OptionParameter
    extra = 4


class OptionAdmin(admin.ModelAdmin):
    list_display = ('get_series', 'name', 'method', 'param')

    fields = ['param', 'name', 'method']
    inlines = [OptionParamInline]



class SeriesParameterAdmin(admin.ModelAdmin):
    list_display = ('series', 'key', 'value', 'rank')

class SeriesParamInline(admin.TabularInline):
    model = SeriesParameter
    extra = 4


class SeriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'category', 'source')

    fields = ['name', 'key', 'category', 'source']
    inlines = [SeriesParamInline]



admin.site.register(Category)
# admin.site.register(Code)
admin.site.register(OptionParameter)

admin.site.register(SeriesParameter, SeriesParameterAdmin)
admin.site.register(Series, SeriesAdmin)
admin.site.register(UserOption, OptionAdmin)
