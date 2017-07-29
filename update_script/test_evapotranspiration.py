import fao_eto as fao
import requests
import time
import urllib
import datetime
import re

def get_rain(longitude, latitude):
    yesterday=datetime.datetime.today()-datetime.timedelta(1)
    url = 'https://darksky.net/details/'+str(longitude)+','+str(latitude)+'/'+str(yesterday.year)+'-'+str(yesterday.month)+'-'+str(yesterday.day)+'/si24/en'
    f = urllib.urlopen(url)
    html = f.read()
    match_object = re.search('<span class="num swip">([0-9]?[0-9]?.?[0-9])<\/span>', html, flags=0)
    rain = match_object.group(1)
    rain = float(rain)/10.
    return rain


def evapotranspiration(longitude, latitude):
    time_stamp = int(time.time()) - 86400  # unix timestamp of yesterday.
    url = 'https://api.darksky.net/forecast/87619986db6f3cc49bfd90d6f52038e9/' + str(longitude) + ',' + str(
        latitude) + ',' + str(time_stamp) + '?units=si&exclude=minutely,hourly,flags,currently,alerts'
    r = requests.get(url).json()

    ##try to find API for this data.
    net_rad = 20  # net radiation at crop surface MJ per m2 per day
    t_min = r['daily']['data'][0]['temperatureMin']
    t_max = r['daily']['data'][0]['temperatureMax']
    ws = r['daily']['data'][0]['windSpeed']
    atm_pres = r['daily']['data'][0]['pressure']
    rh_mean = r['daily']['data'][0]['humidity']

    ## Calculate ETo usinf fao_eto library
    t = fao.daily_mean_t(t_min, t_max)
    print t
    svp = fao.svp_from_t(t)  # Saturation Vapour pressure KpA
    svp_tmin = fao.svp_from_t(t_min)
    svp_tmax = fao.svp_from_t(t_max)
    avp = fao.avp_from_rhmean(svp_tmin, svp_tmax, rh_mean)  # Actual Vapour Pressure
    delta_svp = fao.delta_sat_vap_pres(t)
    psy = fao.psy_const(atm_pres)
    ET = fao.penman_monteith_ETo(net_rad, t, ws, svp, avp, delta_svp, psy)
    ET = ET / 10
    return ET


get_rain(25.5379, 91.2999)
r = evapotranspiration(25.5379, 91.2999)
print r
