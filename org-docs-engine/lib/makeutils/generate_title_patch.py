#!/bin/python3
# usage example: ./generate_title_patch.py --lang=fa ./src/0001/fa/about.yaml

import argparse
from os.path import dirname
import re

from dirhash import dirhash

from common import parse_about_file, parse_authors_file

def main():
    args = parse_args()
    about = parse_about_file(args['about'], args['lang'])
    authors_all = parse_authors_file(args['authors'])
    
    title = about['FULL_TITLE']
    main_author = authors_all[about['MAIN_AUTHOR']][f'full-name-{args["lang"]}']
    date = about['VERSIONS'][-1]['DATE']
    
    other_authors_list = list(set( [authors_all[version['AUTHOR']][f'full-name-{args["lang"]}'] for version in about['VERSIONS']] ))
    other_authors_list.remove(main_author)
    other_authors = '، '.join(other_authors_list) if len(other_authors_list) > 0 else '—'
    
    scope = about['SCOPE']
    labels = '، '.join(about['LABELS']) if len (about['LABELS']) > 0 else '—'
    version = len(about['VERSIONS'])
    id = re.findall(r'(\d+)', args['about'])[0]

    hash = dirhash(dirname(args['about']), 'md5')[0:6]
    
    LANG = args['lang']
    # changelog_list = ["\\par\\medskip " + f"نسخه {i+1} ({about['VERSIONS'][i]['DATE']})\n\n" + \
        # f"توسط: {authors_all[about['VERSIONS'][i]['AUTHOR']][f'full-name-{LANG}']}\n\n" + \
        # f"شرح تغییرات: {about['VERSIONS'][i]['CHANGES']}" for i in range(version)]
    # changelog = '\n\n'.join(changelog_list)
    changelog_list = [f"{i+1} & {format_date_for_latex(about['VERSIONS'][i]['DATE'])} & " + \
        f"{authors_all[about['VERSIONS'][i]['AUTHOR']][f'full-name-{LANG}']} & " + \
        f"{about['VERSIONS'][i]['CHANGES']} \\\\" for i in range(version)]
    changelog = ''.join(changelog_list)
    
    
    
    title_patch = \
f"""\\title{{{title}}}
\\author{{{main_author}}}
\\newcommand{{\\otherauthors}}{{{other_authors}}}
\\newcommand{{\\scope}}{{{scope}}}
\\newcommand{{\\labels}}{{{labels}}}
\\newcommand{{\\version}}{{{version}}}
\\newcommand{{\\id}}{{{id}}}
\\newcommand{{\\hash}}{{{hash}}}
\\newcommand{{\\changelog}}{{{changelog}}}
\\date{{{format_date_for_latex(date)}}}
"""
    
    print(title_patch)


def parse_args():
    parser = argparse.ArgumentParser(
        description='Generate and print LaTeX title commands for a document. --Preprocess step'
    )
    parser.add_argument(
        '--lang',
        metavar='LANG',
        choices=['fa', 'en'],
        required=True,
        help='selected language'
    )
    parser.add_argument(
        '--about',
        metavar='ABOUT_FILE_PATH',
        required=True,
        help='path to about.yaml file'
    )
    parser.add_argument(
        '--authors',
        metavar='AUTHORS_FILE_PATH',
        required=True,
        help='path to authors.yaml file'
    )
    return vars(parser.parse_args())

def format_date_for_latex(date):
    y, m, d = map(int, date.split('/'))
    return '%d/\\kern0pt%d/\\kern0pt%02d' % (d, m, y)


if __name__ == "__main__":
    main()
