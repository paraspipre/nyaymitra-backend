#FIR to text

# importing required modules 
# from PyPDF2 import PdfReader 

# # creating a pdf reader object 
# reader = PdfReader(r'my.pdf') 

# # printing number of pages in pdf file 
# print(len(reader.pages)) 

# # getting a specific page from the pdf file 
# page = reader.pages[0] 

# # extracting text from page 
# text = page.extract_text() 
# print(text) 



#data scraping

import requests
from bs4 import BeautifulSoup
import csv
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd

url = 'https://mphc.gov.in/advocates#'
lawyers =[]
try:
   # for page in range(1,100):
   driver = webdriver.Chrome(ChromeDriverManager().install())

   driver.implicitly_wait(6000000)
   driver.get(url)

   driver.implicitly_wait(6000000)

   html = driver.page_source
   
   soup = BeautifulSoup(html, 'html.parser')
   print(soup)
   

   section1 = soup.find_all('tr',class_="bck1")
   section2 = soup.find_all('tr',class_="bck2")
   print(section1)
   print(section2)
   section = section1 + section2

   for x in section:
      lawyer ={}
      data = x.text
      print(data)
      # para = data.split("\n")

      # i =0
      # for line in para:
      #    if "Advocate" in line:
      #       lawyer["name"] = line
      #    if "Experience" in line:
      #       lawyer["exp"] = line.split(" ")[2]
      #    if "Languages" in line:
      #       lawyer["lang"] = line.split(" ")[2]
      #    if "Specializations:" in line:
      #       for s in para[i+1].split("\t"):
      #          if s != "":
      #             lawyer["spec"] = s
      #    if "|" in line:
      #       if len(para[i-1].split("\t"))>14:
      #          lawyer["loc"] = para[i-1].split("\t")[14]
      #       elif len(para[i+1].split("\t"))>14:
      #          lawyer["loc"] = para[i+1].split("\t")[14]
      #       else:
      #          lawyer["loc"] = ""
      #    i = i+1

      # lawyers.append(lawyer)
   # print(f"page {page} done.\n")
   driver.quit()
except:
   print(f"eror in ")


# df = pd.DataFrame(data=lawyers)
# df.to_excel('lawyers.xlsx')


