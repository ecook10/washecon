from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^browse/([0-9]+)?', views.browse, name='browse'),
    url(r'^getdata', views.getdata, name='getdata'),
    url(r'^showdata', views.showdata, name='showdata'),
    url(r'^search/([0-9]+)?', views.search, name='search'),
    # url(r'^test/', views.test, name='test')
]
