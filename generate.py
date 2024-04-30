import random
import pandas as pd

def read_names_from_file(filename):
	with open(filename, 'r') as file:
		names = [line.strip() for line in file]
	return names

def generate_email(full_name):
	parts = full_name.lower().split()
	return f"{parts[1]}{parts[2]}@gmail.com"

first_names = read_names_from_file("First.txt")
last_names = read_names_from_file("Last.txt")
n=0
lawyers = []

while n<2000:
	name = f"Advocate {random.choice(first_names)} {random.choice(last_names)}"
	email = generate_email(name)
	regno_suffix = random.randint(1, 999)
	regno_suffix1 = random.randint(1, 99)  
	regno = f"MP {regno_suffix}/{regno_suffix1}"  

	phone = str(random.randint(6000000000, 9999999999))

	day = random.randint(1, 28)
	month = random.randint(1, 12)
	year = random.randint(1950, 1995)
	date = f"{day:02d}/{month:02d}/{year}"

	lawyer = {"name":name,"email":email,"regno": regno, "phone": phone, "date": date}
	lawyers.append(lawyer)
	n = n+1
	print(n)

df = pd.DataFrame(data=lawyers)
df.to_excel('lawyersname.xlsx')