from setuptools import setup, find_packages
import os

DESCRIPTION = "Reusable Django app for administrating MongoDB"

LONG_DESCRIPTION = None
try:
    LONG_DESCRIPTION = open('README.rst').read()
except:
    pass

def get_version(version_tuple):
    version = '%s.%s' % (version_tuple[0], version_tuple[1])
    if version_tuple[2]:
        version = '%s.%s' % (version, version_tuple[2])
    return version

# Dirty hack to get version number from fangofmongo/__init__.py
init = os.path.join(os.path.dirname(__file__), 'fangofmongo', '__init__.py')
version_line = filter(lambda l: l.startswith('VERSION'), open(init))[0]
VERSION = get_version(eval(version_line.split('=')[-1]))
print VERSION

CLASSIFIERS = [
    'Development Status :: 3 - Alpha',
    'Intended Audience :: Developers',
    'License :: OSI Approved :: MIT License',
    'Operating System :: OS Independent',
    'Programming Language :: Python',
    'Framework :: Django',
    'Topic :: Database',
    'Topic :: Database :: Front-Ends',
    'Topic :: Software Development :: Libraries :: Python Modules',
]

setup(name='fangofmongo',
      version=VERSION,
      packages=find_packages(),
      author='Maciej Dziardziel',
      author_email='fiedzia@gmail.com',
      url='https://github.com/pkeeper/Fang-of-Mongo',
      license='GNU AGPL v3.0',
      include_package_data=True,
      description=DESCRIPTION,
      long_description=LONG_DESCRIPTION,
      platforms=['any'],
      classifiers=CLASSIFIERS,
      install_requires=['pymongo', 'django'],
)
