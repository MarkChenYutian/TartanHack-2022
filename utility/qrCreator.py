import qrcode

msg = "DR-4jc83kc9"
qrcode.make(msg).save("DRresult.png")
print("Finish")
