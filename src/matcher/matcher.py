import time, requests

def update_proposals():
    requests.post('/matching/update_proposals')

while True:
    update_proposals()
    time.sleep(60)
