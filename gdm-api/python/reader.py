import json
def readData(file_name):
    input = open(file_name, "r").read()
    data = json.loads(input)
    #eksperci
    E = len(data)
    #kandydaci
    S = len(data[0]['matrix'])
    #macierze preferencji
    RR = [elem['matrix'] for elem in data]
    return (E,S,RR)
