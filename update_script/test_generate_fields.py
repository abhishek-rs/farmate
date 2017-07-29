import pyrebase
import random
import numpy as np


def cm_to_l(area, cm):
    sq_dc = float(area) * 100.
    dc = float(cm) / 10.
    l = dc * sq_dc
    return l


def l_to_cm(area, liters):
    sq_dc = float(area) * 100.  # convert to decimals
    dc = float(liters) / sq_dc
    cm = dc * 10.  # 1dc = 10cm
    return cm


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

all_fields = db.child("main").get(user['idToken'])
ids = []
for field in all_fields.each():
    ids.append(field.key())

for id in ids:
    area = random.randrange(10, 50, 1)*0.1
    RF_list = np.zeros(30)
    HP = random.randrange(0, 15, 1)

    for i in range(30):
        day = random.randrange(0, len(RF_list), 1)
        amount = random.randrange(0., 50., 1)*0.1
        RF_list[day] = amount
    RF_list.tolist()

    ET_list = []
    for i in range(30):
        amount = random.randrange(20, 25, 1)*0.1
        ET_list.append(amount)

    DP_list = []
    for i in range(30):
        DP_list.append(0.5)

    RO_list = np.zeros(30)
    RO_list.tolist()

    IR_list = np.zeros(30)
    n_irrigations = random.randrange(3, 14, 1)
    for i in range(n_irrigations):
        day = random.randrange(0, len(IR_list), 1)
        amount = random.randrange(5000, 15000, 1000)
        IR_list[day] = amount
    IR_list.tolist()

    IR_rec_list = np.zeros(30)
    n_irrigations = random.randrange(3, 14, 1)
    for i in range(n_irrigations):
        day = random.randrange(0, len(IR_rec_list), 1)
        amount = random.randrange(10000, 20000, 1000)
        IR_rec_list[day] = amount

    IR_rec_list[-1] = random.randrange(0, 10000, 500)
    IR_rec = IR_rec_list[-1]
    IR_rec_list.tolist()

    n = 0
    max_l = 14
    day = 14
    phase = 7
    desired_depth_chart = []
    for i in range(50):
        level = max_l - n
        n += 1
        desired_depth_chart.append(level)

        if level < phase:
            n = 0
        if i > day:
            phase = 2
            max_l = 7

    crit_day = 20
    first_phase = 3
    second_phase = 0
    critical_depth_chart = []
    for i in range(50):
        if i < crit_day:
            critical_depth_chart.append(first_phase)
        else:
            critical_depth_chart.append(second_phase)

    HP_list = []
    dike_height=random.randrange(7,15,1)

    for i in range(30):
        HP_list.append(HP)
        HP = HP + RF_list[i] + l_to_cm(area, IR_list[i]) - l_to_cm(area, DP_list[i]) - l_to_cm(area,
                                                                                               RO_list[i]) - l_to_cm(
            area, ET_list[i])
        if HP < 0:
            HP = 0
        if HP > dike_height:
            HP=dike_height
    HP_pre_list = [0, 0, 0, 0, 0]
    ET_pre_list = [0, 0, 0, 0, 0]
    RF_pre_list = [0, 0, 0, 0, 0]
    DP_pre_list = [0, 0, 0, 0, 0]
    RO_pre_list = [0, 0, 0, 0, 0]


    RF_list=RF_list.tolist()
    RO_list=RO_list.tolist()
    IR_list=IR_list.tolist()
    IR_rec_list=IR_rec_list.tolist()
    HP=HP_list[-1]
    main = {"year_transplant": 2017,
            "month_transplant": 7,
            "day_transplant": 15,
            "year_irrigation": 2017,
            "month_irrigation": 7,
            "day_irrigation": 15,
            "soil_type": 3,
            "crop_type": "rice",
            "HP": HP,
            "dike_height": dike_height,
            "HP_list": HP_list,
            "RF_list": RF_list,
            "ET_list": ET_list,
            "DP_list": DP_list,
            "RO_list": RO_list,
            "IR_list": IR_list,
            "IR_rec": IR_rec,
            "IR_rec_list": IR_rec_list,
            "HP_pre_list": HP_pre_list,
            "RF_pre_list": RF_pre_list,
            "ET_pre_list": ET_pre_list,
            "DP_pre_list": DP_pre_list,
            "RO_pre_list": RO_pre_list,
            "desired_depth_chart": desired_depth_chart,
            "critical_depth_chart": critical_depth_chart
            }

    db.child("main").child(id).update(main, user['idToken'])

