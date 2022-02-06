import qrcode

msg = "LU-6d44ae39"
qrcode.make(msg).save("LUresult.png")
print("Finish")
