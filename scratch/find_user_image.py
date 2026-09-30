import json
import re

with open(r'C:\Users\Asus\.gemini\antigravity-ide\brain\a4d031df-724f-46c6-9757-4eafe2283722\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if 'แผนผังกับใส่เลข' in content:
                print('Found step!')
                for k, v in data.items():
                    if k != 'content':
                        print(k, v)
                # find all media / image mentions
                paths = re.findall(r'([A-Za-z]:\\[^\s<>]+\.(?:jpg|png))', content)
                print('File paths found:', paths)
                tempmedia = re.findall(r'(media_[0-9]+\.(?:jpg|png))', content)
                print('Tempmedia found:', tempmedia)
                if not paths and not tempmedia:
                    # check if there is an image artifact or tag
                    tags = re.findall(r'<[^>]+>', content)
                    print('Tags:', tags)
                    print('Snippet:', content[-500:].encode('ascii', 'ignore').decode('ascii'))
