#!/bin/python3

import argparse
import logging
from os.path import join

from lib import make, make_all, make_toc

def main():
    logger = logging.getLogger('')
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(asctime)s | %(levelname)s | %(message)s'))
    logger.addHandler(handler)

    argparser = argparse.ArgumentParser()
    argparser.add_argument('--path', default='.')
    argparser.add_argument('--output-path', default='[path]')
    argparser.add_argument('--ignore-cache', action='store_true')
    argparser.add_argument('cmd', metavar='COMMAND', choices=['make-all', 'make'])
    argparser.add_argument('args', metavar='EXTRA_ARGS', nargs='*')
    args = argparser.parse_args()

    if args.output_path == '[path]':
        args.output_path = join(args.path, 'out')

    if args.cmd == 'make':
        assert len(args.args) > 0, "`make` command requires one or more extra arguments that specify target source id."
        target_ids = args.args
        for id in target_ids:
            make(id, args.path, args.output_path, args.ignore_cache)
        make_toc(args.path, args.output_path)
    elif args.cmd == 'make-all':
        make_all(args.path, args.output_path, args.ignore_cache)
        make_toc(args.path, args.output_path)
    else:
        raise Exception(f"Unknown command `{args.cmd}`.")

if __name__ == '__main__':
    main()