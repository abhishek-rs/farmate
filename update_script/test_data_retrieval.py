import datetime
import pyrebase


def get_field_ids(db, user):
    all_fields = db.child("main").get(user['idToken'])
    ids = []
    for field in all_fields.each():
        ids.append(field.key())
    return ids


def get_data_from_field(id, db, user):
    area = db.child('main').child(id).child("area").get(user['idToken']).val()
    longitude = db.child('main').child(id).child("long_center").get(user['idToken']).val()
    latitude = db.child('main').child(id).child("lat_center").get(user['idToken']).val()

    year_transplant = db.child('main').child(id).child("year_transplant").get(user['idToken']).val()
    month_transplant = db.child('main').child(id).child("month_transplant").get(user['idToken']).val()
    day_transplant = db.child('main').child(id).child("day_transplant").get(user['idToken']).val()
    date_transplant = datetime.date(year_transplant, month_transplant, day_transplant)

    year_irrigation = db.child('main').child(id).child("year_irrigation").get(user['idToken']).val()
    month_irrigation = db.child('main').child(id).child("month_irrigation").get(user['idToken']).val()
    day_irrigation = db.child('main').child(id).child("day_irrigation").get(user['idToken']).val()
    date_irrigation = datetime.date(year_irrigation, month_irrigation, day_irrigation)

    dike_height = db.child('main').child(id).child("dike_height").get(user['idToken']).val()
    HP = l_to_cm(area, db.child('main').child(id).child("HP").get(user['idToken']).val())

    ## lists probably wont go correct
    HP_list = l_to_cm_list(area, db.child('main').child(id).child("HP_list").get(user['idToken']).val())
    RF_list = l_to_cm_list(area, db.child('main').child(id).child("RF_list").get(user['idToken']).val())
    ET_list = l_to_cm_list(area, db.child('main').child(id).child("ET_list").get(user['idToken']).val())
    DP_list = l_to_cm_list(area, db.child('main').child(id).child("DP_list").get(user['idToken']).val())
    RO_list = l_to_cm_list(area, db.child('main').child(id).child("RO_list").get(user['idToken']).val())
    IR_rec_list = l_to_cm_list(area, db.child('main').child(id).child("IR_rec_list").get(user['idToken']).val())
    desired_depth_chart = l_to_cm_list(area, db.child('main').child(id).child("desired_depth_chart").get(
        user['idToken']).val())
    critical_depth_chart = l_to_cm_list(area, db.child('main').child(id).child("critical_depth_chart").get(
        user['idToken']).val())
    soil = db.child('main').child(id).child("soil").get(user['idToken']).val()

    HP_pre_list = db.child('main').child(id).child("HP_pre_list").get(user['idToken']).val()
    ET_pre_list = db.child('main').child(id).child("ET_pre_list").get(user['idToken']).val()
    RF_pre_list = db.child('main').child(id).child("RF_pre_list").get(user['idToken']).val()
    DP_pre_list = db.child('main').child(id).child("DP_pre_list").get(user['idToken']).val()
    RO_pre_list = db.child('main').child(id).child("RO_pre_list").get(user['idToken']).val()

    return longitude, latitude, date_transplant, date_irrigation, dike_height, HP, HP_list, RF_list, ET_list, DP_list,\
           RO_list, desired_depth_chart, critical_depth_chart, soil, IR_rec_list, area, HP_pre_list, ET_pre_list, RF_pre_list, \
           DP_pre_list, RO_pre_list


def days_from_date(d0):
    d1 = datetime.date.today()
    n_of_days = d1 - d0
    return n_of_days.days


# area  in square meters, liters
def l_to_cm_list(area, liters):
    sq_dc = area * 100.  # convert to decimals
    dc = [x / sq_dc for x in liters]
    cm = [x * 10. for x in dc]  # 1dc = 10cm
    return cm


# area  in square meters, liters
def l_to_cm(area, liters):
    sq_dc = area * 100.  # convert to decimals
    dc = liters / sq_dc
    cm = dc * 10.  # 1dc = 10cm
    return cm


# area in square meters, height on field in cm
def cm_to_l_list(area, cm):
    sq_dc = float(area) * 100.
    dc = [x / 10. for x in cm]
    l = [x * sq_dc for x in dc]
    return l


def cm_to_l(area, cm):
    sq_dc = float(area) * 100.
    dc = cm / 10.
    l = dc * sq_dc
    return l


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

ids = get_field_ids(db, user)

for id in ids:
    ## get all data for a specific field
    data = get_data_from_field(id, db, user)
    print data
    longitude = data[0]
    latitude = data[1]
    days_since_transplant = days_from_date(data[2])
    days_since_irrigation = days_from_date(data[3])
    dike_height = data[4]
    HP = data[5]
    desired_depth_chart = data[11]
    critical_depth_chart = data[12]
    desired_depth = desired_depth_chart[days_since_transplant]
    critical_depth = critical_depth_chart[days_since_transplant]
