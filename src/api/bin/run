#!/usr/bin/env python

import sys
from app import app
import config
from optparse import OptionParser

parser = OptionParser()
parser.add_option("--port",
                  dest="port", default=1800,
                  help="listening port")
parser.add_option("--host",
                  dest="host", default="0.0.0.0",
                  help="listening ip")
(opts, args) = parser.parse_args(sys.argv)

app.run(host=opts.host, port=int(opts.port))
