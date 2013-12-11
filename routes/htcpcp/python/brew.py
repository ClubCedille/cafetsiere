try: import simplejson as json
except ImportError: import json
import sys

def brew(coffee):
	coffee = json.loads(coffee)
	return "We are now brewing {} Cups of delicious".format(coffee['cups'])

# lambda x: brew(x)

if(len(sys.argv) >= 2):
	print(brew(sys.argv[1]))
else:
	print('Error')