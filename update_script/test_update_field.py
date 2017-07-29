import datetime
import pyrebase


def get_field_ids(db, user):
    all_fields = db.child("main").get(user['idToken'])
    ids = []
    for field in all_fields.each():
        ids.append(field.key())
    return ids


def update_field(HP_list, HP, RF_list, RF, ET_list, ET, DP_list, DP, RO_list, RO, IR, db, user, key):
    del HP_list[0]
    HP_list.append(HP)
    del RF_list[0]
    RF_list.append(RF)
    del ET_list[0]
    HP_list.append(ET)
    del DP_list[0]
    HP_list.append(DP)
    del RO_list[0]
    HP_list.append(RO)

    db.child("main").child(key).update({"HP": HP,
                                        "HP_list": HP_list,
                                        "RF_list": RF_list,
                                        "ET_list": ET_list,
                                        "DP_list": DP_list,
                                        "RO_list": RO_list,
                                        "IR_rec": IR},
                                       user['idToken']
                                       )

    return


def get_data_from_field(id, db, user):
    field_data = db.child('main').child(id).get(user['idToken']).val()
    longitude = field_data.items()[8][1]
    latitude = field_data.items()[2][1]
    area = field_data.items()[6][1]

    year_transplant = field_data.items()[24][1]
    month_transplant = field_data.items()[20][1]
    day_transplant = field_data.items()[18][1]
    date_transplant = datetime.date(year_transplant, month_transplant, day_transplant)

    year_irrigation = field_data.items()[13][1]
    month_irrigation = field_data.items()[22][1]
    day_irrigation = field_data.items()[19][1]
    date_irrigation = datetime.date(year_irrigation, month_irrigation, day_irrigation)

    dike_height = field_data.items()[17][1]
    HP = field_data.items()[1][1]

    ## lists probably wont go correct
    HP_list = field_data.items()[6][1]
    RF_list = field_data.items()[16][1]
    ET_list = field_data.items()[23][1]
    DP_list = field_data.items()[15][1]
    RO_list = field_data.items()[9][1]
    desired_depth_chart = field_data.items()[0][1]
    critical_depth_chart = field_data.items()[4][1]
    soil = field_data.items()[12][1]
    IR_rec_list = field_data.items()[8][1]

    print IR_rec_list
    return longitude, latitude, date_transplant, date_irrigation, dike_height, HP, HP_list, RF_list, ET_list, DP_list, RO_list, desired_depth_chart, critical_depth_chart, soil


def days_from_date(d0):
    d1 = datetime.date.today()
    n_of_days = d1 - d0
    return n_of_days.days


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
    data = get_data_from_field(id, db, user)
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

    HP = 5
    RF = 0
    ET = 0
    DP = 0
    RO = 0
    IR = 20
    print data
    update_field(data[6], HP, data[7], RF, data[8], ET, data[9], DP, data[10], RO, IR, db, user, id)
