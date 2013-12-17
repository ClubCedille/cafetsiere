try: import simplejson as json
except ImportError: import json
import sys
from daemon import Daemon

class CoffeeDaemon(Daemon):

	def brew(coffee):
		coffee = json.loads(coffee)
		return "We are now brewing {} Cups of delicious".format(coffee['cups'])
	
	def stop(coffee):
		coffee = json.loads(coffee)
		return "We are now brewing {} Cups of delicious".format(coffee['cups'])


if __name__ == "__main__":
	daemon = CoffeeDaemon('/tmp/coffee-daemon.pid')
	if len(sys.argv) == 2 || len(sys.argv) == 3:
		if 'brew' == sys.argv[1]:
			if len(sys.argv) == 3:
				daemon.brew()
			else:
				print 'Missing JSON data'
				sys.exit(2)
		elif 'stop' == sys.argv[1]:
			daemon.stop()
		else:
			print 'Unknown Command'
			sys.exit(2)
		sys.exit(0)
	else :
		print "Usage: %s brew|stop [json data]" sys.argv[0]
		sys.exit(2)

# lambda x: brew(x)