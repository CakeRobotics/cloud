import yaml

def localized_to_standard(data, KEY_MAP):
    if isinstance(data, dict):
        return {
            KEY_MAP[localized_key]: localized_to_standard(data, KEY_MAP)
            for localized_key, data in data.items()
        }
    elif isinstance(data, list):
        return [localized_to_standard(item, KEY_MAP) for item in data]
    return data


def parse_about_file(file_path, lang) -> dict:
    with open(file_path) as f:
        localized_data = yaml.safe_load(f)
    KEYS = {
        'fa': {
            'SHORT_TITLE': 'عنوان کوتاه',
            'FULL_TITLE': 'عنوان کامل',
            'MAIN_AUTHOR': 'نویسنده اصلی',
            'SCOPE': 'دامنه انتشار',
            'LABELS': 'برچسب‌ها',
            'VERSIONS': 'فهرست نسخه‌ها',
            'DATE': 'تاریخ',
            'AUTHOR': 'نویسنده',
            'CHANGES': 'تغییرات',
        }
    }
    KEY_MAP = {localized: standard for standard, localized in KEYS[lang].items()}
    return dict( localized_to_standard(localized_data, KEY_MAP) )


def parse_authors_file(file_path):
    with open(file_path) as f:
        data = yaml.safe_load(f)
    return data
