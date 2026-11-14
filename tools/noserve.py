#!/usr/bin/env python3
"""Nodezelsiz yerli server: butun cavablara no-store goyur — Chrome testlerinde
keshlenmis vendor fayllari gorunmur. Ish dusurushu:  python tools/noserve.py 8792"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoStoreHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8792
    ThreadingHTTPServer(("127.0.0.1", port), partial(NoStoreHandler, directory="."))\
        .serve_forever()
