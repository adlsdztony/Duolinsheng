import re
import pandas as pd

def extract_content(txt_file, excel_file):
    with open(txt_file, 'r', encoding='UTF-8-SIG', errors='ignore') as file:
        text = file.read()
    pattern = r'@(.*?)@([^@]*)'
    matches = re.findall(pattern, text, re.DOTALL)
    data = []
    for content, description in matches:
        idx = description[::-1].find('\n')
        if idx!= -1:
            idx = -(idx+1)
            description = description[:idx]
        data.append([content.strip(), description.strip()])
    df = pd.DataFrame(data, columns=['Content', 'Description'])
    # add 3 columns for later use named :'First','Next','Times'
    df['First'] = ''
    df['Next'] = ''
    df['Times'] = ''
    df.to_excel(excel_file, index=False)

extract_content('word-list.txt', '2024-7-23-prankster.xlsx')
