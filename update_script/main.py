import fao_eto as fao
import requests
import time
import datetime
import pyrebase
import urllib
import re
from flask import Flask, jsonify


app = Flask(__name__)

## -------UPDATE FUNCTIONS---------- ##
def update_field(field_id, db, user):
    ## get all data for a specific field
    data = get_data_from_field(field_id, db, user)
    longitude = data[0]
    latitude = data[1]
    days_since_transplant = days_from_date(data[2])
    days_since_irrigation = days_from_date(data[3])
    dike_height = data[4]
    HP = data[5]
    desired_depth_chart = data[11]
    critical_depth_chart = data[12]
    soil = data[13]  # 0 is clay, 5 is sandy
    desired_depth = desired_depth_chart[days_since_transplant]
    critical_depth = critical_depth_chart[days_since_transplant]
    IR_rec_list = data[14]
    area = data[15]

    # http://www.fao.org/docrep/t7202e/t7202e07.htm
    DP = depthperlocation(soil)

    # Computer ET based on Modified Penman Method, ET=crop evapotranspiration
    ET = evapotranspiration(longitude, latitude)

    # Input rainfall in cm, find an API for this.
    RF = get_rain(longitude, latitude)

    # Compute HP, depth of ponding
    HP = HP + RF - ET - DP
    IR = 0
    RO = 0
    if HP <= critical_depth and days_since_transplant <= 14:
        IR = desired_depth - HP
        HP = HP
        RO = 0.
    elif HP <= critical_depth and days_since_transplant > 14 and days_since_irrigation > 2:
        IR = desired_depth - HP
        HP = HP
        RO = 0.
    elif HP > dike_height:
        # Runoff
        RO = HP - dike_height
        HP = dike_height
        IR = 0.
    elif HP <= dike_height and HP > critical_depth:
        IR = 0.
        HP = HP
        RO = 0.

    if HP < 0:
        HP = 0.

    upload_field(days_since_irrigation, data[21], data[6], HP, data[7], RF, data[8], ET, data[9], DP, data[10], RO, IR,
                 IR_rec_list, area, db, user, field_id)
    return


## use regex to pars the amount of water from darksky.net
def get_rain(longitude, latitude):
    yesterday = datetime.datetime.today() - datetime.timedelta(1)
    url = 'https://darksky.net/details/' + str(longitude) + ',' + str(latitude) + '/' + str(yesterday.year) + '-' + str(
        yesterday.month) + '-' + str(yesterday.day) + '/si24/en'
    f = urllib.urlopen(url)
    html = f.read()
    match_object = re.search('<span class="num swip">([0-9]?[0-9]?.?[0-9])<\/span>', html, flags=0)
    rain = match_object.group(1)
    rain = float(rain) / 10.
    return rain

def depthperlocation(soil):
    dp = (float(soil) / 10.) + 0.2
    return dp

# the water that is sucked up by plants. net_rad is an estimate.
def evapotranspiration(longitude, latitude):
    time_stamp = int(time.time()) - 86400  # unix timestamp of yesterday.
    url = 'https://api.darksky.net/forecast/87619986db6f3cc49bfd90d6f52038e9/' + str(longitude) + ',' + str(
        latitude) + ',' + str(time_stamp) + '?units=si&exclude=minutely,hourly,flags,currently,alerts'
    r = requests.get(url).json()

    ##try to find API for this data.
    net_rad = 100  # net radiation at crop surface MJ per m2 per day
    t_min = r['daily']['data'][0]['temperatureMin']
    t_max = r['daily']['data'][0]['temperatureMax']
    ws = r['daily']['data'][0]['windSpeed']
    atm_pres = r['daily']['data'][0]['pressure']
    rh_mean = r['daily']['data'][0]['humidity']

    ## Calculate ETo usinf fao_eto library
    t = fao.daily_mean_t(t_min, t_max)
    svp = fao.svp_from_t(t)  # Saturation Vapour pressure KpA
    svp_tmin = fao.svp_from_t(t_min)
    svp_tmax = fao.svp_from_t(t_max)
    avp = fao.avp_from_rhmean(svp_tmin, svp_tmax, rh_mean)  # Actual Vapour Pressure
    delta_svp = fao.delta_sat_vap_pres(t)
    psy = fao.psy_const(atm_pres)
    ET = fao.penman_monteith_ETo(net_rad, t, ws, svp, avp, delta_svp, psy)
    ET = ET / 10
    return ET


# send all new values to database
def upload_field(days_since_irrigation, IR_list, HP_list, HP, RF_list, RF, ET_list, ET, DP_list, DP, RO_list, RO, IR,
                 IR_rec_list, area, db, user, key):
    del HP_list[0]
    HP_list.append(round(HP, 5))
    del RF_list[0]
    RF_list.append(round(RF, 5))
    del ET_list[0]
    ET_list.append(round(ET, 5))
    del DP_list[0]
    DP_list.append(round(DP, 5))
    del RO_list[0]
    RO_list.append(round(RO, 5))
    del IR_rec_list[0]
    IR_rec_list.append(round(IR, 5))
    IR_rec_list = cm_to_l_list(area, IR_rec_list)

    if days_since_irrigation > 0:
        del IR_list[0]
        IR_list.append(0)
        IR_list = cm_to_l_list(area, IR_list)

    IR = round(cm_to_l(area, IR), 5)
    HP = round(HP, 5)

    db.child("main").child(key).update({"HP": HP,
                                        "HP_list": HP_list,
                                        "RF_list": RF_list,
                                        "ET_list": ET_list,
                                        "DP_list": DP_list,
                                        "RO_list": RO_list,
                                        "IR_rec": IR,
                                        "IR_list": IR_list,
                                        "IR_rec_list": IR_rec_list},
                                       user['idToken']
                                       )

    return

@app.route('/api/update/single_field/<string:field_id>', methods=['GET'])
def update_single_field(field_id):
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    update_field(field_id, db, user)
    response = jsonify({'field_id': field_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/update/field_user/<string:user_id>', methods=['GET'])
def update_field_user(user_id):
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    # get all fields
    ids = get_field_user(user_id, db, user)
    for field_id in ids:
        update_field(field_id, db, user)
    response = jsonify({'user_id': user_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/update/all_fields', methods=['GET'])
def update_all():
    ## setup connction to database
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    # get all fields
    ids = get_field_ids(db, user)

    for field_id in ids:
        update_field(field_id, db, user)
    response = jsonify({'all_fields': 'updated succesfully'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


## ------- PREDICT FUNCTIONS ---------- ##
def predict_field(field_id, db, user):
    data = get_data_from_field(field_id, db, user)
    longitude = data[0]
    latitude = data[1]
    days_since_transplant = days_from_date(data[2])
    days_since_irrigation = days_from_date(data[3])
    dike_height = data[4]
    HP = data[5]
    critical_depth_chart = data[12]
    soil = data[13]  # 0 is clay, 5 is sandy

    area = data[15]

    HP_pre_list = data[16]
    ET_pre_list = data[17]
    RF_pre_list = data[18]
    DP_pre_list = data[19]
    RO_pre_list = data[20]

    for day in range(5):
        DP = (float(soil) / 10.) + 0.2
        ET = evapotranspiration_forecast(longitude, latitude, day)
        RF = get_rain_forecast(longitude, latitude, day)

        HP_pre_list[day] = HP + RF - ET - DP
        HP = HP_pre_list[day]

        critical_depth = critical_depth_chart[days_since_transplant + day - 1]
        RO = 0
        if HP <= critical_depth and days_since_transplant <= 14:
            HP = HP
            RO = 0.
        elif HP <= critical_depth and days_since_transplant > 14 and days_since_irrigation > 2:
            HP = HP
            RO = 0.
        elif HP > dike_height:
            # Runoff
            RO = HP - dike_height
            HP = dike_height
        elif HP <= dike_height and HP > critical_depth:
            HP = HP
            RO = 0.

        if HP < 0:
            HP = 0.

        HP_pre_list[day] = round(HP, 5)
        ET_pre_list[day] = round(ET, 5)
        RF_pre_list[day] = round(RF, 5)
        RO_pre_list[day] = round(RO, 5)
        DP_pre_list[day] = round(DP, 5)

    upload_prediction(HP_pre_list, ET_pre_list, RF_pre_list, RO_pre_list, DP_pre_list, field_id, db, user, area)
    return


def evapotranspiration_forecast(longitude, latitude, day):
    time_stamp = int(time.time()) + 86400 * day  # unix timestamp of yesterday.
    url = 'https://api.darksky.net/forecast/87619986db6f3cc49bfd90d6f52038e9/' + str(longitude) + ',' + str(
        latitude) + ',' + str(time_stamp) + '?units=si&exclude=minutely,hourly,flags,currently,alerts'
    r = requests.get(url).json()

    ##try to find API for this data.
    net_rad = 150  # net radiation at crop surface MJ per m2 per day
    t_min = r['daily']['data'][0]['temperatureMin']
    t_max = r['daily']['data'][0]['temperatureMax']
    ws = r['daily']['data'][0]['windSpeed']
    atm_pres = r['daily']['data'][0]['pressure']
    rh_mean = r['daily']['data'][0]['humidity']

    ## Calculate ETo usinf fao_eto library
    t = fao.daily_mean_t(t_min, t_max)
    svp = fao.svp_from_t(t)  # Saturation Vapour pressure KpA
    svp_tmin = fao.svp_from_t(t_min)
    svp_tmax = fao.svp_from_t(t_max)
    avp = fao.avp_from_rhmean(svp_tmin, svp_tmax, rh_mean)  # Actual Vapour Pressure
    delta_svp = fao.delta_sat_vap_pres(t)
    psy = fao.psy_const(atm_pres)
    ET = fao.penman_monteith_ETo(net_rad, t, ws, svp, avp, delta_svp, psy)
    ET = ET / 10
    return ET


def get_rain_forecast(longitude, latitude, day):
    pre = datetime.datetime.today() + datetime.timedelta(day)
    url = 'https://darksky.net/details/' + str(longitude) + ',' + str(latitude) + '/' + str(pre.year) + '-' + str(
        pre.month) + '-' + str(pre.day) + '/si24/en'
    f = urllib.urlopen(url)
    html = f.read()
    match_object = re.search('<span class="num swip">([0-9]?[0-9]?.?[0-9])<\/span>', html, flags=0)
    rain = match_object.group(1)
    rain_forecast = float(rain) / 10.
    return rain_forecast


def upload_prediction(HP_pre_list, ET_pre_list, RF_pre_list, RO_pre_list, DP_pre_list, field_id, db, user, area):
    db.child("main").child(field_id).update({
        "HP_pre_list": HP_pre_list,
        "ET_pre_list": ET_pre_list,
        "RF_pre_list": RF_pre_list,
        "RO_pre_list": RO_pre_list,
        "DP_pre_list": DP_pre_list,
    },
        user['idToken']
    )
    return

@app.route('/api/predict/single_field/<string:field_id>', methods=['GET'])
def predict_single_field(field_id):
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    predict_field(field_id, db, user)
    response = jsonify({'field_id': field_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/predict/field_user/<string:user_id>', methods=['GET'])
def predict_field_user(user_id):
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    # get all fields
    ids = get_field_user(user_id, db, user)
    for field_id in ids:
        predict_field(field_id, db, user)
    response = jsonify({'user_id': user_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/predict/all_fields', methods=['GET'])
def predict_all():
    ## setup connction to database
    config = {
        "apiKey": "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
        "authDomain": "farmate-f4c81.firebaseapp.com",
        "databaseURL": "https://farmate-f4c81.firebaseio.com",
        "projectId": "farmate-f4c81",
        "storageBucket": "farmate-f4c81.appspot.com",
        "serviceAccount": "Farmate-4a85a1daab0d.json"
    }
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password("hello@thomaslangerak.nl", "random")
    db = firebase.database()

    # get all fields
    ids = get_field_ids(db, user)

    for field_id in ids:
        predict_field(field_id, db, user)
    response = jsonify({'all_fields': 'predicted'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


## ------- HELPER FUNCTIONS ---------- ##
# helper function to convert date to number of days past.
def days_from_date(d0):
    d1 = datetime.date.today()
    n_of_days = d1 - d0
    return n_of_days.days


# get all field from database
def get_field_ids(db, user):
    all_fields = db.child("main").get(user['idToken'])
    ids = []
    for field in all_fields.each():
        ids.append(field.key())
    return ids


def get_field_user(user_id, db, user):
    all_fields = db.child("user").child(str(user_id)).child("fields").get(user['idToken'])
    ids = []
    for field in all_fields.each():
        ids.append(field.key())
    return ids


# get all data for a specific field
def get_data_from_field(field_id, db, user):
    area = db.child('main').child(field_id).child("area").get(user['idToken']).val()
    longitude = db.child('main').child(field_id).child("long_center").get(user['idToken']).val()
    latitude = db.child('main').child(field_id).child("lat_center").get(user['idToken']).val()

    year_transplant = db.child('main').child(field_id).child("year_transplant").get(user['idToken']).val()
    month_transplant = db.child('main').child(field_id).child("month_transplant").get(user['idToken']).val()
    day_transplant = db.child('main').child(field_id).child("day_transplant").get(user['idToken']).val()
    date_transplant = datetime.date(year_transplant, month_transplant, day_transplant)

    year_irrigation = db.child('main').child(field_id).child("year_irrigation").get(user['idToken']).val()
    month_irrigation = db.child('main').child(field_id).child("month_irrigation").get(user['idToken']).val()
    day_irrigation = db.child('main').child(field_id).child("day_irrigation").get(user['idToken']).val()

    date_irrigation = datetime.date(year_irrigation, month_irrigation, day_irrigation)

    dike_height = db.child('main').child(field_id).child("dike_height").get(user['idToken']).val()
    HP = db.child('main').child(field_id).child("HP").get(user['idToken']).val()

    ## lists probably wont go correct
    HP_list = db.child('main').child(field_id).child("HP_list").get(user['idToken']).val()
    RF_list = db.child('main').child(field_id).child("RF_list").get(user['idToken']).val()
    ET_list = db.child('main').child(field_id).child("ET_list").get(user['idToken']).val()
    DP_list = db.child('main').child(field_id).child("DP_list").get(user['idToken']).val()
    RO_list = db.child('main').child(field_id).child("RO_list").get(user['idToken']).val()
    IR_list = l_to_cm_list(area, db.child('main').child(field_id).child("IR_list").get(user['idToken']).val())
    IR_rec_list = l_to_cm_list(area, db.child('main').child(field_id).child("IR_rec_list").get(user['idToken']).val())
    desired_depth_chart = db.child('main').child(field_id).child("desired_depth_chart").get(
        user['idToken']).val()
    critical_depth_chart = db.child('main').child(field_id).child("critical_depth_chart").get(
        user['idToken']).val()
    soil = int(db.child('main').child(field_id).child("soil_type").get(user['idToken']).val())

    HP_pre_list = db.child('main').child(field_id).child("HP_pre_list").get(user['idToken']).val()
    ET_pre_list = db.child('main').child(field_id).child("ET_pre_list").get(user['idToken']).val()
    RF_pre_list = db.child('main').child(field_id).child("RF_pre_list").get(user['idToken']).val()
    DP_pre_list = db.child('main').child(field_id).child("DP_pre_list").get(user['idToken']).val()
    RO_pre_list = db.child('main').child(field_id).child("RO_pre_list").get(user['idToken']).val()

    return longitude, latitude, date_transplant, date_irrigation, float(dike_height), float(
        HP), HP_list, RF_list, ET_list, DP_list, \
           RO_list, desired_depth_chart, critical_depth_chart, int(soil), IR_rec_list, float(
        area), HP_pre_list, ET_pre_list, RF_pre_list, \
           DP_pre_list, RO_pre_list, IR_list


# area  in square meters, liters
def l_to_cm_list(area, liters):
    sq_dc = float(area) * 100.  # convert to decimals
    dc = [float(x) / sq_dc for x in liters]
    cm = [x * 10. for x in dc]  # 1dc = 10cm
    return cm


# area  in square meters, liters
def l_to_cm(area, liters):
    sq_dc = float(area) * 100.  # convert to decimals
    dc = float(liters) / sq_dc
    cm = dc * 10.  # 1dc = 10cm
    return cm


# area in square meters, height on field in cm
def cm_to_l_list(area, cm):
    sq_dc = float(area) * 100.
    dc = [float(x) / 10. for x in cm]
    l = [x * sq_dc for x in dc]
    return l


def cm_to_l(area, cm):
    sq_dc = float(area) * 100.
    dc = float(cm) / 10.
    l = dc * sq_dc
    return l

@app.route('/')
def index():
    return "Hello, World!"

if __name__ == '__main__':
    port = 8000  # the custom port you want
    app.run(host='0.0.0.0', port=port)

