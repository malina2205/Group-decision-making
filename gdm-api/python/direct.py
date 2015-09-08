# -*- coding: utf-8 -*- 
import json, sys, reader

def printM(R):
    for i in range(len(R)):
        print "|"
        for j in range(len(R[0])):
            print (R[i][j],)
        print "|"
    print

    
def column(matrix, i):
    return [row[i] for row in matrix]
    
def f_2(r, alfa):
    if r > alfa:
        return 1        
    else:
        return 0
        
def f_id(r):
    return r
    
def Q(d):
    if d >= 0.8:
        return 1
    elif d> 0.3:
        return 2*d - 0.6
    else:
        return 0
     
file_name = str(sys.argv[1])
#E - liczba ekspertow
#S - liczba alternatyw
#R - kolejne matryce ekspertow // len(R)==E
E, S, R = reader.readData(file_name)

#R_hasz  - matryca R#,
#  rzedy - eksperci
#  kolumny - alternatywy
#  R#|d1|d2|
#  e1|__|__|
#  e2|  |  |
R_hasz = []
for expertMatrix in R: 
    #print expertMatrix
    #print "+++++"
    R_hasz.append([round(sum([f_2(r, 0.5) for r in row])/float(S-1),2) for row in expertMatrix])

#for row in R_hasz:
#    print row

#d - reprezentuje zbior rozmyty decyzji ktore popieraja wszyscy eksperci
d = [sum([f_id(r) for r in column(R_hasz, i)])/float(E) for i in range(S)]
#print ("d = ", d)

#S_q - zbior rozmyty opisujacy decyzje, ktore popiera WIEKSZOSC
S_q = [Q(d_j) for d_j in d]
#print ("S_q = ", S_q, "<br>")

best = max(S_q)
index = [i for i, x in enumerate(S_q) if x == best]


output = {}
row = []
for i in range(len(R_hasz)):
    row_rhasz = {}
    row_rhasz["ekspertId"] = i
    row_rhasz["set"] = R_hasz[i]
    row.append(row_rhasz)
output["Rhasz"] = row
output["d"] = d 
output["S_q"] = S_q
output["decisions"] = index
print json.dumps(output);

