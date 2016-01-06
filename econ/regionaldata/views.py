from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.core import serializers

from regionaldata.models import Series, Category, SeriesParameter, UserOption, OptionParameter
from django.db.models import Q

import requests, re, json, urllib


def index(request):
    # Redirect to homepage
    return redirect('/')


def browse(request, series_id):

    # Prepare categories for template
    root_category = Category.objects.get(name='ROOT')
    nested_categories = root_category.get_nested_list()

    prev_depth = 2
    for cat in nested_categories:
        cat['change'] = cat['depth'] - prev_depth
        prev_depth = cat['depth']

        cat['series'] = Series.objects.filter(category=cat['id'])

    this_series = None
    user_options = []
    series_params = []

    # If id of series was provided in url, populate user options based on the series' parameters
    if series_id:
        this_series = Series.objects.get(id=series_id)
        series_params = SeriesParameter.objects.filter(series=this_series).order_by('rank')

        for param in series_params:
            param.key = param.key.replace('%', '_')
            if param.value == '' and hasattr(param, 'useroption'):
                new_option = {}

                new_option['key'] = param.key
                new_option['name'] = param.useroption.name
                new_option['method'] = param.useroption.method
                new_option['template'] = param.useroption.get_template_name()
                new_option['option_params'] = param.useroption.optionparameter_set.all()

                user_options.append(new_option)
                print(new_option)



    return render(request, 'regionaldata/browse.html', {
        'categories': nested_categories,
        'options': user_options,
        'parameters': series_params,
        'this': this_series})




def showdata(request):
    params = request.GET.dict()
    formatted_params = []

    for p in params:
        formatted_params.append({'key': p, 'value': params[p]})

    return render(request, 'regionaldata/showdata.html', {'params': formatted_params})



def search(request, series_id):

    query = request.GET.get('q', False)
    search_results = []

    if query:
        search_results = Series.objects.filter(name__icontains=query)

    this_series = None
    user_options = []
    series_params = []

    # If id of series was provided in url, populate user options based on the series' parameters
    if series_id:
        this_series = Series.objects.get(id=series_id)
        series_params = SeriesParameter.objects.filter(series=this_series).order_by('rank')

        for param in series_params:
            param.key = param.key.replace('%', '_')
            if param.value == '' and hasattr(param, 'useroption'):
                new_option = {}

                new_option['key'] = param.key
                new_option['name'] = param.useroption.name
                new_option['method'] = param.useroption.method
                new_option['template'] = param.useroption.get_template_name()
                new_option['option_params'] = param.useroption.optionparameter_set.all()

                user_options.append(new_option)


    return render(request, 'regionaldata/search.html', {
        'query': query,
        'results': search_results,
        'options': user_options,
        'parameters': series_params,
        'this': this_series})


def getdata(request):
    """ All-inclusive view that returns raw data to user - data returned depends on 'type' GET parameter """

    # TODO: more validation

    type = request.GET.get('type', False)

    if type == 'getselectdata' or type == 'getchartdata':
        """ Parameters: 'url' - url to look up data, the rest are used to populate the request
        getselectdata - Returns data to populate a 'select' option field in list of {'name': ___, 'val': ___} objects
        getchartdata - Returns data for chart """

        params = request.GET.dict()

        req_url = urllib.parse.unquote(params['url'])
        final_params = {}
        if type == 'getselectdata':
            final_params['UserID'] = '4ed778ea-6730-455d-8c60-1de273f8499d'

        for key in params:

            if key != 'type' and key != 'url':
                final_params[key] = urllib.parse.unquote(params[key])

        r = requests.get(req_url, params=final_params)
        res_json = r.json()

        final_data = []

        if type == 'getselectdata':
            for param in res_json['BEAAPI']['Results']['ParamValue']:       # Not extendable to non-BEA api services!!
                new_param = {
                    "name": param['Desc'],
                    "val": param['Key']
                }
                final_data.append(new_param)

        elif type == 'getchartdata':
            for param in res_json['BEAAPI']['Results']['Data']:
                new_param = [param['TimePeriod'], param['DataValue']]
                final_data.append(new_param)


        # Render data
        return HttpResponse(json.dumps(final_data), content_type='text/plain')


    elif type == 'getchartdata':

        params = request.GET.dict()

        req_url = urllib.parse.unquote(params['url'])
        final_params = {}

        for key in params:

            if key != 'type' and key != 'url':
                final_params[key] = urllib.parse.unquote(params[key])


    elif not type:
        return HttpResponseBadRequest('You must specify a method')


    else:
        return HttpResponseBadRequest('Method not found')




