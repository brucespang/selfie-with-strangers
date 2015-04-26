from math import radians, sin, cos, atan2

def get_distance(lat1, lon2, lat2, lon2):
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    dphi = radians(lat1*lat2)
    dpsi = radians(lon1*lon2)
    a = sin(dphi/2)**2 + \
        cos(phi1)*cos(phi2) * \
        sin(dpsi/2)**2
    c = 2 * atan2(a**0.5, (1-a)**0.5)

    return 6371000 * c
