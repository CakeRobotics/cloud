from distutils.dir_util import copy_tree
from os import makedirs, environ, listdir, remove
from os.path import exists, join, dirname, realpath, dirname
from shutil import copyfile
from subprocess import run
import logging

from dirhash import dirhash
import jinja2

from .makeutils.common import parse_authors_file, parse_about_file

DOC_ENGINE_ROOT = dirname(dirname(realpath(__file__))) # i.e.: ..


def make(id, path, output_path, ignore_cache):
    for lang in ['fa']:
        make_latex(id, path, output_path, lang, ignore_cache)
        make_zip(id, path, output_path, lang, ignore_cache)


def make_latex(id: str, path, output_path, lang, ignore_cache):
    src_path = join(path, 'src', id, lang)
    src_hash = dirhash(src_path, 'md5')
    cache_file = join(output_path, '__cache__', f'{id}-{lang}.pdf')
    target_file = join(output_path, 'pdf', lang, 'by_id', f'{id}.pdf')
    hash_file = join(output_path, '__cache__', f'{id}-{lang}-pdf.hash')
    prebuild_temp_path = join(output_path, '__cache__', 'tmp', f'prebuild-{id}-{lang}-pdf-{src_hash}')
    build_temp_path = join(output_path, '__cache__', 'tmp', f'build-{id}-{lang}-pdf-{src_hash}')

    # Make dirs
    makedirs(dirname(target_file), exist_ok=True)
    makedirs(prebuild_temp_path, exist_ok=True)
    makedirs(build_temp_path, exist_ok=True)

    # Bail if hash available
    if exists(hash_file) and not ignore_cache:
        with open(hash_file) as f:
            current_hash = f.read()
        if current_hash == src_hash and exists(cache_file):
            logging.info(f'Target `{id}-{lang}-pdf` was available in cache.')
            copyfile(cache_file, target_file)
            return

    # Prebuild (Copy src files to temp path)
    copy_tree(src_path, prebuild_temp_path)

    # Prebuild (Generate title patch)
    with open(join(prebuild_temp_path, 'title-patch.tex'), 'wb') as f:
        f.write(
            run(['python3', join(DOC_ENGINE_ROOT, 'lib', 'makeutils', 'generate_title_patch.py'), f'--lang={lang}', '--about', join(src_path, 'about.yaml'), '--authors', join(path, 'definitions', 'authors.yaml')], capture_output=True).stdout
        )

    # Build
    if lang == 'fa':
        latex_env = {
            **environ,
            'TEXINPUTS': f"{join(DOC_ENGINE_ROOT)}:{prebuild_temp_path}:",
        }
        run_latex = lambda hide_output: run(['xelatex', '-halt-on-error', '-output-directory', build_temp_path, join(prebuild_temp_path, 'main.tex')], env=latex_env, capture_output=hide_output)
    else:
        raise Exception(f"Language `{lang}` is not supported.")
    
    run_latex(False)
    if exists(join(prebuild_temp_path, 'ref.bib')):
        bibtex_env = {
            **environ,
            'BIBINPUTS': f"{join(DOC_ENGINE_ROOT)}:{prebuild_temp_path}:",
            'BSTINPUT': build_temp_path,
            'TEXMFOUTPUT': build_temp_path,
        }
        run(['bibtex', join(build_temp_path, 'main')], env=bibtex_env)
    else:
        logging.info(f'Skipping bibtex for {id} as `ref.bib` was not found.')
    run_latex(True)
    run_latex(True)

    # Copy to output and cache
    copyfile(join(build_temp_path, 'main.pdf'), cache_file)
    copyfile(cache_file, target_file)

    # Save hash
    with open(hash_file, 'w') as f:
        f.write(src_hash)


def make_zip(id: str, path, output_path, lang, ignore_cache):
    src_path = join(path, 'src', id, lang)
    src_hash = dirhash(src_path, 'md5')
    cache_file = join(output_path, '__cache__', f'{id}-{lang}.zip')
    target_file = join(output_path, 'zip', lang, 'by_id', f'{id}.zip')
    hash_file = join(output_path, '__cache__', f'{id}-{lang}-zip.hash')
    build_temp_path = join(output_path, '__cache__', 'tmp', f'build-{id}-{lang}-zip-{src_hash}')

    # Make dirs
    makedirs(dirname(target_file), exist_ok=True)
    makedirs(build_temp_path, exist_ok=True)

    # Bail if hash available
    if exists(hash_file) and not ignore_cache:
        with open(hash_file) as f:
            current_hash = f.read()
        if current_hash == src_hash and exists(cache_file):
            logging.info(f'Target `{id}-{lang}-zip` was available in cache.')
            copyfile(cache_file, target_file)
            return

    # Prebuild (Copy src files to temp path)
    copy_tree(src_path, build_temp_path)

    # Build
    if exists(join(build_temp_path, 'main.zip')):
        remove(join(build_temp_path, 'main.zip'))
    run(['7z', 'a', 'main.zip', '*'], cwd=build_temp_path)

    # Copy to output and cache
    copyfile(join(build_temp_path, 'main.zip'), cache_file)
    copyfile(cache_file, target_file)

    # Save hash
    with open(hash_file, 'w') as f:
        f.write(src_hash)


def make_all(path, output_path, ignore_cache):
    for id in listdir(join(path, 'src')):
        make(id, path, output_path, ignore_cache)


def make_toc(path, output_path):
    # Scan information
    articles = []
    authors = parse_authors_file(join(path, 'definitions', 'authors.yaml'))
    for id in listdir(join(path, 'src')):
        languages = []
        for lang in ['fa']:
            about_file = join(path, 'src', id, lang, 'about.yaml')
            if exists(about_file):
                about = parse_about_file(about_file, lang)
                main_author = about['MAIN_AUTHOR']
                languages.append({'langcode': lang, 'about': about, 'main_author': authors[main_author][f'full-name-{lang}']})
        articles.append({'id': id, 'languages': languages})

    # Generate index.html
    env = jinja2.Environment(
        loader=jinja2.PackageLoader('lib'),
        autoescape=jinja2.select_autoescape()
    )
    template = env.get_template('index.html')
    with open(join(output_path, 'index.html'), 'w') as f:
        f.write(template.render(articles=articles, format_date=format_date))
    
    # Copy css
    copyfile(join(DOC_ENGINE_ROOT, 'assets', 'style.css'), join(output_path, 'style.css'))


def format_date(date):
    y, m, d = map(int, date.split('/'))
    if y < 100:
        y = '14%02d' % y
    return '%s/%02d/%02d' % (y, m, d)