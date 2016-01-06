"""A module to abstract calls to the BEA (Bureau of Economic Analysis),
allowing for simpler, more readable code"""


param_defaults = {
    'datasetname': 'RegionalData',
    'parametername': 'KeyCode',
    'resultformat': 'json'
}

data_defaults = {
    'datasetname': 'RegionalData',
    'keycode': 'GDP_SP',
    'geoflips': '32000',
    'year': 'ALL',
    'resultformat': 'json'
}



class BEA_API():

    def __init__(self, key, method='data'):
        self.key = key
        self.base_url = "http://bea.gov/api/data/?UserID=" + key

        if method == 'data':
            self.defaults = data_defaults
            self.defaults['method'] = 'GetData'
        elif method == 'param':
            self.defaults = param_defaults
            self.defaults['method'] = 'GetParameterValues'


    def generate_request(self, options=None):
        # Replace defaults
        for key in options:
            if key in self.defaults:
                self.defaults[key] = options[key]

        final_url = self.base_url
        for key in self.defaults:
            final_url += '&' + key + '=' + self.defaults[key]
        return final_url

