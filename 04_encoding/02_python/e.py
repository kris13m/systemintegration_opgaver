string = "hello world xD"

print("original: ", string)

string = string.encode("utf-32")
print("encoded: ",string)

string = string.decode("utf-32")
print("decoded: ",string)